---
name: core-setup
description: First-time setup — choosing providers, obtaining API keys, starting the local Woosh server, and integrating into a project.
---

# Setup

Follow these steps when the skill is not yet configured (no API key detected).

## 1. Choose providers

| Provider | Env vars | What it powers | Where to get the key |
|----------|----------|----------------|----------------------|
| SiliconFlow | `SILICONFLOW_API_KEY` | TTS (CosyVoice2 / Fish-Speech) | https://cloud.siliconflow.cn/account/ak |
| MiniMax | `MINIMAX_API_KEY` | Music + TTS (China payment) | https://platform.minimaxi.com |
| OpenAI | `OPENAI_API_KEY` | TTS (`tts-1`) | https://platform.openai.com/api-keys |
| ElevenLabs | `ELEVENLABS_API_KEY` | TTS + SFX (foreign payment + proxy) | https://elevenlabs.io |
| MMAudio | `MMAUDIO_API_KEY` | Cloud SFX (text/video → audio, zero install) | https://mmaudio.net/dashboard/api-keys |
| Relay (e.g. Ofox) | `RELAY_API_KEY` + `RELAY_BASE_URL` | OpenAI-compatible TTS relays | platform of your choice |
| Woosh (local) | `WOOSH_URL` | Sound effects on your NVIDIA GPU — **no key** | https://github.com/SonyResearch/Woosh |
| MMAudio (local) | `MMAUDIO_LOCAL_URL` | Local MMAudio SFX on your NVIDIA GPU — **no key** | https://github.com/hkchengrex/MMAudio |

## 2. Configure .env

Write the key(s) to `scripts/.env` (next to sonic.js):

```bash
SILICONFLOW_API_KEY=sk-xxx
MINIMAX_API_KEY=sk-xxx
# OPENAI_API_KEY=sk-xxx
# ELEVENLABS_API_KEY=xxx
# MMAUDIO_API_KEY=sk-xxx
# RELAY_BASE_URL=https://api.ofox.ai/v1
# RELAY_API_KEY=sk-xxx
# WOOSH_URL=http://127.0.0.1:8000
# HTTPS_PROXY=http://127.0.0.1:7890   # required for blocked endpoints (e.g. ElevenLabs)
# NO_PROXY=api.minimaxi.com           # hosts that bypass the proxy (long connections, direct domains)
```

`.env` is loaded from the current working directory and the script directory, and never overrides already-set environment variables.

## 3. Local Woosh / MMAudio — installed automatically by the agent

When a local channel is needed and not installed, the **agent runs the setup script automatically** (do not ask the user to install manually):

```powershell
# Windows (NVIDIA GPU machine) — Woosh (text/video → SFX)
pwsh scripts/setup-woosh.ps1 -Start

# Windows — MMAudio (text/video → SFX, ~6GB VRAM)
pwsh scripts/setup-mmaudio.ps1 -Start
```

```bash
# macOS / Linux
./scripts/setup-woosh.sh --start
./scripts/setup-mmaudio.sh --start
```

Woosh: clones the repo, sets up `uv`, downloads ~5GB of weights, starts at `http://127.0.0.1:8000` (serves `Woosh-DFlow` fast mode).

MMAudio: clones the repo, installs torch CUDA + `mmaudio-server.py`, auto-downloads weights on first start, runs at `http://127.0.0.1:8001` (`--provider mmaudio-local`).

No local install is needed for the **MMAudio cloud** channel — just an API key: `node scripts/sonic.js sfx "..." --provider mmaudio`.

## 4. Merge AGENTS.md into the project (required)

To make the project agent generate audio automatically, **merge the content of `AGENTS.md` (in this skill directory) into the host project's `AGENTS.md` / `CLAUDE.md`**. Do not skip this step.

1. Read the skill's `AGENTS.md` (the "Audio Generation Capability" section).
2. If the project already has that section, skip (idempotent).
3. Otherwise append it to the existing `AGENTS.md` / `CLAUDE.md`, or create one at the project root.

## 5. Verify

```bash
# TTS with the cheapest configured provider
node scripts/sonic.js tts "你好" -o verify.mp3
```

## Key points

- Only keys that are present are usable; the script falls back down the priority order.
- MiniMax only needs `MINIMAX_API_KEY`.
- ElevenLabs requires a foreign card and a proxy from mainland China — configure `HTTPS_PROXY`.
- The AGENTS.md merge is what enables automatic generation in the host project.

<!--
Source references:
- https://docs.siliconflow.com/en/api-reference/audio/create-speech
- https://platform.minimaxi.com/docs/guides/music-generation
- https://github.com/SonyResearch/Woosh
- https://elevenlabs.io/docs
-->
