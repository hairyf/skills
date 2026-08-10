---
name: core-getting-started
description: Add Veil to a Minecraft mod — dependencies, maven repos, resource layout, hot reload, editor, and commands.
---

# Getting Started with Veil

Veil is a client-side rendering library for Minecraft 1.21.1 (range `[1.21.1, 1.21.3]`), current version 4.4.1, built for both Fabric and NeoForge. It needs a separate ImGuiMC mod in development for its in-game editors.

## Dependencies

Add the BlameJared maven (Veil) and RyanHCode maven (ImGuiMC), then depend on the loader-specific artifact `foundry.veil:veil-{fabric|neoforge|common}-${minecraft_version}:${veil_version}`:

```groovy
repositories {
    maven { url = "https://maven.ryanhcode.dev/releases"; name = "RyanHCode Maven" }
    maven { name = 'BlameJared Maven'; url = 'https://maven.blamejared.com' }
}

dependencies {
    // Fabric
    modImplementation("foundry.veil:veil-fabric-${project.minecraft_version}:${project.veil_version}") {
        exclude group: "maven.modrinth"
        exclude group: "me.fallenbreath"
    }
    modImplementation("foundry.imguimc:imguimc-fabric-${project.minecraft_version}:${project.imguimc_version}")

    // NeoForge uses implementation(...) + imguimc-neoforge-..., common uses implementation(...) + imguimc-common-...
}
```

To ship Veil inside your own mod jar (common for mods like MinecraftFoundFootage), disable transitive resolution and include it:

```groovy
modImplementation("foundry.veil:veil-fabric-${project.minecraft_version}:${project.veil_version}") { transitive = false }
include("foundry.veil:veil-fabric-${project.minecraft_version}:${project.veil_version}") { transitive = false }
```

## Resource Layout

All Veil resources live under `assets/{modid}/`:

| Folder | Content |
|--------|---------|
| `pinwheel/shaders/program` | Shader program definitions (`.json` + stage files) |
| `pinwheel/shaders/include` | Shareable GLSL includes (`.glsl`) |
| `pinwheel/framebuffers` | Global framebuffers |
| `pinwheel/rendertypes` | Data-driven render types |
| `pinwheel/post` | Post-processing pipelines |
| `pinwheel/shader_injection` | Shader injections |
| `quasar/` | Quasar particles (emitters, modules) |
| `flare/` | Flare effects (shells, templates, modules) |

Put these folders in your mod's resources (no separate resource pack needed). Resource-pack users can override them the same way.

## Workflow Tools

- **Editor menu:** press `F6` (with ImGuiMC installed) to open the Veil editor — Renderer/Lights, Resources, and the Quasar particle editor (Veil >= 4.3.0).
- **Hot reload:** press `F3+T` after editing JSON/GLSL to reload resource packs and recompile shaders.
- **Commands:** `/veilc buffers enable <type>` enables dynamic buffers client-side; `/quasar <particleemitter> <position>` spawns a Quasar particle (client-side only).
- The in-game Veil text editor/resource browser is currently disabled — use an external editor with hot swapping.

## Reference Material

- Official wiki: `wiki/` in the Veil repo (mirrored at https://github.com/FoundryMC/Veil/wiki)
- Javadocs: https://foundrymc.github.io/Veil/
- Example mod: https://github.com/FoundryMC/veil-example-mod (shaders, render types, framebuffers, Necromancer entities, fog resource pack)

<!--
Source references:
- https://github.com/FoundryMC/Veil/blob/1.21/README.md
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/Home.md
- https://github.com/FoundryMC/veil-example-mod
- https://github.com/SpacePotatoee/MinecraftFoundFootage
-->

