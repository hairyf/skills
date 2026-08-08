---
name: veil-v1-getting-started
description: Set up Veil 1.0.0.228 (MC 1.20.1) — maven, dependency per loader, resource layout, in-game editors, and what does/doesn't exist in v1.
---

# Veil 1 Getting Started (1.0.0.228 / MC 1.20.1)

Veil 1 is the 1.20.1-era API. The published version for your project is `foundry.veil:...-1.20.1:1.0.0.228`. Do **not** follow the current (v4.4.x / MC 1.21.1) wiki dependency blocks or `foundry.veil.api.client.render.light.data.LightData`-style APIs — those don't exist in v1.

## Maven & dependencies

```groovy
repositories {
    maven {
        name = 'BlameJared Maven (CrT / Bookshelf)'
        url = 'https://maven.blamejared.com'
    }
}
```

Fabric:

```groovy
dependencies {
    modImplementation("foundry.veil:veil-fabric-1.20.1:1.0.0.228") {
        exclude group: "maven.modrinth"
    }
}
```

Forge:

```groovy
dependencies {
    implementation fg.deobf("foundry.veil:veil-forge-1.20.1:1.0.0.228") {
        exclude group: "maven.modrinth"
    }
}
```

Multi-loader common: `foundry.veil:veil-common-1.20.1:1.0.0.228`. No ImGuiMC dependency is required before Veil 4.0.0 — the in-game editor is bundled.

## Resource layout

Everything lives under `assets/<modid>/pinwheel/`:

```
pinwheel/shaders/program/       Shader program JSON + GLSL stages
pinwheel/shaders/include/       Shared .glsl includes
pinwheel/shader_modifiers/      Shader injection scripts
pinwheel/framebuffers/          Global framebuffer JSON
pinwheel/post/                  Post-processing pipeline JSON
pinwheel/rendertypes/           Data-driven render type JSON
```

Quasar particles are the exception: `assets/<modid>/quasar/`.

## In-game editors & hot reload

- Press **F6** (default) to open the Veil editor window.
- The **Resource** tab is a resource browser: right-click any text file → **Open in Veil Text Editor** to edit in-game.
- After editing, save and press **F3+T** (or use the reload button) to reload resources — shaders, framebuffers, pipelines, and particles update at runtime.
- The **Renderer** editor tab lists framebuffers, lights, and pipeline info.

## v1 vs v4 feature map (what exists in 1.0.0.228)

| Feature | v1 (1.0.0.228) |
|---|---|
| Custom GLSL shaders | Yes — `foundry.veil.api.client.render.shader` |
| Framebuffers | Yes — `FramebufferManager`, JSON with `dataType` field |
| Post-processing | Yes — blit/copy/mask/depth_function stages |
| Deferred lights | Yes — `PointLight`/`AreaLight`/`DirectionalLight` (no DDA occlusion) |
| Data-driven render types | JSON parsed, but **no `VeilRenderType#get` yet** — build render types in Java |
| Render type stages / fixed buffers | Yes — `RenderTypeStageRegistry`, fixed-buffer event |
| Quasar particles | Yes — codec-driven JSON under `quasar/` |
| Necromancer | **Stub only** — not usable in 1.0.0.228 |
| Graveyard (interpolated skeletons) | Yes — `foundry.veil.api.client.graveyard` |
| Keyframe paths & poses | Yes — `client.anim` + `ExtendedPose`/`PoseRegistry` |
| In-world tooltips | Yes — `Tooltippable` |
| OpenCL | Yes — `foundry.veil.api.opencl` |
| Shader modification | Yes — `pinwheel/shader_modifiers` |

<!--
Source references:
- https://github.com/FoundryMC/Veil.wiki (Home, 2024-12-02 revision)
- https://github.com/FoundryMC/Veil/tree/1.20 (Veil 1.0.0.228, maven metadata 2024-06-13)
-->
