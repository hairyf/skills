---
name: veil-v1-shaders
description: Veil 1 shader programs — program JSON, stage file extensions, includes, uniform auto-detection, Java usage, definitions, and texture binding.
---

# Veil 1 Shaders

Shader programs live in `assets/<modid>/pinwheel/shaders/program`; includes in `pinwheel/shaders/include`.

## Program JSON

```json5
{
  // All optional; at least one stage needed
  "vertex": "modid:shaderid",
  "tesselation_control": "modid:shaderid",
  "tesselation_evaluation": "modid:shaderid",
  "geometry": "modid:shaderid",
  "fragment": "modid:shaderid",
  "compute": "modid:shaderid",
  "definitions": ["foo", "bar", { "defaultValue": 4 }],
  "textures": {
    "CustomTexture": "veil:textures/gui/item_shadow.png",
    "FramebufferTex": { "type": "framebuffer", "name": "veil:deferred", "sampler": 4 },
    "FramebufferDepth": { "type": "framebuffer", "name": "veil:deferred:depth" }
  }
}
```

Stage file extensions (verified against v1 source): vertex `.vsh`, tessellation control `.tcsh`, tessellation evaluation `.tesh`, geometry `.gsh`, fragment `.fsh`, compute `.comp`. Includes always use `.glsl`.

Compute shaders are supported but must be dispatched from Java (`glDispatchCompute`).

## Includes

```glsl
#include namespace:path
```

Includes can include other includes but must not be circular.

## Uniforms

Uniforms are auto-detected by name — no Java-side registration needed. Standard Minecraft uniforms work out of the box: `Sampler0`-`Sampler11`, `ModelViewMat`, `ProjMat`, `TextureMat`, `ColorModulator`, `ScreenSize`, `Light0_Direction`, `Light1_Direction`, `FogStart`, `FogEnd`, `FogColor`, `FogShape`, `GlintAlpha`, `GameTime`, `LineWidth`, `ChunkOffset`.

## Using shaders from Java

```java
private static final ResourceLocation SHADER = Veil.veilPath("test_shader");

ShaderProgram shader = VeilRenderSystem.setShader(SHADER);
if (shader == null) return; // missing or failed to compile

shader.setFloat("CustomValue", 37.2F);
shader.setMatrix("CustomProjection", new Matrix4f().ortho(0, 10, 10, 0, 0.3F, 100.0F, false));
shader.bind();
// ... draw ...
ShaderProgram.unbind();
```

`ShaderProgram` is an interface (`foundry.veil.api.client.render.shader.program.ShaderProgram`) extending `MutableUniformAccess` (`setInt/setFloat/setVector/setMatrix/...`) and `TextureUniformAccess`. `VeilRenderSystem.getShader()` returns the currently bound program.

For pipeline-specific uniforms during post-processing, upload in `VeilEventPlatform.INSTANCE.preVeilPostProcessing(...)` and fetch the shader from the pipeline context (see [Post-Processing](v1-post-processing.md)).

## Definitions

Definitions insert `#define name value` at the top of every shader that lists the name. Set them at runtime:

```java
ShaderPreDefinitions definitions = VeilRenderSystem.renderer().getShaderDefinitions();
definitions.define("example_definition");          // #define example_definition
definitions.define("FOO", "4");                    // #define FOO 4
definitions.remove("FOO");
```

Shaders depending on a definition recompile automatically when it changes. A JSON `defaultValue` is used when no Java value is set. `defineStatic`/`setStatic` add global definitions that never trigger recompiles (use for constants).

## Textures

Texture keys in the JSON map to `uniform sampler2D <Key>;` in GLSL. Two sources:

- **Location** — plain string (`"modid:textures/...png"`) or `{"type":"location","location":"..."}`; loads through `TextureManager`/file.
- **Framebuffer** — `{"type":"framebuffer","name":"id","sampler":n}` binds attachment `n`; `name + ":depth"` binds the depth attachment.

The uniform is bound automatically when the shader is set.

<!--
Source references:
- https://github.com/FoundryMC/Veil.wiki (Shader, 2024-12-02 revision)
- https://github.com/FoundryMC/Veil/tree/1.20 (1.0.0.228: ShaderSourceSet, ShaderPreDefinitions, ShaderProgram)
-->
