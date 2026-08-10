---
name: minecraft-model-workflow
description: End-to-end Minecraft model workflow — design the model and three-view reference with an image model, then build, texture, animate, and verify it in Blockbench through the Blockbench MCP server.
---

# Workflow

## 1. Design (two image-model calls in one session)

Follow [core-design-prompts](core-design-prompts.md):

1. **Design image** — send the vanilla pre-prompt, then describe the model (one-block footprint, cube-only parts, simple structure, functional constraints, `1:1` aspect) and generate the design.
2. **Review** — check the design against the requirements (AI by default; involve the user if the AI's judgment isn't trusted or the user is unhappy). Iterate the design prompt with feedback before continuing.
3. **Three views** — ask for the three views in the **same session** so the model keeps the design:

```bash
node scripts/imagine.js "生成一格Minecraft蜗牛，蜗牛壳是一个立方体，不要堆叠。蜗牛身体结构简单，有触角。蜗牛足够将整个身体缩回到蜗牛壳内部。请绘制 将宽高比设为 1:1" --session snail -o design.png
# review the design...
node scripts/imagine.js "非常好，画出它的三视图" --session snail -o views.png
```

Keep the design chunky and cuboid — no smooth curves — so it maps cleanly onto Blockbench cubes.

## 2. Build (Blockbench MCP)

Confirm the MCP tools are present (`place_cube`, `add_group`, `list_outline`); if not, remind the user to install/start Blockbench MCP. Then create the project and build the hierarchy and cubes, mirroring the design (coordinates below are examples — derive the actual `from`/`to` values from the three-view reference):

```text
create_project: name="snail", format="bedrock"
add_group: name="root", origin=[0, 0, 0]
add_group: name="body", parent="root", origin=[0, 8, 0]
place_cube: elements=[
  {name: "shell", from: [-4, 4, -4], to: [4, 12, 4]},
  {name: "foot", from: [-4, 0, -3], to: [4, 2, 3]},
  {name: "antenna_l", from: [-2, 10, -6], to: [-1, 16, -5]},
  {name: "antenna_r", from: [1, 10, -6], to: [2, 16, -5]}
], group="body", faces=true
```

Build order: project → bone hierarchy (pivots at joints) → cubes per group → `faces=true` for auto UV.

## 3. Texture

Create the texture with the palette sampled from the design reference, paint the details, then apply:

```text
create_texture: name="snail_skin", width=32, height=32
paint_fill_tool: texture_id="snail_skin", x=8, y=8, color="#A0522D", fill_mode="face"
apply_texture: id="shell", texture="snail_skin", applyTo="all"
```

## 4. Animate (optional)

Add an idle or walk animation by keyframing bone rotation; see [features-animation](features-animation.md).

## 5. Verify

- `list_outline` to confirm the hierarchy matches the design.
- `capture_screenshot` / `capture_app_screenshot` to visually check proportions against the three-view reference.
- Iterate: adjust cube `from`/`to` until the silhouette matches, then export/save the project.

<!--
Source references:
- https://ai-kit.xingduansuzhao.com/model
- bundled blockbench skills from the site (blockbench-modeling, blockbench-texturing, blockbench-animation)
-->
