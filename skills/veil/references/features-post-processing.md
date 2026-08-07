---
name: features-post-processing
description: Build post-processing pipelines from JSON stages, merge pipelines, and sample the scene in custom shaders.
---

# Post-Processing

Post-pipelines live in `assets/{modid}/pinwheel/post/*.json` and chain shader stages together — a JSON-driven replacement for vanilla's post-chain.

## Pipeline JSON

```json5
{
  "stages": [],
  "textures": {},               // global textures for all child shaders
  "framebuffers": {},           // temporary framebuffers (same format as global ones)
  "renderStage": "AFTER_SKY",   // VeilRenderLevelStageEvent.Stage
  "dynamicBuffers": ["albedo", "normal", "light_uv", "light_color", "debug"],
  "priority": 1000,             // lower executes first
  "replace": false              // overwrite same-name pipelines with higher priority
}
```

Multiple pipelines with the same id merge; `priority` controls insertion order and `replace` drops higher-priority ones. Adding a file with the same id is how you inject into existing pipelines.

## Stages

The `in` parameter binds the input framebuffer's color attachments as `DiffuseSampler0`-`DiffuseSampler#` (plus `DiffuseDepthSampler` for depth); attachments with custom `name`s get matching uniforms. All stage types are registered in `PostPipelineStageRegistry`.

### Blit

Draws a quad with a shader — the basic stage:

```json5
{
  "type": "veil:blit",
  "shader": "modid:shaderid",
  "in": "modid:framebufferid",
  "out": "modid:framebufferid",
  "clear": true
}
```

### Copy

Copies buffers between framebuffers (no shader):

```json5
{
  "type": "veil:copy",
  "in": "modid:framebufferid",
  "out": "modid:framebufferid",
  "color": true,
  "depth": false,
  "linear": false
}
```

### Mask

Sets color/depth write state for later stages. Depth writing is disabled by default; when enabled, write depth explicitly with `gl_FragDepth` or the buffer fills with 0.5:

```json5
{
  "type": "veil:mask",
  "red": true, "green": true, "blue": true, "alpha": true,
  "depth": false
}
```

### Depth Function

Sets the depth function for later stages (`ALWAYS` initially):

```json5
{ "type": "veil:depth_function", "function": "ALWAYS" }
```

## Fog Example

```json5
{
  "stages": [
    { "type": "veil:blit", "shader": "example:test_shader", "in": "minecraft:main" }
  ]
}
```

The shader uses `veil:blit_screen` as its vertex program:

```json5
{ "vertex": "veil:blit_screen", "fragment": "example:test_shader" }
```

```glsl
#include veil:fog
#include veil:space_helper

uniform sampler2D DiffuseSampler0;
uniform sampler2D DiffuseDepthSampler;

const float FogStart = -10;
const float FogEnd = 40;
uniform vec4 FogColor;
uniform int FogShape;

in vec2 texCoord;
out vec4 fragColor;

void main() {
    vec4 baseColor = texture(DiffuseSampler0, texCoord);
    float depthSample = texture(DiffuseDepthSampler, texCoord).r;
    vec3 pos = screenToLocalSpace(texCoord, depthSample).xyz;
    float vertexDistance = fog_distance(pos, FogShape);
    fragColor = linear_fog(baseColor, vertexDistance, FogStart, FogEnd, FogColor);
}
```

<!--
Source references:
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/PostProcessing.md
-->
