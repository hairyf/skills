---
name: core-usage
description: How to invoke vision.js — CLI arguments, local files, remote URLs, and prompts.
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

## Arguments

| Argument | Description |
|----------|-------------|
| `<image>` | Path to a local image file, or a URL when used with `--url` |
| `--url` | Treat the first argument as a remote URL instead of a file path |
| `[question]` | Optional prompt; defaults to a generic "describe the image" request |

Supported local formats: jpg, jpeg, png, gif, webp, bmp.

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | Success, description printed to stdout |
| `1` | Missing API key, missing image argument, or API failure (error printed to stderr) |
