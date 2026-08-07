---
name: geckolib-geomodels
description: GeoModel variants (automatic, defaulted, basic), asset path resolution, and v5 path rules.
---

# GeoModels

A `GeoModel` tells a GeckoLib renderer where its `.geo.json`, `.animation.json`, and `.png` files are. Each renderer owns exactly one `GeoModel` instance per object type.

## 1. Automatic GeoModel (recommended)

Pass the registered object directly to the renderer constructor. GeckoLib generates a `DefaultedEntityGeoModel`/`DefaultedItemGeoModel`/`DefaultedBlockGeoModel` automatically:

```java
new GeoEntityRenderer<>(context, EntityRegistry.EXAMPLE_ENTITY);
new GeoItemRenderer<>(ItemRegistry.EXAMPLE_ITEM);
new GeoBlockRenderer<>(context, BlockEntityRegistry.EXAMPLE_BLOCK_ENTITY);
```

Assets are resolved from the registry ID. For `examplemod:example_entity`:

- Model: `assets/examplemod/geckolib/models/entity/example_entity.geo.json`
- Animations: `assets/examplemod/geckolib/animations/entity/example_entity.animation.json`
- Texture: `assets/examplemod/textures/entity/example_entity.png`

Drawback: no dynamic path resolution or subfolder control.

## 2. Defaulted GeoModels

Take a single `Identifier` and auto-generate the three paths, adding a subfolder per type:

```java
new DefaultedItemGeoModel(Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "example_item"));
new DefaultedEntityGeoModel(Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "animal/example_animal"));
```

Built-ins: `DefaultedEntityGeoModel`, `DefaultedBlockGeoModel`, `DefaultedItemGeoModel`.

Create a custom defaulted model by overriding `subtype()`, which becomes the subfolder:

```java
public class ExampleCustomDefaultedGeoModel extends DefaultedGeoModel {
    public ExampleCustomDefaultedGeoModel(Identifier identifier) {
        super(identifier);
    }

    @Override
    protected String subtype() {
        return "custom";
    }
}
```

## 3. Basic GeoModels

Extend `GeoModel<T>` and implement the three resource methods. Cache the `Identifier`s in `final` fields:

```java
public class ExampleGeoModel extends GeoModel<ExampleEntity> {
    private final Identifier modelPath = Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "example_entity");
    private final Identifier animationsPath = Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "example_entity");
    private final Identifier texturePath = Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "example_entity.png");

    @Override
    public Identifier getModelResource(GeoRenderState renderState) {
        return this.modelPath;
    }

    @Override
    public Identifier getAnimationResource(ExampleEntity animatable) {
        return this.animationsPath;
    }

    @Override
    public Identifier getTextureResource(GeoRenderState renderState) {
        return this.texturePath;
    }
}
```

## v5 path rules

- `getModelResource` and `getAnimationResource` should NOT include the `geckolib/models` / `geckolib/animations` prefix or the `.geo.json` / `.animation.json` suffixes anymore — GeckoLib 5 adds them itself.
- `getTextureResource` still uses the full vanilla-style path including the `textures` prefix and `.png` suffix.

<!--
Source references:
- https://wiki.geckolib.com/docs/geckolib5/concepts/geomodels/overview
- https://wiki.geckolib.com/docs/geckolib5/concepts/geomodels/automatic-geomodel
- https://wiki.geckolib.com/docs/geckolib5/concepts/geomodels/defaulted-geomodel
- https://wiki.geckolib.com/docs/geckolib5/concepts/geomodels/basic-geomodel
- https://wiki.geckolib.com/docs/geckolib5/updating/noteworthy/geomodel-asset-paths
-->
