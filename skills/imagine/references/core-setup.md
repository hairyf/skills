---
name: core-setup
description: First-time setup — choosing a provider, API keys, .env configuration, AGENTS.md merge, and verification.
---

# Setup

Follow these steps when no API key is configured.

## 1. Choose a provider

Ask which provider the user has a key for; each maps to one env var:

| Provider | Env var | Key source |
|----------|---------|------------|
| OpenAI (`gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`) | `OPENAI_API_KEY` | https://platform.openai.com/api-keys |
| SiliconFlow (`Qwen/Qwen-Image`, `Qwen/Qwen-Image-Edit-2509`) | `SILICONFLOW_API_KEY` | https://cloud.siliconflow.cn/account/ak |
| Google Gemini / Nano Banana (`gemini-2.5-flash-image` etc.) | `GEMINI_API_KEY` | https://aistudio.google.com/apikey |

Fall back to the next model in the priority order when a provider has no key.

## 2. Configure .env

Write the key(s) to `scripts/.env` (also loaded from cwd; existing env vars always win):

```bash
OPENAI_API_KEY=sk-xxx
SILICONFLOW_API_KEY=sk-xxx
GEMINI_API_KEY=xxx

# Nano Banana via an OpenAI-compatible Chinese relay (no Google billing)
# RELAY_BASE_URL=https://api.ofox.ai/v1
# RELAY_API_KEY=sk-xxx
# HTTPS_PROXY=http://127.0.0.1:7890   # required when relay domains are blocked
```

Prefixed model names (`google/gemini-2.5-flash-image`) auto-route to the relay; `--provider relay` forces it.

## 3. Merge AGENTS.md into the host project (required)

Append this skill's `AGENTS.md` (the "Image Generation Capability" section) to the host project's `AGENTS.md` / `CLAUDE.md` if not already present. This is what lets the agent generate images automatically on request.

## 4. Verify

```bash
node scripts/imagine.js "a small red square with a white border" -m Qwen/Qwen-Image -o verify.png
```

## Key points

- Only configured providers are usable — fall back rather than fail.
- The AGENTS.md merge enables automatic generation; `.env` alone is not enough.
