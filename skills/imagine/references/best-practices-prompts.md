---
name: best-practices-prompts
description: Asset-ready prompt recipes and generation best practices — style keywords, transparency, tiling, aspect ratios, and iteration workflow.
---

# Prompt Recipes

Small prompt choices decide whether output is asset-ready or needs manual cleanup. These patterns apply across all supported models.

## Structure a generation prompt

`{subject} + {style} + {composition/view} + {lighting} + {background} + {technical notes}`

Example:
> "a cozy reading nook with a cat, cozy flat illustration, soft warm light, plants around, pastel palette, high detail, 4k"

## Style keywords

| Desired look | Add to prompt |
|--------------|---------------|
| Flat vector / illustration | "flat vector illustration, bold clean shapes, limited color palette" |
| Pixel art | "pixel art, 16-bit style, crisp pixels, limited palette" |
| Watercolor | "watercolor illustration, soft edges, paper texture" |
| Photorealistic | "photorealistic, natural lighting, shallow depth of field, shot on {camera}" |
| 3D render | "3D render, soft studio lighting, octane render, clay material" |
| Retro / poster | "retro synthwave poster, neon grid, grainy print texture, 80s style" |

## Transparency

- GPT Image: `--background transparent -f png` (or `webp`). Never request transparency with `jpeg`.
- Ideogram: `background_transparent: true`.
- Sticker phrasing: "die-cut sticker", "isolated on transparent background", "no background".
- If a model ignores transparency, switch to Ideogram or `gpt-image-1.5`.

## Tiling / seamless

- Always include: "seamless", "tileable", "top-down", "flat uniform lighting", "no shadows", "edges wrap perfectly".
- Avoid scene-like prompts (perspective, depth, vignettes) for textures.
- Prefer a dedicated tiling model (Z-Image Turbo Tiling) over prompt-only approaches.

## Aspect ratios and sizes

- **OpenAI** — `1024x1024`, `1536x1024` (landscape), `1024x1536` (portrait); `gpt-image-2` accepts arbitrary `WIDTHxHEIGHT` (both divisible by 16, ratio within 1:3–3:1).
- **SiliconFlow Qwen-Image** — use the model's native sizes: `1328x1328` (1:1), `1664x928` (16:9), `928x1664` (9:16), etc. Arbitrary sizes degrade quality.
- **Gemini** — use `--aspect` (`1:1`, `16:9`, `9:16`, `4:3`, `3:4`), not pixel sizes.

## Text in images

- GPT Image 2 is best-in-class for CJK and multilingual text (posters, UI mockups, infographics).
- Qwen-Image is strong at Chinese text and cheap for it.
- Keep text short and quoted, e.g. `a poster that says "你好，世界"`.
- For precise typography (logos, long copy), use Ideogram.

## Editing workflow

1. Generate a base image.
2. Edit iteratively with `-e` and short deltas ("make the sky purple", "add a hat").
3. Use reference images for consistency (up to 16 for GPT Image 2, up to 8 for FLUX.2).
4. For inpainting, provide a mask (white = regenerate, black = keep) on OpenAI edits.

## Cost and iteration

- Draft with cheap/fast models (`Qwen-Image`, Nano Banana, `quality: low`), then render final assets on `gpt-image-2` (`quality: high`).
- Use `--seed` to reproduce or iterate on a specific result (SiliconFlow / Gemini).
- Generate variations in batches with `-n`/`--num-images` where supported, then pick the best.

## Key points

- Always state the style explicitly — models default to bland photorealism otherwise.
- State the background explicitly ("transparent", "solid white", "blurred studio backdrop").
- For assets, prefer dedicated specialists: Ideogram (stickers/logos), Z-Image Turbo Tiling (textures).
- Fall back down the model priority order when a provider lacks a key.
