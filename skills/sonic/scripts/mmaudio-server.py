"""Local MMAudio API server for the sonic skill.

Serves text-to-audio and video-to-audio through a tiny HTTP API, so
`sonic.js sfx --provider mmaudio-local` can generate sound effects on your
own NVIDIA GPU at zero per-call cost.

Requires the MMAudio repo installed (see setup-mmaudio.ps1 / setup-mmaudio.sh).

Usage:
    uvicorn mmaudio-server:app --host 0.0.0.0 --port 8001

Env:
    MMAUDIO_VARIANT   model variant (default: large_44k_v2)
                      options: small_16k, small_44k, medium_44k, large_44k, large_44k_v2
    MMAUDIO_IDLE_TIMEOUT
                      auto-exit after N minutes without a /generate request
                      (default: 15, 0 = keep running forever)

Endpoints:
    GET  /ping
    POST /generate
        body: {"prompt": "...", "negative_prompt": "", "duration": 8,
               "cfg_strength": 4.5, "num_steps": 25, "seed": 42,
               "format": "flac"|"wav", "video_url": "..."|"video_path": "..."}
        -> audio bytes (flac/wav)
"""

import io
import os
import tempfile
import threading
import time
import urllib.request
from pathlib import Path
from typing import Optional

import torch
import torchaudio
import soundfile as sf
from fastapi import FastAPI
from fastapi.responses import Response
from pydantic import BaseModel

from mmaudio.eval_utils import all_model_cfg, generate, load_video
from mmaudio.model.flow_matching import FlowMatching
from mmaudio.model.networks import get_my_mmaudio
from mmaudio.model.utils.features_utils import FeaturesUtils

torch.backends.cuda.matmul.allow_tf32 = True
torch.backends.cudnn.allow_tf32 = True

VARIANT = os.environ.get("MMAUDIO_VARIANT", "large_44k_v2")
FORMATS = {"flac": "audio/flac", "wav": "audio/wav"}
_lock = threading.Lock()
_last_activity = time.monotonic()
_idle_timeout_min = float(os.environ.get("MMAUDIO_IDLE_TIMEOUT", "15"))
_idle_timeout_sec = _idle_timeout_min * 60 if _idle_timeout_min > 0 else 0
app = FastAPI()


def _touch() -> None:
    """Record a generate request so the idle watchdog does not fire."""
    global _last_activity
    _last_activity = time.monotonic()


def _idle_watchdog() -> None:
    """Exit the process after MMAUDIO_IDLE_TIMEOUT without any /generate call."""
    while True:
        time.sleep(min(30, _idle_timeout_sec / 2))
        if not _lock.acquire(blocking=False):
            continue  # a request is in flight
        try:
            idle_sec = time.monotonic() - _last_activity
            if idle_sec >= _idle_timeout_sec:
                print(f"[mmaudio-server] idle for {idle_sec:.0f}s "
                      f"(limit {_idle_timeout_sec:.0f}s) — shutting down")
                os._exit(0)
        finally:
            _lock.release()


class GenerateRequest(BaseModel):
    prompt: str
    negative_prompt: str = ""
    duration: float = 8.0
    cfg_strength: float = 4.5
    num_steps: int = 25
    seed: int = 42
    format: str = "flac"
    video_url: Optional[str] = None
    video_path: Optional[str] = None


def _download(url: str, dest: str) -> str:
    urllib.request.urlretrieve(url, dest)
    return dest


@app.on_event("startup")
def startup() -> None:
    global model_cfg, net, feature_utils, rng
    model_cfg = all_model_cfg[VARIANT]
    model_cfg.download_if_needed()
    device = "cuda" if torch.cuda.is_available() else (
        "mps" if torch.backends.mps.is_available() else "cpu"
    )
    dtype = torch.bfloat16 if device != "cpu" else torch.float32
    net = get_my_mmaudio(model_cfg.model_name).to(device, dtype).eval()
    net.load_weights(torch.load(model_cfg.model_path, map_location=device, weights_only=True))
    feature_utils = FeaturesUtils(
        tod_vae_ckpt=model_cfg.vae_path,
        synchformer_ckpt=model_cfg.synchformer_ckpt,
        enable_conditions=True,
        mode=model_cfg.mode,
        bigvgan_vocoder_ckpt=model_cfg.bigvgan_16k_path,
        need_vae_encoder=False,
    )
    feature_utils = feature_utils.to(device, dtype).eval()
    rng = torch.Generator(device=device)
    print(f"[mmaudio-server] variant={VARIANT} device={device} ready")
    if _idle_timeout_sec > 0:
        threading.Thread(target=_idle_watchdog, daemon=True).start()
        print(f"[mmaudio-server] idle watchdog armed "
              f"({_idle_timeout_min:g} min, /generate refreshes it)")


@app.get("/ping")
def ping() -> dict:
    return {"status": "ok", "variant": VARIANT}


@app.post("/generate")
def generate_endpoint(req: GenerateRequest) -> Response:
    _touch()
    with _lock:
        video_path: Optional[Path] = None
        if req.video_url:
            tmp = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False)
            tmp.close()
            _download(req.video_url, tmp.name)
            video_path = Path(tmp.name)
        elif req.video_path:
            video_path = Path(req.video_path)

        try:
            if video_path is not None:
                video_info = load_video(video_path, req.duration)
                clip = video_info.clip_frames
                clip_frames = clip.unsqueeze(0) if clip is not None else None
                sync_frames = video_info.sync_frames.unsqueeze(0)
                duration = video_info.duration_sec
            else:
                clip_frames = sync_frames = None
                duration = req.duration

            model_cfg.seq_cfg.duration = duration
            net.update_seq_lengths(
                model_cfg.seq_cfg.latent_seq_len,
                model_cfg.seq_cfg.clip_seq_len,
                model_cfg.seq_cfg.sync_seq_len,
            )
            rng.manual_seed(req.seed)
            fm = FlowMatching(min_sigma=0, inference_mode="euler", num_steps=req.num_steps)

            # eval_utils.generate() is not autograd-safe: it mixes inference-mode
            # feature tensors with grad-tracked linear ops. Run it under
            # inference_mode like the official demo.py does.
            with torch.inference_mode():
                audios = generate(
                    clip_frames,
                    sync_frames,
                    [req.prompt],
                    negative_text=[req.negative_prompt],
                    feature_utils=feature_utils,
                    net=net,
                    fm=fm,
                    rng=rng,
                    cfg_strength=req.cfg_strength,
                )
            # generate() returns (B, C, T); drop batch and the singleton
            # channel dim so soundfile sees plain mono frames (it treats
            # dim0 as frames, unlike torchaudio which treats it as channels).
            audio = audios.float().cpu()[0].squeeze()
            fmt = req.format if req.format in FORMATS else "flac"
            buf = io.BytesIO()
            # torchaudio.save routes through torchcodec on Windows, whose DLLs
            # often fail to load; soundfile bundles libsndfile and is dependency-free.
            sf.write(buf, audio.numpy(), model_cfg.seq_cfg.sampling_rate, format=fmt.upper())
            return Response(content=buf.getvalue(), media_type=FORMATS[fmt])
        finally:
            if req.video_url and video_path is not None:
                video_path.unlink(missing_ok=True)
