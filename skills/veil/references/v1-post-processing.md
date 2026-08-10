---
name: veil-v1-post-processing
description: Veil 1 post-processing — pipeline JSON, blit/copy/mask/depth_function stages, framebuffer references, priority/replace, and the PostProcessingManager API.
---

# Veil 1 Post-Processing

Post-pipelines are JSON files in `assets/<modid>/pinwheel/post/` linking shaders and framebuffers together, processed by `foundry.veil.api.client.render.post.PostProcessingManager`.

## Pipeline JSON

```json5
{
  "stages": [ ... ],
  "textures": { ... },      // shared with child shaders (same format as shader textures)
  "framebuffers": { ... },  // temporary framebuffers for this pipeline only
  "priority": 1000,
  "replace": false
}
```

- `priority` — lower values are inserted earlier when merging pipelines with the same id.
- `replace` — overwrite all same-id pipelines with a higher priority.
- Pipelines with the same file path/id merge, so resource packs can inject stages into existing pipelines.

## Framebuffer references

The `in` parameter of a stage accepts a global framebuffer id (`"minecraft:main"`, `"veil:post"`) or a temporary buffer defined in the pipeline's `framebuffers` block (referenced by bare `"name"`). The `in` framebuffer's attachments are exposed to the stage shader as `DiffuseSampler0`-`DiffuseSampler#` plus `DiffuseDepthSampler` (if depth exists); named attachments also become uniforms.

## Stage types

### Blit

```json5
{
  "type": "veil:blit",
  "shader": "modid:shaderid",      // required
  "in": "modid:framebufferid",     // optional, defaults to the input scene
  "out": "modid:framebufferid",    // required
  "clear": true
}
```

Drawing to `veil:post` on the last stage is the convention.

### Copy

```json5
{
  "type": "veil:copy",
  "in": "modid:framebufferid",
  "out": "modid:framebufferid",
  "color": false,   // copy color buffers
  "depth": false,   // copy depth buffers
  "linear": false   // linear filtering when sizes differ
}
```

### Mask

```json5
{
  "type": "veil:mask",
  "red": true, "green": true, "blue": true, "alpha": true,
  "depth": false
}
```

Sets color/depth write state for later stages. When depth writing is enabled, write `gl_FragDepth` yourself or the depth buffer fills with 0.5.

### Depth function

```json5
{
  "type": "veil:depth_function",
  "function": "ALWAYS"
}
```

## Running pipelines from Java

```java
PostProcessingManager manager = VeilRenderSystem.renderer().getPostProcessingManager();
manager.add(pipelineId);        // enable a pipeline
manager.remove(pipelineId);     // disable
manager.getPipeline(id);        // PostPipeline
manager.runPipeline(pipeline);  // run manually
```

Upload uniforms per-frame with `VeilEventPlatform.INSTANCE.preVeilPostProcessing((pipelineName, pipeline, context) -> { ... })` — fetch the shader from `context` and call `setInt`/`setFloat` on it.

<!--
Source references:
- https://github.com/FoundryMC/Veil.wiki (PostProcessing, 2024-12-02 revision)
- https://github.com/FoundryMC/Veil/tree/1.20 (1.0.0.228: PostProcessingManager, PostPipeline)
-->
