---
name: fabric-getting-started
description: Scaffolding a Fabric mod project, IDE setup, launch, sources, build, and shared tips.
---

# Getting Started with a Fabric Mod Project

## Project Generation

Use the official [Fabric Template Mod Generator](https://fabricmc.net/develop/template/) (recommended) or clone `https://github.com/FabricMC/fabric-example-mod.git` manually.

Rules for the project path: avoid cloud-sync folders (OneDrive), non-ASCII characters, and spaces. Example good path: `C:\Projects\YourProjectName`.

The package name must be lowercase, dot-separated, and unique (reverse domain, e.g. `com.example.my_mod`). Remember your **mod id** (`example-mod` in docs) — it appears in file paths like `resources/assets/<mod-id>/`.

The generator supports Kotlin, Kotlin buildscripts, and data generation under **Advanced Options**. For a modern client/common split, enable "Split client and common sources" so client-only code lives in `src/client`.

After generating/cloning:

- Delete the `.git` folder from a cloned example mod.
- Modify `gradle.properties` (`maven_group`, `archive_base_name`) and `fabric.mod.json` (`id`, `name`, `description`).
- Query current versions (Minecraft, mappings, Loader, Loom, API) on https://fabricmc.net/develop/.

## Toolchain Requirements

- **JDK 25** for Minecraft 26.1+ (`java.toolchain` / `options.release = 25`).
- **Gradle** via the wrapper (`./gradlew`); IntelliJ IDEA is recommended, VS Code works with the right extensions.
- **Fabric Loom** Gradle plugin: `net.fabricmc.fabric-loom` for unobfuscated versions (26.1+), `net.fabricmc.fabric-loom-remap` for obfuscated versions (1.21.11 and older).

## IDE Workflow

Open the folder as a Gradle project and import the Gradle build when prompted. Loom auto-generates run configurations for `Minecraft Client` / `Minecraft Server`.

- **Launch**: run the `Minecraft Client` configuration in Debug mode for breakpoints and hotswap.
- **Generate sources**: run the `genSources` task (or IDE action) to decompile Minecraft for navigation. Regenerate after changing mappings/access wideners.
- **Build**: `./gradlew build` (Windows: `./gradlew.bat build`) — JARs land in `build/libs`; use the shortest-named JAR for distribution.
- **Reload assets**: press `F3+T`; reload datapack data with `/reload`.

## Hotswap

Start in **Debug** mode, then use `Build > Build Project` to apply limited code changes at runtime. Mixins need special run configuration setup to hotswap. Asset/data changes reload without restarting via `F3+T` and `/reload`.

## Key Points

- Always regenerate IDE run configs after Gradle changes (`runConfigs.configureEach { ideConfigGenerated = true }`).
- Use your mod id as the logger name so logs are attributable.
- Keep the reference Example Mod (`FabricMC/fabric-docs`, `reference/latest`) handy — every doc snippet exists there as compilable code.

<!--
Source references:
- https://docs.fabricmc.net/develop/getting-started/creating-a-project
- https://docs.fabricmc.net/develop/getting-started/setting-up
- https://docs.fabricmc.net/develop/getting-started/opening-a-project
- https://docs.fabricmc.net/develop/getting-started/launching-the-game
- https://docs.fabricmc.net/develop/getting-started/generating-sources
- https://docs.fabricmc.net/develop/getting-started/building-a-mod
- https://docs.fabricmc.net/develop/getting-started/tips-and-tricks
-->
