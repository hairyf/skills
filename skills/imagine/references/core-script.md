---
name: core-script
description: How imagine.js works internally — provider routing, API payloads, response handling, and configuration variables.
---

# How imagine.js works

A zero-dependency ESM script that generates images through multiple provider channels. The entry point is `scripts/imagine.js`; the implementation is split into small modules under `scripts/lib/`.

## Module layout

| File | Responsibility |
|------|----------------|
| `scripts/imagine.js` | Entry point — CLI parsing, provider/key checks, main flow, help |
| `scripts/lib/env.js` | Zero-dependency `.env` loader (cwd + script dir) |
| `scripts/lib/config.js` | Reads env into constants (keys, base URLs, proxy, model defaults, MIME maps) |
| `scripts/lib/http.js` | Unified HTTP — native fetch or zero-dependency CONNECT proxy tunnel, JSON POST, multipart, downloads |
| `scripts/lib/providers.js` | Provider routing + request builders (OpenAI, SiliconFlow, Gemini, relay) |
| `scripts/lib/output.js` | Response normalization (`extractImages`) and output path resolution |

## Pipeline

1. **Parse args** — prompt, model, size, quality, background, format, edit/mask, seed, steps, aspect.
2. **Route provider** — inferred from the model id (`gemini-*` → gemini; `Qwen/*`, `Kolors/*`, `Z-Image*`, `FLUX*` → siliconflow; `gpt-image-*` → openai), overridable with `--provider`.
3. **Call the API** — one of three request builders below.
4. **Extract images** — normalize provider responses into `{ buffer, ext }` items.
5. **Save** — write each image to disk (creating parent directories), print absolute paths.

## Session continuity (`--session`)

`scripts/lib/session.js` manages conversation state at `.imagine/<name>.json` (or `IMAGINE_SESSION_DIR`):

```json
{
  "provider": "gemini",
  "model": "gemini-2.5-flash-image",
  "turns": [
    { "role": "user", "text": "生成一格Minecraft蜗牛…", "images": [] },
    { "role": "model", "text": "", "images": ["/abs/path/design.png"] }
  ]
}
```

- `loadSession` / `saveSession` / `clearSession` read, write, and delete the state file; `latestImage` returns the most recent generated image path; `mimeOf` guesses MIME types.
- On a session call the provider receives `opts.sessionHistory` (the loaded state). After saving images, `imagine.js` appends the user turn and the model turn with the new absolute image paths, then persists the state.
- `--session-reset` deletes the state file first; a provider/model mismatch between calls also resets the session with a warning.
- Per-provider continuity: Gemini replays all turns as `contents` (native conversation); OpenAI/relay and SiliconFlow pass the latest image as the edit input (`image` field). Session calls without `--session` are untouched — stateless single generation remains the default.

## Provider channels

### OpenAI (`/v1/images/generations`, `/v1/images/edits`)

- Create: JSON body `{ model, prompt, size?, quality?, background?, output_format?, n? }`.
- Edit: `multipart/form-data` with `image` (+ optional `mask`), `prompt`, and the same option fields.
- Response: `data[].b64_json` or `data[].url`.

### SiliconFlow (`/v1/images/generations`, OpenAI-compatible)

- Body: `{ model, prompt, image_size, num_inference_steps, seed?, image? }`.
- `batch_size` is only sent for Kolors models (the docs mark it Kolors-only).
- Editing uses `Qwen/Qwen-Image-Edit-2509` with the `image` field as a base64 data URL.
- Response: `images[].url` — **expires in one hour**, downloaded immediately.

### Gemini / Nano Banana (`:generateContent`)

- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key=...`.
- Body: `{ contents: [{ parts }], generationConfig: { response_modalities: ["IMAGE"], imageConfig: { aspectRatio? }, seed? } }`.
- Editing passes the input image as an `inline_data` part before the text part.
- Response: `candidates[].content.parts[].inlineData.data` (base64) or `fileData.fileUri` (downloaded with the API key header).

## Configuration (env vars or .env)

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | — | Required for the openai provider |
| `SILICONFLOW_API_KEY` | — | Required for the siliconflow provider |
| `GEMINI_API_KEY` | — | Required for the gemini provider |
| `OPENAI_BASE_URL` | `https://api.openai.com/v1` | OpenAI-compatible endpoint override |
| `SILICONFLOW_BASE_URL` | `https://api.siliconflow.cn/v1` | SiliconFlow endpoint override |
| `RELAY_BASE_URL` | — | Nano Banana relay (e.g. `https://api.ofox.ai/v1`), OpenAI-compatible |
| `RELAY_API_KEY` | — | API key for the relay |
| `HTTPS_PROXY` | — | Optional HTTP proxy (CONNECT tunnel) for blocked relay domains |

### Relay channel

Relays expose Nano Banana (and other models) through OpenAI-compatible `/v1/images/generations` with prefixed model names such as `google/gemini-2.5-flash-image` or `openai/gpt-image-2`. Requests go to `RELAY_BASE_URL` with `RELAY_API_KEY`. Prefixed model names auto-route to the relay; `--provider relay` forces it.

## Default models

| Provider | Default model |
|----------|---------------|
| openai | `gpt-image-2` |
| siliconflow | `Qwen/Qwen-Image` |
| gemini | `gemini-2.5-flash-image` |
| relay | `google/gemini-2.5-flash-image` |

## Key points

- Uses native `fetch` (or a built-in CONNECT tunnel when `HTTPS_PROXY` is set) — no npm dependencies; requires Node 18+.
- Not bound to a single vendor; the same CLI covers all providers.
- Multi-image responses (`data[]`, `images[]`, multiple Gemini candidates) are all saved.
