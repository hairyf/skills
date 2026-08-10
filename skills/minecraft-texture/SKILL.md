---
name: minecraft-texture
description: Generate Minecraft item/block textures (16x16 / 32x32 PNG) from AI-generated art. Use when the user asks to create, convert, or post-process Minecraft textures — e.g. "生成一个原味鸡的 MC 材质" or "把这张图做成 16x16 的 Minecraft 材质" — including white-background removal and per-block color sampling. Pairs with the `imagegen` skill for generation and the `minecraft-modding` skill for using textures in mods.
metadata:
  author: Hairy
  version: "2026.8.10"
  source: Workflow modeled on https://ai-kit.xingduansuzhao.com/texture; post-processing implemented locally
---

# Minecraft Texture

> Workflow modeled on the ai-kit texture tool (https://ai-kit.xingduansuzhao.com/texture): generate the texture with an image model, then post-process it into usable 16x16 / 32x32 pixel textures. The post-processing (white-background removal + color-block sampling) is implemented in `scripts/mc_texture.py` — no login or external service required.

## Workflow

1. **Generate** — use an image model (e.g. the `imagegen` skill) with a prompt that produces a flat front view of the item/block that fills the whole frame on a plain white background. Do NOT ask for grid lines — the pipeline converts white to transparency and samples color blocks directly. See [best-practices-prompts](references/best-practices-prompts.md).
2. **Post-process** — run the pipeline script:

```bash
python scripts/mc_texture.py pipeline texture.png -o out/ --sizes 16,32
```

This replaces the white background with transparency, samples the dominant color of every block, and writes `out/texture-16x16.png` and `out/texture-32x32.png`.
3. **Verify** — run `python scripts/mc_texture.py check out/texture-32x32.png` for a programmatic check (near-white dots, transparency ratio; no vision model needed). Rerun with a tuned `--tolerance` / `--white-cutoff` if background edges bleed or thin details disappear.

## References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Workflow | Full generate → post-process → verify flow and placing textures into a mod/resource pack | [core-workflow](references/core-workflow.md) |
| Script reference | Commands, options, tuning, troubleshooting | [core-script](references/core-script.md) |
| Prompt recipes | Prompts for generating item/block textures that fill the frame on white | [best-practices-prompts](references/best-practices-prompts.md) |
