---
name: core-setup
description: GeckoLib 4.x dependencies, Blockbench workflow, resource layout, and version selection.
---

# Setup

## Dependencies (1.19.3 → 1.20.4)

```groovy
repositories {
    maven {
        name = 'GeckoLib'
        url 'https://dl.cloudsmith.io/public/geckolib3/geckolib/maven/'
        content {
            includeGroupByRegex("software\\.bernie.*")
            includeGroup("com.eliotlash.mclib")
        }
    }
}

dependencies {
    // Fabric
    modImplementation("software.bernie.geckolib:geckolib-fabric-${minecraft_version}:${geckolib_version}")
    implementation("com.eliotlash.mclib:mclib:20")

    // Forge instead:
    // implementation fg.deobf("software.bernie.geckolib:geckolib-forge-${minecraft_version}:${geckolib_version}")
}
```

```properties
# gradle.properties
geckolib_version=4.4.9    # 1.20.1 (up to 4.8.x exist; 4.5+ targets 1.20.6+)
```

`fabric.mod.json`:

```json
{
  "depends": {
    "minecraft": "~1.20.1",
    "geckolib": ">=4.4.9"
  }
}
```

Forge (≤1.20.4) additionally needs the SpongePowered mixin plugin: add `https://repo.spongepowered.org/repository/maven-public/` to `pluginManagement.repositories` and apply `id 'org.spongepowered.mixin' version '0.7.+'`.

## Blockbench workflow

1. Install the GeckoLib plugin in Blockbench (File → Plugins).
2. Create a model with entity/block/item settings, rig it, and make animations with keyframes.
3. Export: model → `geo/<name>.geo.json`, animations → `animations/<name>.animation.json`; save texture PNG separately.
4. Bedrock-style animation names (e.g. `move.walk`, `misc.idle`) referenced from Java must match exactly.

## Resource layout

```text
assets/<modid>/
├── geo/entity/<name>.geo.json            # Blockbench model
├── animations/entity/<name>.animation.json
└── textures/entity/<name>.png
```

The `GeoModel` methods (or defaulted model) must point at these paths. Subdirectories are allowed.

## Key points

- Maven group is `software.bernie.geckolib`; artifact is `geckolib-fabric-<mc>` / `geckolib-forge-<mc>`.
- Verify available versions via the cloudsmith maven-metadata for your MC version.
- 1.20.5+ is fully multiloader; ≤1.20.4 pick the platform artifact.

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/Installation-(Geckolib4)
- https://github.com/bernie-g/geckolib/wiki/Making-Your-Models-(Blockbench)
-->
