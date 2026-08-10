---
name: core-uniforms
description: Built-in shader uniforms and uniform blocks provided by Veil, and how to access them from Java.
---

# Uniforms & Uniform Blocks

Vanilla-style uniforms are auto-detected by name — no extra registration is needed.

## Built-in Uniforms

| Uniform | Source |
|---------|--------|
| `uniform sampler2D Sampler#;` | `RenderSystem#getShaderTexture` (samplers 0-11; `Sampler0` color, `Sampler1` overlay, `Sampler2` lightmap) |
| `uniform mat4 ModelViewMat;` | `RenderSystem#getModelViewStack` |
| `uniform mat4 ProjMat;` | `RenderSystem#getProjectionMatrix` |
| `uniform mat4 TextureMat;` | `RenderSystem#getTextureMatrix` |
| `uniform vec2 ScreenSize;` | Window size |
| `uniform vec4 ColorModulator;` | `RenderSystem#getShaderColor` |
| `uniform vec3 Light0_Direction;` / `Light1_Direction` | `VeilRenderSystem#getLight*Direction` |
| `uniform float GlintAlpha;` | `RenderSystem#getShaderGlintAlpha` |
| `uniform float FogStart;` / `FogEnd` / `vec4 FogColor` / `int FogShape` | `RenderSystem` fog state |
| `uniform float LineWidth;` | Only with `LINES`/`LINE_STRIP` |
| `uniform float GameTime;` | Vanilla game time 0..1 (0.5 = noon) |
| `uniform vec3 ChunkOffset;` | Chunk rendering offset |
| `uniform float VeilRenderTime;` | Current client time in seconds, loops every hour (Veil) |
| `uniform mat3 NormalMat;` | Normal transform from projection matrix (Veil) |
| `uniform float VeilBlockFaceBrightness[#];` | `ClientLevel#getShade`; import via `#include veil:light` (Veil) |

## Uniform Blocks

Register a buffer with `VeilShaderBufferRegistry#REGISTRY`, build its layout with `VeilShaderBufferLayout` (see `CameraMatrices#createLayout` for an example), then import it in GLSL:

```glsl
#veil:buffer veil:camera VeilCamera
```

The interface name scopes fields (`VeilCamera.FieldName`). Built-in blocks:

| Java Code | GLSL |
|-----------|------|
| `VeilRenderer#getCameraMatrices` | `#veil:buffer veil:camera VeilCamera` |
| `VeilRenderer#getGuiInfo` | `#veil:buffer veil:gui_info VeilGuiInfo` |

## Uploading Uniforms

```java
ShaderUniformAccess customProjection = shader.getUniform("CustomProjection");
if (customProjection != null) {
    Matrix4f projection = new Matrix4f().ortho(0, 10, 10, 0, 0.3F, 100.0F, false);
    customProjection.setMatrix(projection);
}
```

Always null-check uniforms — they are `null` when the shader does not declare them.

<!--
Source references:
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/Shader.md
-->

