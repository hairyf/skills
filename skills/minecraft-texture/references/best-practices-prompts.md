---
name: minecraft-texture-prompts
description: Prompt recipes for generating Minecraft item/block textures with image models — subject framing, grid overlay, background, style keywords, and negative prompts.
---

# Prompt recipes

## Item texture (16x16 grid)

English:

> raw chicken, Minecraft item texture, flat, front-facing, centered, isolated on plain white background, thin gray pixel grid dividing the image into 16x16 equal squares, flat unshaded pixel-art colors, crisp cell boundaries, vanilla Minecraft style, no text, no watermark, no 3D perspective

Chinese:

> 原味鸡，Minecraft 物品材质，正面平视，居中，纯白背景，细灰色网格线将画面分成 16x16 等分方格，扁平无阴影的像素色块，边缘清晰，原版 MC 风格，无文字，无水印，无立体透视

## Block texture (32x32 grid)

> oak plank block face, Minecraft block texture, top-down flat front face, single square, thin gray pixel grid dividing the image into 32x32 equal squares, flat pixel-art colors, seamless tileable, vanilla Minecraft style, no text, no watermark

## Structure of a good prompt

1. **Subject** — exact item/block noun (raw chicken, diamond sword, deepslate bricks...). Use "原味鸡" / "raw chicken" style naming for Chinese requests.
2. **Framing** — `flat`, `front-facing`, `centered`, `single square`; items never get 3D/iso perspective.
3. **Grid** — explicitly request a thin gray pixel grid with the exact resolution (`16x16` / `32x32` equal squares). The script detects these lines to align cells; a missing grid triggers block-sampling fallback.
4. **Style** — `vanilla Minecraft` (16x16, muted palette) vs `faithful 32x32` (more detail) vs custom themes; keep shading flat so quantization picks one clean color per cell.
5. **Negative prompts** — `no text, no watermark, no shadows, no background objects, no 3D perspective, no bevel`.

## Tips

- Ask for `flat unshaded colors` — gradients make the dominant-color sampling muddy.
- Keep the background a single solid color (white); the script detects it from the image corners.
- Request a large canvas (512px+) so each grid cell contains enough pixels.
- If the output has no grid, either regenerate or rely on the fallback; the fallback still produces usable 16x16/32x32 textures from any clean sprite.

<!--
Source references:
- https://ai-kit.xingduansuzhao.com/texture (generation step of the modeled workflow)
-->
