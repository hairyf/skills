---
name: geckolib-v4-geo-models
description: GeckoLib 4 GeoModel classes — manual vs Defaulted models, asset path conventions, render type override, Molang hooks, and head tracking.
---

# GeckoLib 4 Geo Models

A `GeoModel<T>` (in `software.bernie.geckolib.model`) ties the animatable to its `.geo.json`, texture, and `.animation.json`. Extend it and implement the three resource methods:

```java
public class ExampleEntityModel extends GeoModel<ExampleEntity> {
    private static final ResourceLocation MODEL = new ResourceLocation(ModID, "geo/entity/example_entity.geo.json");
    private static final ResourceLocation TEXTURE = new ResourceLocation(ModID, "textures/entity/example_entity.png");
    private static final ResourceLocation ANIMATION = new ResourceLocation(ModID, "animations/entity/example_entity.animation.json");

    @Override public ResourceLocation getModelResource(ExampleEntity animatable) { return MODEL; }
    @Override public ResourceLocation getTextureResource(ExampleEntity animatable) { return TEXTURE; }
    @Override public ResourceLocation getAnimationResource(ExampleEntity animatable) { return ANIMATION; }
}
```

## Defaulted models (recommended)

`DefaultedEntityGeoModel`, `DefaultedBlockGeoModel`, and `DefaultedItemGeoModel` derive all three paths from one `ResourceLocation`:

```java
new DefaultedEntityGeoModel<>(new ResourceLocation(ModID, "entity/example_entity"))
```

produces:

```
geo/entity/example_entity.geo.json
animations/entity/example_entity.animation.json
textures/entity/example_entity.png
```

Useful builders: `withAltModel`, `withAltAnimations`, `withAltTexture` swap individual paths.

`DefaultedEntityGeoModel` head tracking: the two-arg constructor `new DefaultedEntityGeoModel<>(location, true)` automatically rotates the entity's `head` bone to look at the player (uses `DataTickets.ENTITY_MODEL_DATA`). Block models use `DefaultedBlockGeoModel`, armor/item models use `DefaultedItemGeoModel` (armor path convention: `geo/item/armor/<name>.geo.json` etc.).

## Other GeoModel hooks

- `getRenderType(T animatable, ResourceLocation texture)` — return a custom `RenderType` for this animatable; this is how you change rendering without subclassing the renderer.
- `applyMolangQueries(T animatable, double animTime)` — override to feed values into custom Molang variables (see [Molang](v4-molang.md)).
- `getBone(String name)` — find a bone from the baked model.
- `getAnimation(T animatable, String name)` — fetch an `Animation` by name.
- `crashIfBoneMissing()` — default true; set false to log instead of crash when a bone referenced by an animation is missing.
- `addAdditionalStateData(T animatable, long instanceId, BiConsumer<DataTicket<T>, T> dataConsumer)` — add custom per-instance data into the animation state.

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/Geo-Models-(Geckolib4)
- https://github.com/bernie-g/geckolib/wiki/Geckolib-4-Changes
- https://github.com/bernie-g/geckolib/tree/1.20.1 (v4.4.9)
-->
