---
name: geckolib-updating-from-v4
description: Migrating a GeckoLib 4 mod to GeckoLib 5 — package changes, RenderState pipeline, generics, asset paths, bone snapshots, and removed APIs.
---

# Updating From GeckoLib 4

GeckoLib 5 was a full overhaul forced by Mojang's 1.21+ rendering changes (render thread separated from game thread, immutable render tasks). Adapt your code to the RenderState pipeline.

## Package change

GeckoLib 5.x (from 5.5) moved the base package from `software.bernie.geckolib` to **`com.geckolib`**. Update all imports.

## Conceptual changes

- **The animatable is not accessible at render time.** All renderers operate on a `RenderState`; the entity/item/etc. is only available during extraction.
- **No perpetual state between render passes** — renderers, Molang, and animation pipelines are instance-based.
- **All render data must be pre-computed** before submission.
- Two stages per render: (1) extract data into `GeoRenderState` (`GeoRenderer#addRenderData`, `GeoModel#addAdditionalStateData`, `GeoRenderLayer#addRenderData`), (2) render from that state.

## AnimationState → AnimationTest

Controller predicates now receive `AnimationTest` instead of GeckoLib 4's `AnimationState` (which was confused with vanilla's class). API is otherwise similar (`setAndContinue`, `PlayState`).

## New generic types

`GeoRenderer`/`GeoRenderLayer` now take `<T, O, R>`:

- `T` — animatable type
- `O` — associated data used when extracting the render state (`Void` if none)
- `R` — `RenderState` type, must extend `GeoRenderState`

Explicitly define `R` in new `GeoBlockRenderer`/`GeoArmorRenderer`/`GeoEntityRenderer` subclasses, e.g. `R extends LivingEntityRenderState & GeoRenderState`.

## Asset paths

- Models: move `.geo.json` to `assets/<modid>/geckolib/models/`
- Animations: move `.animation.json` to `assets/<modid>/geckolib/animations/`
- `getModelResource`/`getAnimationResource` no longer take the `geckolib/models` / `geckolib/animations` prefix or the `.geo.json` / `.animation.json` suffixes — return the bare identifier.
- `getTextureResource` still needs the full path with `textures` prefix and `.png` suffix.

## Bone manipulation

- `GeoBone`s are now immutable. Direct mutation is no longer possible.
- All bone changes go through **`BoneSnapshots`** (override `adjustModelBonesForRender`) or **`BoneUpdaters`** (add to `RenderPassInfo` before `submitRenderTasks`).
- Snapshots are computed once per render pass and discarded afterwards — no leakage between animatables.
- Bone position listeners (`RenderPassInfo#addBonePositionListener`) replace ad-hoc world-position lookups during render; store positions, don't use them inside the listener.

## Molang variables

Molang `MathValue`s changed from `DoubleSupplier` to `ToDoubleFunction<ControllerState>`, so queries are dynamic within an instance-based pipeline. Query values can no longer be updated at arbitrary render times.

## Removed / replaced features

- **`Dynamic*Renderer`s removed** (`DynamicGeoEntityRenderer`, `DynamicGeoItemRenderer`, `DynamicGeoBlockRenderer`) → use `CustomBoneTextureGeoLayer`.
- **`.mcmeta` glowmasks removed** → texture-based `_glowmask` files with `AutoGlowingGeoLayer`; base textures are no longer modified.
- `RenderPassInfo` now bundles renderer, state, pose stack, baked model, camera state, updaters/listeners, and per-bone render callbacks.

## What didn't change

- Entity/block/item/armor registration is still vanilla modloader territory.
- `AnimatableInstanceCache` + `registerControllers` pattern remains.
- Blockbench workflow (model/export/placement) is the same, only target folders changed.

<!--
Source references:
- https://wiki.geckolib.com/docs/geckolib5/updating/introduction
- https://wiki.geckolib.com/docs/geckolib5/updating/important/conceptual-changes
- https://wiki.geckolib.com/docs/geckolib5/updating/important/animationcontroller
- https://wiki.geckolib.com/docs/geckolib5/updating/important/animationstate
- https://wiki.geckolib.com/docs/geckolib5/updating/important/generic-types
- https://wiki.geckolib.com/docs/geckolib5/updating/important/asset-paths
- https://wiki.geckolib.com/docs/geckolib5/updating/important/renderstates
- https://wiki.geckolib.com/docs/geckolib5/updating/important/renderpassinfo
- https://wiki.geckolib.com/docs/geckolib5/updating/important/bone-snapshots
- https://wiki.geckolib.com/docs/geckolib5/updating/important/bone-updaters
- https://wiki.geckolib.com/docs/geckolib5/updating/noteworthy/glowmasks
- https://wiki.geckolib.com/docs/geckolib5/updating/noteworthy/molang-variables
- https://wiki.geckolib.com/docs/geckolib5/updating/noteworthy/dynamic-renderers
-->
