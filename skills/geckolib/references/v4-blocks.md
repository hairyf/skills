---
name: geckolib-v4-blocks
description: GeckoLib 4 animated blocks — GeoBlockEntity, disabling vanilla rendering, GeoBlockRenderer, registration, and block directionality.
---

# GeckoLib 4 Blocks

Minecraft blocks are static, so animated blocks need a `BlockEntity`; the `BlockEntity` implements `GeoBlockEntity` (not the block class).

## Block class

Make the block an `EntityBlock` that returns your block entity from `newBlockEntity`, and disable the vanilla blockstate renderer:

```java
@Override
public RenderShape getRenderShape(BlockState state) {
    return RenderShape.ENTITYBLOCK_ANIMATED;
}
```

## BlockEntity class

```java
public class ExampleBlockEntity extends BlockEntity implements GeoBlockEntity {
    private static final RawAnimation DEPLOY_ANIM = RawAnimation.begin().thenPlay("misc.deploy").thenLoop("misc.idle");
    private final AnimatableInstanceCache cache = GeckoLibUtil.createInstanceCache(this);

    public ExampleBlockEntity(BlockPos pos, BlockState state) {
        super(BlockEntityRegistry.EXAMPLE_BLOCK_ENTITY.get(), pos, state);
    }

    @Override
    public void registerControllers(AnimatableManager.ControllerRegistrar controllers) {
        controllers.add(new AnimationController<>(this, state -> state.setAndContinue(DEPLOY_ANIM)));
    }

    @Override
    public AnimatableInstanceCache getAnimatableInstanceCache() {
        return this.cache;
    }
}
```

## Renderer

```java
public class ExampleBlockEntityRenderer extends GeoBlockRenderer<ExampleBlockEntity> {
    public ExampleBlockEntityRenderer(BlockEntityRendererProvider.Context context) {
        super(new ExampleBlockEntityModel());
    }
}
```

Registration — Forge:

```java
event.registerBlockEntityRenderer(BlockEntityRegistry.EXAMPLE_BLOCK_ENTITY.get(), ExampleBlockEntityRenderer::new);
```

Fabric:

```java
BlockEntityRendererRegistry.register(BlockEntityRegistry.EXAMPLE_BLOCK_ENTITY, ExampleBlockEntityRenderer::new);
```

## Directionality

GeckoLib rotates directional blocks automatically. To customize or disable rotation, override `rotateBlock` in `GeoBlockRenderer`.

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/Geckolib-Blocks-(Geckolib4)
- https://github.com/bernie-g/geckolib/tree/1.20.1 (v4.4.9)
-->
