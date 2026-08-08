---
name: veil
description: Add advanced rendering to Minecraft mods with Veil — Veil 4.4.1 (MC 1.21.1) plus Veil 1.0.0.228 (MC 1.20.1): custom GLSL shaders, post-processing pipelines, JSON framebuffers, deferred lighting, data-driven particles (Quasar), animations (Graveyard/Necromancer), render types, in-world tooltips, OpenCL, and shader modification. Use when building Minecraft mod visuals, shaders, or game-engine-style rendering.
metadata:
  author: Hairy
  version: "2026.8.8"
  source: Generated from https://github.com/FoundryMC/Veil, scripts located at https://github.com/hairyf/skills
---

Veil is a rendering library for Minecraft mods (Fabric, Forge, NeoForge) that brings game-engine-level graphics to Java Minecraft: a full GLSL shader pipeline, JSON-driven framebuffers and post-processing, deferred lighting, data-driven particles and effects, procedural skeletal animation, and custom render types. Use these skills when adding shaders, post FX, lights, particles, animations, or custom render pipelines to a mod.

> The skill is based on Veil v4.4.1 (Minecraft 1.21.1) and Veil v1.0.0.228 (Minecraft 1.20.1), generated at 2026-08-07, v1 content added 2026-08-08.

## Core References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Setup & Resource Layout | Dependencies, maven repos, `pinwheel`/`quasar`/`flare` folders, hot reload, editors, commands | [core-getting-started](references/core-getting-started.md) |
| Shader Programs | Program JSON, shader stages, includes, definitions, textures, blending, required features | [core-shaders](references/core-shaders.md) |
| Uniforms & Uniform Blocks | Built-in uniforms, `#veil:buffer` blocks, uploading values from Java | [core-uniforms](references/core-uniforms.md) |
| Colors & Easings | `Color` utilities and the `Easing` helpers | [core-colors-easings](references/core-colors-easings.md) |

## Features

### Rendering Pipeline

| Topic | Description | Reference |
|-------|-------------|-----------|
| Framebuffers | Global JSON framebuffers, long/short forms, attachments, sampler aliases | [features-framebuffers](references/features-framebuffers.md) |
| Post-Processing | Pipeline JSON, stages (blit/copy/mask/depth), pipeline merging, fog example | [features-post-processing](references/features-post-processing.md) |
| Dynamic Buffers | Deferred-style buffers (albedo/normal/light), shader tags and flags | [features-dynamic-buffers](references/features-dynamic-buffers.md) |
| Deferred Lights | Point/area/directional/spot lights, custom light types, renderers, DDA occlusion | [features-lights](references/features-lights.md) |

### Render Types

| Topic | Description | Reference |
|-------|-------------|-----------|
| Data-Driven Render Types | JSON render types, vertex formats, modes, and all layer shards | [features-render-types](references/features-render-types.md) |
| Render Type Stages | Custom `RenderStateShard`s, fixed buffers, level-stage rendering, layered render types | [features-render-type-stages](references/features-render-type-stages.md) |

### Content Systems

| Topic | Description | Reference |
|-------|-------------|-----------|
| Quasar Particles | Data-driven particle emitters, shapes, settings, modules, spawning | [features-quasar](references/features-quasar.md) |
| Flare Effects | Data-driven effects: shells, properties, modifiers, templates, modules | [features-flare](references/features-flare.md) |
| Necromancer Animations | Skeletons, bones, animators, animations, skins, entity rendering | [features-necromancer](references/features-necromancer.md) |

### Shader & Vertex Extras

| Topic | Description | Reference |
|-------|-------------|-----------|
| Shader Injection | JSON injections with `head()`/`tail()`, redirect/replace, migration from old format | [features-shader-injection](references/features-shader-injection.md) |
| Vertex Arrays | Uploadable vertex buffers with custom attributes and multi-buffer layouts | [features-vertex-arrays](references/features-vertex-arrays.md) |
| Veil Events | Platform-independent and Forge/Fabric-specific Veil events | [features-events](references/features-events.md) |

## Best Practices

| Topic | Description | Reference |
|-------|-------------|-----------|
| Dev Workflow | Editor usage, hot swapping, debugging, integration patterns | [best-practices-workflow](references/best-practices-workflow.md) |
| Molang & Codecs | Molang expressions, codec-driven data files, registry extension points | [best-practices-molang-codecs](references/best-practices-molang-codecs.md) |

## Veil 1 (MC 1.20.1)

For projects pinned to **Veil 1.0.0.228 / Minecraft 1.20.1**, use these references — they document the v1 API (`foundry.veil.api.client.*`, `foundry.veil.api.quasar.*`, `foundry.veil.api.opencl.*`), not the v4 API. The current wiki describes Veil 4.x and is misleading for 1.20.1 projects.

| Topic | Description | Reference |
|-------|-------------|-----------|
| Getting Started | Maven, per-loader deps, resource layout, editors/hot reload, v1 vs v4 feature map | [v1-getting-started](references/v1-getting-started.md) |
| Shaders | Program JSON, stage extensions, includes, uniforms, definitions, textures | [v1-shaders](references/v1-shaders.md) |
| Framebuffers | JSON long/short forms, `dataType`, `FramebufferManager`, `AdvancedFbo` | [v1-framebuffers](references/v1-framebuffers.md) |
| Post-Processing | Pipeline JSON, blit/copy/mask/depth_function stages, `PostProcessingManager` | [v1-post-processing](references/v1-post-processing.md) |
| Render Types | JSON layer shards, Java-built/layered render types, v1 `VeilRenderType#get` caveat | [v1-render-types](references/v1-render-types.md) |
| Render Type Stages | `RenderTypeStageRegistry`, fixed buffers, level-stage rendering | [v1-render-type-stages](references/v1-render-type-stages.md) |
| Deferred Lights | `PointLight`/`AreaLight`/`DirectionalLight`, `LightRenderer`, deferred framebuffer | [v1-lights](references/v1-lights.md) |
| Quasar Particles | Emitter/module/particle-data JSON, shapes, spawning, custom modules | [v1-quasar](references/v1-quasar.md) |
| Animations | Keyframe/Path timeline system; Necromancer stub status in 1.0.0.228 | [v1-animations](references/v1-animations.md) |
| Graveyard Skeletons | `InterpolatedSkeleton`, bones, `AnimationProperties`, meshes, constraints | [v1-graveyard](references/v1-graveyard.md) |
| Colors & Easings | `Color`, filters, themes, easings.net curves | [v1-colors-easings](references/v1-colors-easings.md) |
| Poses | `ExtendedPose`/`PoseRegistry` custom item-use poses | [v1-poses](references/v1-poses.md) |
| In-World Tooltips | `Tooltippable`, worldspace/screenspace, themes, item holders | [v1-tooltips](references/v1-tooltips.md) |
| Events | `VeilEventPlatform` bridge + Forge/Fabric event classes | [v1-events](references/v1-events.md) |
| OpenCL | Environments, programs, kernels, buffers, event dispatch | [v1-opencl](references/v1-opencl.md) |
| Shader Modification | `shader_modifiers` layout, directives, injection commands | [v1-shader-modification](references/v1-shader-modification.md) |

Note: in 1.0.0.228 the Necromancer package is an unfinished stub, and JSON render types have no runtime getter yet — use the Graveyard system and Java-built render types instead.
