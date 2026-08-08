---
name: veil-v1-render-types
description: Veil 1 render types — JSON format and layer shards, Java-built render types, layered render types, and the v1 caveat that JSON render types have no runtime getter yet.
---

# Veil 1 Render Types

## JSON format (`pinwheel/rendertypes/`)

```json5
{
  "format": "POSITION_COLOR_TEX_LIGHTMAP",  // DefaultVertexFormats name
  "mode": "QUADS",                          // primitive mode
  "bufferSize": "TRANSIENT",                // or BIG / SMALL / byte count
  "sort": false,
  "affectsCrumbling": true,
  "outline": false,
  "layers": [ ... ]
}
```

`layers` can also be an array of arrays to create a layered render type.

### Layer shards

| Type | Fields |
|---|---|
| `minecraft:texture` | `texture` (format string), `blur`, `mipmap` |
| `minecraft:multi_texture` | `textures`: list of texture layers (up to 12 units) |
| `minecraft:shader` | `name` (vanilla shader file name) |
| `veil:shader` | `name` (registered Veil shader id) |
| `minecraft:transparency` | `mode`: none/additive/lightning/glint/crumbling/translucent |
| `minecraft:depth_test` | `mode`: never/less/equal/lequal/greater/notequal/gequal/always |
| `minecraft:cull` | `face`: front/back/front_and_back/none |
| `minecraft:lightmap` | `enabled` (default true) |
| `minecraft:overlay` | `enabled` (default true) |
| `minecraft:layering` | `mode`: none/polygon_offset/view_offset |
| `minecraft:output` | `framebuffer` (render target name) |
| `minecraft:texturing` | `scale` (glint scrolling) |
| `minecraft:write_mask` | `color`, `depth` |
| `minecraft:line` | `width` (defaults to window scale) |
| `minecraft:color_logic` | `operation`: and/and_inverted/and_reverse/clear/copy/.../xor |
| `veil:patches` | `patchVertices` (tessellation) |

String fields support Java format specifiers (`%1$s`) for template values.

## v1 caveat

In **1.0.0.228** the `rendertypes` JSON files are parsed at reload, but the runtime query API (`VeilRenderType#get(id, texture)`) does **not** exist yet — `DynamicRenderTypeManager` loads them internally without a public getter. For 1.0.0.228, build custom render types in Java instead:

```java
// Layered render type — draws one mesh with several render types at once
RenderType renderType = VeilRenderType.layered(
        RenderType.entityCutoutNoCull(BASE_TEXTURE),
        RenderType.entityCutoutNoCull(ARMOR_TEXTURE));

// Use it like any RenderType
VertexConsumer builder = bufferSource.getBuffer(renderType);
```

## RenderTypeLayerRegistry

`foundry.veil.api.client.registry.RenderTypeLayerRegistry` registers codecs for layer types (`texture`, `multi_texture`, `shader`, `veil:shader`); custom layer types register here for the JSON pipeline in later versions.

<!--
Source references:
- https://github.com/FoundryMC/Veil.wiki (CustomRenderType, 2024-12-02 revision)
- https://github.com/FoundryMC/Veil/tree/1.20 (1.0.0.228: VeilRenderType, DynamicRenderTypeManager, RenderTypeLayerRegistry)
-->
