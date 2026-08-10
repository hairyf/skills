---
name: vision
description: Image recognition for agents without native vision support. Use when the user shares an image path or URL, the message contains saved image attachments, or the user asks to analyze, describe, or identify image content. Sends local images or remote URLs to an OpenAI-compatible vision model; --coords returns pixel element coordinates for UI/debug inspection.
metadata:
  author: Hairy
  version: "2026.8.11"
---

# Vision

The underlying model has no native image understanding. When an image arrives, **do not use the Read tool** — run `scripts/vision.js` to get a text description back.

Requires Node.js 18+ (native fetch) and network access to an OpenAI-compatible vision API.

## When to use

- User shares an image path (local file or remote URL)
- Message contains "Saved attachments:" listing image files
- User asks to analyze, describe, or identify image content

## Quick start

```bash
node scripts/vision.js "<image path>" "[question]"
node scripts/vision.js --url "<image url>" "[question]"
node scripts/vision.js "<image path>" "find the search button" --coords
node scripts/vision.js --base64 "<base64 or data:image/...;base64,... URL>" "[question]"
node scripts/vision.js --base64 - < shot.b64 "[question]" --coords center
node scripts/vision.js "<image path>" "[question]" --session ui    # multi-turn conversation
node scripts/vision.js "<image 2>" "compare with the previous image" --session ui
node scripts/vision.js --clear ui                                  # remove the session cache when done
```

Run `node scripts/vision.js --help` for the full flag list.

## Session continuity

Pass the same `--session <name>` to several calls to keep the conversation
history — previous images and replies are replayed alongside the current
question on every call. State is stored in `.vision/<name>.json` (cwd), or
`VISION_SESSION_DIR/<name>.json` when that env var is set. When the
conversation is finished, remove the cache with
`node scripts/vision.js --clear <name>`. See [core-usage](references/core-usage.md).

## Output contract

The reply is injected into the caller's context, so keep it compact:

- **Concise by default** — 1 subject line + compact bullets covering every key element. No fixed cap: dense images stay complete. Group similar elements (menus, lists, grids) into one bullet; include visible text verbatim; no greetings, filler, or disclaimers.
- **Debug mode** (`--coords [bbox|center]`, caller decides) appends a `## Coordinates` section — one JSON line per element: bbox `{"name","text","bbox":{"x","y","w","h"}}` by default, or center point `{"name","text","center":{"x","y"}}` with `--coords center`. Coordinates are **pixels in the ORIGINAL image**; views are resampled and remapped automatically.
- **Default is non-debug** — coordinates appear only when the caller passes `--coords`.

## Gotchas

- Never try to "see" an image directly — always use `scripts/vision.js`.
- `--base64` accepts raw base64 or a full data URL; use `--base64 -` (stdin) for
  large payloads that exceed the Windows command-line limit, e.g. screenshots.
- Keep replies dense: they enter the caller's context, so compactness is a hard contract, not a suggestion.
- Do not pass width/height or rescale coordinates — the script handles both automatically.
- The first `--coords` call downloads one dependency (`sharp`, one-time); non-debug calls are zero-dependency.
- `--detail [n]` and `--rounds N` are optional; defaults are compact and coarse-to-fine (2 rounds).

## References — load on demand

| When | Reference |
|------|-----------|
| Unsure of flags or output contract, or using `--coords` / `--detail` for the first time | [core-usage](references/core-usage.md) |
| First run with no API key configured | [core-setup](references/core-setup.md) |
| Debugging the pipeline or editing the scripts | [core-script](references/core-script.md) |
