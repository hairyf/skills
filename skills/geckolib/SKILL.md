---
name: geckolib
description: GeckoLib Minecraft mod animation — GeckoLib 5 (1.21+) render-state pipeline plus GeckoLib 4.4.9 (1.20.1) API for Fabric/Forge/NeoForge: setup, entities, blocks, items, armor, replaced entities, animation controllers, Molang, render layers, textures, and data syncing. Use when working with GeckoLib animatables, .geo.json/.animation.json assets, or adding keyframe animations to a Minecraft mod.
metadata:
  author: Hairy
  version: "2026.8.8"
  source: Generated from https://github.com/bernie-g/geckolib, scripts at https://github.com/hairyf/skills
---

# GeckoLib

> Based on GeckoLib v5.5.3 (2026-06-27) and GeckoLib v4.4.9 (2024-08-30, MC 1.20.1), generated 2026-08-07, v4 content added 2026-08-08. Docs: https://wiki.geckolib.com (v5) + the GeckoLib 4 wiki (v4).

GeckoLib is an animation and rendering engine for Minecraft mods, available for Fabric, Forge, and NeoForge. It plays Blockbench/GeckoLib keyframe animations on entities, blocks, items, and armor, with 30+ easings, Molang math expressions, sound/particle/event keyframes, glowmasks, animated textures, and replaced-entity support. Since v5 it renders from immutable `RenderState` snapshots (Minecraft 1.21+ render pipeline); v4 (up to 4.4.9 for MC 1.20.1) renders directly from the animatable under the `software.bernie.geckolib` package with `geo/` + `animations/` asset folders.

## Preferences

- Prefer **automatic/defaulted GeoModels** over hand-written `GeoModel` classes; only use basic models for dynamic paths
- Prefer `DefaultAnimations` built-in controllers and `RawAnimation` instances over hand-rolled controllers
- Prefer controller-based animations over stateless animations (stateless is less efficient)
- Never mutate `GeoBone`s directly in v5 — use `BoneSnapshots`/`BoneUpdaters` via `RenderPassInfo`
- Cache `Identifier`s in GeoModels and memoize renderer suppliers in items/armor
- Pass render-time data through `DataTicket`s in `GeoRenderState`, never hold the live animatable at render time
- Keep client-only classes (renderers, layers) in client sources when using split sources

## Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Setup | Maven repo + dependency per loader, Blockbench plugin, asset file placement | [core-setup](references/core-setup.md) |
| Animatable Pattern | `AnimatableInstanceCache`, `registerControllers`, per-type interfaces | [core-animatable-interface](references/core-animatable-interface.md) |
| GeoModels | Automatic, Defaulted, and Basic models; v5 path rules | [core-geomodels](references/core-geomodels.md) |
| Animation Controllers | StateHandler/`AnimationTest`, `PlayState`, ordering, additive, `DefaultAnimations` | [core-animation-controller](references/core-animation-controller.md) |
| Keyframes & Molang | `AnimationPoint`/`Timeline`, Molang operators, functions, queries | [core-keyframes-and-molang](references/core-keyframes-and-molang.md) |
| Rendering | `GeoRenderState`, `DataTicket`s, `RenderPassInfo`, `BoneSnapshots`/`BoneUpdaters`, generics | [core-rendering](references/core-rendering.md) |

## Creating Animatables

| Topic | Description | Reference |
|-------|-------------|-----------|
| Entities | Entity class, renderer, registration, asset layout, common issues | [features-entities](references/features-entities.md) |
| Replaced Entities | Replacing vanilla entities with GeckoLib models | [features-replaced-entities](references/features-replaced-entities.md) |
| Blocks | Block/BlockEntity/renderer + required blockstate/model JSONs | [features-blocks](references/features-blocks.md) |
| Items | `GeoItem`/`GeoRenderProvider`, item JSONs, split sources, perspective-aware | [features-items](references/features-items.md) |
| Armor | `GeoArmorRenderer`, armor template bones, split sources | [features-armor](references/features-armor.md) |

## Features

| Topic | Description | Reference |
|-------|-------------|-----------|
| Triggerable Animations | One-shot `triggerAnim` from client/server, items/armor specifics | [features-triggerable-animations](references/features-triggerable-animations.md) |
| Stateless Animations | Controller-free play/stop API and interfaces | [features-stateless-animations](references/features-stateless-animations.md) |
| Keyframe Markers | Sound/particle/custom-instruction keyframes, `AutoPlayingSoundKeyframeHandler` | [features-keyframe-markers](references/features-keyframe-markers.md) |
| Glowmasks & Textures | `AutoGlowingGeoLayer`, `_glowmask` textures, animated `.mcmeta` textures | [features-glowmasks-and-textures](references/features-glowmasks-and-textures.md) |
| Render Layers | `GeoRenderLayer` + built-ins: held items, armor, bone textures, overlays | [features-render-layers](references/features-render-layers.md) |

## Migration & Examples

| Topic | Description | Reference |
|-------|-------------|-----------|
| Updating From v4 | Package moves, RenderState pipeline, generics, bone API changes | [updating-from-v4](references/updating-from-v4.md) |
| Examples | Official example mods by feature, copy-paste templates, real-world mod | [examples](references/examples.md) |

## GeckoLib 4 (MC 1.20.1)

For projects pinned to **GeckoLib 4.4.9 / Minecraft 1.20.1**, use these references — they document the `software.bernie.geckolib` API (not the v5 `com.geckolib` API) and the v4 asset layout (`geo/`, `animations/`). The official GeckoLib 5 wiki is misleading for 1.20.1 projects.

| Topic | Description | Reference |
|-------|-------------|-----------|
| Setup | Maven (`software.bernie.geckolib` group), per-loader deps, mclib, mixin plugin, asset folders | [v4-setup](references/v4-setup.md) |
| Animatable Pattern | `GeoAnimatable`, type interfaces, instance caches, controller registration, DataTickets | [v4-animatable-pattern](references/v4-animatable-pattern.md) |
| Geo Models | `GeoModel` + Defaulted models, path conventions, render type, Molang hooks, head tracking | [v4-geo-models](references/v4-geo-models.md) |
| Animation Controllers | Constructors, `PlayState`/`AnimationState`, `RawAnimation`, `DefaultAnimations`, transitions, easings, custom loop types | [v4-animation-controller](references/v4-animation-controller.md) |
| Entities | `GeoEntity` + `GeoEntityRenderer`, registration, common issues | [v4-entities](references/v4-entities.md) |
| Blocks | `GeoBlockEntity`, `ENTITYBLOCK_ANIMATED`, `GeoBlockRenderer`, directionality | [v4-blocks](references/v4-blocks.md) |
| Items | `GeoItem`, item display JSON, Forge/Fabric renderer registration, perspective-aware | [v4-items](references/v4-items.md) |
| Armor | `ArmorItem` + `GeoArmorRenderer`, `prepForRender`, bone mapping, full-set pattern | [v4-armor](references/v4-armor.md) |
| Replaced Entities | `GeoReplacedEntity`, `GeoReplacedEntityRenderer`, per-entity render hooks | [v4-replaced-entities](references/v4-replaced-entities.md) |
| Keyframe Triggers | Sound/particle/custom instruction keyframes, `AutoPlayingSoundKeyframeHandler` | [v4-keyframe-triggers](references/v4-keyframe-triggers.md) |
| Render Layers & Events | `GeoRenderLayer`, built-in layers, `DynamicGeoEntityRenderer`, `GeoRenderEvent` | [v4-render-layers](references/v4-render-layers.md) |
| Molang | Operators, functions, full query list, custom functions/queries, compound expressions | [v4-molang](references/v4-molang.md) |
| Textures | Glowmask/emissive textures, animated `.mcmeta` textures, limitations | [v4-textures](references/v4-textures.md) |
| Triggerable Animations | Server triggers, `SerializableDataTicket` data syncing, built-in tickets | [v4-triggerable-animations](references/v4-triggerable-animations.md) |
| v4 vs v5 | Coordinates/packages/asset paths/class renames/rendering pipeline mapping | [v4-vs-v5](references/v4-vs-v5.md) |

Note: stateless animations and the split-source `GeoRenderProvider` system did **not** exist in 4.4.9 — they arrived in 4.5/1.20.6+. Renderers must live in client source sets instead.

## Quick Reference

### Minimal animated entity

```java
public class ExampleEntity extends PathfinderMob implements GeoEntity {
    private final AnimatableInstanceCache geoCache = GeckoLibUtil.createInstanceCache(this);

    @Override
    public void registerControllers(final AnimatableManager.ControllerRegistrar controllers) {
        controllers.add(DefaultAnimations.genericWalkIdleController());
    }

    @Override
    public AnimatableInstanceCache getAnimatableInstanceCache() {
        return this.geoCache;
    }
}
```

```java
// Renderer registration
context -> new GeoEntityRenderer<>(context, EntityRegistry.EXAMPLE_ENTITY.get());
```

### Assets for `examplemod:example_entity`

```
assets/examplemod/geckolib/models/entity/example_entity.geo.json
assets/examplemod/geckolib/animations/entity/example_entity.animation.json
assets/examplemod/textures/entity/example_entity.png
```

### Dependency (Fabric)

```groovy
repositories {
    exclusiveContent {
        forRepository { maven { name = 'GeckoLib'; url = 'https://dl.cloudsmith.io/public/geckolib3/geckolib/maven/' } }
        filter { includeGroupAndSubgroups('com.geckolib') }
    }
}
dependencies {
    modImplementation "com.geckolib:geckolib-fabric-${minecraftVersion}:${geckolibVersion}"
}
```

Forge uses `implementation minecraft.dependency("com.geckolib:geckolib-forge-...")`; NeoForge uses `implementation "com.geckolib:geckolib-neoforge-..."` (optionally plus `interfaceInjectionData`).

### Key naming conventions

- Controller one animation at a time; multiple controllers for concurrent animation groups
- `DefaultAnimations` expects animation names like `misc.idle`, `move.walk`, `attack.swing`
- Glowmask textures: `<name>_glowmask.png`; animated textures: `<name>.png.mcmeta`
