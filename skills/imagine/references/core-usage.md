---
name: core-usage
description: imagine.js CLI reference — generate, edit, model/provider selection, arguments, sessions, output, and exit codes.
---

# Usage

Run the script with Node.js (18+). The provider is inferred from the model id, or forced with `--provider`.
Run `node scripts/imagine.js --help` for the full flag list.

## Generate and edit

```bash
node imagine.js "a cute cat sticker, die-cut, white border" -o cat.png
node imagine.js "add a red balloon" -e photo.png -o edited.png
```

`-e/--edit` works on all providers.

## Provider and model selection

```bash
node imagine.js "..." -m gpt-image-2                    # -> openai (default)
node imagine.js "..." -m gemini-2.5-flash-image         # -> gemini
node imagine.js "..." -m Qwen/Qwen-Image                # -> siliconflow
node imagine.js "..." -m google/gemini-2.5-flash-image  # -> relay (prefixed names auto-route)
node imagine.js "..." --provider relay -m google/gemini-2.5-flash-image  # force relay
```

## Arguments

| Argument | Description |
|----------|-------------|
| `<prompt>` | Text prompt describing the image to generate (required) |
| `-o, --output <path>` | Output file or directory; defaults to `image-<timestamp>-<n>.<ext>` |
| `-m, --model <id>` | Model id; defaults per provider (`gpt-image-2`, `Qwen/Qwen-Image`, `gemini-2.5-flash-image`) |
| `--provider <name>` | Force provider: `openai`, `siliconflow`, `gemini`, `relay` |
| `-s, --size <WxH>` | Image size, e.g. `1024x1024`, `1536x1024`, `1328x1328` |
| `-q, --quality <lvl>` | `low` / `medium` / `high` (OpenAI GPT Image models) |
| `--background <bg>` | `auto` / `transparent` / `opaque` (OpenAI; `transparent` requires `-f png` or `webp`) |
| `-f, --format <fmt>` | `png` / `jpeg` / `webp` output format |
| `-e, --edit <image>` | Edit an existing image (local path) |
| `--seed <n>` | Seed for reproducible output (SiliconFlow / Gemini) |
| `--aspect <ratio>` | Aspect ratio for Gemini: `1:1`, `16:9`, `9:16`, `4:3`, `3:4`, `2:3`, `3:2`, `21:9` |
| `-S, --session <name>` | Session continuity — preserve context across calls so later prompts can build on earlier results (default: stateless, no continuity) |

## Sessions (`--session`)

For multi-step workflows that build on earlier results (e.g. design → three views), pass the same `--session <name>` to each call; omit it for stateless generation. State is stored in `.imagine/<name>.json` (or `IMAGINE_SESSION_DIR`).

```bash
# First call: create the design
node imagine.js "a cute robot mascot, front view, flat vector style" --session mascot -o design.png

# Second call: continue the same session for the three views
node imagine.js "draw its three views (front, side, back) from the same design" --session mascot -o views.png
```

- **Gemini / Nano Banana** — replays the whole conversation natively; later turns refine or re-draw earlier images.
- **OpenAI / relays** — the latest session image is passed as the edit input.
- **SiliconFlow** — the latest session image is passed via the `image` field; use an edit-capable model (`Qwen/Qwen-Image-Edit-2509`) for reliable continuity.

A provider/model change between calls resets the session with a warning. `--session` combined with `--edit` uses the explicit `-e` image and still records the turn.

## Output and exit codes

- Absolute path(s) of saved files are printed to stdout; `-o` may point to a directory.
- SiliconFlow image URLs expire after one hour — the script downloads them immediately.
- Exit `0` on success; `1` on missing prompt/key, unknown option, or API failure (message on stderr).
