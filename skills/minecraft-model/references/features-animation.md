---
name: minecraft-model-animation
description: Blockbench MCP animation patterns — keyframes, channels, interpolation, bone rigging, and timeline control for animating Minecraft models.
---

# Animation

Animation requires a bone hierarchy: animate groups, not cubes directly. Set pivots at joints when creating groups.

## Create an animation

```text
create_animation: name="idle", animation_length=2.0, loop=true
manage_keyframes: bone_name="body", channel="rotation",
  keyframes=[{time: 0, values: [0, 0, 0]}, {time: 1.0, values: [0, 5, 0]}, {time: 2.0, values: [0, 0, 0]}]
animation_timeline: action="play"
```

Channels: `position` (xyz offset), `rotation` (degrees), `scale` (xyz or uniform).
Interpolation: `linear`, `catmullrom` (organic), `bezier` (custom curves), `step` (mechanical).

## Walk cycle (1s loop)

```text
create_animation: name="walk", animation_length=1.0, loop=true, bones={
  "leg_left": [{time: 0, rotation: [30, 0, 0]}, {time: 0.5, rotation: [-30, 0, 0]}, {time: 1.0, rotation: [30, 0, 0]}],
  "leg_right": [{time: 0, rotation: [-30, 0, 0]}, {time: 0.5, rotation: [30, 0, 0]}, {time: 1.0, rotation: [-30, 0, 0]}]
}
```

## Rigging and helpers

```text
bone_rigging: action="set_pivot", bone_data={name: "arm_left", origin: [4, 22, 0]}
animation_graph_editor: bone_name="arm", channel="rotation", action="smooth"
animation_copy_paste: action="copy", source={bone: "arm_left"}
animation_copy_paste: action="mirror_paste", target={bone: "arm_right", mirror_axis: "x"}
batch_keyframe_operations: operation="scale", selection="all", parameters={scale_factor: 2.0}
```

## Timeline

```text
animation_timeline: action="set_fps", fps=60
animation_timeline: action="set_length", length=2.5
animation_timeline: action="loop", loop_mode="loop"   # loop / once / hold
animation_timeline: action="set_time", time=0.5
```

## Key Points

- `list_outline` first to see the available bones.
- Use `catmullrom` for organic movement, `step` for mechanical movement.
- Mirror animations (`mirror_paste`) to save time on symmetrical rigs.

<!--
Source references:
- bundled blockbench skills from https://ai-kit.xingduansuzhao.com/model (blockbench-animation)
-->
