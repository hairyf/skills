---
name: geckolib-rendering
description: GeckoLib 5 rendering concepts — GeoRenderState, DataTickets, RenderPassInfo, BoneSnapshots, BoneUpdaters, bone position listeners, and renderer generic types.
---

# GeckoLib 5 Rendering Concepts

Since Minecraft 1.21 moved rendering off the game thread, GeckoLib 5 renders from **immutable snapshots**, never from the live object. Everything below exists to make that safe.

## RenderState & DataTickets

`GeoRenderState` (GeckoLib's extension of vanilla `RenderState`) holds all data needed to render. The animatable is only accessible during extraction — after that, the renderer only sees the state.

Add your own data with a `DataTicket` key:

```java
// Create the ticket (static final, e.g. in your entity class)
public static final DataTicket<Boolean> IS_TAMED = DataTicket.create("example_is_tamed", Boolean.class);
```

For generic types use the `TypeToken` factory: `DataTicket.create("example_directions", EnumMap.class, new TypeToken<>() {})`.

Store data in the render state at the closest place to where it's used:

- `GeoRenderer#addRenderData`
- `GeoModel#addAdditionalStateData`
- `GeoRenderLayer#addRenderData`

```java
@Override
public void addRenderData(MyEntity animatable, Void relatedObject, R renderState, float partialTick) {
    renderState.addGeckoLibData(ModDataTickets.IS_TAMED, animatable.hasOwner());
}
```

Read it back during rendering:

```java
final boolean isTamed = renderPassInfo.getGeckolibData(ModDataTickets.IS_TAMED);
```

GeckoLib ships built-in tickets in the `DataTickets` class — e.g. `ANIMATABLE_INSTANCE_ID`, `PARTIAL_TICK`, `IS_MOVING`, `POSITION`, `VELOCITY`, `ITEM_RENDER_PERSPECTIVE`, `HAS_GLINT`, `IS_ENCHANTED`, `MAX_USE_DURATION`, `MAX_DURABILITY`, `ANIMATABLE_MANAGER`. To use a ticket created by another mod without a hard dependency, create a `DataTicket` with the same id — GeckoLib unifies them automatically.

## RenderPassInfo

Created at the start of every render pass (`GeoRenderer#performRenderPass`), `RenderPassInfo` bundles everything a pass needs:

- the `GeoRenderer`, `GeoRenderState`, `PoseStack`, `BakedGeoModel`, and `CameraRenderState`
- `BoneUpdaters`, bone position listeners, and per-bone render callbacks

Use it to set ticket values, register bone updaters/listeners, and read render data.

## BoneSnapshots

`BoneSnapshot`s are the sole owners of bone transformations for a render pass. `GeoBone`s are immutable in v5 — you can never mutate bones directly. Override `adjustModelBonesForRender` in your renderer:

```java
@Override
public void adjustModelBonesForRender(RenderPassInfo<R> renderPassInfo, BoneSnapshots snapshots) {
    snapshots.ifPresent("MyBoneName", boneSnapshot -> {
        boneSnapshot.setRotX(45 * Mth.DEG_TO_RAD);
    });
}
```

Snapshots are discarded at the end of each render pass, so changes can never leak between animatables.

## BoneUpdaters

To modify bones from outside the renderer, add a `BoneUpdater` to the `RenderPassInfo` (before `GeoRenderer#submitRenderTasks` — adding too late throws):

```java
renderPassInfo.addBoneUpdater((renderPassInfo, boneSnapshots) -> {
    // Modify bones here
});
```

## Bone position listeners

Get a bone's world/model/local position during rendering:

```java
renderPassInfo.addBonePositionListener("MyBoneName", (worldPos, modelPos, localPos) -> {
    // store, don't use directly
});
```

Positions are nullable (not all renderers can resolve all three). Do **not** use the positions inside the listener — store them in your animatable and use them on tick, because listeners run on every render.

## Renderer generic types (v5)

Renderers now take three generics: `<T, O, R>` — `T` = animatable type, `O` = associated-data type (`Void` if none), `R` = `RenderState` type (must extend `GeoRenderState`):

```java
public class MyEntityRenderer<R extends LivingEntityRenderState & GeoRenderState> extends GeoEntityRenderer<MyEntity, R> {
}
```

`GeoRenderLayer`s use the same generics. Prefer the correct vanilla render state for the object being rendered (e.g. `CreeperRenderState` when replacing a Creeper).

<!--
Source references:
- https://wiki.geckolib.com/docs/geckolib5/concepts/rendering/renderstates
- https://wiki.geckolib.com/docs/geckolib5/concepts/rendering/datatickets
- https://wiki.geckolib.com/docs/geckolib5/concepts/rendering/renderpassinfo
- https://wiki.geckolib.com/docs/geckolib5/concepts/geobones/bone-snapshots
- https://wiki.geckolib.com/docs/geckolib5/concepts/geobones/bone-updaters
- https://wiki.geckolib.com/docs/geckolib5/concepts/geobones/bone-position-listeners
- https://wiki.geckolib.com/docs/geckolib5/updating/important/generic-types
-->
