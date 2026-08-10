---
name: core-setup
description: First-time setup — choosing a vision service, obtaining an API key, configuring .env, and integrating into a project.
---

# Setup

Follow these steps when the skill is not yet configured (no API key detected).

## 1. Choose a vision service

Ask the user which service to use:

- **DashScope (recommended)** — `qwen3.5-omni-plus` / `qwen-vl-max`. New users get 1M free tokens (~¥0.02 per call).
- **OpenAI** — `gpt-4o-mini`, or any other OpenAI-compatible vision model.

## 2. Obtain an API key

Ask the user for their API key; if they don't have one, guide them to register on the provider's platform. For non-DashScope services, also ask for the **API Base URL**.

## 3. Configure .env

Write the key to `scripts/.env` (next to vision.js):

```bash
DASHSCOPE_API_KEY=sk-xxx
# Optional overrides
# VISION_MODEL=qwen-vl-max
# DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

## 4. Merge AGENTS.md into the project (required)

To make the project agent use vision.js automatically, **merge the content of `AGENTS.md` (in this skill directory) into the host project's `AGENTS.md` / `CLAUDE.md`**. Do not skip this step.

1. Read the skill's `AGENTS.md` (the "Vision Capability" section).
2. If the project has an `AGENTS.md` / `CLAUDE.md`, check whether the vision section is already present — if so, skip the merge (idempotent).
3. Otherwise, append the section to the existing file, or create a new `AGENTS.md` / `CLAUDE.md` at the project root.
4. Tell the user the configuration is done — from now on they can just send images and the agent will recognize them automatically.

## 5. Verify

Run the script against a sample image to confirm the API key and base URL work before reporting success:

```bash
node scripts/vision.js "path/to/sample.png" "Describe this image"
```

## Key points

- Requires Node.js 18+ (native `fetch`) and network access to the vision API.
- DashScope's free tier makes it the default recommendation; any OpenAI-compatible vision API works.
- The model key is not tied to a specific vendor — the script speaks the OpenAI-compatible format.
- The AGENTS.md merge is what enables automatic image recognition in the host project — the `.env` config alone is not enough.
