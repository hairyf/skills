---
name: minecraft-model-texturing
description: Blockbench MCP texturing patterns — texture creation, painting tools, layers, UV mapping, and PBR materials for Minecraft models.
---

# Texturing

## Create and apply

```text
create_texture: name="skin", width=32, height=32, fill_color="#A0522D"
apply_texture: id="shell", texture="skin", applyTo="all"
```

Sample the palette from the design reference; the model's texture grid is small (tens of pixels per face), so per-face fills are enough.

## Painting

```text
paint_with_brush: texture_id="skin", coordinates=[{x: 10, y: 10}, {x: 12, y: 10}],
  brush_settings={color: "#000000", size: 1}              # details (eyes, outlines)

paint_fill_tool: texture_id="skin", x=8, y=8, color="#C4A484", fill_mode="face"
paint_fill_tool: texture_id="skin", x=0, y=0, color="#3366CC", fill_mode="color_connected", tolerance=10

draw_shape_tool: texture_id="skin", shape="rectangle", start={x: 0, y: 0}, end={x: 16, y: 16}, color="#FFCC00"
gradient_tool: texture_id="skin", start={x: 0, y: 0}, end={x: 0, y: 32}, start_color="#87CEEB", end_color="#1E90FF"
```

Also available: `eraser_tool`, `color_picker_tool` (pick colors from the reference), `copy_brush_tool` (clone areas), `texture_layer_management` (layers), `texture_selection`.

## UV mapping

```text
auto_uv_mesh: mesh_id="cube", mode="project"              # project / unwrap / cylinder / sphere
set_mesh_uv: mesh_id="cube", face_key="north", uv_mapping={v1: [0, 0], v2: [16, 0], v3: [16, 16], v4: [0, 16]}
rotate_mesh_uv: mesh_id="cube", angle="90"
```

## PBR materials (Bedrock RTX)

Channels: `color` (albedo), `normal` (tangent-space RGB), `height` (grayscale), `mer` (R=metalness, G=emissive, B=roughness).

```text
create_pbr_material: name="gold", textures={color: "gold_color", normal: "gold_normal", mer: "gold_mer"}
configure_material: material_id="gold", config={metalness_emissive_roughness: {metalness: 1.0, emissive: 0.0, roughness: 0.25}}
```

Common presets: stone (roughness 0.9), gold/iron (metalness 1, roughness 0.25), glass (roughness 0.05), glow (emissive 1).

## Key Points

- Enable `pixel_perfect=true` via `paint_settings` for clean pixel art; use `mirror_painting` for symmetry.
- Apply the texture to elements after painting; inspect with `list_textures` / `get_texture`.
- PBR is only needed for Bedrock RTX material sets — standard textures suffice for Java.

<!--
Source references:
- bundled blockbench skills from https://ai-kit.xingduansuzhao.com/model (blockbench-texturing, blockbench-pbr-materials)
-->
