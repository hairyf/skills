---
name: vision
description: Image recognition for agents without native vision support. Use when the user shares an image path or URL, the message contains saved image attachments, or the user asks to analyze, describe, or identify image content. Provides a zero-dependency Node.js script that sends local images or remote URLs to an OpenAI-compatible vision model and returns a text description.
metadata:
  author: Hairy
  version: "2026.8.6"
---

# Vision

The underlying model has no native image understanding. When an image arrives, **do not use the Read tool** — use `scripts/vision.js` to send the image to a vision model and get a text description back.

## Quick start

```bash
node scripts/vision.js "<image path>" "[question]"
node scripts/vision.js --url "<image url>" "[question]"
```

## When to use

- User shares an image path (local file or remote URL)
- Message contains "Saved attachments:" listing image files
- User asks to analyze, describe, or identify image content

## Setup

Requires an API key for an OpenAI-compatible vision service (DashScope/Qwen recommended). On first run, follow the setup steps in [core-setup](references/core-setup.md) — including the required AGENTS.md merge. Once configured, the user simply sends images and the agent recognizes them automatically.

## References

### Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Usage | CLI arguments, local files vs remote URLs, prompts, exit codes | [core-usage](references/core-usage.md) |
| Setup | Service selection, API keys, `.env` configuration, required AGENTS.md merge, verification | [core-setup](references/core-setup.md) |
| How it works | Internals of vision.js for patching and debugging | [core-script](references/core-script.md) |
