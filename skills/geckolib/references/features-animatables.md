---
name: features-animatables
description: GeckoLib 4.x blocks, items, armor, and keyframe triggers (sound/particle/custom instruction).
---

# Blocks, Items, Armor & Keyframe Triggers

## Animated blocks (`GeoBlockEntity`)

The **block entity** implements `GeoBlockEntity` (the block itself does not). Needs an associated `BlockEntity`.

```java
public class RadioBlockEntity extends BlockEntity implements GeoBlockEntity {
    private final AnimatableInstanceCache cache = GeckoLibUtil.createInstanceCache(this);

    public RadioBlockEntity(BlockPos pos, BlockState state) {
        super(ModBlockEntities.RADIO, pos, state);
    }

    @Override
    public void registerControllers(AnimatableManager.ControllerRegistrar controllers) {
        controllers.add(new AnimationController<>(this, "play", 5, state ->
            state.setAndContinue(RawAnimation.begin().thenLoop("misc.play"))));
    }

    @Override
    public AnimatableInstanceCache getAnimatableInstanceCache() {
        return this.cache;
    }
}
```

Renderer extends `GeoBlockEntityRenderer<RadioBlockEntity>`; register it client-side for the `BlockEntityType` via `BlockEntityRendererRegistry.register(...)`. Model: `DefaultedBlockGeoModel` or a custom `GeoModel` pointing at `geo/block/radio.geo.json`.

## Animated items (`GeoItem`)

```java
public class WandItem extends Item implements GeoItem {
    private final AnimatableInstanceCache cache = GeckoLibUtil.createInstanceCache(this);

    public WandItem(Settings settings) {
        super(settings);
        SingletonGeoAnimatable.registerSyncedAnimatable(this); // required for singletons
    }

    @Override
    public void registerControllers(AnimatableManager.ControllerRegistrar controllers) {
        controllers.add(new AnimationController<>(this, "use", state -> PlayState.STOP)
            .triggerableAnim("use", RawAnimation.begin().thenPlay("use.activate")));
    }

    @Override
    public AnimatableInstanceCache getAnimatableInstanceCache() {
        return this.cache;
    }
}
```

Client: `ItemRendererRegistry.register(item, () -> new GeoItemRenderer<>(new DefaultedItemGeoModel<>(...)))`. Trigger from the server:

```java
triggerAnim(player, GeoItem.getOrAssignId(stack, (ServerWorld) world), "use", "use");
```

## Armor (`GeoArmor`)

Armor item extends `ArmorItem` and implements `GeoArmor` (same cache + controllers pattern). Client registers a `GeoArmorRenderer` via `ArmorRendererRegistry.register(renderer, item)`.

## Keyframe triggers

Blockbench keyframes can fire callbacks:

```java
new AnimationController<>(this, "sounds", state -> PlayState.STOP)
    .setSoundKeyframeHandler(event -> {
        // play a sound: event.getKeyframeData().getSound()
    })
    .setParticleKeyframeHandler(event -> {
        // spawn a particle at event.getKeyframeData().getLocator()
    })
    .setCustomInstructionKeyframeHandler(event -> {
        // custom instruction string from the animation
    });
```

Define them in Blockbench (Animate → Keyframe → add sound/particle/custom instruction keyframes).

## Key points

- Items/armor are singletons: always call `SingletonGeoAnimatable.registerSyncedAnimatable(this)` and use `GeoItem.getOrAssignId(...)` for server-side triggers.
- Blocks animate via their `BlockEntity`, never the `Block` itself.
- `GeoItem` needs `renderScale`/render adjustments via the renderer if the item is huge/tiny in hand.

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/Geckolib-Blocks-(Geckolib4)
- https://github.com/bernie-g/geckolib/wiki/Geckolib-Items-(Geckolib4)
- https://github.com/bernie-g/geckolib/wiki/Geckolib-Armor-(Geckolib4)
- https://github.com/bernie-g/geckolib/wiki/Keyframe-Triggers-(Geckolib4)
-->
