---
name: minecraft-texture
description: Generate Minecraft item/block textures (16x16 / 32x32 PNG) from AI-generated art. Use when the user asks to create, convert, or post-process Minecraft textures — e.g. "生成一个原味鸡的 MC 材质" or "把这张图做成 16x16 的 Minecraft 材质" — including background removal, pixel-grid detection, and per-cell color-block sampling. Pairs with the `imagegen` skill for generation and the `minecraft-modding` skill for using textures in mods.
metadata:
  author: Hairy
  version: "2026.8.10"
  source: Workflow modeled on https://ai-kit.xingduansuzhao.com/texture; post-processing implemented locally
---

# Minecraft Texture

> Workflow modeled on the ai-kit texture tool (https://ai-kit.xingduansuzhao.com/texture): generate the texture with an image model, then post-process it into usable 16x16 / 32x32 pixel textures. The post-processing (background removal, pixel-grid detection, color-block sampling) is implemented in `scripts/mc_texture.py` — no login or external service required.

## Workflow

1. **Generate** — use an image model (e.g. the `imagegen` skill) with a prompt that produces a flat front view of the item/block with a visible pixel grid on a plain background. See [best-practices-prompts](references/best-practices-prompts.md).
2. **Post-process** — run the pipeline script:

```bash
python scripts/mc_texture.py pipeline texture.png -o out/ --sizes 16,32 --preview
```

This detects the grid, removes the background, samples the dominant color of every cell, and writes `out/texture-16x16.png` and `out/texture-32x32.png` (plus tiled previews with `--preview`).
3. **Verify** — inspect the tiled previews; rerun with a tuned `--tolerance` if background edges bleed or thin details disappear.

## References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Workflow | Full generate → post-process → verify flow and placing textures into a mod/resource pack | [core-workflow](references/core-workflow.md) |
| Script reference | Commands, options, tuning, troubleshooting | [core-script](references/core-script.md) |
| Prompt recipes | Prompts for generating item/block textures with a visible grid | [best-practices-prompts](references/best-practices-prompts.md) |
