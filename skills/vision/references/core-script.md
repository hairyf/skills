---
name: core-script
description: How vision.js works internally — base64 encoding, the OpenAI-compatible API request, and configuration variables.
---

# How vision.js works

A zero-dependency ESM script that recognizes images through an OpenAI-compatible vision API.

## Pipeline

1. **Resolve the image** — read a local file and convert it to a base64 data URL, or pass through a remote URL when `--url` is used.
2. **Call the API** — POST to `{BASE_URL}/chat/completions` with a user message containing an `image_url` part and a `text` part.
3. **Output** — print `choices[0].message.content` to stdout.

## Configuration (env vars or .env)

| Variable | Default | Description |
|----------|---------|-------------|
| `DASHSCOPE_API_KEY` | — | Required. API key for the vision service |
| `VISION_MODEL` | `qwen-vl-max` | Model name |
| `DASHSCOPE_BASE_URL` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | OpenAI-compatible endpoint |

`.env` files are loaded from the current working directory and the script's directory, and never override already-set environment variables.

## Key points

- Uses the native `fetch` — no npm dependencies.
- Not bound to a specific vendor; works with any OpenAI-compatible vision API.
- Supported local formats: jpg, jpeg, png, gif, webp, bmp.
