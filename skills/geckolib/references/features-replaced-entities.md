---
name: geckolib-replaced-entities
description: Replacing vanilla or modded entity rendering with GeckoLib models — GeoReplacedEntity, renderer generics, and render state extraction.
---

# Replaced Entities

GeckoLib can replace the model, texture, and animations of an existing (vanilla or modded) entity without breaking its behavior. No `EntityType` registration is needed.

Steps: create the `GeoReplacedEntity` class → create the `GeoModel` → create the renderer → register the renderer.

## GeoReplacedEntity class

```java
public class ExampleReplacedEntity implements GeoReplacedEntity {
    private final AnimatableInstanceCache geoCache = GeckoLibUtil.createInstanceCache(this);

    @Override
    public void registerControllers(final AnimatableManager.ControllerRegistrar controllers) {
    }

    @Override
    public AnimatableInstanceCache getAnimatableInstanceCache() {
        return this.geoCache;
    }
}
```

Override `getReplacingEntityType()` to return the `EntityType` being replaced (e.g. `EntityType.CREEPER`).

## GeoModel

```java
public class ExampleReplacedEntityGeoModel extends DefaultedEntityGeoModel<ExampleReplacedEntity> {
    public ExampleReplacedEntityGeoModel() {
        super(Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "example_replaced_entity"));
    }
}
```

Assets go in `geckolib/models/entity/`, `geckolib/animations/entity/`, `textures/entity/` under the target id.

## Renderer

Generics are `<T = replaced animatable, O = target entity, R = target render state>`:

```java
public class ExampleReplacedEntityRenderer<R extends CreeperRenderState & GeoRenderState> extends GeoEntityRenderer<ExampleReplacedEntity, Creeper, R> {
    public ExampleReplacedEntityRenderer(EntityRendererProvider.Context context) {
        super(context, new ExampleReplacedEntityGeoModel(), new ExampleReplacedEntity());
    }
}
```

Strongly recommended overrides — return the target entity's normal render state and extract its values:

```java
@Override
public R createRenderState(ExampleReplacedEntity animatable, Creeper relatedObject) {
    return (R) new CreeperRenderState();
}

@Override
public void extractRenderState(Creeper entity, R renderState, float partialTick) {
    super.extractRenderState(entity, renderState, partialTick);
    renderState.swelling = entity.getSwelling(partialTick);
    renderState.isPowered = entity.isPowered();
}
```

Check the target entity's normal renderer for the values it extracts, and replicate them.

<!--
Source references:
- https://wiki.geckolib.com/docs/geckolib5/entities/replaced-entities/intro
- https://wiki.geckolib.com/docs/geckolib5/entities/replaced-entities/creating-the-entity-class
- https://wiki.geckolib.com/docs/geckolib5/entities/replaced-entities/creating-the-geomodel
- https://wiki.geckolib.com/docs/geckolib5/entities/replaced-entities/creating-the-renderer
-->
