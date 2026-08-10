---
name: geckolib-entities
description: Creating animated entities — entity class, renderer (simple/advanced), registration, asset layout, and common issues.
---

# GeckoLib Entities

Steps: create the entity class → register the entity → create the renderer class → register the renderer.

## Entity class

```java
public class ExampleEntity extends PathfinderMob implements GeoEntity {
    private final AnimatableInstanceCache geoCache = GeckoLibUtil.createInstanceCache(this);

    public ExampleEntity(EntityType<? extends PathfinderMob> entityType, Level level) {
        super(entityType, level);
    }

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

Register the `EntityType` normally per loader (Fabric/Forge/NeoForge registration docs — vanilla modding, not GeckoLib-specific).

## Renderer

Simple (no custom class needed — recommended):

```java
// Fabric
context -> new GeoEntityRenderer<>(context, EntityRegistry.EXAMPLE_ENTITY);
// Forge / NeoForge
context -> new GeoEntityRenderer<>(context, EntityRegistry.EXAMPLE_ENTITY.get());
```

Advanced (custom class):

```java
public class ExampleEntityRenderer<R extends LivingEntityRenderState & GeoRenderState> extends GeoEntityRenderer<ExampleEntity, R> {
    public ExampleEntityRenderer(EntityRendererProvider.Context context, EntityType<ExampleEntity> entityType) {
        super(context, entityType);
    }
}
```

`R` is the render state type (default `LivingEntityRenderState` + `GeoRenderState`); the second generic is your entity.

Register the renderer with your loader's entity-renderer registration system (Fabric `EntityRendererRegistry`, NeoForge `EntityRenderersEvent.RegisterRenderers`, etc.).

## Asset files

For an entity registered as `example_entity` (automatic model):

- Model: `assets/<mod_id>/geckolib/models/entity/example_entity.geo.json`
- Animations: `assets/<mod_id>/geckolib/animations/entity/example_entity.animation.json`
- Texture: `assets/<mod_id>/textures/entity/example_entity.png`

## Animating

Add `AnimationController`s in `registerControllers`; see [Animation Controllers](core-animation-controller.md).

For animated projectiles, GeckoLib ships `DirectionalProjectileRenderer` in `com.geckolib.renderer.specialty` — an entity renderer that orients the model along the projectile's motion direction (useful for arrows, thrown weapons, and similar).

## Common issues

- **Crash on spawn: `NullPointerException ... entityrenderer is null`** — the renderer was never registered.
- **`/summon` fails** — entity attributes were not registered.

<!--
Source references:
- https://wiki.geckolib.com/docs/geckolib5/entities/intro
- https://wiki.geckolib.com/docs/geckolib5/entities/the-entity-class
- https://wiki.geckolib.com/docs/geckolib5/entities/the-entity-renderer
- https://wiki.geckolib.com/docs/geckolib5/entities/copy-paste-templates
- https://wiki.geckolib.com/docs/geckolib5/entities/common-issues
-->
