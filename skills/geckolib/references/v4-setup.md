---
name: geckolib-v4-setup
description: Add GeckoLib v4.4.9 (MC 1.20.1) to a Fabric/Forge project — maven, dependency coordinates, Forge mixin setup, asset folder layout, and multiloader caveats.
---

# GeckoLib 4 Setup (4.4.9 / MC 1.20.1)

GeckoLib 4 lives under the `software.bernie.geckolib` package and is published per-loader for each Minecraft version. For MC 1.20.1 the last release is **4.4.9**; do **not** follow the GeckoLib 5 wiki dependency blocks (`com.geckolib:geckolib-...`) for a 1.20.1 project.

## Maven repository

```groovy
repositories {
    maven {
        name = 'GeckoLib'
        url = 'https://dl.cloudsmith.io/public/geckolib3/geckolib/maven/'
        content {
            includeGroupByRegex("software\\.bernie.*")
            includeGroup("com.eliotlash.mclib")
        }
    }
}
```

## Dependencies (1.19.3 → 1.20.4 template)

Fabric:

```groovy
dependencies {
    modImplementation("software.bernie.geckolib:geckolib-fabric-${minecraft_version}:${geckolib_version}")
    implementation("com.eliotlash.mclib:mclib:20")
}
```

Forge:

```groovy
dependencies {
    implementation fg.deobf("software.bernie.geckolib:geckolib-forge-${minecraft_version}:${geckolib_version}")
    implementation("com.eliotlash.mclib:mclib:20")
}
```

Forge also requires the Mixin plugin in `build.gradle`:

```groovy
plugins {
    id 'org.spongepowered.mixin' version '0.7.+'
}
```

And in `gradle.properties`:

```properties
minecraft_version=1.20.1
geckolib_version=4.4.9
```

NeoForge for 1.20.1 uses `software.bernie.geckolib:geckolib-neoforge-${minecraft_version}` the same way (mclib still required on 1.20.1).

## Multiloader caveat (≤1.20.4)

Before 1.20.5 GeckoLib publishes no common artifact. In a multiloader project, add the Forge **or** Fabric source as the dependency in your common module, and expect loader-specific handling for items/armor (renderer registration differs between Forge and Fabric).

## Asset folders (v4 layout)

Unlike v5, GeckoLib 4 models go in `geo/` and animations in `animations/` (no `geckolib/` prefix):

```
assets/<modid>/geo/entity/example_entity.geo.json
assets/<modid>/animations/entity/example_entity.animation.json
assets/<modid>/textures/entity/example_entity.png
```

Model files may be placed in any subfolder of `assets/<modid>/geo`; animation files in any subfolder of `assets/<modid>/animations`; textures in `assets/<modid>/textures`.

Models are made in Blockbench — install the **GeckoLib** plugin (it adds the geo/anim export formats and the "Animate Effects" keyframe panel). The v4 wiki and GeckoLib itself use Mojmap + Parchment; on Yarn mappings translate names via [Linkie](https://linkie.shedaniel.me/mappings).

## Dev-mode examples

GeckoLib 4 ships example entities/blocks/items/armor in development environments (package `software.bernie.example`). Disable them with a run-config property:

```groovy
property 'geckolib.disable_examples', 'true'
```

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/Installation-(Geckolib4)
- https://github.com/bernie-g/geckolib/tree/1.20.1 (v4.4.9, commit 25a41d73)
-->
