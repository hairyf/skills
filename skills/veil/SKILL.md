---
name: veil
description: Foundry Veil (foundry.veil) — Minecraft Fabric/NeoForge GLSL shader and post-processing framework. Use when adding custom shaders, full-screen post-processing (VHS/CRT/noise/chromatic aberration), custom framebuffers, shader injection, or data-driven render effects to a Minecraft mod (e.g. Fabric 1.20.1 mods).
metadata:
  author: Hairy
  version: "2026.8.7"
---

# Veil (Foundry Veil)

Veil is a Fabric/NeoForge rendering framework that adds a data-driven GLSL pipeline to Minecraft: custom shader programs, JSON-defined post-processing pipelines, custom framebuffers, injection into vanilla shaders, and deferred-style dynamic buffers. It powers the VHS/CRT/noise post-processing in horror mods such as Minecraft Found Footage (SPBackrooms-Revamped).

## Key facts

| Item | Value |
|------|-------|
| GitHub / docs | `FoundryMC/Veil` (wiki in the repo), branch `1.20` for 1.20.1 |
| Maven | `https://maven.blamejared.com` — `foundry.veil:*` |
| Fabric dependency | `modImplementation("foundry.veil:veil-fabric-${mc}:${veil_version}")` |
| 1.20.1 version | `1.0.0.x` (check `https://maven.blamejared.com/foundry/veil/Veil-fabric-1.20.1/`) |
| Resource root | `assets/<modid>/pinwheel/` |
| Shader programs | `pinwheel/shaders/program/*.json` + `.vsh`/`.fsh`/`.comp`/`.gsh`/`.tcsh`/`.tesh` |
| Includes | `pinwheel/shaders/include/*.glsl` |
| Post pipelines | `pinwheel/post/*.json` (stages: `veil:blit`, `veil:copy`, `veil:mask`, `veil:depth_function`) |
| Framebuffers | `pinwheel/framebuffers/*.json` |
| Shader injection | `pinwheel/shader_injection/*.json` |
| Java API | `foundry.veil.api.client.render.*`, `foundry.veil.api.event.*`, `foundry.veil.fabric.event.*` |

## Quick start

```groovy
// build.gradle (Fabric)
repositories {
  maven { name = 'BlameJared Maven'; url = 'https://maven.blamejared.com' }
}
dependencies {
  modImplementation("foundry.veil:veil-fabric-${project.minecraft_version}:${project.veil_version}") {
    exclude group: "maven.modrinth"
    exclude group: "me.fallenbreath"
  }
}
```

```java
// Client entrypoint — update custom uniforms of a post pipeline each frame
public class MyModClient implements ClientModInitializer {
    public static final Identifier VHS_PIPELINE = new Identifier("mymod", "vhs");

    @Override
    public void onInitializeClient() {
        FabricVeilPostProcessingEvent.PRE.register((name, pipeline, context) -> {
            if (VHS_PIPELINE.equals(name)) {
                pipeline.setFloat("Time", (System.currentTimeMillis() % 2000) / 2000F);
            }
        });
    }
}
```

A post pipeline is mostly **data**: drop a JSON file in `assets/<modid>/pinwheel/post/`, reference a shader program, and Veil applies it after the world renders. See [core-post-processing](references/core-post-processing.md).

## References

### Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Setup | Dependency, `pinwheel` resource layout, versions, client init | [core-setup](references/core-setup.md) |
| Shaders | Shader programs, includes, uniforms, definitions, textures | [core-shaders](references/core-shaders.md) |
| Post-processing | Pipeline JSON, stages, priority/replace, wiring shaders | [core-post-processing](references/core-post-processing.md) |

### Features

| Topic | Description | Reference |
|-------|-------------|-----------|
| Framebuffers | Custom framebuffers + deferred dynamic buffers | [features-framebuffers](references/features-framebuffers.md) |
| Events & stages | Veil events, level-stage rendering, render-type stages | [features-events](references/features-events.md) |
| Shader injection | Inject/replace vanilla shaders without touching files | [features-shader-injection](references/features-shader-injection.md) |
| Runtime API | `setShader` binding, per-frame uniforms, definitions | [features-runtime](references/features-runtime.md) |
| Effects | VHS/CRT/noise/chromatic-aberration recipes | [features-effects](references/features-effects.md) |

### Best Practices

| Topic | Description | Reference |
|-------|-------------|-----------|
| Pitfalls | Client-only rendering, mapping differences, perf, versions | [best-practices](references/best-practices.md) |

## Source references

- https://github.com/FoundryMC/Veil
- https://github.com/FoundryMC/Veil/wiki
- https://maven.blamejared.com/foundry/veil/
