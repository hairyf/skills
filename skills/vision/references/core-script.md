---
name: core-script
description: How the vision skill works internally — module layout, image resolution, prompt contracts, coarse-to-fine localization, coordinate remapping, and configuration.
---

# How the vision skill works

An ESM pipeline that recognizes images through an OpenAI-compatible vision API. The CLI entry is thin; logic lives in `scripts/lib/*.js` so each concern can be patched or tested independently.

## File layout

```
scripts/
├── vision.js            # CLI entry: args, round orchestration, output
└── lib/
    ├── preprocess.js    # Resample/crop views (--coords), remap mode
    ├── install.js       # One-time sharp install into scripts/.deps/
    ├── env.js           # .env loading + resolved config
    ├── prompts.js       # System prompts + per-round contracts
    ├── image.js         # Format sniffing, size detection, base64 data URLs
    ├── api.js           # Payload building + OpenAI-compatible request
    └── coords.js        # Parse/normalize/scale coordinates (shared)
```

## Pipeline

1. **Resolve the image** — read a local file and convert it to a base64 data URL, pass through a remote URL when `--url` is used, or decode raw base64 / a `data:` URL passed via `--base64` into a temp file so both downstream paths stay file-based.
2. **Resample (debug mode only)** — when `--coords` is passed, `lib/preprocess.js prepare` resizes each view to fit the model's input limits, keeping the shorter side ≥ 96px so tiny flat crops don't degrade grounding (its dependency `sharp` is auto-installed by `scripts/lib/install.js` on first use).
3. **Coarse-to-fine rounds** — round 1 asks the model to propose a precise point or a zoom region (`propose` contract); round 2 re-locates in the focused crop (`locate` contract, bbox or center per `--coords` format); `--rounds 3` adds a small-window verification round (`verify` contract).
4. **Call the API per round** — POST to `{BASE_URL}/chat/completions` with a user message containing a base64 `image_url` part and a `text` part.
5. **Normalize & remap** — each round's `## Coordinates` section is normalized to canonical JSON lines (tolerating malformed output), and every center point is scaled back to the ORIGINAL image pixels using that round's crop offset.

## Configuration (env vars or .env)

| Variable | Default | Description |
|----------|---------|-------------|
| `DASHSCOPE_API_KEY` | — | Required. API key for the vision service |
| `VISION_MODEL` | `qwen-vl-max` | Model name |
| `DASHSCOPE_BASE_URL` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | OpenAI-compatible endpoint |

`.env` files are loaded from the current working directory and the script's directory, and never override already-set environment variables.

## Key points

- Uses the native `fetch` — no npm dependencies.
- `lib/coords.js` is shared by vision.js (locate rounds) and lib/preprocess.js (remap) — change parsing/remapping there.
- Not bound to a specific vendor; works with any OpenAI-compatible vision API.
- Compactness and coordinate instructions are embedded in the user text part, so strict APIs that only accept user messages still work.
- Debug mode is caller-driven: coordinates appear only with `--coords`; there is no keyword auto-detection.
- Remote URLs are downloaded so resampling works everywhere; no caller-supplied dimensions needed.
- `--base64` materializes the payload to a temp file in the OS temp dir (cleaned up on exit), keeping `--coords` resampling unchanged.
- Resampling uses `sharp` (installed on first `--coords` use into `scripts/.deps/`); the non-debug path stays zero-dependency.
- The coordinate contract emits bbox by default and center points with `--coords center`; parsing derives the other representation (bbox ↔ center) automatically.
- Model input limits come from a per-model table with `VISION_MAX_PIXELS` / `VISION_MAX_LONG_EDGE` env overrides, since the API does not expose them.
- Supported local formats: jpg, jpeg, png, gif, webp, bmp.
