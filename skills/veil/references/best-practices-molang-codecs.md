---
name: best-practices-molang-codecs
description: Use Molang expressions and Veil's codec-driven registries and extension points correctly.
---

# Molang & Codec-Driven Data

## Molang

Veil uses the Molang expression language in several JSON systems:

- **Framebuffers**: `"width": "q.screen_width"`, `"height": "q.screen_height"`.
- **Quasar modules**: `interpolant` and value fields like `"brightness": "3 - q.agePercent * 3"`, `"size": "0.1 - q.agePercent * 0.1"`. Common queries include `q.agePercent` (0..1 lifetime progress); more are listed in `QuasarParticle`.
- **Flare**: curve nodes and property values.

Write expressions that stay valid for a particle's full lifetime (0..1), and keep time-based values bounded to avoid NaN/infinity.

## Codec-Driven Files

All Veil resource files (particles, effects, framebuffers, post pipelines, render types) are decoded with Mojang codecs:

- When a JSON field is unknown, read the corresponding codec class in the Veil repo (e.g. `ParticleEmitterData`, `QuasarParticleData`, `EmitterShapeSettings`).
- For vanilla codec fields, look them up with Linkie (`mojang_raw` mappings for your MC version).
- Add new field types (Flare property/modifier types) via the mod-prefixed convention `"modid:type"` and register your codec.

## Extension Points

| Registry | Extends |
|----------|---------|
| `LightTypeRegistry` | Custom light types + renderers |
| `ParticleModuleTypeRegistry` | Custom Quasar modules |
| `PostPipelineStageRegistry` | Custom post stages |
| `RenderTypeShardRegistry` | Custom render type shards |
| `RenderTypeLayerRegistry` | Custom render type layers |
| `PropertyRegistry` / `PropertyModifierRegistry` | Flare properties/modifiers |
| `VeilShaderBufferRegistry` | Custom uniform blocks |
| `VeilResourceEditorRegistry` | Custom resource editors |

Register through the matching `VeilRegister*` event or the registry API; loaders may expose equivalent Fabric/Forge entry points.

<!--
Source references:
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/Quasar.md
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/Flare.md
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/Framebuffer.md
-->
