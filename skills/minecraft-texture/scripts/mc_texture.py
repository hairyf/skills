#!/usr/bin/env python3
"""
Minecraft texture post-processing pipeline.

Turns a generated Minecraft item/block texture image into usable 16x16 / 32x32
textures:

1. remove-bg   make the white background transparent
2. quantize    sample the dominant color of every block ("color blocks")

Commands:

    pipeline     full flow: remove background -> quantize -> output
    remove-bg    replace the background color with transparency
    quantize     sample dominant colors per block and write an NxN texture

Requires Pillow only (Python 3.10+).
"""

from __future__ import annotations

import argparse
import math
import os
import sys
from collections import Counter, deque

from PIL import Image


BG_TOL = 28           # color distance for "background-like" pixels
WHITE_BRIGHT = 220    # min mean brightness for a near-white pixel
WHITE_SPREAD = 30     # max channel spread for a near-white pixel
QUANT_BITS = 5        # bits per channel used for color-block grouping


def load_image(path: str) -> Image.Image:
    return Image.open(path).convert("RGBA")


def dist(a, b):
    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2)


def edge_background_color(img: Image.Image, inset: int = 4, patch: int = 10):
    """Most common color in the four corner patches; assumed to be the
    background (white for generated textures). Only trusted when it actually
    looks white-ish; otherwise falls back to white, because a sprite that fills
    the frame may occupy the corners."""
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
    mode = counts.most_common(1)[0][0]
    if (sum(mode) / 3) >= 200 and (max(mode) - min(mode)) <= 40:
        return mode
    return (255, 255, 255)


def is_bg_like(c, bg, tol: int = BG_TOL,
               white_bright: int = WHITE_BRIGHT,
               white_spread: int = WHITE_SPREAD) -> bool:
    """True when a pixel counts as background: close to the detected background
    color, or bright and desaturated ("white" regardless of exact shade)."""
    if dist(c[:3], bg) <= tol:
        return True
    return (sum(c[:3]) / 3) >= white_bright and (max(c[:3]) - min(c[:3])) <= white_spread


def remove_bg(img: Image.Image, tol: int = BG_TOL, mode: str = "replace",
              white_bright: int = WHITE_BRIGHT,
              white_spread: int = WHITE_SPREAD):
    """Return (out, bg_color).

    mode="replace" (default): every pixel within `tol` of the background color
    becomes transparent — the direct "white -> transparent" conversion.
    mode="flood": only border-connected background becomes transparent, so
    white pixels inside the sprite are preserved.
    """
    bg = edge_background_color(img)
    out = img.copy()
    px = img.load()
    opx = out.load()
    w, h = img.size

    if mode == "replace":
        for y in range(h):
            for x in range(w):
                r, g, b, a = px[x, y]
                if a >= 128 and is_bg_like((r, g, b), bg, tol,
                                           white_bright, white_spread):
                    opx[x, y] = (0, 0, 0, 0)
    elif mode == "flood":
        def is_bg(c):
            return (c[3] < 128
                    or is_bg_like(c, bg, tol, white_bright, white_spread))

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
        for y in range(h):
            for x in range(w):
                if mask[y * w + x]:
                    opx[x, y] = (0, 0, 0, 0)
    else:
        raise ValueError(f"unknown mode: {mode} (expected 'replace' or 'flood')")

    return out, bg


def dominant_color(img: Image.Image, box, bg_color, bg_tol: int,
                   white_bright: int = WHITE_BRIGHT,
                   white_spread: int = WHITE_SPREAD):
    """Most common quantized color inside a box, ignoring transparent and
    background-colored pixels. Returns RGBA or None (empty cell)."""
    crop = img.crop(box)
    px = crop.load()
    counts = Counter()
    sums = {}
    for y in range(crop.height):
        for x in range(crop.width):
            r, g, b, a = px[x, y]
            if a < 128:
                continue
            if bg_color is not None and is_bg_like((r, g, b), bg_color, bg_tol,
                                                   white_bright, white_spread):
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


def quantize(img: Image.Image, size: int, bg_color,
             tol: int = BG_TOL,
             white_bright: int = WHITE_BRIGHT,
             white_spread: int = WHITE_SPREAD) -> Image.Image:
    """Split the sprite's bounding box into `size` x `size` blocks and fill
    each output pixel with the block's dominant color. Empty blocks stay
    transparent."""
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    opx = out.load()
    bbox = img.getbbox()
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
                                 white_bright, white_spread)
            if col is not None:
                opx[c, r] = col
    return out


def cmd_check(args):
    img = load_image(args.input)
    px = img.load()
    w, h = img.size
    opaque = 0
    distinct = set()
    dots = []
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 128:
                continue
            opaque += 1
            distinct.add((r, g, b))
            if (sum((r, g, b)) / 3) >= args.white_cutoff \
                    and (max(r, g, b) - min(r, g, b)) <= args.white_spread:
                dots.append((x, y, (r, g, b)))
    print(f"size: {w}x{h}")
    print(f"opaque: {opaque}/{w * h}  transparent: {w * h - opaque}")
    print(f"distinct colors: {len(distinct)}")
    if dots:
        print(f"near-white opaque pixels: {len(dots)}")
        for d in dots[:20]:
            print(f"  pos {d[0], d[1]} color {d[2]}")
        print("FAIL: near-white dots found")
        sys.exit(1)
    print("OK: no near-white dots")


def cmd_remove_bg(args):
    img = load_image(args.input)
    out, bg = remove_bg(img, args.tolerance, args.mode,
                        args.white_cutoff, args.white_spread)
    out.save(args.output)
    print(f"saved {args.output}")
    print(f"background color: {bg} (mode: {args.mode}, "
          f"white cutoff: {args.white_cutoff})")


def cmd_quantize(args):
    img = load_image(args.input)
    bg_color = edge_background_color(img)
    out = quantize(img, args.size, bg_color, args.tolerance,
                   args.white_cutoff, args.white_spread)
    out.save(args.output)
    print(f"saved {args.output} ({args.size}x{args.size})")


def cmd_pipeline(args):
    img = load_image(args.input)
    nobg, bg = remove_bg(img, args.tolerance, args.mode,
                         args.white_cutoff, args.white_spread)
    os.makedirs(args.output_dir, exist_ok=True)
    base = os.path.splitext(os.path.basename(args.input))[0]
    for size in args.sizes:
        tex = quantize(nobg, size, bg, args.tolerance,
                       args.white_cutoff, args.white_spread)
        tex_path = os.path.join(args.output_dir, f"{base}-{size}x{size}.png")
        tex.save(tex_path)
        print(f"saved {tex_path}")


def main(argv=None):
    parser = argparse.ArgumentParser(
        prog="mc_texture.py",
        description="Minecraft texture post-processing: replace the white "
                    "background with transparency, sample color blocks, and "
                    "output NxN textures.")
    sub = parser.add_subparsers(dest="command", required=True)

    p_chk = sub.add_parser("check", help="verify a texture: report size, transparency, and near-white dots")
    p_chk.add_argument("input")
    p_chk.add_argument("--white-cutoff", type=int, default=WHITE_BRIGHT)
    p_chk.add_argument("--white-spread", type=int, default=WHITE_SPREAD)
    p_chk.set_defaults(func=cmd_check)

    p_rm = sub.add_parser("remove-bg", help="make the background transparent")
    p_rm.add_argument("input")
    p_rm.add_argument("-o", "--output", required=True)
    p_rm.add_argument("--tolerance", type=int, default=BG_TOL)
    p_rm.add_argument("--mode", choices=["replace", "flood"], default="replace",
                      help="replace: all bg-colored pixels (default); "
                           "flood: only border-connected background")
    p_rm.add_argument("--white-cutoff", type=int, default=WHITE_BRIGHT,
                      help="min mean brightness for near-white background")
    p_rm.add_argument("--white-spread", type=int, default=WHITE_SPREAD,
                      help="max channel spread for near-white background")
    p_rm.set_defaults(func=cmd_remove_bg)

    p_q = sub.add_parser("quantize", help="sample dominant colors per block, output an NxN texture")
    p_q.add_argument("input")
    p_q.add_argument("-o", "--output", required=True)
    p_q.add_argument("--size", type=int, required=True, help="output resolution, e.g. 16 or 32")
    p_q.add_argument("--tolerance", type=int, default=BG_TOL)
    p_q.add_argument("--white-cutoff", type=int, default=WHITE_BRIGHT)
    p_q.add_argument("--white-spread", type=int, default=WHITE_SPREAD)
    p_q.set_defaults(func=cmd_quantize)

    p_pipe = sub.add_parser("pipeline", help="full flow: remove background -> quantize")
    p_pipe.add_argument("input")
    p_pipe.add_argument("-o", "--output-dir", required=True)
    p_pipe.add_argument("--sizes", type=lambda s: [int(x) for x in s.split(",")],
                        default=[16, 32], help="comma-separated output sizes (default 16,32)")
    p_pipe.add_argument("--tolerance", type=int, default=BG_TOL)
    p_pipe.add_argument("--mode", choices=["replace", "flood"], default="replace")
    p_pipe.add_argument("--white-cutoff", type=int, default=WHITE_BRIGHT)
    p_pipe.add_argument("--white-spread", type=int, default=WHITE_SPREAD)
    p_pipe.set_defaults(func=cmd_pipeline)

    args = parser.parse_args(argv)
    args.func(args)


if __name__ == "__main__":
    main()
