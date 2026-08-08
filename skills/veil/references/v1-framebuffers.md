---
name: veil-v1-framebuffers
description: Veil 1 custom framebuffers — JSON long/short forms, dataType field, depth, aliases, FramebufferManager, and AdvancedFbo usage.
---

# Veil 1 Framebuffers

Global framebuffers are JSON files in `assets/<modid>/pinwheel/framebuffers/`, managed by `foundry.veil.api.client.render.framebuffer.FramebufferManager` (`VeilRenderSystem.renderer().getFramebufferManager()`). They can be sampled by shaders and post-pipelines.

## JSON format

Short form (single color buffer + optional depth):

```json5
{
  "width": "q.screen_width",   // MoLang expression
  "height": "q.screen_height", // MoLang expression
  "autoClear": true,
  "type": "texture",           // "texture" or "render_buffer"
  "format": "RGBA8",
  "dataType": "UNSIGNED_BYTE", // v1-specific field
  "levels": 0,
  "linear": false,
  "name": "AwesomeColorBuffer",
  "depth": true
}
```

Long form:

```json5
{
  "width": "q.screen_width",
  "height": "q.screen_height",
  "autoClear": true,
  "color_buffers": [
    { "type": "texture", "format": "RGBA8", "dataType": "UNSIGNED_BYTE", "levels": 0, "linear": false, "name": "AlbedoSampler" },
    { "type": "texture", "format": "RGB16F", "dataType": "FLOAT", "name": "NormalSampler" }
  ],
  "depth": { "type": "texture", "format": "DEPTH_COMPONENT", "dataType": "FLOAT" }
}
```

Rules:

- At least one color buffer is required (depth-only is invalid).
- All fields are optional; `{ "depth": true }` alone is a valid window-sized RGBA8 + depth buffer.
- `dataType` matters for int/float formats — mismatched data types make drivers refuse to draw into the buffer.
- `name` on a texture attachment adds an alias uniform (e.g. `AlbedoSampler` alongside `DiffuseSampler0`).
- `linear` and `name` only apply to `texture` attachments.

## Using framebuffers from Java

```java
FramebufferManager manager = VeilRenderSystem.renderer().getFramebufferManager();
AdvancedFbo fbo = manager.getFramebuffer(new ResourceLocation("mymod", "my_buffer"));
```

`AdvancedFbo` (interface) gives `getWidth()/getHeight()`, `getColorBuffer(int)`/`getColorTexture(int)`, `getDepthBuffer()`, `bind()/bindRead()/unbind()`, `blit(...)`, `resize(...)`, and `free()`. Java-side framebuffers can be built with `AdvancedFbo.withSize(width, height).addColorTextureBuffer().setDepthTextureBuffer().build(true)` and registered via `manager.setFramebuffer(id, fbo)`.

## Known IDs

`minecraft:main` is the main render target; `veil:deferred` (and its attachments) is used by the deferred renderer. Referencing `id:depth` in shader/pipeline `textures` binds the depth attachment.

<!--
Source references:
- https://github.com/FoundryMC/Veil.wiki (Framebuffer, 2024-12-02 revision)
- https://github.com/FoundryMC/Veil/tree/1.20 (1.0.0.228: FramebufferManager, AdvancedFbo)
-->
