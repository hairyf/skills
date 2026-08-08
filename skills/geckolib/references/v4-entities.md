---
name: geckolib-v4-entities
description: GeckoLib 4 animated entities — GeoEntity class, GeoEntityRenderer, per-loader registration, and common issues.
---

# GeckoLib 4 Entities

## Entity class

```java
public class ExampleEntity extends PathfinderMob implements GeoEntity {
    private static final RawAnimation FLY_ANIM = RawAnimation.begin().thenLoop("move.fly");
    private final AnimatableInstanceCache geoCache = GeckoLibUtil.createInstanceCache(this);

    public ExampleEntity(EntityType<? extends ExampleEntity> type, Level level) {
        super(type, level);
    }

    @Override
    public void registerControllers(AnimatableManager.ControllerRegistrar controllers) {
        controllers.add(new AnimationController<>(this, "Flying", 5, state ->
                state.isMoving() ? state.setAndContinue(FLY_ANIM) : PlayState.STOP));
    }

    @Override
    public AnimatableInstanceCache getAnimatableInstanceCache() {
        return this.geoCache;
    }
}
```

Register the `EntityType` normally (Fabric/Forge registration is vanilla modding, not GeckoLib-specific).

## Renderer

```java
public class ExampleEntityRenderer extends GeoEntityRenderer<ExampleEntity> {
    public ExampleEntityRenderer(EntityRendererProvider.Context context) {
        super(context, new ExampleEntityModel());
    }
}
```

Register it like any entity renderer — Fabric:

```java
EntityRendererRegistry.register(EntityRegistry.EXAMPLE_ENTITY, ExampleEntityRenderer::new);
```

Forge:

```java
@SubscribeEvent
public static void registerRenderers(EntityRenderersEvent.RegisterRenderers event) {
    event.registerEntityRenderer(EntityRegistry.EXAMPLE_ENTITY.get(), ExampleEntityRenderer::new);
}
```

No model layers/mesh definitions are needed — the `GeoEntityRenderer` takes the `GeoModel` directly.

## Common issues

- **Crash on spawn (`entityrenderer is null`)** — you forgot to register the renderer.
- **`DefaultAnimations.genericAttackAnimation` not swinging** — call `swing()`/use `MeleeAttackGoal`; if not extending `Monster`, call `updateSwingTime()` in `aiStep`.
- **Attack animation cuts off early** — override `getCurrentSwingDuration()` to return the animation length in ticks.
- **Animation won't replay** — either don't reset the animation after it finishes, or the JSON loop type is `hold_on_last_frame`.

## Examples in GeckoLib 4 dev mode (1.20.1)

The `software.bernie.example` package demonstrates: `BatEntity` (Molang + world-space bone positioning + head turn), `BikeEntity` (advanced queries), `CoolKidEntity` (render layers), `DynamicExampleEntity`/`FakeGlassEntity` (DynamicGeoEntityRenderer per-bone textures), `ParasiteEntity` (multiple controllers), `RaceCarEntity` (animated textures), `ReplacedCreeperEntity` (replaced entity).

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/Geckolib-Entities-(Geckolib4)
- https://github.com/bernie-g/geckolib/wiki/Examples-(Geckolib-4)
- https://github.com/bernie-g/geckolib/tree/1.20.1 (v4.4.9)
-->
