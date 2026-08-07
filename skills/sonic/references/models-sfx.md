---
name: models-sfx
description: Sound effect generation — local Sony Woosh (API), MMAudio, ElevenLabs SFX, Stable Audio SFX — and how each is accessed.
---

# Sound Effect Models

Recommended order for a China-based workflow: **local MMAudio (free, your GPU) → local Sony Woosh (free, your GPU) → MMAudio cloud API (zero install) → ElevenLabs SFX (key + proxy)**.

## Local MMAudio — run on your own GPU (recommended, zero cost)

The popular open-source MMAudio model runs locally on an NVIDIA GPU (6GB+ VRAM) and is **free per call**. The skill provides everything:

- **`scripts/setup-mmaudio.ps1` / `.sh`** — auto-install: clone `hkchengrex/MMAudio`, install torch CUDA + `pip install -e .`, start the server.
- **`scripts/mmaudio-server.py`** — FastAPI server at `http://127.0.0.1:8001` wrapping the official `generate()` pipeline (text-to-audio + video-to-audio, auto-downloads weights from HuggingFace on first start).
- **Usage** — `node sonic.js sfx "雨声敲打木屋顶" -o rain.flac --provider mmaudio-local --duration 10`; local video path or URL via `--video`.
- Variants: `MMAUDIO_VARIANT=large_44k_v2` (default), `small_16k`/`small_44k` (lighter/faster), `medium_44k`, `large_44k`.
- Licensing: MIT code, CC-BY-NC 4.0 weights (non-commercial).
- Note: official repo is Ubuntu-tested; on Windows use the setup script (or WSL2 if the native install hits dependency issues).

## MMAudio — cloud API (zero install, recommended)

MMAudio (the popular open-source model) is also offered as a **hosted cloud API** at `https://mmaudio.net` — no GPU, no local install, just an API key.

- **Text-to-audio** — `POST https://mmaudio.net/api/text-to-audio`, body:
  ```json
  { "prompt": "rain falling on a wooden roof", "duration": 8, "num_steps": 25, "cfg_strength": 4.5 }
  ```
  → `data.audio.url` (download immediately).
- **Video-to-audio** — same endpoint family: `POST /api/video-to-audio` with `video_url` + `prompt` → synchronized SFX (`sonic.js sfx --provider mmaudio --video <url>`).
- **Validate / credits** — `GET /api/credits` with the key.
- An official **MCP server** (`mmaudio/mmaudio-mcp`) wraps this same REST API for Cursor/Claude Desktop — sonic.js calls the REST API directly, so no MCP installation is needed.
- Payment/access: hosted credits via mmaudio.net (check China accessibility/currency when registering).

## Sony Woosh (local, recommended — zero cost)

Sony Research open-source sound effect models (MIT code, CC-BY-NC weights — non-commercial).

- Four models: **Woosh-Flow** (quality), **Woosh-DFlow** (distilled, ~10× faster), **Woosh-VFlow / Woosh-DVFlow** (video → synchronized SFX, up to 8s clips).
- Official FastAPI server: `uv run uvicorn api.api_server:app --port 8000` → `POST /generate` returns `audio/flac`.
  ```json
  { "version": "0.1", "token": "local", "args": { "prompt": "footsteps on snow", "model": "Woosh-DFlow", "num_steps": 8, "cfg": 1 } }
  ```
- **The API server currently serves `Woosh-DFlow` only**; quality/V2A modes run through the Gradio web UI.
- Requirements: NVIDIA GPU (8GB+ recommended for V2A), CUDA 12.8. `sonic.js sfx` targets this server.
- Chinese UI bundlet ("懒人包") versions exist for convenience; the API server needs the official repo.

## MMAudio (most popular open source)

- Video-aware sound effect generation (video → matched SFX, text → SFX); GitHub 2.2k★, big in Chinese tutorial circles.
- **Local self-host** — the same model is served locally via `scripts/setup-mmaudio.*` + `mmaudio-server.py` (`--provider mmaudio-local`); ComfyUI nodes and 整合包 also exist.
- Related: AudioX, ThinkSound (multimodal audio comparison models).

## ElevenLabs SFX (international mainstream)

- `POST https://api.elevenlabs.io/v1/sound-generation`, body `{ text, model_id: "eleven_text_to_sound_v3"` (or `v2`), `duration_seconds?, prompt_influence? }` → MP3.
- Strong at punchy game sounds (impacts, UI clicks, footsteps); official tutorial has ~10M YouTube views.
- Needs a foreign card + proxy from mainland China. `sonic.js sfx --provider elevenlabs` supports it.

## Stable Audio 3 Small-SFX

- Open weights (433M, CPU-capable), text → SFX up to ~120s; also via Stability/fal API (foreign card).
- Good for sound-design style effects; the Large variant is API-only.

## Choosing

- Free local generation on your NVIDIA GPU → MMAudio (`mmaudio-local`) or Woosh
- Best quality game-style one-shots (with key) → ElevenLabs SFX
- Video-driven SFX locally → MMAudio
- Sound-design / instrumental layers → Stable Audio 3

<!--
Source references:
- https://github.com/SonyResearch/Woosh
- https://github.com/hkchengrex/MMAudio
- https://elevenlabs.io/docs
- https://github.com/Stability-AI/stable-audio-3
-->
