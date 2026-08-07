---
name: features-sticker
description: Sticker, icon, and logo generation — die-cut stickers, transparent backgrounds, and the best models for asset-ready output.
---

# Stickers & Icons

Stickers and icons need two things generic image models often get wrong: **clean shapes** and a **transparent background**. Specialist models or explicit parameters solve both.

## 1. Ideogram 3.0 (recommended for stickers/logos)

Ideogram is the strongest model for typography and clean graphic assets, and its transparent-background mode is purpose-built for stickers.

- **Direct API** — `POST https://api.ideogram.ai/generate`:
  ```json
  {
    "image_request": {
      "prompt": "die-cut stickers of a sun, a cloud and a star, thick white outline",
      "model": "V_3",
      "background_transparent": true,
      "magic_prompt_option": "Auto",
      "aspect_ratio": "1:1"
    }
  }
  ```
  Response: `data[0].url` (PNG with transparency).
- **Transparent variant** — some hosts expose `ideogram-v3/generate-transparent` with just `{ "prompt": "..." }`.
- **Style presets** — `AUTO`, `GENERAL`, `REALISTIC`, `DESIGN`; use `DESIGN` for logos and stickers.
- **Also via fal / aggregators** — `fal-ai/ideogram/v3` supports `transparent_background`, `style_references`, and `character_references`.

## 2. GPT Image (`gpt-image-1.5` / `gpt-image-2`)

GPT Image models produce excellent die-cut stickers on demand.

```bash
node scripts/imagine.js "die-cut sticker of a cute sloth, flat vector, thick white border" -m gpt-image-1.5 --background transparent -f png -o sloth.png
```

- Transparent output requires `output_format: png` (or `webp`).
- `gpt-image-1.5` is the reliable transparent-PNG choice; `gpt-image-2` exposes `background` on OpenAI native but some hosts omit it.
- Keep sticker prompts short and shape-focused: "bold clean shapes", "thick black/white outline", "flat vector style", "no background".

## 3. FLUX.2 pro

- Best for photorealistic sticker *mockups* (a sticker sheet lying on a table) and consistent character stickers using reference images (up to 8 input images).
- Endpoints: BFL `/flux-2-pro`, fal `fal-ai/flux-2-pro`, Together, Replicate.
- Transparent output is not its strength — prefer Ideogram or GPT Image for cutout stickers.

## Prompt recipes

| Style | Prompt seed |
|-------|-------------|
| Classic die-cut | "die-cut sticker of {subject}, thick white border, bold clean shapes, flat vector" |
| Cute / kawaii | "kawaii chibi {subject} sticker, glossy highlights, soft pastel colors, rounded shapes" |
| Minimal icon | "minimal line icon of {subject}, single color, centered, transparent background" |
| Logo | "flat logo mark of {subject}, DESIGN style, vector, transparent background" |
| Emoji-style | "emoji-style {subject}, bold outlines, vibrant colors, sticker" |

## Key points

- Transparent background: `--background transparent -f png` (GPT Image) or `background_transparent: true` (Ideogram).
- "Die-cut sticker" + "white/black outline" is the single most reliable sticker prompt phrase.
- For consistent character stickers across a set, use FLUX.2 with character references.

<!--
Source references:
- https://ideogram.ai/api-transparent-backgrounds/
- https://ideogram.ai/api-learn/
- https://fal.ai/docs/model-api-reference/image-generation-api/ideogram-v3
- https://developers.cloudflare.com/ai/models/openai/gpt-image-2/
- https://docs.bfl.ai/quick_start/generating_images
- https://www.together.ai/models/flux-2-pro
-->
