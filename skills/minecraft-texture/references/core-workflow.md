---
name: minecraft-texture-workflow
description: End-to-end Minecraft texture workflow — generate art with an image model, remove the background, detect the pixel grid, sample color blocks, output 16x16/32x32 PNGs, and place them into a mod or resource pack.
---

# Workflow

## 1. Generate the artwork

Produce a flat, front-facing image of the item/block with:

- a plain, uniform background (white works best);
- a visible, regular pixel grid drawn over the sprite (the script uses it to align cells);
- flat per-cell colors (no gradients or heavy shading), so quantization is clean.

Use [best-practices-prompts](best-practices-prompts.md) for prompt recipes. Prefer 512px+ images so each cell has enough pixels to sample.

## 2. Post-process with the pipeline

```bash
python scripts/mc_texture.py pipeline texture.png -o out/ --sizes 16,32 --preview
```

The pipeline:

1. detects the pixel grid (prints `grid detected: NxN`; falls back to uniform block sampling when no regular grid exists);
2. removes the border-connected background and all grid lines;
3. samples the dominant color of every cell ("color blocks");
4. writes `out/<name>-<size>x<size>.png` for each requested size, plus tiled `-preview.png` images.

When the detected grid resolution equals a requested size (e.g. a 16x16 grid and `--sizes 16`), cells are sampled directly from the grid. Other sizes use uniform block sampling over the sprite.

## 3. Verify

- Open the tiled previews: each texture pixel must read as one flat color and the item silhouette must be correct.
- A fully transparent cell is expected for background cells; a partially eaten sprite means `--tolerance` is too high (default 28).
- If the grid was not detected, provide `--grid N` to the script only when the generator actually drew an NxN grid, or accept the block-sampling fallback.

## 4. Place the texture

- **Resource pack**: `assets/minecraft/textures/item/<name>.png` (items) or `assets/minecraft/textures/block/<name>.png` (blocks), keeping the `16x16` file at native resolution.
- **Mod**: `assets/<modid>/textures/item/<name>.png` or `.../textures/block/<name>.png`; register the item/block and reference the texture by path. See the `fabric` skill for registration details.

<!--
Source references:
- https://ai-kit.xingduansuzhao.com/texture (workflow modeled on the site's tool flow)
-->
