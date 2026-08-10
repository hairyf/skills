---
name: imagine
description: AI image, sticker, icon, and seamless-texture generation for agents. Use when the user asks to create, generate, edit, or iterate on images, photos, illustrations, posters, stickers, icons, logos, sprites, textures, or mockups. Provides a zero-dependency Node.js script that calls GPT Image 2, Nano Banana (Gemini), SiliconFlow Qwen-Image, or other image models and saves the result to disk.
metadata:
  author: Hairy
  version: "2026.8.7"
---

# Image Gen

Generate images, stickers, and seamless textures through a single zero-dependency Node.js script backed by multiple providers. The script speaks to each provider's API directly — no SDK or npm dependencies — and saves the generated image to disk.

## Model selection

Picked by the user for image generation, in priority order:

1. **GPT Image 2** (`gpt-image-2`, OpenAI) — best overall quality, 4K, excellent CJK/multilingual text rendering, up to 16 input images for edits.
2. **Nano Banana** (`gemini-2.5-flash-image`, Google) — fast, free tier, native conversational image editing; newer `gemini-3.1-flash-image` / `gemini-3-pro-image` variants.
3. **SiliconFlow Qwen-Image** (`Qwen/Qwen-Image`, SiliconFlow) — cheapest OpenAI-compatible option (~$0.042/image), strong Chinese text rendering, dedicated edit model `Qwen/Qwen-Image-Edit-2509`.
4. **OpenAI GPT Image** (`gpt-image-1`, OpenAI) — previous-generation GPT Image model; still the most widely supported via third-party aggregators.

For stickers, icons, and textures use the dedicated models below; the general image models still work but the specialists produce better asset-ready output.

| Asset | Recommended models (priority order) | Notes |
|-------|-------------------------------------|-------|
| Images / photos / posters | GPT Image 2 → Nano Banana → SiliconFlow Qwen-Image → OpenAI GPT Image | Follow the user's order above |
| Stickers / icons / logos | Ideogram 3.0 (transparent) → GPT Image (transparent PNG) → FLUX.2 pro | Transparent background built in |
| Seamless textures / tiles | Z-Image Turbo Tiling → FLUX.2 pro → Nano Banana / GPT Image 2 | Z-Image Tiling is purpose-built for tileable textures |

## Quick start

```bash
# Generate an image (defaults to gpt-image-2)
node scripts/imagine.js "a retro synthwave poster, neon grid, 80s style" -o poster.png

# Sticker with transparent background
node scripts/imagine.js "die-cut sticker of a cute sloth, white border" -m gpt-image-1.5 --background transparent -f png -o sloth.png

# Seamless texture via SiliconFlow (fast, cheap)
node scripts/imagine.js "seamless tileable brick wall texture, top-down, uniform lighting" -m Qwen/Qwen-Image -s 1328x1328 -o brick.png

# Nano Banana with a landscape aspect ratio
node scripts/imagine.js "a serene mountain lake at sunset" -m gemini-2.5-flash-image --aspect 16:9 -o lake.png

# Edit an existing image
node scripts/imagine.js "add a red balloon in the sky" -e photo.png -o edited.png

# Two-step design in one conversation (design -> three views), e.g. Minecraft model design
node scripts/imagine.js "生成一格Minecraft蜗牛，蜗牛壳是一个立方体，不要堆叠。蜗牛身体结构简单，有触角。蜗牛足够将整个身体缩回到蜗牛壳内部。请绘制 将宽高比设为 1:1" --session snail -o design.png
node scripts/imagine.js "非常好，画出它的三视图" --session snail -o views.png
```

## Setup

Requires at least one API key (OpenAI, SiliconFlow, or Google AI Studio). On first run, follow [core-setup](references/core-setup.md) — including the required AGENTS.md merge. Once configured, the agent can generate images on demand.

## References

### Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Usage | CLI arguments, providers, output handling, exit codes | [core-usage](references/core-usage.md) |
| Setup | API keys, `.env` configuration, required AGENTS.md merge, verification | [core-setup](references/core-setup.md) |
| How it works | Internals of imagine.js for patching and debugging | [core-script](references/core-script.md) |

### Models

| Topic | Description | Reference |
|-------|-------------|-----------|
| Image models | GPT Image 2, Nano Banana, SiliconFlow Qwen-Image, GPT Image — capabilities & parameters | [models-image](references/models-image.md) |

### Features

| Topic | Description | Reference |
|-------|-------------|-----------|
| Stickers & icons | Die-cut stickers, transparent backgrounds, Ideogram / GPT Image / FLUX.2 | [features-sticker](references/features-sticker.md) |
| Seamless textures | Tileable texture generation, Z-Image Turbo Tiling / FLUX.2 / prompt recipes | [features-texture](references/features-texture.md) |

### Best Practices

| Topic | Description | Reference |
|-------|-------------|-----------|
| Prompt recipes | Asset-ready prompts: style keywords, transparency, tiling, aspect ratios | [best-practices-prompts](references/best-practices-prompts.md) |
