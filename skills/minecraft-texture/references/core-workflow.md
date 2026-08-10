---
name: minecraft-texture-workflow
description: End-to-end Minecraft texture workflow — generate art with an image model, replace the white background with transparency, sample color blocks, output 16x16/32x32 PNGs, and place them into a mod or resource pack.
---

# Workflow

## 1. Generate the artwork

Produce a flat, front-facing image of the item/block with:

- a plain white background (the pipeline turns white into transparency);
- the subject filling the whole frame edge-to-edge (no big margins, no floating on a canvas);
- flat per-cell colors (no gradients or heavy shading), so block sampling is clean;
- **no grid lines** — the pipeline does not rely on a grid.

Use [best-practices-prompts](best-practices-prompts.md) for prompt recipes. Prefer 1024px+ square images.

## 2. Post-process with the pipeline

```bash
python scripts/mc_texture.py pipeline texture.png -o out/ --sizes 16,32 --preview
```

The pipeline:

1. replaces every white background pixel with transparency (`--mode replace`, the default);
2. crops to the sprite's bounding box so the content fills the frame;
3. splits the sprite into `size` x `size` blocks and fills each output pixel with the block's dominant color;
4. writes `out/<name>-<size>x<size>.png` for each requested size, plus tiled `-preview.png` images.

## 3. Verify

- Open the tiled previews (they have a transparent background): the sprite should touch the frame edges, every texture pixel must read as one flat color, and no white or gray lines may remain.
- Run the programmatic check (no vision model needed):

```bash
python scripts/mc_texture.py check out/raw-32x32.png
```

It reports near-white dots (with positions) and exits non-zero if any are found.
- A fully transparent cell is expected at the corners of a round sprite; a partially eaten sprite means `--tolerance` is too high (default 28).
- If white pixels inside the sprite are being removed (e.g. white cream filling), rerun with `--mode flood` so only border-connected background becomes transparent.
- If the subject floats with big margins, regenerate with a "fill the frame" prompt rather than cropping later.

## 4. Place the texture

- **Resource pack**: `assets/minecraft/textures/item/<name>.png` (items) or `assets/minecraft/textures/block/<name>.png` (blocks), keeping the `16x16` file at native resolution.
- **Mod**: `assets/<modid>/textures/item/<name>.png` or `.../textures/block/<name>.png`; register the item/block and reference the texture by path. See the `fabric` skill for registration details.

<!--
Source references:
- https://ai-kit.xingduansuzhao.com/texture (workflow modeled on the site's tool flow)
-->
