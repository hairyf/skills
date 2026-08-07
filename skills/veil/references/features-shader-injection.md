---
name: features-shader-injection
description: Modify vanilla or Veil shaders without replacing them — JSON injections with head()/tail(), redirects, and replaces.
---

# Shader Injection

Injection definitions live in `assets/{modid}/pinwheel/shader_injection/*.json` and reference GLSL files with `void head()` / `void tail()` marker functions.

## JSON Format

```json5
{
  "target": "minecraft:shaders/core/rendertype_solid.fsh",  // string or string[]
  "redirect": "modid:example.glsl",                          // GLSL file(s); required unless "replace"
  "replace": "modid:custom_shader",                          // replace target entirely; exclusive with redirect
  "priority": 1000,                                          // lower = injected earlier, default 1000
  "debug": true                                              // log parsed body and globals
}
```

- `redirect` targets include the extension (`.fsh`, `.vsh`, ...).
- `replace` targets omit the extension and may only target vanilla Minecraft shaders (e.g. `minecraft:shaders/core/rendertype_solid`). To replace a Veil shader, use `redirect`.

## GLSL Format

`void tail()` injects at the end of the target function; `void head()` at the start. Code outside the marker is treated as globals (uniforms, helper functions):

```glsl
vec4 tintColor(vec4 color) {
    return color * vec4(1.0, 0.5, 0.5, 1.0);
}

void tail() {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = vec3(gray);
}
```

At least one marker function is required — otherwise the injection is silently skipped with a warning. A `#version` line is auto-detected and applied when the target's version is lower.

## Multi-Target Example

```json
{
  "target": [
    "minecraft:shaders/core/rendertype_entity_solid.fsh",
    "minecraft:shaders/core/rendertype_entity_cutout.fsh"
  ],
  "redirect": "modid:multi_target.glsl"
}
```

## Migration from the Old `.txt` Format

| Old | New |
|-----|-----|
| `#priority 1000` | `"priority": 1000` |
| `#include modid:path` | `#include "path.glsl"` in GLSL |
| `#replace modid:path` | `"replace": "modid:path"` |
| `[FUNCTION main(0) HEAD]` / `[FUNCTION main(0) TAIL]` | `void head() { }` / `void tail() { }` |
| `[OUTPUT]`, `[UNIFORM]`, `[GET_ATTRIBUTE]` | Plain globals outside markers |
| `assets/.../shader_modifiers/*.txt` | `assets/.../shader_injection/*.json` |

<!--
Source references:
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/ShaderInject.md
-->
