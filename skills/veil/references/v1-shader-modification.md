---
name: veil-v1-shader-modification
description: Veil 1 shader injection — shader_modifiers file layout, directives, and commands for hooking into vanilla or Veil shaders.
---

# Veil 1 Shader Modification

Shader modifications inject code into existing shader sources (vanilla or Veil/pinwheel) without replacing the file. They load before shaders compile.

## File layout

`assets/<modid>/pinwheel/shader_modifiers/<namespace>/<path>/<filename>.<ext>.txt`

For example, modifying `minecraft:shaders/core/rendertype_solid.vsh`:

```
assets/mymod/pinwheel/shader_modifiers/minecraft/shaders/core/rendertype_solid.vsh.txt
```

## Format

```text
#version 330 // required minimum shader version
#priority 1000 // lower loads first (default 1000)
#include veil:camera // optional include

// #replace veil:shader/test // optional: replace the whole target shader

[GET_ATTRIBUTE 0] vec3 InPos;
[GET_ATTRIBUTE 4] vec3 Nom;

[OUTPUT]
out vec4 Test;
out vec3 TestNormal;

[UNIFORM]
uniform sampler2D Sampler8;

[FUNCTION main(0) HEAD]
TestNormal = #Nom;
Test = vec4(#InPos, 1.0);
```

## Directives

- `#version` — minimum GLSL version for this modification; use the target shader's version if unsure.
- `#priority` — ordering for multiple modifications of the same shader.
- `#include namespace:path` — include another `.glsl` include.
- `#replace veil:shader/id` — replaces the target shader entirely with another Veil shader; all other modifications are ignored. Last resort only.

## Commands

- `[GET_ATTRIBUTE #] type name;` — fetch/define a vertex attribute by location; use `#name` anywhere in the file to reference it.
- `[OUTPUT]` — code after it is added as outputs; Veil automatically forwards them as inputs to the next pipeline shader.
- `[UNIFORM]` — code added at the end of the target's uniform block.
- `[FUNCTION name(params) HEAD|TAIL]` — inject code into the named function, at the start (`HEAD`) or end (`TAIL`). The params count optionally disambiguates overloads; omitting it matches all functions with that name.

This is the v1 version of the shader-injection system (later renamed `shader_injection` with `head()`/`tail()` syntax in Veil 4).

<!--
Source references:
- https://github.com/FoundryMC/Veil.wiki (ShaderModification, 2024-12-02 revision)
- https://github.com/FoundryMC/Veil/tree/1.20 (1.0.0.228: ShaderModificationManager)
-->
