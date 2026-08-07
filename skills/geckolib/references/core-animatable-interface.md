---
name: geckolib-animatable-interface
description: The GeoAnimatable pattern shared by all GeckoLib animatable objects — instance caches, controller registration, and the per-type interfaces.
---

# GeoAnimatable Interface Pattern

Every animatable object in GeckoLib (entity, block entity, item, armor, replaced entity) follows the same core pattern from `GeoAnimatable`:

1. Implement the type-specific interface (`GeoEntity`, `GeoBlockEntity`, `GeoItem`, `GeoReplacedEntity`, `SingletonGeoAnimatable`)
2. Create an `AnimatableInstanceCache` field via `GeckoLibUtil.createInstanceCache(this)`
3. Return it from `getAnimatableInstanceCache()`
4. Override `registerControllers(AnimatableManager.ControllerRegistrar)` and add `AnimationController`s

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

## Interface reference

| Animatable | Interface | Renderer used |
|---|---|---|
| Entity | `GeoEntity` | `GeoEntityRenderer` |
| Block entity | `GeoBlockEntity` | `GeoBlockRenderer` |
| Item | `GeoItem` | `GeoItemRenderer` (via `GeoRenderProvider`) |
| Armor | `GeoItem` | `GeoArmorRenderer` (via `GeoRenderProvider`) |
| Replaced vanilla entity | `GeoReplacedEntity` | `GeoEntityRenderer` (3 generics) or `GeoReplacedEntityRenderer` |
| Non-entity singleton | `SingletonGeoAnimatable` | depends on use |

Items/armor additionally implement `GeoItem.createGeoRenderer(Consumer<GeoRenderProvider>)` to supply their renderer; see [Items](features-items.md) and [Armor](features-armor.md).

Stateless alternatives exist for every interface (e.g. `StatelessGeoEntity`, `StatelessGeoSingletonAnimatable`); see [Stateless Animations](features-stateless-animations.md).

## Key points

- The cache must be a `final` field, never recreated per render pass.
- For singleton animatables (items, armor, non-entity singletons) use `GeckoLibUtil.createInstanceCache(this, true)`; entities/block entities use the default (false) overload.
- `SingletonGeoAnimatable` exists for animatable objects that aren't entities/items/block entities; items/armor instead implement `GeoItem` with `GeoItem.registerSyncedAnimatable(this)` when they need network sync.
- `registerControllers` is called when the animatable first needs animations; it is the single place to register controllers.
- One controller plays one animation at a time; register as many controllers as you need simultaneously-playing animation groups.
- For server-triggerable animations on singleton objects (items), call `GeoItem.registerSyncedAnimatable(this)` in the constructor so GeckoLib can network-find the instance (see [Triggerable Animations](features-triggerable-animations.md)).

<!--
Source references:
- https://wiki.geckolib.com/docs/geckolib5/entities/the-entity-class
- https://wiki.geckolib.com/docs/geckolib5/blocks/the-blockentity-class
- https://wiki.geckolib.com/docs/geckolib5/items/the-item-class
- https://wiki.geckolib.com/docs/geckolib5/armor/the-item-class
-->
