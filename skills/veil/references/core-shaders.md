---
name: core-shaders
description: Define Veil shader programs — stages, includes, definitions, textures, blending, and required features.
---

# Veil Shaders

Veil shaders live in `assets/{modid}/pinwheel/shaders/program` as JSON program definitions. Each stage is a separate GLSL file with its own extension so stages can share a name:

| Stage | Extension |
|-------|-----------|
| Vertex | `.vsh` |
| Tessellation Control | `.tcsh` |
| Tessellation Evaluation | `.tesh` |
| Geometry | `.gsh` |
| Fragment | `.fsh` |
| Compute | `.comp` |

Includes use `.glsl` and live in `pinwheel/shaders/include`.

## Program JSON

```json5
{
  "vertex": "modid:shaderid",
  "fragment": "modid:shaderid",
  "definitions": ["foo", "bar", { "defaultValue": 4 }],
  "textures": { "CustomTexture": "veil:textures/gui/item_shadow.png" },
  "blend": { "func": "ADD", "srcrgb": "ONE", "dstrgb": "ZERO" },
  "required_features": ["BINDLESS_TEXTURE"]
}
```

- All stage fields are optional; at least one stage is needed to make a valid program.
- Compute shaders are supported but must be dispatched from Java (`glDispatchCompute`).

## Includes

```glsl
#include namespace:path
```

Includes may include other includes but must not form circular references.

## Definitions

Definitions insert `#define name value` at the top of the shader. Define them at runtime with `VeilRenderer#getShaderDefinitions().set("example_definition")`; every shader depending on the value recompiles automatically when it changes. A JSON `defaultValue` is used when no value is defined in Java.

```java
VeilRenderer renderer = VeilRenderSystem.renderer();
ShaderPreDefinitions definitions = renderer.getShaderDefinitions();
definitions.set("example_definition");
```

## Textures

Texture keys in the JSON bind to uniform names in the GLSL. Two sources exist:

- **Location** — `"veil:textures/foo.png"` or `{"type":"location","location":"minecraft:textures/atlas/particles.png"}`; uses `TextureManager`/file loading.
- **Framebuffer** — `{"type":"framebuffer","name":"veil:deferred","sampler":4}`; `:depth` suffix binds the depth attachment.

Per-texture sampling filters can override GL state:

```json5
{
  "filter": {
    "blur": false,
    "mipmap": false,
    "anisotropy": 1.0,
    "compareFunction": "less",
    "wrapX": "repeat",
    "borderColor": "0xFF000000",
    "borderType": "float",
    "seamless": false
  }
}
```

## Blending

`blend` overrides the currently set blend mode (mainly for post-processing): `func`/`alphafunc` are `ADD|SUBTRACT|REVERSE_SUBTRACT|MIN|MAX`; `srcrgb`/`dstrgb`/`srcalpha`/`dstalpha` use standard OpenGL factors (`ONE`, `ZERO`, `SRC_ALPHA`, `ONE_MINUS_SRC_ALPHA`, etc.).

## Required Features

`required_features` gates compilation on GPU extensions listed in `ShaderFeature.java` (e.g. `BINDLESS_TEXTURE`). The shader only loads and compiles when the GPU supports the feature; requiring one also enables the needed GLSL extensions.

## Using a Shader from Java

```java
ShaderProgram shader = VeilRenderSystem.setShader(CUSTOM_SHADER);
if (shader == null) return; // missing or failed to compile

ShaderUniformAccess customValue = shader.getUniform("CustomValue");
if (customValue != null) customValue.setFloat(32.2F);

shader.bind();
// ... render ...
ShaderProgram.unbind();
```

Custom uniforms can also be uploaded during `VeilPostProcessingEvent.Pre` for pipeline-specific values.

<!--
Source references:
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/Shader.md
-->

