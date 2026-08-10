---
name: geckolib
description: GeckoLib 4.x (software.bernie.geckolib) — Minecraft entity/block/item/armor animation driven by Blockbench JSON models and keyframe animations. Use when adding animated mobs, animated blocks (furnaces, radios, tape decks), animated items, or armor to a Fabric/Forge mod.
metadata:
  author: Hairy
  version: "2026.8.7"
---

# GeckoLib (4.x)

GeckoLib animates entities, blocks, items and armor with Blockbench `.geo.json` models + `.animation.json` keyframes, driven from Java by `AnimationController`s. No manual model layers or mesh definitions — the renderer handles everything.

## Key facts

| Item | Value |
|------|-------|
| Package (4.x) | `software.bernie.geckolib` (3.x was `software.bernie.geckolib3`) |
| Maven | `https://dl.cloudsmith.io/public/geckolib3/geckolib/maven/` |
| Fabric dep | `modImplementation "software.bernie.geckolib:geckolib-fabric-${minecraft_version}:${geckolib_version}"` |
| 1.20.1 version | `4.4.9` |
| Core interfaces | `GeoEntity`, `GeoModel`, `GeoEntityRenderer` (blocks/items/armor have their own) |
| Assets | `assets/<modid>/geo/`, `animations/`, `textures/` |
| Modeling | Blockbench + GeckoLib plugin (Bedrock format export) |

## Quick start (Fabric 1.20.1, Yarn mappings)

```groovy
// build.gradle
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
    modImplementation("software.bernie.geckolib:geckolib-fabric-${minecraft_version}:${geckolib_version}")
    implementation("com.eliotlash.mclib:mclib:20") // required for 1.19.3-1.20.4
}
```

```properties
# gradle.properties
geckolib_version=4.4.9
```

1. Model + animate in Blockbench (GeckoLib plugin), export `.geo.json` / `.animation.json` / `.png`.
2. Entity implements `GeoEntity` (cache + controllers); renderer extends `GeoEntityRenderer`; model extends `GeoModel`.
3. Register the entity (server) and the renderer (client: `EntityRendererRegistry.register(...)`).

## References

### Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Setup | Dependencies, Blockbench export, resource layout, versions | [core-setup](references/core-setup.md) |
| Animation controllers | `AnimationController`, `PlayState`, `RawAnimation`, triggers, `DefaultAnimations` | [core-animation-controller](references/core-animation-controller.md) |
| Models | `GeoModel`, defaulted models, resource paths | [core-models](references/core-models.md) |

### Features

| Topic | Description | Reference |
|-------|-------------|-----------|
| Custom entities | Full animated-entity walkthrough (class → model → renderer → registration → JSON) | [features-entities](references/features-entities.md) |
| Other animatables | Blocks, items, armor + keyframe triggers (sound/particle/instruction) | [features-animatables](references/features-animatables.md) |
| Best practices | 4.x vs 3.x differences, common crashes, server sync | [best-practices](references/best-practices.md) |

## Source references

- https://github.com/bernie-g/geckolib/wiki (Geckolib-Entities, The-Animation-Controller, Geo-Models, Triggerable-Animations, Geckolib-4-Changes)
- https://github.com/bernie-g/geckolib
- https://dl.cloudsmith.io/public/geckolib3/geckolib/maven/
