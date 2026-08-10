---
name: geckolib-setup
description: Adding GeckoLib 5 to a Minecraft mod project (Fabric/Forge/NeoForge), installing the Blockbench plugin, and placing asset files.
---

# GeckoLib Project Setup

GeckoLib 5 is distributed as a per-loader, per-Minecraft-version artifact under the `com.geckolib` group. All three major loaders (Fabric, Forge, NeoForge) use the same Cloudsmith Maven repository.

## Finding the version

Pick the GeckoLib version for your Minecraft version + loader from the [CurseForge page](https://www.curseforge.com/minecraft/mc-mods/geckolib) (Files tab) or [Modrinth](https://modrinth.com/mod/geckolib) (Versions tab). Filter by your Minecraft version (e.g. `1.21.11`, `26.1`) and loader.

## Repository

Add GeckoLib's Maven repository to the `repositories` block of `build.gradle` (NOT the one inside `publishing` or `buildscript`):

```groovy
repositories {
    exclusiveContent {
        forRepository {
            maven {
                name = 'GeckoLib'
                url = 'https://dl.cloudsmith.io/public/geckolib3/geckolib/maven/'
            }
        }
        filter { includeGroupAndSubgroups('com.geckolib') }
    }
}
```

Kotlin DSL equivalent: `url = uri("...")` and `includeGroupAndSubgroups("com.geckolib")`.

The Maven URL is intentionally not browsable (returns 404). Browse packages at `https://cloudsmith.io/~geckolib3/repos/geckolib/packages/` instead.

## Dependency

Declare `geckolibVersion` in `gradle.properties` (or a `geckolib` entry in `libs.versions.toml`), plus a `minecraftVersion` property, then add the artifact per loader:

| Loader | Groovy dependency | Notes |
|---|---|---|
| Fabric | `modImplementation "com.geckolib:geckolib-fabric-${minecraftVersion}:${geckolibVersion}"` | |
| Forge | `implementation minecraft.dependency("com.geckolib:geckolib-forge-${minecraftVersion}:${geckolibVersion}")` | Requires ForgeGradle 7 |
| NeoForge | `implementation "com.geckolib:geckolib-neoforge-${minecraftVersion}:${geckolibVersion}"` | Optionally add `interfaceInjectionData` (see below) |

With a version catalog (`libs.versions.toml`):

```toml
[versions]
geckolib = "5.5.3"

[libraries]
geckolib = { group = "com.geckolib", name = "geckolib-fabric-26.1", version.ref = "geckolib" }
```

Then `modImplementation libs.geckolib`. Change `26.1` to your actual Minecraft version.

### NeoForge interface injections (optional)

NeoForge ModDevGradle users can add compile-time interface injections so GeckoLib's interfaces are visible on vanilla classes:

```groovy
interfaceInjectionData "com.geckolib:geckolib-neoforge-${minecraftVersion}:${geckolibVersion}"
```

## Blockbench plugin

GeckoLib models are created in Blockbench with the official plugin.

1. In Blockbench: `File` → `Plugins` → `Available` tab
2. Search for `GeckoLib`, install **GeckoLib Models & Animations**

Plugin settings (in the GeckoLib plugin window's `Settings` tab):

- **Auto-compute block/item particle texture** — auto-create particle texture references on export
- **Bake in bezier keyframes** — export bezier-interpolated keyframes as discrete linear keyframes
- **Always show display tab** — force the Display tab visible
- **Remember file export locations** — remember export paths, stored in the `.bbmodel` file
- **Default Mod ID** — used for exporting texture/asset paths

Create a model via `File` → `New Project` → `GeckoLib Animated Model`. For armor choose the `Armor` model type template and only add cubes inside the `armor`-prefixed bones.

Export:

- Model: `File` → `Export` → `Export GeckoLib Model`
- Animations: `File` → `Export` → `Export GeckoLib Animations`
- Display settings: `File` → `Export` → `Export GeckoLib Display Settings`
- Texture: right-click the texture → `Save As`

## Asset file placement (GeckoLib 5)

Since v5, model and animation files live under a dedicated `geckolib/` asset folder:

| Asset | Path |
|---|---|
| Model | `assets/<modid>/geckolib/models/<path>.geo.json` |
| Animations | `assets/<modid>/geckolib/animations/<path>.animation.json` |
| Texture | `assets/<modid>/textures/<path>.png` |

Subfolders are allowed everywhere; the `.geo` and `.animation` filename suffixes are optional in v5. `DefaultedGeoModel` classes add automatic subfolders (see [GeoModels](core-geomodels.md)).

<!--
Source references:
- https://wiki.geckolib.com/docs/geckolib5/setup/fabric/quick-reference
- https://wiki.geckolib.com/docs/geckolib5/setup/forge/quick-reference
- https://wiki.geckolib.com/docs/geckolib5/setup/neoforge/quick-reference
- https://wiki.geckolib.com/docs/geckolib5/setup/blockbench/the-plugin
- https://wiki.geckolib.com/docs/geckolib5/making-models/exporting-the-files
- https://wiki.geckolib.com/docs/geckolib5/making-models/placing-the-files
-->
