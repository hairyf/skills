---
name: minecraft-texture-script
description: CLI reference for scripts/mc_texture.py — pipeline / remove-bg / detect-grid / quantize commands, options, exit codes, and troubleshooting.
---

# Script reference

Requires Python 3.10+ with Pillow (`pip install pillow`). Run from the skill directory:

```bash
python scripts/mc_texture.py <command> [options]
```

## Commands

### pipeline (recommended)

```bash
python scripts/mc_texture.py pipeline in.png -o out/ --sizes 16,32 --preview
```

| Option | Default | Meaning |
|--------|---------|---------|
| `-o, --output-dir <dir>` | required | output directory (created if missing) |
| `--sizes <n,n>` | `16,32` | output resolutions |
| `--preview` | off | also write tiled 4x4 preview PNGs |
| `--tolerance <n>` | `28` | background color distance (raise to remove more, lower to keep near-background colors) |
| `--grid-tolerance <n>` | `70` | grid-line color matching distance |

### remove-bg

```bash
python scripts/mc_texture.py remove-bg in.png -o nobg.png
```

Writes the sprite with the border-connected background and grid lines transparent; prints the estimated background color.

### detect-grid

```bash
python scripts/mc_texture.py detect-grid in.png
```

Prints JSON: `cols`, `rows`, `cell_w`, `cell_h`, `x_lines`, `y_lines`, `grid_color`. Exits `1` when no regular grid is found.

### quantize

```bash
python scripts/mc_texture.py quantize in.png -o tex.png --size 16
```

Samples one dominant color per cell. Uses the detected grid when it matches `--size`; otherwise uniform block sampling over the sprite bounding box. Works on raw images (white background is excluded) or pre-removed images (transparent background).

## Output

- `texture-<size>x<size>.png` — RGBA, one flat color per texture pixel; transparent for background cells.
- `texture-<size>x<size>-preview.png` — the texture tiled 4x4 and scaled for visual QA.

Exit code `0` on success, `1` on missing input, no grid (`detect-grid`), or invalid options.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| "no regular grid detected" | The generator drew no clean grid. Either regenerate with an explicit grid in the prompt, or accept block sampling (still yields usable textures). |
| Sprite edges partially removed | Lower `--tolerance` (background bleed) or raise `--grid-tolerance` (grid pixels eaten as background). |
| Dark/desaturated sprite pixels missing | They are only removed when lying exactly on detected line positions; if whole cells vanish, lower `--grid-tolerance`. |
| Near-white sprite colors become transparent | Lower `--tolerance`, or pre-remove the background so only truly transparent cells are dropped. |

<!--
Source references:
- https://ai-kit.xingduansuzhao.com/texture (tool flow replicated locally)
-->
