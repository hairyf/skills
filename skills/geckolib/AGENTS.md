# GeckoLib Animation Capability

When the user asks to **add animated entities / blocks / items / armor to a Minecraft mod** (Blockbench JSON animations), follow these patterns.

## Quick API cheat sheet (GeckoLib 4.x)

```java
// Entity: implement GeoEntity
private final AnimatableInstanceCache cache = GeckoLibUtil.createInstanceCache(this);

@Override
public void registerControllers(AnimatableManager.ControllerRegistrar controllers) {
    controllers.add(new AnimationController<>(this, "move", 5, state ->
        state.isMoving()
            ? state.setAndContinue(RawAnimation.begin().thenLoop("move.walk"))
            : state.setAndContinue(RawAnimation.begin().thenLoop("misc.idle"))));
}

@Override
public AnimatableInstanceCache getAnimatableInstanceCache() {
    return this.cache;
}
```

```java
// Renderer (client)
public class MyEntityRenderer extends GeoEntityRenderer<MyEntity> {
    public MyEntityRenderer(EntityRendererFactory.Context ctx) {
        super(ctx, new DefaultedEntityGeoModel<>(new Identifier("mymod", "my_entity")));
    }
}

// Client entrypoint
EntityRendererRegistry.register(ModEntities.MY_ENTITY, MyEntityRenderer::new);
```

## Key rules

- 4.x package is `software.bernie.geckolib` (never `geckolib3` on 4.x).
- Every animatable needs: a `GeoModel` (or `Defaulted*GeoModel`), the animatable interface (`GeoEntity`/`GeoBlockEntity`/`GeoItem`/`GeoArmor`), and a registered renderer — missing renderer = crash on spawn.
- Controllers are state predicates called every frame: return `state.setAndContinue(anim)` or `PlayState.STOP`; don't start/stop animations there.
- Register "broad" controllers first (walk/idle), more specific ones later (attack) — later controllers override earlier ones, enabling blended layers.
- Trigger one-shot animations from the server with `entity.triggerAnim("controller_name", "trigger_name")`; register the trigger with `.triggerableAnim(...)`.
- Defaulted model paths: `DefaultedEntityGeoModel(new Identifier(mod, "bat"))` → `geo/entity/bat.geo.json`, `animations/entity/bat.animation.json`, `textures/entity/bat.png`.
- Use `DefaultAnimations` (`.WALK`, `.IDLE`, `.ATTACK_SWING`, `genericWalkIdleController`) and keep animation names like `move.walk` / `misc.idle` for compatibility.
- For items/armor (singletons) call `SingletonGeoAnimatable.registerSyncedAnimatable(this)` and use `GeoItem.getOrAssignId(stack, serverWorld)` when triggering from the server.
- Wiki uses Mojmap names (`Level`, `EntityRendererProvider.Context`, `ResourceLocation`); on Fabric use Yarn (`World`, `EntityRendererFactory.Context`, `Identifier`).
