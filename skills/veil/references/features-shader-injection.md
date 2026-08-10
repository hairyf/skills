---
name: features-shader-injection
description: Inject or replace vanilla/Veil shaders — old .txt modifier format (1.20.x) and new JSON+GLSL format (1.21+).
---

# Shader Injection

Veil can modify vanilla (or Veil) shaders without replacing files — useful for global effects like "make all entity shaders grayscale".

## New format (1.21+, `pinwheel/shader_injection/*.json`)

```json
{
  "target": "minecraft:shaders/core/rendertype_solid.fsh",
  "redirect": "mymod:grayscale.glsl",
  "priority": 1000
}
```

The GLSL file uses `void head()` / `void tail()` markers; code outside them becomes globals:

```glsl
// globals (uniforms / helpers)
float luminance(vec3 c) {
    return dot(c, vec3(0.299, 0.587, 0.114));
}

void tail() {
    float gray = luminance(fragColor.rgb);
    fragColor.rgb = vec3(gray);
}
```

Fields:

| Field | Meaning |
|-------|---------|
| `target` | shader to inject into; must include extension for `redirect` (`...rendertype_solid.fsh`), no extension for `replace` |
| `redirect` | GLSL file(s) providing the injection code |
| `replace` | replace the target shader entirely with another Veil program (mutually exclusive with `redirect`) |
| `priority` | injection order, lower first (default 1000) |
| `debug` | log parsed body/globals |

Multi-target and `#version` are supported:

```json
{
  "target": [
    "minecraft:shaders/core/rendertype_entity_solid.fsh",
    "minecraft:shaders/core/rendertype_entity_cutout.fsh"
  ],
  "redirect": "mymod:red_overlay.glsl"
}
```

## Old format (1.20.x, `pinwheel/shader_modifiers/*.txt`)

On Veil `1.0.0.x` (MC 1.20.1) the modifier files mirror the vanilla shader path:

```text
src/main/resources/assets/mymod/pinwheel/shader_modifiers/minecraft/shaders/core/rendertype_cutout.txt
```

```text
#version 330
#priority 1000

// Inject at the end of main()
[FUNCTION main(0) TAIL]
fragColor.rgb = vec3(dot(fragColor.rgb, vec3(0.299, 0.587, 0.114)));
```

Directives: `#version`, `#priority`, `#include modid:path`, `#replace modid:shader`, and `[FUNCTION main(0) HEAD]` / `[FUNCTION main(0) TAIL]`.

## Key points

- `redirect` injects code into the existing shader; `replace` swaps it for another Veil program.
- At least one of `head()`/`tail()` must exist in the new format, or the injection is skipped with a warning.
- Only vanilla Minecraft shaders can be replaced; to replace a Veil shader use `redirect` with head/tail injections.
- 1.20.x projects must use the `.txt` modifier format under `shader_modifiers/`.

<!--
Source references:
- https://github.com/FoundryMC/Veil/wiki/ShaderInject
-->
