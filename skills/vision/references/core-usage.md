---
name: core-usage
description: How to invoke vision.js — CLI arguments, local files, remote URLs, output modes, and the coordinate contract.
---

# Usage

Run the script with Node.js. It reads the image, sends it to a vision model, and prints the text description to stdout.

## Local image

```bash
node vision.js "path/to/image.png" "Describe this image"
```

## Remote URL

```bash
node vision.js --url "https://example.com/image.png" "Describe this image"
```

## Output contract

- Default: concise — 1 subject line + compact bullets covering every key element (no fixed cap; group similar elements), visible text verbatim, no filler.
- Debug-related prompts automatically add a `## Coordinates` section: one JSON line per element, `{"name","text","bbox":{"x","y","w","h"}}` with percentages (0–100, origin top-left).
- Auto-detection is a heuristic; override with `--coords` / `--no-coords` when the caller knows better.

## Arguments

| Argument | Description |
|----------|-------------|
| `<image>` | Path to a local image file, or a URL when used with `--url` |
| `--url` | Treat the first argument as a remote URL instead of a file path |
| `[question]` | Optional prompt; defaults to a concise "describe the image" request |
| `--coords` | Force the `## Coordinates` section even when no debug intent is detected |
| `--no-coords` | Suppress coordinates even when debug intent is detected |
| `--brief` | (default) Compact output |
| `--detail` | Allow fuller detail (also raises the token cap to 1600) |
| `--max-tokens <n>` | Cap the output size (default 1000) |

Supported local formats: jpg, jpeg, png, gif, webp, bmp.

## Examples

```bash
# Concise recognition (default)
node vision.js "shot.png" "Describe this image"

# UI debugging — coordinates are auto-added for "find the button"
node vision.js "ui.png" "find the login button and its position"

# Force coordinates for any element
node vision.js "ui.png" "describe the layout" --coords

# Detailed analysis with a bigger budget
node vision.js "chart.png" "extract all labels and values" --detail
```

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | Success, description printed to stdout |
| `1` | Missing API key, missing image argument, or API failure (error printed to stderr) |
