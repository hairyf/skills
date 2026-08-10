---
name: core-models
description: GeckoLib 4.x GeoModel — resource paths, custom models, defaulted models.
---

# Geo Models

Every animatable needs a model that ties together its `.geo.json`, `.animation.json`, and `.png` resources.

## Custom GeoModel (Yarn names)

```java
public class MyEntityModel extends GeoModel<MyEntity> {
    private static final Identifier MODEL = new Identifier("mymod", "geo/entity/my_entity.geo.json");
    private static final Identifier TEXTURE = new Identifier("mymod", "textures/entity/my_entity.png");
    private static final Identifier ANIMATIONS = new Identifier("mymod", "animations/entity/my_entity.animation.json");

    @Override
    public Identifier getModelLocation(MyEntity animatable) {
        return MODEL;
    }

    @Override
    public Identifier getTextureLocation(MyEntity animatable) {
        return TEXTURE;
    }

    @Override
    public Identifier getAnimationFileLocation(MyEntity animatable) {
        return ANIMATIONS;
    }
}
```

> The GeckoLib wiki uses Mojmap names (`getModelResource`, `getTextureResource`, `getAnimationResource`). On Fabric with Yarn mappings these are `getModelLocation`, `getTextureLocation`, `getAnimationFileLocation`.

## Defaulted models (recommended)

```java
new DefaultedEntityGeoModel<>(new Identifier("mymod", "bat"));
new DefaultedItemGeoModel<>(new Identifier("mymod", "wand"));
new DefaultedBlockGeoModel<>(new Identifier("mymod", "radio"));
```

They auto-resolve paths:

```text
textures/entity/bat.png
geo/entity/bat.geo.json
animations/entity/bat.animation.json
```

## Required resource directories

- Models: `assets/<modid>/geo/` (any subdirectory)
- Animations: `assets/<modid>/animations/`
- Textures: `assets/<modid>/textures/`

## Key points

- Paths in the `GeoModel` must match the exported files exactly; a mismatch renders the default missing texture.
- Defaulted models enforce consistent file organization — prefer them for new entities.
- Animatable type matters: entities use `DefaultedEntityGeoModel`, items `DefaultedItemGeoModel`, blocks `DefaultedBlockGeoModel`.

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/Geo-Models-(Geckolib4)
-->
