---
name: geckolib-v4-vs-v5
description: Map GeckoLib 4.4.9 (1.20.1) to GeckoLib 5 — dependency coordinates, package moves, class renames, asset paths, and rendering pipeline differences.
---

# GeckoLib 4 vs 5: What Changes

Use this when you have v4.4.9 (MC 1.20.1) code and need to check against v5 docs, or when migrating.

## Coordinates & packages

| | GeckoLib 4 (4.4.9 / 1.20.1) | GeckoLib 5 (5.x / 1.21+) |
|---|---|---|
| Maven group | `software.bernie.geckolib` | `com.geckolib` |
| Artifact example | `geckolib-fabric-1.20.1:4.4.9` | `geckolib-fabric-1.21.1` / `geckolib-fabric-1.21.6` |
| Extra dep | `com.eliotlash.mclib:mclib:20` | none |
| Base package | `software.bernie.geckolib` (+ `.core`) | `com.geckolib` |
| Common module | none published (≤1.20.4) | published for all loaders |

## Asset paths

| Asset | v4 | v5 |
|---|---|---|
| Model | `assets/<modid>/geo/...` | `assets/<modid>/geckolib/models/...` |
| Animation | `assets/<modid>/animations/...` | `assets/<modid>/geckolib/animations/...` |
| Texture | `assets/<modid>/textures/...` | `assets/<modid>/textures/...` (usually `geckolib/models`-relative too) |

## Class renames (v4 → v5)

| v4 | v5 |
|---|---|
| `GeoModel` + `getModelResource/getTextureResource/getAnimationResource` | `GeoModel` + `getModel/...` (automatic/Defaulted models, different method set) |
| `RawAnimation.begin().thenPlay(...)` | `RawAnimation.begin().thenPlay(...)` (same chain API) |
| `AnimationController<>(this, name, ticks, handler)` | same constructors |
| `AnimationState#getData(DataTicket)` | `GeoRenderState#getData(DataTicket)` |
| `GeoEntityRenderer<E>` | `GeoEntityRenderer<E, R extends LivingEntityRenderState & GeoRenderState>` |
| `GeoItemRenderer` via `createRenderer`/`RenderProvider` | `createGeoRenderer`/`GeoRenderProvider` |
| `GeoBlockRenderer(GeoModel)` | `GeoBlockRenderer(context, ...)` render-state based |
| `DefaultAnimations.genericWalkIdleController(this)` | `DefaultAnimations.genericWalkIdleController()` |
| `software.bernie.geckolib.constant.DefaultAnimations` | `com.geckolib.animation.DefaultAnimations` |
| `software.bernie.geckolib.network.SerializableDataTicket` | `com.geckolib.network.SerializableDataTicket` (same pattern) |

## Rendering pipeline

- **v5 renders from immutable `RenderState` snapshots** (Minecraft 1.21+ `LivingEntityRenderState`); you never touch the live entity at render time. v4 renders directly from the animatable with `PoseStack`/`VertexConsumer` in hand.
- v5 forbids mutating `GeoBone`s directly at render time (`BoneSnapshots`/`BoneUpdaters` via `RenderPassInfo`); v4 code freely manipulates bones/pose in renderers and layers.
- v5 moved render-layer registration and most per-frame hooks into `GeoRenderState`/`RenderPassInfo`; v4 uses `addRenderLayer` in the renderer constructor and overrides `preRender`/`postRender`.
- v5 item/armor renderers are supplied via `createGeoRenderer(Consumer<GeoRenderProvider>)`; v4 uses `createRenderer(Consumer<Object>)` (Fabric) or `initializeClient` (Forge).

## What stayed the same

- Animatable pattern: `AnimatableInstanceCache` via `GeckoLibUtil.createInstanceCache(this)` + `registerControllers`.
- Controller concepts: one animation per controller, `PlayState`, transitions, easings, `triggerableAnim`/`triggerAnim`, `DefaultAnimations` naming conventions.
- Molang expression language and most queries.
- Glowmask textures (`_glowmask.png`) and animated `.mcmeta` textures.

## v3 → v4 rename table (for old code)

If you're upgrading from GeckoLib 3.x, the 4.0 overhaul renamed most classes: `AnimationData` → `AnimatableManager`, `AnimationFactory` → `AnimatableInstanceCache`, `AnimationBuilder` → `RawAnimation`, `IAnimatable` → `GeoAnimatable`, `AnimatedGeoModel` → `GeoModel`, `AnimationEvent` → `AnimationState`, `ILoopType` → `Animation$LoopType`, `IGeoRenderer` → `GeoRenderer`, `GeoLayerRenderer` → `GeoRenderLayer`, `ExtendedGeoEntityRenderer` → `DynamicGeoEntityRenderer`, `LayerGlowingAreasGeo` → `AutoGlowingGeoLayer`. Animatable classes also switched to typed interfaces (`GeoEntity`, `GeoItem`, ...) and caches are created via `GeckoLibUtil.createInstanceCache`.

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/Geckolib-4-Changes
- https://wiki.geckolib.com (GeckoLib 5 docs)
- https://github.com/bernie-g/geckolib/tree/1.20.1 (v4.4.9) and main (v5.5.3)
-->
