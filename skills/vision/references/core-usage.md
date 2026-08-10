---
name: core-usage
description: How to invoke vision.js — CLI arguments, local files, remote URLs, output modes, and the coordinate contract.
---

# Usage

Run the script with Node.js. It reads the image, sends it to a vision model, and prints the text description to stdout.
Run `node scripts/vision.js --help` for the full interface.

## Local image

```bash
node vision.js "path/to/image.png" "Describe this image"
```

## Remote URL

```bash
node vision.js --url "https://example.com/image.png" "Describe this image"
```

## Base64 / data URL

Pass the image as a raw base64 string or a full `data:image/...;base64,...` URL:

```bash
node vision.js --base64 "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" "Describe this image"
node vision.js --base64 "data:image/png;base64,iVBORw0KGgo..." "find the login button" --coords center
```

Use `-` to read the payload from stdin — required for large payloads
(screenshots, full windows) that would exceed the Windows command-line length
limit:

```bash
node vision.js --base64 - < shot.b64 "find the login button" --coords center
```

The payload is decoded and written to a temp file (removed when the run
finishes); supported formats are the same as local files.

## Output contract

- Default: concise — 1 subject line + compact bullets covering every key element (no fixed cap; group similar elements), visible text verbatim, no filler.
- With `--coords` a `## Coordinates` section is appended: one JSON line per element — bbox `{"name","text","bbox":{"x","y","w","h"}}` by default, or center point `{"name","text","center":{"x","y"}}` with `--coords center`. The other representation is derived automatically during parsing.
- Coordinates are **pixels in the ORIGINAL image**. The image is automatically resampled to the model's input limits before sending, and coordinates are remapped back afterwards — the caller never supplies width/height or does scaling.
- Localization is **coarse-to-fine** by default: round 1 asks the model to propose a precise point or a zoom region, round 2 re-locates in the focused crop, and `--rounds 3` adds a small-window verification round. This works on any model and removes the need for manual crop hints.
- The first `--coords` call auto-installs a resampling dependency (sharp) into `scripts/.deps/` (gitignored, one-time download). Non-debug calls never install anything.
- The section is normalized to canonical, valid JSON — malformed model output (stray commas, missing keys, arrays) is repaired automatically.
- Default is non-debug: coordinates appear only when the caller passes `--coords`.

## Model input limits

The API does not expose a model's maximum input size, so the resampler uses a per-model table (Qwen/DashScope `max_pixels`, Claude long-edge/pixel budgets, conservative defaults for others) with two env overrides:

```bash
VISION_MAX_PIXELS=1310720      # total pixel budget (e.g. qwen-vl-max default)
VISION_MAX_LONG_EDGE=1568      # long-edge budget in px
```

Unknown models fall back to a conservative 1568px / 1.15MP limit. Tune via env vars when switching providers.

## Arguments

| Argument | Description |
|----------|-------------|
| `<image>` | Path to a local image file, or a URL when used with `--url` |
| `--url` | Treat the first argument as a remote URL instead of a file path |
| `--base64 <data|->` | Image as raw base64 or `data:image/...;base64,...` URL; `-` reads the payload from stdin |
| `[question]` | Optional prompt; defaults to a concise "describe the image" request |
| `--coords [center]` | Debug mode: append the `## Coordinates` section (bbox by default; center points with `--coords center`) in original pixels |
| `--detail [n]` | Fuller detail output; optional token cap `n` (default 1600; compact mode caps at 1000) |
| `--rounds N` | 1 = single locate, 2 = coarse-to-fine (default), 3 = + verification round |
| `--session <name>` | Session continuity — replay this session's previous turns (images + text) together with the current question (default: stateless, no continuity) |
| `--clear <name>` | Delete the session state file (`.vision/<name>.json`) and exit — callers use this after finishing a session |
| `-h, --help` | Print usage and exit |

Supported local formats: jpg, jpeg, png, gif, webp, bmp.

## Examples

```bash
# Concise recognition (default)
node vision.js "shot.png" "Describe this image"

# UI debugging — element coordinates via --coords
node vision.js "ui.png" "find the login button and its position" --coords

# Detailed analysis with a custom token budget
node vision.js "chart.png" "extract all labels and values" --detail 2500
```

## Session continuity (`--session`)

Some workflows need a follow-up question that builds on images seen earlier in
the same conversation (e.g. "describe this screenshot", then "where is the
search bar compared to the previous one?"). Pass the same `--session <name>` to both
calls; omit it to keep the existing stateless behavior.

```bash
# First call: recognize the first screenshot
node vision.js "shot1.png" "Describe this screenshot" --session ui

# Second call: same session replays shot1 + its answer alongside shot2
node vision.js "shot2.png" "Compare the layout with the previous screenshot" --session ui
```

Session state is stored in `.vision/<name>.json` (cwd), or
`VISION_SESSION_DIR/<name>.json` when that env var is set. Each call appends a
user turn (question + image source) and an assistant turn (the reply) to the
state.

How history is replayed:

- Every previous user turn's image is sent again (local files are re-read at
  call time; missing files degrade that turn to text-only instead of failing).
- Only the most recent turns are replayed (default 10, override with
  `VISION_SESSION_MAX_TURNS`), so image-heavy histories don't overflow the
  model's context window. Stored turns are never deleted.
- If the model changes between calls of the same session name, the session is
  reset with a warning (same behavior as imagine's provider/model check).
- `--coords` rounds replay the same history; the final coordinates reply is
  stored as the assistant turn.

When the conversation is finished, remove the cache so the next run starts
clean:

```bash
node vision.js --clear ui
```

`--clear <name>` deletes `.vision/<name>.json` (or
`VISION_SESSION_DIR/<name>.json`) and exits without needing an image or API
key; it prints the removed path, or a "session does not exist" notice when
there is nothing to clear.

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | Success (description printed to stdout; session saved when `--session` was passed; `--clear` removes the session file) |
| `1` | Missing API key, missing image argument, invalid session name, or API failure (error printed to stderr) |
