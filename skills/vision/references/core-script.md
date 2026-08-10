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
    ├── session.js       # Conversation state (--session): load/save/clear, replay
    └── coords.js        # Parse/normalize/scale coordinates (shared)
```

## Pipeline

1. **Resolve the image** — read a local file and convert it to a base64 data URL, pass through a remote URL when `--url` is used, or decode raw base64 / a `data:` URL passed via `--base64` into a temp file so both downstream paths stay file-based.
2. **Resample (debug mode only)** — when `--coords` is passed, `lib/preprocess.js prepare` resizes each view to fit the model's input limits, keeping the shorter side ≥ 96px so tiny flat crops don't degrade grounding (its dependency `sharp` is auto-installed by `scripts/lib/install.js` on first use).
3. **Coarse-to-fine rounds** — round 1 asks the model to propose a precise point or a zoom region (`propose` contract); round 2 re-locates in the focused crop (`locate` contract, bbox or center per `--coords` format); `--rounds 3` adds a small-window verification round (`verify` contract).
4. **Call the API per round** — POST to `{BASE_URL}/chat/completions` with a user message containing a base64 `image_url` part and a `text` part.
5. **Normalize & remap** — each round's `## Coordinates` section is normalized to canonical JSON lines (tolerating malformed output), and every center point is scaled back to the ORIGINAL image pixels using that round's crop offset.
6. **Session save** — when `--session` is passed, the user turn (question + image source) and the assistant turn (the printed reply) are appended to the state file.

## Session continuity (`--session`)

`scripts/lib/session.js` manages conversation state at `.vision/<name>.json`
(or `VISION_SESSION_DIR`), mirroring the imagine skill's design:

```json
{
  "model": "qwen-vl-max",
  "turns": [
    { "role": "user", "text": "Describe this screenshot", "images": ["C:/abs/path/shot1.png"] },
    { "role": "assistant", "text": "A login form with…", "images": [] }
  ]
}
```

- `isValidSessionName` / `sessionPath` / `loadSession` / `saveSession`
  validate the name (letters/digits/`-`/`_`), resolve, read, and write the
  state file; `clearSession` deletes it (used by `--clear <name>`);
  `trimTurns` caps the replayed history
  (default 10, `VISION_SESSION_MAX_TURNS`); `imageUrlFor` converts a stored
  source (data URL, http URL, or local path) into an API-ready image at replay
  time — missing local files yield `null` so the turn degrades to text-only.
- On a session call, `vision.js` loads the state, replays the trimmed turns via
  `buildPayload(..., { history })`, and appends the new user + assistant turns
  after the reply succeeds. The current image + per-round instructions are
  always the last message, so contracts like `locate` only apply to the current
  task.
- A model change between calls resets the session with a warning.
- Image sources are stored verbatim: local paths are stored as absolute paths,
  URLs as URLs, and `--base64` input as a `data:image/...;base64,...` URL (the
  temp file itself is still cleaned up after the run).

## Configuration (env vars or .env)

| Variable | Default | Description |
|----------|---------|-------------|
| `DASHSCOPE_API_KEY` | — | Required. API key for the vision service |
| `VISION_MODEL` | `qwen-vl-max` | Model name |
| `DASHSCOPE_BASE_URL` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | OpenAI-compatible endpoint |
| `VISION_SESSION_DIR` | `.vision` | Directory for `--session` state files |
| `VISION_SESSION_MAX_TURNS` | `10` | Max history turns replayed per session call |

`.env` files are loaded from the current working directory and the script's directory, and never override already-set environment variables.

## Key points

- Uses the native `fetch` — no npm dependencies.
- `lib/coords.js` is shared by vision.js (locate rounds) and lib/preprocess.js (remap) — change parsing/remapping there.
- Not bound to a specific vendor; works with any OpenAI-compatible vision API.
- Compactness and coordinate instructions are embedded in the user text part, so strict APIs that only accept user messages still work.
- Debug mode is caller-driven: coordinates appear only with `--coords`; there is no keyword auto-detection.
- Remote URLs are downloaded so resampling works everywhere; no caller-supplied dimensions needed.
- `--base64` materializes the payload to a temp file in the OS temp dir (cleaned up on exit), keeping `--coords` resampling unchanged.
- Session continuity is stateless by default — history is replayed only when
  `--session` is passed; the same session name resumes the conversation.
  `--clear <name>` removes the session state file and exits — no image or API
  key is required, so callers can clean up after a finished conversation.
- Resampling uses `sharp` (installed on first `--coords` use into `scripts/.deps/`); the non-debug path stays zero-dependency.
- The coordinate contract emits bbox by default and center points with `--coords center`; parsing derives the other representation (bbox ↔ center) automatically.
- Model input limits come from a per-model table with `VISION_MAX_PIXELS` / `VISION_MAX_LONG_EDGE` env overrides, since the API does not expose them.
- Supported local formats: jpg, jpeg, png, gif, webp, bmp.
