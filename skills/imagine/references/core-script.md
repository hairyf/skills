---
name: core-script
description: How imagine.js works internally — module layout, pipeline, session state, provider channels, and configuration.
---

# How imagine.js works

A zero-dependency ESM script that generates images through multiple provider channels. The CLI entry is thin; provider logic and HTTP live in `scripts/lib/*.js` so each concern can be patched independently.

## File layout

```
scripts/
├── imagine.js          # CLI entry: arg parsing, provider/key checks, main flow, help
└── lib/
    ├── env.js          # Zero-dependency .env loader (cwd + script dir)
    ├── config.js       # Reads env into constants (keys, base URLs, proxy, model defaults, MIME maps)
    ├── http.js         # Unified HTTP — native fetch or zero-dependency CONNECT proxy tunnel, JSON POST, multipart, downloads
    ├── providers.js    # Provider routing + request builders (OpenAI, SiliconFlow, Gemini, relay)
    ├── output.js       # Response normalization (extractImages) and output path resolution
    └── session.js      # Conversation state (--session): load/save/clear, latestImage, MIME sniffing
```

## Pipeline

1. **Parse args** — prompt, model, size, quality, background, format, edit/mask, seed, steps, aspect, session.
2. **Route provider** — inferred from the model id (`gemini-*` → gemini; `Qwen/*`, `Kolors/*`, `Z-Image*`, `FLUX*` → siliconflow; `gpt-image-*` → openai), overridable with `--provider`.
3. **Load session** — when `--session` is passed, load prior state (or start fresh) and attach it as `opts.sessionHistory`; a provider/model mismatch resets the session with a warning.
4. **Call the API** — one of three request builders; the session history is replayed per provider (see below).
5. **Extract images** — normalize provider responses into `{ buffer, ext }` items.
6. **Save & persist** — write each image to disk (creating parent directories), print absolute paths, then append the user turn + model turn (with image paths) to the session state.

## Session continuity (`--session`)

`scripts/lib/session.js` manages conversation state at `.imagine/<name>.json` (or `IMAGINE_SESSION_DIR`):

```json
{
  "provider": "gemini",
  "model": "gemini-2.5-flash-image",
  "turns": [
    { "role": "user", "text": "a cute robot mascot, front view…", "images": [] },
    { "role": "model", "text": "", "images": ["/abs/path/design.png"] }
  ]
}
```

- `loadSession` / `saveSession` read and write the state file; `clearSession` deletes it (used by `--clear <name>`); `latestImage` returns the most recent generated image path; `mimeOf` guesses MIME types.
- On a session call the provider receives `opts.sessionHistory`. After saving images, `imagine.js` appends the user turn and the model turn with the new absolute image paths, then persists the state.
- A provider/model mismatch between calls resets the session with a warning.
- Per-provider replay: Gemini replays all turns as `contents` (native conversation); OpenAI/relay and SiliconFlow pass the latest image as the edit input (`image` field). Without `--session`, behavior is stateless.
- `--clear <name>` removes the session state file and exits — no prompt or API
  key is required, so callers can clean up after a finished workflow.

## Provider channels

### OpenAI (`/v1/images/generations`, `/v1/images/edits`)

Create sends `{ model, prompt, size?, quality?, background?, output_format?, n? }`; edits are multipart with `image` (+ optional `mask`) and the same option fields. Responses are `data[].b64_json` or `data[].url`.

### SiliconFlow (`/v1/images/generations`, OpenAI-compatible)

Body: `{ model, prompt, image_size, num_inference_steps, seed?, image? }`; `batch_size` is sent only for Kolors models. Editing uses `Qwen/Qwen-Image-Edit-2509` with the `image` field as a base64 data URL. Responses are `images[].url` — **expire in one hour**, downloaded immediately.

### Gemini / Nano Banana (`:generateContent`)

Body: `{ contents: [{ parts }], generationConfig: { response_modalities: ["IMAGE"], imageConfig: { aspectRatio? }, seed? } }`. Editing passes the input image as an `inline_data` part before the text part. Responses are `candidates[].content.parts[].inlineData.data` (base64) or `fileData.fileUri` (downloaded with the API key header).

### Relay channel

Relays expose Nano Banana (and other models) through OpenAI-compatible `/v1/images/generations` with prefixed model names such as `google/gemini-2.5-flash-image` or `openai/gpt-image-2`. Prefixed names auto-route to the relay; `--provider relay` forces it.

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

`.env` files are loaded from the current working directory and the script's directory, and never override already-set environment variables.

## Key points

- Uses native `fetch` (or a built-in CONNECT tunnel when `HTTPS_PROXY` is set) — no npm dependencies; requires Node 18+.
- Not bound to a single vendor; the same CLI covers all providers.
- Multi-image responses (`data[]`, `images[]`, multiple Gemini candidates) are all saved.
- Provider/model changes reset a session with a warning — keep the same model across a session.
- SiliconFlow image URLs expire after one hour — downloads happen immediately.
