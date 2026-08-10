---
name: minecraft-texture-prompts
description: Prompt recipes for generating Minecraft item/block textures with image models — fill-the-frame framing, white background, flat colors, and negative prompts.
---

# Prompt recipes

## Item texture

English:

> raw chicken, Minecraft item texture, flat, front-facing, filling the entire frame edge to edge, no margin, no grid lines, isolated on plain white background, flat unshaded pixel-art colors, vanilla Minecraft style, no text, no watermark, no 3D perspective

Chinese:

> 巧克力卷（巧克力瑞士卷），Minecraft 物品材质，正面平视，占满整个画面，无留白，无网格线，纯白背景，扁平无阴影的像素色块，原版 MC 风格，无文字，无水印，无立体透视

## Block texture

> oak plank block face, Minecraft block texture, top-down flat front face, single square filling the entire frame edge to edge, no grid lines, flat pixel-art colors, seamless tileable, vanilla Minecraft style, no text, no watermark

## Structure of a good prompt

1. **Subject** — exact item/block noun (raw chicken, diamond sword, deepslate bricks...). Use "原味鸡" / "巧克力卷" style naming for Chinese requests.
2. **Framing** — `flat`, `front-facing`, `centered`, and critically `filling the entire frame / 占满整个画面` so the sampled texture keeps maximum detail. Never add `grid lines` — the pipeline does not need them and leftover lines would show in the texture.
3. **Background** — `plain white background` / `纯白背景`. The pipeline converts white to transparency.
4. **Style** — `vanilla Minecraft` (16x16, muted palette) vs `faithful 32x32` (more detail) vs custom themes; keep shading flat so block sampling picks one clean color per pixel.
5. **Negative prompts** — `no text, no watermark, no grid lines, no shadows, no background objects, no 3D perspective, no bevel`.

## Tips

- Ask for `flat unshaded colors` — gradients make the dominant-color sampling muddy.
- Ask the subject to fill the frame; large white margins waste resolution and get cropped anyway.
- Never ask for a grid overlay; if the model draws lines anyway, `remove-bg --mode replace` still removes white but not gray lines, so regenerate.
- If the output has no white margin or a non-white background, the corner-based background detection picks the wrong color — keep the background white.

<!--
Source references:
- https://ai-kit.xingduansuzhao.com/texture (generation step of the modeled workflow)
-->
