---
name: core-setup
description: First-time setup — choosing providers, obtaining API keys, configuring .env, and integrating into a project.
---

# Setup

Follow these steps when the skill is not yet configured (no API key detected).

## 1. Choose a provider

Ask the user which provider(s) they have keys for. Each maps to one `.env` variable:

| Provider | Env var | Where to get the key |
|----------|---------|----------------------|
| OpenAI (`gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`) | `OPENAI_API_KEY` | https://platform.openai.com/api-keys |
| SiliconFlow (`Qwen/Qwen-Image`, `Qwen/Qwen-Image-Edit-2509`, `Tongyi-MAI/Z-Image-Turbo`) | `SILICONFLOW_API_KEY` | https://cloud.siliconflow.cn/account/ak |
| Google Gemini / Nano Banana (`gemini-2.5-flash-image`, `gemini-3.1-flash-image`, `gemini-3-pro-image`) | `GEMINI_API_KEY` | https://aistudio.google.com/apikey (free tier) |

The agent should fall back to the next model in the priority order when a provider has no key configured. For example, if only `SILICONFLOW_API_KEY` is set, use `Qwen/Qwen-Image` for images even though GPT Image 2 is preferred.

## 2. Configure .env

Write the key(s) to `scripts/.env` (next to imagine.js):

```bash
OPENAI_API_KEY=sk-xxx
SILICONFLOW_API_KEY=sk-xxx
GEMINI_API_KEY=xxx
RELAY_BASE_URL=https://api.ofox.ai/v1
RELAY_API_KEY=sk-xxx

# Optional overrides
# OPENAI_BASE_URL=https://api.openai.com/v1
# SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1
# HTTPS_PROXY=http://127.0.0.1:7890   # required when relay domains are blocked (e.g. in China)
```

`.env` is also loaded from the current working directory, and never overrides already-set environment variables.

## 3. Merge AGENTS.md into the project (required)

To make the project agent generate images automatically, **merge the content of `AGENTS.md` (in this skill directory) into the host project's `AGENTS.md` / `CLAUDE.md`**. Do not skip this step.

1. Read the skill's `AGENTS.md` (the "Image Generation Capability" section).
2. If the project has an `AGENTS.md` / `CLAUDE.md`, check whether the section is already present — if so, skip the merge (idempotent).
3. Otherwise, append the section to the existing file, or create a new `AGENTS.md` / `CLAUDE.md` at the project root.
4. Tell the user the configuration is done — from now on they can just ask for images and the agent generates them automatically.

## 4. Verify

Run the script with the cheapest configured provider to confirm the key works before reporting success:

```bash
node scripts/imagine.js "a small red square with a white border" -m Qwen/Qwen-Image -o verify.png
```

## Key points

- The user's image model priority: GPT Image 2 → Nano Banana → SiliconFlow Qwen-Image → OpenAI GPT Image.
- Only keys that are present are usable; fall back to a configured provider rather than failing.
- The AGENTS.md merge is what enables automatic generation in the host project — the `.env` config alone is not enough.

## Using Nano Banana through a Chinese relay (no Google billing)

If native Gemini is unavailable (no Google payment method), use an OpenAI-compatible relay that sells Nano Banana access and accepts Alipay/WeChat:

```bash
RELAY_BASE_URL=https://api.ofox.ai/v1
RELAY_API_KEY=<relay-key>
```

Then call `node imagine.js "..." -m google/gemini-2.5-flash-image`. Prefixed model names route to the relay automatically; use `--provider relay` to force it. When `GEMINI_API_KEY` is set, the native channel wins for bare `gemini-*` names — comment it out or pass `--provider relay`.

If the relay domain is unreachable directly (DNS pollution / SNI reset, common in China), route through the local proxy client (Clash/V2Ray etc. — the port is shown in the client's settings):

```bash
HTTPS_PROXY=http://127.0.0.1:7890
```

The script sends all HTTP traffic through the proxy via a zero-dependency CONNECT tunnel.
