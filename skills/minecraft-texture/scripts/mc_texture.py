#!/usr/bin/env python3
"""
Minecraft texture post-processing pipeline.

Turns a generated Minecraft item/block texture image into usable 16x16 / 32x32
textures by:

1. remove-bg     making the border-connected background transparent
2. detect-grid   locating the pixel grid the generator drew over the image
3. quantize      sampling the dominant color of every cell ("color blocks")

Commands:

    pipeline     full flow: detect grid -> remove background -> quantize -> output
    remove-bg    make the border-connected background transparent
    detect-grid  detect the pixel grid and print cell counts / positions
    quantize     sample dominant colors per cell and write an NxN texture

Requires Pillow only (Python 3.10+).
"""

from __future__ import annotations

import argparse
import json
import math
import os
import sys
from collections import Counter, deque
from typing import Optional

from PIL import Image


BG_TOL = 28          # color distance for "background-like" flood fill
GRID_TOL = 70        # color distance to a detected grid-line color
GRID_DARK = 25       # how much darker than the median a grid line must be
QUANT_BITS = 5       # bits per channel used for color-block grouping


def load_image(path: str) -> Image.Image:
    return Image.open(path).convert("RGBA")


def dist(a, b):
    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2)


def is_grid_pixel(x: int, y: int, color, grid, tol: int = GRID_TOL) -> bool:
    """True when a pixel lies on a detected grid line (thin band around a line
    position) and matches the line color. Pixels off the line positions are
    sprite content even when their color is dark/desaturated."""
    if not grid:
        return False
    hw_x = max(1.5, grid["cell_w"] * 0.06)
    hw_y = max(1.5, grid["cell_h"] * 0.06)
    on_line = (any(abs(x - lx) <= hw_x for lx in grid["x_lines"])
               or any(abs(y - ly) <= hw_y for ly in grid["y_lines"]))
    if not on_line:
        return False
    return dist(color, tuple(grid["grid_color"])) <= tol


def edge_background_color(img: Image.Image, inset: int = 4, patch: int = 10):
    """Most common color in the four corner patches; assumed to be the
    background. Skips the outer few pixels so border grid lines don't win."""
    w, h = img.size
    px = img.load()
    counts = Counter()
    regions = [
        (inset, inset, inset + patch, inset + patch),
        (w - inset - patch, inset, w - inset, inset + patch),
        (inset, h - inset - patch, inset + patch, h - inset),
        (w - inset - patch, h - inset - patch, w - inset, h - inset),
    ]
    for x0, y0, x1, y1 in regions:
        for x in range(max(0, x0), min(w, x1)):
            for y in range(max(0, y0), min(h, y1)):
                counts[px[x, y][:3]] += 1
    return counts.most_common(1)[0][0]


def remove_bg(img: Image.Image, tol: int = BG_TOL, grid=None,
              grid_tol: int = GRID_TOL):
    """Return (out, bg_color).

    Flood-fills border-connected background-colored pixels (grid lines act as
    barriers so interior cells are never eaten), then makes every grid-line
    pixel transparent. The estimated background color is returned so later
    stages can keep excluding background-colored cells.
    """
    w, h = img.size
    px = img.load()
    bg = edge_background_color(img)

    def is_bg(c):
        if c[3] < 128:
            return True
        return dist(c, bg) <= tol

    mask = bytearray(w * h)
    queue = deque()
    for x in range(w):
        for y in (0, h - 1):
            if not mask[y * w + x] and is_bg(px[x, y]):
                mask[y * w + x] = 1
                queue.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if not mask[y * w + x] and is_bg(px[x, y]):
                mask[y * w + x] = 1
                queue.append((x, y))
    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not mask[ny * w + nx]:
                if is_bg(px[nx, ny]):
                    mask[ny * w + nx] = 1
                    queue.append((nx, ny))

    out = img.copy()
    opx = out.load()
    for y in range(h):
        for x in range(w):
            if (mask[y * w + x]
                    or (grid and is_grid_pixel(x, y, px[x, y][:3], grid,
                                               grid_tol))):
                opx[x, y] = (0, 0, 0, 0)
    return out, bg


def detect_grid(img: Image.Image):
    """Return dict with grid info, or None when no regular grid is found.

    Looks for thin, mostly-continuous dark lines spanning the image in both
    axes, then keeps only lines consistent with the median spacing.
    """
    gray = img.convert("L")
    w, h = gray.size
    g = gray.load()
    values = [g[x, y] for y in range(h) for x in range(w)]
    median = sorted(values)[len(values) // 2]
    thresh = median - GRID_DARK

    def lines_axis(length, other, gray_at, color_at):
        def merge(bands):
            merged = []
            for i in bands:
                if merged and i - merged[-1][-1] <= 3:
                    merged[-1].append(i)
                else:
                    merged.append([i])
            return merged

        def dark_rows():
            return [i for i in range(length)
                    if sum(1 for j in range(other) if gray_at(i, j) < thresh)
                    >= 0.6 * other]

        # Pass 1: thin dark bands give the grid-line color.
        thin = [b for b in merge(dark_rows()) if len(b) <= 6]
        if len(thin) < 2:
            return None, None
        counter = Counter()
        for b in thin:
            i = b[len(b) // 2]
            for j in range(other):
                counter[color_at(i, j)] += 1
        line_color = counter.most_common(1)[0][0]

        # Pass 2: every line row is a row where most pixels match that color
        # (this also finds lines that border dark sprite content).
        def match_rows():
            rows = []
            for i in range(length):
                n = sum(1 for j in range(other)
                        if dist(color_at(i, j), line_color) <= 14)
                if n >= 0.6 * other:
                    rows.append(i)
            return rows

        bands = [b for b in merge(match_rows()) if len(b) <= 6]
        centers = [sum(b) / len(b) for b in bands]
        if len(centers) < 3:
            return None, None
        spacings = [b - a for a, b in zip(centers, centers[1:])]
        cell = sorted(spacings)[len(spacings) // 2]
        if cell < 4:
            return None, None
        kept = [centers[0]]
        for c in centers[1:]:
            if abs(c - kept[-1] - cell) <= max(3, 0.35 * cell):
                kept.append(c)
        if len(kept) < 3:
            return None, None
        return kept, line_color

    # Precompute pixel colors for grid-line color sampling.
    px = img.load()

    x_lines, x_color = lines_axis(
        w, h,
        lambda x, y: g[x, y],
        lambda x, y: px[x, y][:3],
    )
    y_lines, y_color = lines_axis(
        h, w,
        lambda y, x: g[x, y],
        lambda y, x: px[x, y][:3],
    )
    if x_lines is None or y_lines is None:
        return None

    cols = len(x_lines) - 1
    rows = len(y_lines) - 1
    grid_color = x_color or y_color or (0, 0, 0)
    return {
        "cols": cols,
        "rows": rows,
        "cell_w": round((x_lines[-1] - x_lines[0]) / (len(x_lines) - 1), 3),
        "cell_h": round((y_lines[-1] - y_lines[0]) / (len(y_lines) - 1), 3),
        "x_lines": [round(x, 2) for x in x_lines],
        "y_lines": [round(y, 2) for y in y_lines],
        "grid_color": list(grid_color),
    }


def alpha_bbox(img: Image.Image):
    """Bounding box of opaque pixels, or None when the image is empty."""
    bbox = img.getbbox()
    if bbox is None:
        return None
    return bbox


def dominant_color(img: Image.Image, box, bg_color, bg_tol: int,
                   grid=None, grid_tol: int = GRID_TOL):
    """Most common quantized color inside a box, ignoring transparent pixels,
    background-colored pixels and grid lines. Returns RGBA or None."""
    crop = img.crop(box)
    px = crop.load()
    ox, oy = box[0], box[1]
    counts = Counter()
    sums = {}
    for y in range(crop.height):
        for x in range(crop.width):
            r, g, b, a = px[x, y]
            if a < 128:
                continue
            if bg_color is not None and dist((r, g, b), bg_color) <= bg_tol:
                continue
            if grid and is_grid_pixel(ox + x, oy + y, (r, g, b), grid, grid_tol):
                continue
            key = (r >> (8 - QUANT_BITS), g >> (8 - QUANT_BITS), b >> (8 - QUANT_BITS))
            counts[key] += 1
            s = sums.setdefault(key, [0, 0, 0, 0])
            s[0] += r
            s[1] += g
            s[2] += b
            s[3] += 1
    if not counts:
        return None
    top = counts.most_common(1)[0][0]
    s = sums[top]
    n = s[3]
    return (round(s[0] / n), round(s[1] / n), round(s[2] / n), 255)


def cell_bounds(lines, cell, limit):
    """Cell boundaries = the grid line positions themselves (grid lines mark
    cell edges). Clamped to the image."""
    return [max(0, min(limit, line)) for line in lines]


def quantize(img: Image.Image, size: int, grid=None, bg_color=None,
             tol: int = BG_TOL, grid_tol: int = GRID_TOL) -> Image.Image:
    """Sample the dominant color of every cell and build an NxN texture.

    When a detected grid is square and its resolution matches `size`, cells are
    taken directly from the detected lines (grid lines excluded). Otherwise the
    sprite's bounding box is split into `size` x `size` uniform blocks.
    """
    w, h = img.size
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    opx = out.load()

    if grid and grid["cols"] == grid["rows"] == size:
        xb = cell_bounds(grid["x_lines"], grid["cell_w"], w)
        yb = cell_bounds(grid["y_lines"], grid["cell_h"], h)
        for r in range(size):
            for c in range(size):
                box = (int(round(xb[c])), int(round(yb[r])),
                       int(round(xb[c + 1])), int(round(yb[r + 1])))
                col = dominant_color(img, box, bg_color, tol, grid, grid_tol)
                if col is not None:
                    opx[c, r] = col
        return out

    bbox = alpha_bbox(img)
    if bbox is None:
        return out
    x0, y0, x1, y1 = bbox
    bw, bh = x1 - x0, y1 - y0
    for r in range(size):
        for c in range(size):
            bx0 = x0 + bw * c // size
            bx1 = max(bx0 + 1, x0 + bw * (c + 1) // size)
            by0 = y0 + bh * r // size
            by1 = max(by0 + 1, y0 + bh * (r + 1) // size)
            col = dominant_color(img, (bx0, by0, bx1, by1), bg_color, tol,
                                 grid, grid_tol)
            if col is not None:
                opx[c, r] = col
    return out


def has_transparency(img: Image.Image) -> bool:
    alpha = img.getchannel("A")
    return alpha.getextrema()[0] < 255


def preview(texture: Image.Image, scale: int = 8, tiles: int = 4) -> Image.Image:
    """Tile the texture 4x4 and scale it up for visual QA."""
    n = texture.size[0]
    big = texture.resize((n * scale, n * scale), Image.Resampling.NEAREST)
    canvas = Image.new("RGBA", (n * scale * tiles, n * scale * tiles), (0, 0, 0, 0))
    for ty in range(tiles):
        for tx in range(tiles):
            canvas.paste(big, (tx * n * scale, ty * n * scale))
    return canvas


def cmd_remove_bg(args):
    img = load_image(args.input)
    grid = detect_grid(img)
    out, bg = remove_bg(img, args.tolerance, grid, args.grid_tolerance)
    out.save(args.output)
    print(f"saved {args.output}")
    print(f"background color: {bg}")
    if grid:
        print(f"grid: {grid['cols']}x{grid['rows']}, cell {grid['cell_w']}x{grid['cell_h']}px")


def cmd_detect_grid(args):
    img = load_image(args.input)
    grid = detect_grid(img)
    if grid is None:
        print(json.dumps({"grid": None}))
        sys.exit(1)
    print(json.dumps(grid))


def cmd_quantize(args):
    img = load_image(args.input)
    grid = detect_grid(img)
    bg_color = edge_background_color(img) if not has_transparency(img) else None
    out = quantize(img, args.size, grid, bg_color,
                   args.tolerance, args.grid_tolerance)
    out.save(args.output)
    if grid:
        print(f"detected grid: {grid['cols']}x{grid['rows']} "
              f"(cell {grid['cell_w']}x{grid['cell_h']}px)")
    print(f"saved {args.output} ({args.size}x{args.size})")


def cmd_pipeline(args):
    img = load_image(args.input)
    grid = detect_grid(img)
    if grid:
        print(f"grid detected: {grid['cols']}x{grid['rows']}, "
              f"cell {grid['cell_w']}x{grid['cell_h']}px, "
              f"line color {tuple(grid['grid_color'])}")
    else:
        print("no regular grid detected; using uniform block sampling")
    nobg, bg = remove_bg(img, args.tolerance, grid, args.grid_tolerance)
    os.makedirs(args.output_dir, exist_ok=True)
    base = os.path.splitext(os.path.basename(args.input))[0]
    for size in args.sizes:
        tex = quantize(nobg, size, grid, bg, args.tolerance, args.grid_tolerance)
        tex_path = os.path.join(args.output_dir, f"{base}-{size}x{size}.png")
        tex.save(tex_path)
        print(f"saved {tex_path}")
        if args.preview:
            pv = preview(tex)
            pv_path = os.path.join(args.output_dir, f"{base}-{size}x{size}-preview.png")
            pv.save(pv_path)
            print(f"saved {pv_path}")


def main(argv=None):
    parser = argparse.ArgumentParser(
        prog="mc_texture.py",
        description="Minecraft texture post-processing: remove background, "
                    "detect the pixel grid, sample color blocks, output NxN textures.")
    sub = parser.add_subparsers(dest="command", required=True)

    p_rm = sub.add_parser("remove-bg", help="make the border-connected background transparent")
    p_rm.add_argument("input")
    p_rm.add_argument("-o", "--output", required=True)
    p_rm.add_argument("--tolerance", type=int, default=BG_TOL)
    p_rm.add_argument("--grid-tolerance", type=int, default=GRID_TOL)
    p_rm.set_defaults(func=cmd_remove_bg)

    p_dg = sub.add_parser("detect-grid", help="detect the pixel grid and print info as JSON")
    p_dg.add_argument("input")
    p_dg.set_defaults(func=cmd_detect_grid)

    p_q = sub.add_parser("quantize", help="sample dominant colors per cell, output an NxN texture")
    p_q.add_argument("input")
    p_q.add_argument("-o", "--output", required=True)
    p_q.add_argument("--size", type=int, required=True, help="output resolution, e.g. 16 or 32")
    p_q.add_argument("--tolerance", type=int, default=BG_TOL)
    p_q.add_argument("--grid-tolerance", type=int, default=GRID_TOL)
    p_q.set_defaults(func=cmd_quantize)

    p_pipe = sub.add_parser("pipeline", help="full flow: grid detect -> remove background -> quantize")
    p_pipe.add_argument("input")
    p_pipe.add_argument("-o", "--output-dir", required=True)
    p_pipe.add_argument("--sizes", type=lambda s: [int(x) for x in s.split(",")],
                        default=[16, 32], help="comma-separated output sizes (default 16,32)")
    p_pipe.add_argument("--preview", action="store_true",
                        help="also write tiled preview images for visual QA")
    p_pipe.add_argument("--tolerance", type=int, default=BG_TOL)
    p_pipe.add_argument("--grid-tolerance", type=int, default=GRID_TOL)
    p_pipe.set_defaults(func=cmd_pipeline)

    args = parser.parse_args(argv)
    args.func(args)


if __name__ == "__main__":
    main()
