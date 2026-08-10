---
name: core-setup
description: First-time setup — choosing providers, API keys, local SFX servers, AGENTS.md merge, and verification.
---

# Setup

Follow these steps when no API key is configured.

## 1. Choose providers

| Provider | Env vars | Powers | Key source |
|----------|----------|--------|------------|
| SiliconFlow | `SILICONFLOW_API_KEY` | TTS (CosyVoice2 / Fish-Speech) | https://cloud.siliconflow.cn/account/ak |
| MiniMax | `MINIMAX_API_KEY` | Music + TTS (China payment) | https://platform.minimaxi.com |
| OpenAI | `OPENAI_API_KEY` | TTS (`tts-1`) | https://platform.openai.com/api-keys |
| ElevenLabs | `ELEVENLABS_API_KEY` | TTS + SFX (foreign card + proxy) | https://elevenlabs.io |
| MMAudio cloud | `MMAUDIO_API_KEY` | SFX (text/video → audio, zero install) | https://mmaudio.net/dashboard/api-keys |
| Relay (e.g. Ofox) | `RELAY_API_KEY` + `RELAY_BASE_URL` | OpenAI-compatible TTS relays | platform of your choice |
| Woosh (local) | `WOOSH_URL` | GPU SFX — **no key** | https://github.com/SonyResearch/Woosh |
| MMAudio (local) | `MMAUDIO_LOCAL_URL` | Local GPU SFX — **no key** | https://github.com/hkchengrex/MMAudio |

## 2. Configure .env

Write the key(s) to `scripts/.env` (also loaded from cwd; existing env vars always win):

```bash
SILICONFLOW_API_KEY=sk-xxx
MINIMAX_API_KEY=sk-xxx
# OPENAI_API_KEY=sk-xxx
# ELEVENLABS_API_KEY=xxx
# MMAUDIO_API_KEY=sk-xxx
# RELAY_BASE_URL=https://api.ofox.ai/v1
# RELAY_API_KEY=sk-xxx
# HTTPS_PROXY=http://127.0.0.1:7890   # blocked endpoints (e.g. ElevenLabs)
# NO_PROXY=api.minimaxi.com           # bypass the proxy for long music calls
```

## 3. Local MMAudio / Woosh — auto-installed by the agent

When a local channel is needed and not installed, the **agent runs the setup script itself** — never ask the user to install by hand:

```powershell
pwsh scripts/install/mmaudio.ps1 -Start    # Windows — MMAudio (~6GB VRAM)
pwsh scripts/install/woosh.ps1 -Start      # Windows — Sony Woosh (text/video → SFX)
```

```bash
./scripts/install/mmaudio.sh --start
./scripts/install/woosh.sh --start       # macOS / Linux
```

Both clone the repo, install dependencies and weights, and start a server (`http://127.0.0.1:8000` Woosh, `:8001` MMAudio). Servers auto-exit after 15 idle minutes (`*_IDLE_TIMEOUT=0` disables); restart with the setup script before retrying a failed request. MMAudio cloud needs no install — just `MMAUDIO_API_KEY`.

## 4. Merge AGENTS.md into the project (required)

Append this skill's `AGENTS.md` (the "Audio Generation Capability" section) to the host project's `AGENTS.md` / `CLAUDE.md` if not already present. This enables automatic audio generation in the project.

## 5. Verify

```bash
node scripts/sonic.js tts "Hello" -o verify.mp3
```

## Key points

- Only configured providers are usable — the script falls back down the priority order.
- ElevenLabs requires a foreign card and a proxy from mainland China — configure `HTTPS_PROXY`.
- The AGENTS.md merge enables automatic generation; `.env` alone is not enough.
