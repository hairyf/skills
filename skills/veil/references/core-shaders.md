---
name: core-shaders
description: Veil shader programs — program JSON, shader stage files, includes, uniforms, definitions, textures, and Java-side shader usage.
---

# Veil Shaders

Shader programs live in `assets/<modid>/pinwheel/shaders/program/` and are referenced by post pipelines or bound directly from Java. Includes (`.glsl`) live in `shaders/include/` and share code between programs.

## Program JSON

`assets/<modid>/pinwheel/shaders/program/scanlines.json`:

```json
{
  "vertex": "veil:blit_screen",
  "fragment": "mymod:scanlines"
}
```

Each stage uses a dedicated extension so stages can share a base name:

| Stage | Extension |
|-------|-----------|
| Vertex | `.vsh` |
| Fragment | `.fsh` |
| Compute | `.comp` |
| Geometry | `.gsh` |
| Tesselation control / evaluation | `.tcsh` / `.tesh` |
| Include (not a program) | `.glsl` |

`assets/<modid>/pinwheel/shaders/program/scanlines.fsh`:

```glsl
uniform sampler2D DiffuseSampler0;   // color attachment of the pipeline's "in" framebuffer
uniform float ScanlineStrength;

in vec2 texCoord;
out vec4 fragColor;

void main() {
    vec4 color = texture(DiffuseSampler0, texCoord);
    float scan = 0.5 + 0.5 * sin(texCoord.y * 600.0);
    fragColor = vec4(color.rgb * mix(1.0, scan, ScanlineStrength), color.a);
}
```

## Includes

```glsl
// assets/<modid>/pinwheel/shaders/include/tint.glsl
vec4 tint(vec4 c) { return c * vec4(1.0, 0.7, 0.7, 1.0); }
```

```glsl
// scanlines.fsh
#include mymod:tint
// ... then use tint(color)
```

Includes can include other includes; no circular references.

## Uniforms

Uniforms are auto-detected by name — no manual binding needed. Set them from Java per frame:

```java
FabricVeilPostProcessingEvent.PRE.register((name, pipeline, context) -> {
    if (name.equals(MyPipelines.VHS)) {
        pipeline.setFloat("ScanlineStrength", 0.6F);
        pipeline.setInt("FrameIndex", frameIndex++);
        pipeline.setVector("TintColor", 1.0F, 0.3F, 0.3F, 1.0F);
    }
});
```

### Useful built-in uniforms

| Uniform | Meaning |
|---------|---------|
| `DiffuseSampler0` | First color attachment of the stage's `in` framebuffer |
| `DiffuseDepthSampler` | Depth attachment of `in` (if present) |
| `ScreenSize` (`vec2`) | Window size in pixels |
| `GameTime` (`float`) | Vanilla game time 0–1 (0 = dawn, 0.5 = noon) |
| `VeilRenderTime` (`float`) | Client time in seconds, loops hourly |
| `ModelViewMat` / `ProjMat` | Standard matrices |
| `FogStart` / `FogEnd` / `FogColor` / `FogShape` | Vanilla fog state |

Uniform blocks (UBO) can be imported with `#veil:buffer veil:camera FooBar` — e.g. `#veil:buffer veil:camera VeilCamera` exposes camera matrices.

## Definitions

Define compile-time flags in the program JSON and toggle them from Java (shaders auto-recompile):

```json
{
  "vertex": "veil:blit_screen",
  "fragment": "mymod:example",
  "definitions": ["CUSTOM_FEATURE"]
}
```

```java
VeilRenderSystem.renderer().getShaderDefinitions().set("CUSTOM_FEATURE");
```

In GLSL the definition becomes `#define CUSTOM_FEATURE`.

## Textures

Programs can bind textures or framebuffers by uniform name:

```json
{
  "vertex": "veil:blit_screen",
  "fragment": "mymod:example",
  "textures": {
    "NoiseTex": "mymod:textures/noise.png",
    "DepthBuffer": { "type": "framebuffer", "name": "veil:post:depth" }
  }
}
```

## Binding from Java (non-post shaders)

```java
ShaderProgram shader = VeilRenderSystem.setShader(new Identifier("mymod", "my_shader"));
if (shader == null) return;                       // compile/feature failure
ShaderUniformAccess u = shader.getUniform("Value");
if (u != null) u.setFloat(32.2F);
shader.bind();
// ... render ...
ShaderProgram.unbind();
```

## Key points

- `veil:blit_screen` is the standard fullscreen-quad vertex shader for post effects.
- Custom uniforms are null-checked (`getUniform` returns null if absent).
- `required_features` (e.g. `BINDLESS_TEXTURE`) gate a program on GPU support; shaders only compile when the feature exists.

<!--
Source references:
- https://github.com/FoundryMC/Veil/wiki/Shader
- https://github.com/FoundryMC/Veil/wiki/PostProcessing
-->
