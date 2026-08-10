---
name: features-framebuffers
description: Veil custom framebuffers (global + pipeline-local) and deferred-style dynamic buffers.
---

# Framebuffers & Dynamic Buffers

## Custom framebuffers

Global framebuffers live in `pinwheel/framebuffers/<name>.json` and are referenced from any pipeline by full id (`modid:name`). Pipeline-local (temporary) framebuffers are declared inside a post pipeline JSON and are only visible to that pipeline.

```json
{
  "width": "q.screen_width",
  "height": "q.screen_height",
  "autoClear": true,
  "color_buffers": [
    { "type": "texture", "format": "RGBA8", "linear": false, "name": "AlbedoSampler" },
    { "type": "texture", "format": "RGB16F", "name": "NormalSampler" }
  ],
  "depth": true
}
```

- `width`/`height` are MoLang expressions — `q.screen_width`, `q.screen_height`, or math like `q.screen_width / 2`.
- At least one color buffer is required; `depth` may be a boolean or a full attachment object.
- A color buffer `name` creates a sampler alias usable directly in GLSL (`uniform sampler2D AlbedoSampler;`).
- Formats: `RGBA8`, `RGBA16F`, `RGB16F`, `R16F`, `DEPTH_COMPONENT`, etc.
- When using integer/float formats make sure the data type matches what shaders expect, or drivers may refuse to draw into the buffer.

### Pipeline-local temporary buffers

```json
{
  "framebuffers": {
    "swap": { "depth": true, "format": "RGBA16F" }
  },
  "stages": [
    { "type": "veil:blit", "shader": "mymod:effect", "in": "veil:post", "out": "swap" },
    { "type": "veil:copy", "in": "swap", "out": "veil:post" }
  ]
}
```

Temporary buffers are referenced by bare name (`"swap"`); global buffers by full id (`"veil:post"`, `"minecraft:main"`).

## Dynamic (deferred) buffers

Veil can capture extra per-pixel data for use in post-processing or deferred passes:

| Buffer | Texture location | Contents |
|--------|------------------|----------|
| Albedo | `veil:dynamic_buffer/albedo` | raw unlit texture color |
| Normal | `veil:dynamic_buffer/normal` | screen-relative normals |
| Lightmap UV | `veil:dynamic_buffer/light_uv` | lightmap UV coordinates |
| Lightmap Color | `veil:dynamic_buffer/light_color` | lightmap color |
| Debug | `veil:dynamic_buffer/debug` | unused by Veil |

Enable in a pipeline with `"dynamicBuffers": ["albedo", "normal"]`, or from Java on the render thread:

```java
VeilRenderer renderer = VeilRenderSystem.renderer();
renderer.enableBuffers(...);
renderer.disableBuffers(...);
```

Shaders write to a dynamic buffer by tagging a value:

```glsl
// #veil:normal
vec3 normal = NormalMat * Normal;
```

Veil defines `VEIL_ALBEDO`, `VEIL_NORMAL`, `VEIL_LIGHT_UV`, `VEIL_LIGHT_COLOR`, `VEIL_DEBUG` when the corresponding buffer is enabled.

In-game, view buffers with the F6 editor menu (Framebuffers section) or `/veilc buffers enable <type>`.

## Key points

- Use global framebuffers to pass data between pipelines; use pipeline-local buffers for temporary ping-pong within one pipeline.
- Dynamic buffers cost memory and fill-rate — enable only the ones you actually sample.

<!--
Source references:
- https://github.com/FoundryMC/Veil/wiki/Framebuffer
- https://github.com/FoundryMC/Veil/wiki/DynamicBuffer
-->
