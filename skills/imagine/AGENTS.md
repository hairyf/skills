# Image Generation Capability

When the user asks to generate, create, edit, or iterate on an **image, photo, illustration, poster, sticker, icon, logo, texture, sprite, or mockup**, use `scripts/imagine.js`:

```bash
node scripts/imagine.js "<prompt>" -o <output.png> [options]
node scripts/imagine.js "<prompt>" -e <image.png> -o <edited.png>   # edit
```

## Model selection

Follow this priority order unless the user specifies otherwise:

- **Images** — GPT Image 2 (`gpt-image-2`) → Nano Banana (`gemini-2.5-flash-image`) → SiliconFlow Qwen-Image (`Qwen/Qwen-Image`) → OpenAI GPT Image (`gpt-image-1`).
- **Stickers / icons / logos** — Ideogram 3.0 (transparent) → GPT Image (`--background transparent -f png`) → FLUX.2 pro. For Ideogram, see `references/features-sticker.md`.
- **Seamless textures** — Z-Image Turbo Tiling (fal.ai) → FLUX.2 pro → Nano Banana / GPT Image 2 with a "seamless tileable" prompt. See `references/features-texture.md`.

## Trigger scenarios

- The user asks to "generate/create/draw/make" an image, sticker, icon, logo, or texture
- The user provides a reference image and asks to edit, redraw, or combine it
- The user needs asset variations (e.g. "another style", "transparent background", "seamless tile")

Save outputs to a sensible path, print the saved file path, and mention the model used. Fall back to the next model in the priority order if the preferred provider has no API key configured.
