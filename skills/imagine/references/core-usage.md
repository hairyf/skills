---
name: core-usage
description: How to invoke imagine.js — prompts, providers, output files, editing, and exit codes.
---

# Usage

Run the script with Node.js (18+). It sends the prompt to the selected provider, downloads the generated image, and saves it to disk. The provider is inferred from the model id, or forced with `--provider`.

## Generate

```bash
node imagine.js "a cute cat sticker, die-cut, white border" -o cat.png
```

## Edit an existing image

```bash
node imagine.js "add a red balloon" -e photo.png -o edited.png
```

`-e/--edit` is supported by all three providers:

- OpenAI → `/v1/images/edits` (multipart, optional `--mask` for inpainting)
- SiliconFlow → passes the image to `Qwen/Qwen-Image-Edit-2509` via the `image` field
- Gemini → text + inline image parts in `generateContent`

## Provider and model selection

```bash
# Explicit provider (overrides model-based inference)
node imagine.js "..." --provider siliconflow -m Qwen/Qwen-Image

# Model-based inference
node imagine.js "..." -m gpt-image-2        # -> openai (default)
node imagine.js "..." -m gemini-2.5-flash-image  # -> gemini
node imagine.js "..." -m Qwen/Qwen-Image    # -> siliconflow
```

## OpenAI-compatible relays (e.g. Nano Banana via a Chinese relay)

Set `RELAY_API_KEY` + `RELAY_BASE_URL` to the relay endpoint. Prefixed model names (e.g. `google/gemini-2.5-flash-image`, `openai/gpt-image-2`, `bailian/qwen-image-3.0`) route to the relay automatically; `--provider relay` forces it:

```bash
RELAY_API_KEY=<relay-key>
RELAY_BASE_URL=https://api.ofox.ai/v1

node imagine.js "a cute dog" -m google/gemini-2.5-flash-image -o dog.png   # -> relay (auto-detected)
node imagine.js "a cute dog" -m google/gemini-2.5-flash-image --provider relay -o dog.png
```

If the relay domain is unreachable on your network (DNS pollution / SNI reset), set `HTTPS_PROXY` — see core-setup.

## Arguments

| Argument | Description |
|----------|-------------|
| `<prompt>` | Text prompt describing the image to generate (required) |
| `-o, --output <path>` | Output file or directory; defaults to `image-<timestamp>-<n>.<ext>` |
| `-m, --model <id>` | Model id; defaults per provider (`gpt-image-2`, `Qwen/Qwen-Image`, `gemini-2.5-flash-image`) |
| `--provider <name>` | Force provider: `openai`, `siliconflow`, `gemini` |
| `-s, --size <WxH>` | Image size, e.g. `1024x1024`, `1536x1024`, `1328x1328` |
| `-q, --quality <lvl>` | `low` / `medium` / `high` (OpenAI GPT Image models) |
| `--background <bg>` | `auto` / `transparent` / `opaque` (OpenAI; `transparent` requires `-f png` or `webp`) |
| `-f, --format <fmt>` | `png` / `jpeg` / `webp` output format |
| `-e, --edit <image>` | Edit an existing image (local path) |
| `--mask <image>` | Mask for inpainting (OpenAI edits; white = regenerate, black = keep) |
| `-n, --num-images <n>` | Number of images to generate (OpenAI / SiliconFlow Kolors) |
| `--seed <n>` | Seed for reproducible output (SiliconFlow / Gemini) |
| `--steps <n>` | Inference steps, default 20 (SiliconFlow) |
| `--aspect <ratio>` | Aspect ratio for Gemini: `1:1`, `16:9`, `9:16`, `4:3`, `3:4`, `2:3`, `3:2`, `21:9` |
| `-S, --session <name>` | Conversation continuity — reuse the previous generation in this session as edit input / conversation context (default: stateless, no continuity) |
| `--session-reset` | Clear the session state for `--session <name>` before this run |

## Conversation continuity (`--session`)

Some workflows need a follow-up generation that builds on the previous image (e.g. "generate the design, then draw its three views"). Pass the same `--session <name>` to both calls; omit it to keep the existing stateless behavior.

```bash
# First call: create the design
node imagine.js "生成一格Minecraft蜗牛，蜗牛壳是一个立方体，不要堆叠。蜗牛身体结构简单，有触角。蜗牛足够将整个身体缩回到蜗牛壳内部。请绘制 将宽高比设为 1:1" --session snail -o design.png

# Second call: continue the same conversation for the three views
node imagine.js "非常好，画出它的三视图" --session snail -o views.png
```

Session state is stored in `.imagine-sessions/<name>.json` (cwd), or `IMAGINE_SESSION_DIR/<name>.json` when that env var is set. Each call appends a user turn and the generated image paths to the state.

Provider behavior:

- **Gemini / Nano Banana** — replays the whole conversation (`contents`) natively, so later turns can refine or re-draw the earlier image.
- **OpenAI / relays** — the latest session image is passed as the edit input to `/v1/images/edits` with the new prompt.
- **SiliconFlow** — the latest session image is passed via the `image` field; use an edit-capable model (e.g. `Qwen/Qwen-Image-Edit-2509`) for reliable continuity.

`--session` with `--edit` uses the explicit `-e` image as input and still records the turn in the session. If the model/provider changes between calls of the same session name, the session is reset with a warning.

## Output

- The script prints the absolute path(s) of saved files to stdout.
- If `-o` points to a directory (no extension), files are saved inside it as `image-<n>.<ext>`.
- With `-n 2` (or a multi-image provider response), an index is appended before the extension.
- SiliconFlow image URLs expire after one hour — the script downloads them immediately.

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | Success, image(s) saved and paths printed to stdout |
| `1` | Missing prompt / API key, unknown option, or API failure (error printed to stderr) |
