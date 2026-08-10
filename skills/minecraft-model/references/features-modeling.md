---
name: minecraft-model-modeling
description: Blockbench MCP modeling patterns — project creation, bone/group hierarchy, cube placement and modification, mesh editing, and structure queries for building Minecraft models.
---

# Modeling

Use these MCP patterns to build the model in Blockbench.

## Project

```text
create_project: name="snail", format="bedrock"   # bedrock / java_block / free
```

Pick the format by where the model will be used: entity/mob models typically use `bedrock`, block models use `java_block`.

## Hierarchy before geometry

```text
add_group: name="root", origin=[0, 0, 0]
add_group: name="body", parent="root", origin=[0, 12, 0]
add_group: name="head", parent="body", origin=[0, 24, 0]
```

Set group origins at pivot points (joints) so later animation rotates correctly. Build the groups first, then attach cubes.

## Cubes

```text
place_cube: elements=[
  {name: "torso", from: [-4, 12, -2], to: [4, 24, 2]},
  {name: "head", from: [-4, 24, -4], to: [4, 32, 4]}
], group="body", faces=true
```

- `faces=true` auto-generates UVs — always use it unless UVs are customized manually.
- `modify_cube` adjusts position, rotation, origin, and UV after placement.
- `duplicate_element` with `offset` for symmetric parts (arms, legs).

## Meshes (freeform)

```text
create_sphere: elements=[{name: "ball", position: [0, 8, 0], diameter: 16, sides: 12}]
create_cylinder: elements=[{name: "pillar", position: [0, 0, 0], diameter: 8, height: 24, sides: 12}]
```

Prefer cubes for Minecraft-style models; use mesh editing (`select_mesh_elements`, `extrude_mesh`, `subdivide_mesh`, `move_mesh_vertices`, `merge_mesh_vertices`) only when the design genuinely needs freeform geometry.

## Querying & verifying

- `list_outline` — current hierarchy and elements; run it before every modification.
- `capture_screenshot` — 3D view; `capture_app_screenshot` — whole Blockbench window.
- `trigger_action: action="undo"` — roll back a bad edit.

## Key Points

- Query first (`list_outline`, `list_textures`) to know the current state.
- One cube per named part; descriptive names make later edits and animation easier.
- Keep the design's cube constraint: Minecraft models are chunky cuboids, not smooth meshes.

<!--
Source references:
- bundled blockbench skills from https://ai-kit.xingduansuzhao.com/model (blockbench-modeling, blockbench-mcp-overview)
-->
