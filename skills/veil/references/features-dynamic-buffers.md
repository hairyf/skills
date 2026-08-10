---
name: features-dynamic-buffers
description: Output extra per-fragment data (albedo, normals, lightmap) for deferred rendering and post-processing.
---

# Dynamic Buffers

Dynamic buffers add deferred-style render targets that post-processing or a deferred pass can read later.

| Buffer | Texture Location | Contents |
|--------|------------------|----------|
| Albedo | `veil:dynamic_buffer/albedo` | Raw unlit texture color |
| Normal | `veil:dynamic_buffer/normal` | Screen-relative normals |
| Lightmap UV | `veil:dynamic_buffer/light_uv` | Lightmap UV coordinates |
| Lightmap Color | `veil:dynamic_buffer/light_color` | Lightmap color |
| Debug | `veil:dynamic_buffer/debug` | Unused by Veil |

## Enabling Buffers

```java
VeilRenderer renderer = VeilRenderSystem.renderer();
renderer.enableBuffers(...);  // render thread only
renderer.disableBuffers(...);
```

In-game: view them in the editor menu (F6, Framebuffers section) or enable with the client command `/veilc buffers enable <type>`.

## Writing from Shaders

Mark any shader value with a `// #veil:BUFFER` comment to output it to the matching buffer when enabled. This works in vertex and fragment shaders; Veil forwards vertex values to the fragment stage automatically.

```glsl
#ifdef VEIL_NORMAL
// #veil:normal
vec3 normal = NormalMat * Normal;
#endif

#ifdef VEIL_LIGHT_UV
// #veil:light_uv
vec2 texCoord2 = vec2(UV2 / 256.0);
#endif
```

When a buffer is enabled, Veil defines a flag: `VEIL_ALBEDO`, `VEIL_NORMAL`, `VEIL_LIGHT_UV`, `VEIL_LIGHT_COLOR`, `VEIL_DEBUG` — use `#ifdef` to conditionally include attributes and uniforms (e.g. the extra `Normal` vertex attribute).

Post-pipelines can require buffers via their `dynamicBuffers` list.

<!--
Source references:
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/DynamicBuffer.md
-->

