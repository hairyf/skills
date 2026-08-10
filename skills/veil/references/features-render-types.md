---
name: features-render-types
description: Create data-driven render types from JSON with format, mode, and layer shards (texture, shader, depth, cull, bloom, output, etc.).
---

# Data-Driven Render Types

Render types live in `assets/{modid}/pinwheel/rendertypes/*.json` and are fetched in the render loop with `VeilRenderType#get(id, args...)` — calling it in the loop makes updates from resource reloads apply automatically.

```java
RenderType renderType = VeilRenderType.get(RENDER_TYPE, "test_texture.png");
if (renderType == null) return; // error loading
VertexConsumer builder = bufferSource.getBuffer(renderType);
```

## Top-Level Fields

```json5
{
  "format": "POSITION_COLOR_TEX_LIGHTMAP", // Required, see DefaultVertexFormats
  "mode": "QUADS",                          // Required, primitive mode
  "bufferSize": "TRANSIENT",                // Required: BIG | SMALL | TRANSIENT
  "sort": false,
  "affectsCrumbling": true,
  "outline": false,
  "layers": []
}
```

String fields support Java `Formatter` codes (`%1$s`) so callers can pass template values to `VeilRenderType#get`.

## Layer Shards

`layers` is a list of shards; an array of arrays creates a **layered** render type (e.g. bloom draws the same mesh with several settings).

| Layer | Example |
|-------|---------|
| `minecraft:texture` | `{ "type": "minecraft:texture", "texture": "%1$s", "blur": true, "mipmap": false }` |
| `minecraft:multi_texture` | `{ "type": "minecraft:multi_texture", "textures": [...] }` (up to 12 units) |
| `minecraft:shader` | `{ "type": "minecraft:shader", "name": "rendertype_solid" }` (vanilla shader) |
| `veil:shader` | `{ "type": "veil:shader", "name": "veil:test_shader" }` (any Veil program) |
| `minecraft:transparency` | `{ "type": "minecraft:transparency", "mode": "translucent" }` — none/additive/lightning/glint/crumbling/translucent (most need sorting) |
| `minecraft:depth_test` | `{ "type": "minecraft:depth_test", "mode": "lequal" }` — never/less/equal/lequal/greater/notequal/gequal/always |
| `minecraft:cull` | `{ "type": "minecraft:cull", "face": "back" }` — front/back/front_and_back/none |
| `minecraft:lightmap` | `{ "type": "minecraft:lightmap", "enabled": true }` |
| `minecraft:overlay` | `{ "type": "minecraft:overlay", "enabled": true }` |
| `minecraft:layering` | `{ "type": "minecraft:layering", "mode": "polygon_offset" }` — none/polygon_offset/view_offset |
| `minecraft:output` | `{ "type": "minecraft:output", "framebuffer": "veil:bloom" }` |
| `minecraft:texturing` | `{ "type": "minecraft:texturing", "scale": 1 }` (enchantment glint UV scroll) |
| `minecraft:write_mask` | `{ "type": "minecraft:write_mask", "color": true, "depth": true }` |
| `minecraft:line` | `{ "type": "minecraft:line", "width": 42 }` (defaults to window scale) |
| `minecraft:color_logic` | `{ "type": "minecraft:color_logic", "operation": "or_reverse" }` (and/clear/copy/invert/xor, etc.) |
| `veil:patches` | `{ "type": "veil:patches", "patchVertices": 4 }` (tessellation) |
| `veil:depth_clamp` | `{ "type": "veil:depth_clamp", "enabled": true }` |
| `veil:multisample` | `{ "type": "veil:multisample", "enabled": true }` (needs multisampled render buffer) |
| `veil:seamless_cubemap` | `{ "type": "veil:seamless_cubemap", "enabled": true }` (set per-texture in shader definitions instead when using Veil shaders) |

## Bloom Example

```json5
{
  "layers": [
    [ { "type": "veil:shader", "name": "veil:test_shader" } ],
    [
      { "type": "veil:shader", "name": "veil:test_bloom_shader" },
      { "type": "minecraft:output", "framebuffer": "veil:bloom" }
    ]
  ]
}
```

<!--
Source references:
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/CustomRenderType.md
-->

