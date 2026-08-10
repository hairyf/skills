---
name: best-practices
description: Veil version differences, injection formats, and common pitfalls.
---

# Best Practices

## Version matrix

| MC version | Veil line | Artifact | Injection format |
|------------|-----------|----------|------------------|
| 1.20.1 | `1.0.0.x` | `Veil-fabric-1.20.1` | `shader_modifiers/*.txt` (old) |
| 1.20.4+ / 1.21.x | `3.x` / `4.x` | `veil-fabric-1.21` etc. | `shader_injection/*.json` (new) |

Check https://maven.blamejared.com/foundry/veil/ for exact artifact names and versions.

## Shader injection formats

### Old (1.20.x) — `pinwheel/shader_modifiers/<vanilla shader path>.txt`

```text
#version 330
#priority 1000
#include modid:utils

[FUNCTION main(0) HEAD]
// code injected at the start of main

[FUNCTION main(0) TAIL]
// code injected at the end of main
```

Target files mirror the vanilla path, e.g. `minecraft/shaders/core/rendertype_cutout.txt` under `shader_modifiers/`. `#replace modid:shader` swaps the shader entirely.

### New (1.21+) — `pinwheel/shader_injection/*.json`

```json
{
  "target": "minecraft:shaders/core/rendertype_solid.fsh",
  "redirect": "modid:my_inject.glsl"
}
```

```glsl
// globals go here (uniforms/helpers)
void tail() {
    fragColor.rgb = vec3(dot(fragColor.rgb, vec3(0.299, 0.587, 0.114)));
}
```

`void head()` / `void tail()` markers are required; code outside them is treated as globals.

## Common pitfalls

| Pitfall | Fix |
|---------|-----|
| Effect never runs | pipeline JSON invalid, or post-processing requires at least one valid stage |
| Black/feedback image | missing `out: veil:post` on the last stage; blit into a temp buffer then copy back |
| Shader loads but does nothing | wrong uniform name, or uniform not set from Java (`getUniform` returns null) |
| `ClassNotFound`/crash on server | `foundry.veil` used in common entrypoint — keep it client-only |
| Post shader samples nothing | `in` framebuffer omitted → samplers not populated; use `"in": "veil:post"` |
| Random crash on some GPUs | `required_features` unsupported, or integer/float format mismatch in framebuffers |

## Debugging

- Install ImGuiMC in dev; press F6 to inspect framebuffers, shaders, and dynamic buffers.
- Use the client command `/veilc buffers enable <type>` to toggle dynamic buffers in-game.
- Check the log for shader compile errors — Veil logs load failures instead of crashing the game.
- To sanity-check a pipeline, start from Veil's own `fog.json` and `blit_screen.fsh` (in the Veil jar under `assets/veil/pinwheel/`).

<!--
Source references:
- https://github.com/FoundryMC/Veil/wiki/ShaderInject
- https://github.com/FoundryMC/Veil/wiki/Home
-->
