---
name: geckolib-v4-replaced-entities
description: Replace vanilla entity models with GeckoLib 4 animations — GeoReplacedEntity, getReplacingEntityType, GeoReplacedEntityRenderer, and per-entity render hooks.
---

# GeckoLib 4 Replaced Entities

`GeoReplacedEntity` swaps the model/animations of an existing vanilla entity type without replacing the entity class.

## The animatable

`GeoReplacedEntity` extends `SingletonGeoAnimatable`; implement `registerControllers`, `getAnimatableInstanceCache`, and `getReplacingEntityType()`:

```java
public class ReplacedCreeperEntity implements GeoReplacedEntity {
    private final AnimatableInstanceCache cache = GeckoLibUtil.createInstanceCache(this);

    @Override
    public void registerControllers(AnimatableManager.ControllerRegistrar controllers) {
        controllers.add(DefaultAnimations.genericWalkIdleController(this));
    }

    @Override
    public EntityType<?> getReplacingEntityType() {
        return EntityType.CREEPER;
    }

    @Override
    public AnimatableInstanceCache getAnimatableInstanceCache() {
        return this.cache;
    }
}
```

Because it is a singleton animatable, register it for sync in the constructor with `SingletonGeoAnimatable.registerSyncedAnimatable(this)` if you use triggered animations or synced data.

## The renderer

```java
public class ReplacedCreeperRenderer extends GeoReplacedEntityRenderer<Creeper, ReplacedCreeperEntity> {
    public ReplacedCreeperRenderer(EntityRendererProvider.Context context) {
        super(context, new ReplacedCreeperModel(), new ReplacedCreeperEntity());
    }
}
```

Register the renderer for the **vanilla** entity type (`EntityType.CREEPER`), exactly like a normal entity renderer. The generic type is `<T extends Entity, A extends GeoReplacedEntity>`: the first is the vanilla entity being replaced, the second your animatable.

Inside the renderer, `currentEntity` is the vanilla entity instance — use it for per-entity render effects:

```java
@Override
public void preRender(PoseStack poseStack, ReplacedCreeperEntity animatable, BakedGeoModel model,
                      MultiBufferSource bufferSource, VertexConsumer buffer, boolean isReRender,
                      float partialTick, int packedLight, int packedOverlay,
                      float red, float green, float blue, float alpha) {
    super.preRender(poseStack, animatable, model, bufferSource, buffer, isReRender, partialTick,
            packedLight, packedOverlay, red, green, blue, alpha);

    float swell = ((Creeper) this.currentEntity).getSwelling(partialTick);
    // ... scale the poseStack
}
```

`triggerAnim`/`setAnimData` for replaced entities take the related `Entity` as the first argument (see [Triggerable Animations & Data Syncing](v4-triggerable-animations.md)).

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/Geckolib-4-Changes
- https://github.com/bernie-g/geckolib/wiki/Examples-(Geckolib-4)
- https://github.com/bernie-g/geckolib/tree/1.20.1 (v4.4.9, software.bernie.example.entity.ReplacedCreeperEntity)
-->
