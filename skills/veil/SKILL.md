---
name: veil
description: Add advanced rendering to Minecraft Fabric/NeoForge mods with Veil — custom GLSL shaders, post-processing pipelines, JSON framebuffers, deferred lighting, data-driven particles (Quasar), effects (Flare), animations (Necromancer), render types, and shader injection. Use when building Minecraft mod visuals, shaders, or game-engine-style rendering.
metadata:
  author: Hairy
  version: "2026.8.7"
  source: Generated from https://github.com/FoundryMC/Veil, scripts located at https://github.com/hairyf/skills
---

Veil is a rendering library for Minecraft 1.21.1+ mods (Fabric and NeoForge) that brings game-engine-level graphics to Java Minecraft: a full GLSL shader pipeline, JSON-driven framebuffers and post-processing, deferred lighting, data-driven particles and effects, procedural skeletal animation, and custom render types. Use these skills when adding shaders, post FX, lights, particles, animations, or custom render pipelines to a mod.

> The skill is based on Veil v4.4.1 (Minecraft 1.21.1), generated at 2026-08-07.

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

