---
name: core-setup
description: Adding Veil to a Fabric/NeoForge mod — maven, dependency, versions, pinwheel resource layout, and client initialization.
---

# Veil Setup

## Add the dependency

```groovy
// build.gradle — repositories block
repositories {
  maven { name = 'BlameJared Maven (CrT / Bookshelf)'; url = 'https://maven.blamejared.com' }
  // For the dev-only ImGuiMC debug UI:
  maven { name = 'RyanHCode Maven'; url = 'https://maven.ryanhcode.dev/releases' }
}

dependencies {
  modImplementation("foundry.veil:veil-fabric-${project.minecraft_version}:${project.veil_version}") {
    exclude group: "maven.modrinth"
    exclude group: "me.fallenbreath"
  }
  // Optional, for the in-game framebuffer/light debug UI in dev:
  modImplementation("foundry.imguimc:imguimc-fabric-${project.minecraft_version}:${project.imguimc_version}")
}
```

```properties
# gradle.properties
veil_version=1.0.0.x   # check https://maven.blamejared.com/foundry/veil/Veil-fabric-1.20.1/
imguimc_version=...
```

For NeoForge use `implementation("foundry.veil:veil-neoforge-${mc}:${version}")` instead of `modImplementation`.

## Versions

| Minecraft | Veil artifact version | Notes |
|-----------|----------------------|-------|
| 1.20.1 | `1.0.0.x` (Fabric/Forge) | Branch `1.20`; used by SPBackrooms-Revamped |
| 1.21+ | `4.x` | Same `pinwheel` resources; Java API evolved |

## Resource layout

Everything lives under `assets/<modid>/pinwheel/`:

```
src/main/resources/assets/<modid>/pinwheel/
├── shaders/
│   ├── program/<name>.json + <name>.vsh|.fsh|.comp|.gsh|.tcsh|.tesh
│   └── include/<name>.glsl
├── post/<pipeline>.json
├── framebuffers/<buffer>.json
└── shader_injection/<injection>.json
```

Quasar particles (`assets/<modid>/quasar/`) and Flare effects (`assets/<modid>/flare/`) are separate roots.

## Client initialization

Veil is client-only. Register event listeners in a `ClientModInitializer` (Fabric) or the client setup (NeoForge):

```java
public class MyModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        FabricVeilPostProcessingEvent.PRE.register((name, pipeline, context) -> {
            // set per-frame uniforms here; see core-post-processing
        });
    }
}
```

## Key points

- No Veil code runs on a dedicated server; keep all Veil imports out of `ModInitializer` (server entrypoint).
- The dependency must be declared with `modImplementation` (Fabric) so it is shaded/loaded as a mod.
- The wiki examples use Mojang mappings; translate to Yarn names (`Identifier`, `MatrixStack`, `World`) in Yarn projects.

<!--
Source references:
- https://github.com/FoundryMC/Veil/wiki/Home
- https://github.com/FoundryMC/Veil/wiki/Shader
- https://github.com/FoundryMC/Veil/wiki/PostProcessing
- https://maven.blamejared.com/foundry/veil/
-->
