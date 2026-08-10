---
name: imagine
description: AI image, sticker, icon, and seamless-texture generation for agents. Use when the user asks to create, generate, edit, or iterate on images, photos, illustrations, posters, stickers, icons, logos, sprites, textures, or mockups. Provides a zero-dependency Node.js script that calls GPT Image 2, Nano Banana (Gemini), SiliconFlow Qwen-Image, or other image models and saves the result to disk.
metadata:
  author: Hairy
  version: "2026.8.11"
---

# Image Gen

Generate images through `scripts/imagine.js`, a zero-dependency Node.js CLI (Node 18+, no npm install) backed by multiple providers. It saves images to disk and prints the absolute paths.

## Quick start

```bash
# Generate an image
node scripts/imagine.js "a retro synthwave poster, neon grid, 80s style" -o poster.png

# Edit an existing image
node scripts/imagine.js "add a red balloon in the sky" -e photo.png -o edited.png

# Multi-step session: keep context across calls (design first, then its three views)
node scripts/imagine.js "a cute robot mascot, front view, flat vector style" --session mascot -o design.png
node scripts/imagine.js "draw its three views (front, side, back) from the same design" --session mascot -o views.png

# Clean up the session cache when the workflow is done
node scripts/imagine.js --clear mascot
```

## Model selection

Priority for general images: **GPT Image 2 (`gpt-image-2`) → Nano Banana (`gemini-2.5-flash-image`) → SiliconFlow Qwen-Image (`Qwen/Qwen-Image`) → OpenAI GPT Image (`gpt-image-1`)**. When a provider has no API key, fall back to the next configured one.

| Asset | Recommended models (priority order) |
|-------|-------------------------------------|
| Images / posters | `gpt-image-2` → `gemini-2.5-flash-image` → `Qwen/Qwen-Image` → `gpt-image-1` |
| Stickers / icons / logos | Ideogram 3.0 (transparent) → `gpt-image-1.5` / `gpt-image-2` with `--background transparent -f png` → FLUX.2 pro |
| Seamless textures | Z-Image Turbo Tiling (fal.ai) → FLUX.2 pro → any strong model with a strict tiling prompt |

Specialist models outside the script's providers (Ideogram, fal tiling) are called through their own APIs; `imagine.js` covers OpenAI, SiliconFlow, Gemini, and OpenAI-compatible relays.

## Key workflows

- **Transparent assets**: `--background transparent -f png` (never `jpeg`); phrase stickers as "die-cut sticker, thick white border, bold clean shapes".
- **Seamless textures**: include "seamless, tileable, top-down, flat uniform lighting, no shadows, edges wrap perfectly".
- **Text in images**: GPT Image 2 is best for CJK/multilingual text; keep text short and quoted.
- **Aspect ratio**: Gemini via `--aspect 16:9`; OpenAI/SiliconFlow via `-s WxH` (Qwen native sizes like `1328x1328`, `1664x928`).
- **Iterate cheaply**: draft with `Qwen/Qwen-Image` / Nano Banana or `-q low`, render finals on `gpt-image-2` with `-q high`; `--seed` for reproducible output.

## References — load on demand

| When | Reference |
|------|-----------|
| Full CLI arguments, session details, exit codes | [core-usage](references/core-usage.md) |
| First run with no API key configured (env keys, AGENTS.md merge) | [core-setup](references/core-setup.md) |
| Debugging the pipeline or editing the scripts | [core-script](references/core-script.md) |
