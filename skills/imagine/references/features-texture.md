---
name: features-texture
description: Seamless texture and tile generation — Z-Image Turbo Tiling, FLUX.2, and prompt recipes for tileable game/3D/UI textures.
---

# Seamless Textures

The hard requirement for textures is **seamless tiling**: edges must wrap so the texture repeats without visible seams. A purpose-built tiling model beats prompt tricks alone.

## 1. Z-Image Turbo Tiling (recommended for tileable textures)

Tongyi-MAI's Z-Image Turbo with toroidal-RoPE + circular VAE — generates pixel-wrap seamless repeating textures.

- **Endpoint** — `POST https://fal.run/fal-ai/z-image/turbo/tiling`, auth `Authorization: Key $FAL_KEY`.
- **Key parameters**:
  - `tile_size` (latent): `64` = 512px, `128` = 1024px (default), `256` = 2048px
  - `tile_stride` (latent): `32` = 256px, `64` = 512px (default), `128` = 1024px
  - `tiling_mode`: `both` (omnidirectional, default), `horizontal`, `vertical`
  - `image_size`: `square_hd` (default), `square`, `portrait_4_3`, `portrait_16_9`, `landscape_4_3`, `landscape_16_9`, `auto`
  - `num_inference_steps`: 1–8 (default 8); `num_images`: 1–4; `output_format`: `jpeg`/`png`/`webp`
- **Example**:
  ```bash
  curl -X POST https://fal.run/fal-ai/z-image/turbo/tiling \
    -H "Authorization: Key $FAL_KEY" -H "Content-Type: application/json" \
    -d '{"prompt":"seamless tileable 4k brick wall texture, weathered, moss in mortar lines, flat uniform lighting, no shadows","image_size":"square_hd","tiling_mode":"both","num_inference_steps":8}'
  ```
- **Also on SiliconFlow** — `Tongyi-MAI/Z-Image-Turbo` is available OpenAI-compatible for general fast generation, but the seamless *tiling* mode is a fal-specific variant.

## 2. FLUX.2 pro

- High-detail, photorealistic textures; strong at material variation (wood, stone, fabric, metal).
- Pair with a "seamless / tileable / flat top-down" prompt; FLUX is not tile-native so expect to check the seams.
- Supports up to 8 reference images for style consistency.

## 3. Nano Banana / GPT Image 2 (prompt-based fallback)

When a tiling model is unavailable, use any strong image model with a strict tiling prompt:

```bash
node scripts/imagine.js "seamless tileable dark wood floor texture, top-down flat view, uniform lighting, no shadows, edges wrap perfectly, 4k detail" -o wood.png
```

- GPT Image 2: best for realistic PBR-style base maps with text-free material detail.
- Nano Banana: free and fast for iterating on material looks.

## 4. 3D / game-asset pipelines

- **Seed3D 2.0** (ByteDance / Volcano Engine) — 3D geometry + texture generation in one model, production-ready for games.
- **Ludo.ai** — game-asset REST API: sprites, icons, UI assets, textures, backgrounds, even 2D→3D with PBR maps.
- **GenAI Model Generator** (Unreal plugin) — PBR map sets (base color, normal, roughness, metallic) via Google Gemini.

## Prompt recipes

| Material | Prompt seed |
|----------|-------------|
| Stone/brick | "seamless tileable {brick/stone} wall texture, weathered, uniform flat lighting, no shadows, edges wrap" |
| Wood | "seamless tileable {oak/dark} wood floor texture, top-down, straight grain, flat lighting" |
| Fabric | "seamless tileable {linen/denim} fabric texture, fine weave detail, even tone" |
| Metal | "seamless brushed metal texture, horizontal grain, subtle reflections, flat lighting" |
| Organic | "seamless moss/ground texture, top-down, natural color variation, no vignette" |

## Key points

- Use `tiling_mode: both` for general-purpose tiles; `horizontal`/`vertical` only for specific use cases.
- Larger `tile_size` = higher resolution tile (up to 2048px) but slower.
- Always say "seamless", "tileable", "top-down", "flat/uniform lighting", "no shadows" and "edges wrap perfectly".
- For 3D workflows, generate base color first, then derive normal/roughness maps in the target engine or with PBR tools.

<!--
Source references:
- https://fal.ai/docs/model-api-reference/image-generation-api/z-image-turbo-tiling
- https://fal.ai/models/fal-ai/z-image/turbo/tiling/api
- https://docs.bfl.ai/quick_start/generating_images
- https://www.aibase.com/news/27393
- https://github.com/api-evangelist/ludo-ai
- https://muddyterrain.com/docs/genai-modelgenerator/
-->
