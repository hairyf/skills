---
name: minecraft-texture-script
description: CLI reference for scripts/mc_texture.py — pipeline / remove-bg / quantize commands, options, exit codes, and troubleshooting.
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
| `--tolerance <n>` | `28` | background color distance (raise to remove more white, lower to keep near-white colors) |
| `--mode <m>` | `replace` | `replace`: all background-colored pixels become transparent; `flood`: only border-connected background |
| `--white-cutoff <n>` | `220` | pixels with mean brightness >= this are treated as white background (lower = remove more light pixels) |
| `--white-spread <n>` | `30` | max channel spread for a near-white pixel (raise = accept more colored pixels as white) |

### remove-bg

```bash
python scripts/mc_texture.py remove-bg in.png -o nobg.png [--mode replace|flood]
```

Writes the sprite with the background transparent; prints the detected background color.

### quantize

```bash
python scripts/mc_texture.py quantize in.png -o tex.png --size 16
```

Samples one dominant color per block over the sprite's bounding box. Works on pre-removed images (transparent background) or raw images (white background is excluded).

### check

```bash
python scripts/mc_texture.py check tex.png
```

Programmatic QA: prints size, opaque/transparent counts, distinct colors, and the positions/colors of any near-white opaque pixels. Exits `1` when near-white dots are found — use it instead of a vision model to verify textures.

## Output

- `texture-<size>x<size>.png` — RGBA, one flat color per texture pixel; transparent for background cells.
- `texture-<size>x<size>-preview.png` — the texture tiled 4x4 and scaled for visual QA.

Exit code `0` on success, `1` on missing input or invalid options.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| White pixels inside the sprite vanish (e.g. white cream filling) | Use `--mode flood` so only border-connected background is removed. |
| Background not fully removed | Raise `--tolerance` (e.g. `--tolerance 40`) or check the image background is actually white. |
| Near-white sprite colors become transparent | Lower `--tolerance`. |
| Light cream/beige dots remain in 32x32 (bright but not within `--tolerance`) | They are now removed by default (`--white-cutoff 220`); lower `--white-cutoff` if still visible. |
| Subject floats with large margins | Regenerate with a "fill the frame" prompt; the pipeline crops to the sprite bounding box, but detail is lost if the margins are huge. |
| Output looks blurry / muddy | The source has gradients; regenerate with "flat unshaded colors" so each block has one clean dominant color. |

<!--
Source references:
- https://ai-kit.xingduansuzhao.com/texture (tool flow replicated locally)
-->
