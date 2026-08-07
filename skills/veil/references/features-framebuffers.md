---
name: features-framebuffers
description: Define global JSON framebuffers with custom attachments, formats, and sampler aliases for shaders and post-processing.
---

# Custom Framebuffers

Global framebuffers live in `assets/{modid}/pinwheel/framebuffers/*.json`. They are managed by `FramebufferManager` and can be bound as texture sources in shaders and post-pipelines.

## Format

There must be **at least one color buffer** — depth-only framebuffers are invalid. Both long form (customizable color buffers) and short form (single color buffer) are supported:

```json5
{
  "width": "q.screen_width",   // MoLang expression, optional
  "height": "q.screen_height", // MoLang expression, optional
  "autoClear": true,           // optional
  "color_buffers": [           // long form; short form uses these fields at top level instead
    {
      "type": "texture",       // "texture" or "render_buffer"
      "format": "RGBA8",       // OpenGL format
      "levels": 0,             // mipmaps (textures) / samples (render buffers), >= 0
      "linear": false,
      "name": "AwesomeColorBuffer"
    }
  ],
  "depth": true                // bool or full attachment definition
}
```

Depth can be `true` (adds a depth texture) or a full attachment object with `type`, `format` (`DEPTH_COMPONENT`), `levels`, `linear`, `name`.

## Sampler Aliases

Setting `name` on a texture attachment adds an alias binding, so both names sample the same texture:

```json5
{
  "depth": true,
  "color_buffers": [
    { "name": "AlbedoSampler", "format": "RGBA8" },
    { "name": "NormalSampler", "format": "RGB16F" },
    { "name": "MaterialSampler", "format": "R16F" },
    { "name": "EmissiveSampler", "format": "RGBA8" },
    { "name": "VanillaLightSampler", "format": "RG8" }
  ]
}
```

```glsl
// Both reference the same texture
uniform sampler2D DiffuseSampler0;
uniform sampler2D AlbedoSampler;
```

`linear` and `name` only apply to `texture` attachments — render buffers cannot be sampled.

## Notes

- Match the data type to integer/float formats or most drivers refuse to draw into the buffer.
- All parameters are optional; `{ "depth": true }` is a valid window-sized RGBA8 + depth framebuffer.
- Use `name:...:depth` (e.g. `veil:deferred:depth`) when binding a depth attachment as a shader texture.

<!--
Source references:
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/Framebuffer.md
-->

