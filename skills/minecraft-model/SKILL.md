---
name: minecraft-model
description: Create Minecraft 3D models (Java/Bedrock) — generate a vanilla-Minecraft design and three-view reference with an image model, then build, texture, and animate the model directly in Blockbench through the Blockbench MCP server. Use when the user asks to 做一个 Minecraft 模型 / 生成一格 XXX / 把设计图或三视图建成 Blockbench 模型 / 给模组或资源包添加模型, or any request where a 3D model should be created or edited in Blockbench. Assumes Blockbench MCP is installed and running; if the MCP tools are unavailable, remind the user to install and start Blockbench MCP first.
metadata:
  author: Hairy
  version: "2026.8.10"
  source: Workflow modeled on https://ai-kit.xingduansuzhao.com/model, tool patterns from the site's bundled blockbench skills
---

# Minecraft Model

> Workflow modeled on the ai-kit model tool (https://ai-kit.xingduansuzhao.com/model): design the model with an image model first (this yields both the structure scheme and the texture reference), then let the agent build it in Blockbench through the Blockbench MCP server.

## Prerequisite

**默认假设：用户已安装并启动 Blockbench MCP**（Blockbench 已打开、MCP 插件已加载、AI 工具已配置 MCP 服务）。

If the MCP tools are unavailable (e.g. `place_cube`, `add_group`, `list_outline` are missing from the tool list), stop and remind the user to install and start Blockbench MCP before continuing. Do not work around a missing MCP by hand-writing model files.

## Workflow

1. **Design** — two image-model calls in one session (e.g. the `imagine`/`imagegen` skill): first generate the vanilla-Minecraft design image, review it (AI by default; involve the user if they're unhappy), then ask for the three views in the same session using [core-design-prompts](references/core-design-prompts.md). The result provides both the cube structure and the texture map for modeling.
2. **Build** — drive Blockbench via MCP: create the project, build the bone hierarchy, place cubes, paint/apply the texture, and add animations. Follow [core-workflow](references/core-workflow.md) with the tool patterns in [features-modeling](references/features-modeling.md), [features-texturing](references/features-texturing.md), and [features-animation](references/features-animation.md).
3. **Verify** — capture screenshots with MCP (`capture_screenshot`), inspect the hierarchy with `list_outline`, and iterate until the model matches the design.

## References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Design prompts | Vanilla pre-prompt (EN/ZH), design prompt + review gate, three views in the same session | [core-design-prompts](references/core-design-prompts.md) |
| End-to-end workflow | Design → build → texture → animate → verify, with a worked snail example | [core-workflow](references/core-workflow.md) |
| Modeling tools | Project creation, groups/bones, cubes, meshes | [features-modeling](references/features-modeling.md) |
| Texturing & PBR | Textures, painting, UV mapping, PBR materials | [features-texturing](references/features-texturing.md) |
| Animation tools | Keyframes, rigging, timeline control | [features-animation](references/features-animation.md) |
