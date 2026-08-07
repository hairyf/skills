---
name: core-script
description: How sonic.js works internally — module layout, provider channels, and configuration variables.
---

# How sonic.js works

A zero-dependency ESM script that generates voice, music, lyrics, and sound effects. The entry point is `scripts/sonic.js`; the implementation is split into small modules under `scripts/lib/`.

## Module layout

| File | Responsibility |
|------|----------------|
| `scripts/sonic.js` | Entry — CLI parsing, provider/key checks, command dispatch, help |
| `scripts/lib/env.js` | Zero-dependency `.env` loader (cwd + script dir) |
| `scripts/lib/config.js` | Reads env into constants (keys, base URLs, proxy, model defaults) |
| `scripts/lib/http.js` | Unified HTTP — native fetch or CONNECT proxy tunnel, JSON POST, downloads |
| `scripts/lib/providers.js` | TTS / music / lyrics / SFX request builders |
| `scripts/lib/output.js` | Output path resolution |

## Provider channels

### TTS

- **SiliconFlow / OpenAI / relay** — OpenAI-compatible `POST {base}/audio/speech`, body `{ model, input, voice?, response_format?, speed?, sample_rate? }`, returns audio binary.
- **MiniMax** — `POST {base}/v1/t2a_v2`, body `{ model, text, voice_setting, audio_setting }`; `data.audio` is hex- or base64-encoded and decoded locally.
- **ElevenLabs** — `POST {base}/v1/text-to-speech/{voice_id}` with `xi-api-key`; returns MP3 binary.

### Music / lyrics (MiniMax)

- Music: `POST {base}/v1/music_generation`, body `{ model, prompt, lyrics?, is_instrumental?, lyrics_optimizer?, audio_setting, output_format: "url" }`; `data.audio` is a download URL (valid 12–24h), fetched immediately.
- Lyrics: `POST {base}/v1/lyrics_generation`, body `{ mode: "write_full_song", prompt }`; returns `data.lyrics`.

### SFX

- **MMAudio (local)** — `POST {MMAUDIO_LOCAL_URL}/generate` (default `http://127.0.0.1:8001`), body `{ prompt, negative_prompt, duration, cfg_strength, num_steps, seed, format, video_url?|video_path? }`; returns FLAC/WAV bytes. Backed by `scripts/mmaudio-server.py`, installed by `scripts/setup-mmaudio.*`.
- **MMAudio (cloud)** — `POST {base}/api/text-to-audio` or `/api/video-to-audio`, body `{ prompt, duration, num_steps, cfg_strength, negative_prompt?, seed?, video_url? }`; `data.audio.url` (or `data.video.url`) is downloaded. Zero local install.
- **Woosh (local)** — `POST {WOOSH_URL}/generate`, body `{ version: "0.1", token: "local", args: { prompt, model, num_steps, cfg, seed? } }`; returns `audio/flac`. The server (`uvicorn api.api_server:app`) only serves `Woosh-DFlow`.
- **ElevenLabs** — `POST {base}/v1/sound-generation`, body `{ text, model_id (default eleven_text_to_sound_v3), duration_seconds?, prompt_influence? }`; returns MP3 binary.

## Configuration (env vars or .env)

| Variable | Default | Description |
|----------|---------|-------------|
| `SILICONFLOW_API_KEY` | — | SiliconFlow TTS |
| `SILICONFLOW_BASE_URL` | `https://api.siliconflow.cn/v1` | SiliconFlow endpoint |
| `MINIMAX_API_KEY` | — | MiniMax music/lyrics/TTS |
| `MINIMAX_BASE_URL` | `https://api.minimaxi.com` | MiniMax endpoint (China) |
| `OPENAI_API_KEY` / `OPENAI_BASE_URL` | — / `https://api.openai.com/v1` | OpenAI TTS |
| `ELEVENLABS_API_KEY` / `ELEVENLABS_BASE_URL` | — / `https://api.elevenlabs.io` | ElevenLabs TTS + SFX |
| `MMAUDIO_API_KEY` / `MMAUDIO_BASE_URL` | — / `https://mmaudio.net` | MMAudio cloud SFX |
| `MMAUDIO_LOCAL_URL` | `http://127.0.0.1:8001` | Local MMAudio API server |
| `RELAY_API_KEY` + `RELAY_BASE_URL` | — | OpenAI-compatible TTS relays |
| `WOOSH_URL` | `http://127.0.0.1:8000` | Local Woosh API server |
| `HTTPS_PROXY` | — | Optional CONNECT proxy for blocked endpoints |
| `NO_PROXY` | — | Comma-separated hosts that bypass the proxy (e.g. `api.minimaxi.com` for long music calls) |

## Key points

- Uses native `fetch` (or a built-in CONNECT tunnel when `HTTPS_PROXY` is set) — no npm dependencies; requires Node 18+.
- MiniMax returns hex/base64 audio for TTS and URLs for music; both are normalized to buffers.
- Woosh is a local-only channel (NVIDIA GPU) — it never touches the network.
- Local setup is automated: `scripts/setup-woosh.*` and `scripts/setup-mmaudio.*` install and start the servers; the agent runs them on demand.

<!--
Source references:
- https://docs.siliconflow.com/en/api-reference/audio/create-speech
- https://platform.minimaxi.com/docs/api-reference/music-generation
- https://github.com/SonyResearch/Woosh/tree/main/api
-->
