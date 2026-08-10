---
name: geckolib-blocks
description: Creating animated blocks — Block, BlockEntity, GeoBlockRenderer, and the required blockstate/model JSON files.
---

# GeckoLib Blocks

Blocks are static in Minecraft, so animated blocks need a `BlockEntity`. Steps: create the `Block` class → create the `BlockEntity` class → create the renderer → register everything → create blockstate/model JSONs.

## Block class

Implement `EntityBlock` and return your block entity from `newBlockEntity`:

```java
public class ExampleBlock extends Block implements EntityBlock {
    public ExampleBlock(BlockBehaviour.Properties properties) {
        super(properties);
    }

    @Override
    public @Nullable BlockEntity newBlockEntity(BlockPos pos, BlockState state) {
        return BlockEntityRegistry.EXAMPLE_BLOCK_ENTITY.get().create(pos, state);
    }
}
```

(Fabric uses `BlockEntityRegistry.EXAMPLE_BLOCK_ENTITY.create(...)` without `.get()`.)

## BlockEntity class

```java
public class ExampleBlockEntity extends BlockEntity implements GeoBlockEntity {
    private final AnimatableInstanceCache geoCache = GeckoLibUtil.createInstanceCache(this);

    public ExampleBlockEntity(BlockPos pos, BlockState state) {
        super(BlockEntityRegistry.EXAMPLE_BLOCK_ENTITY.get(), pos, state);
    }

    @Override
    public void registerControllers(final AnimatableManager.ControllerRegistrar controllers) {
    }

    @Override
    public AnimatableInstanceCache getAnimatableInstanceCache() {
        return this.geoCache;
    }
}
```

## Renderer

Simple: `context -> new GeoBlockRenderer<>(context, BlockEntityRegistry.EXAMPLE_BLOCK_ENTITY.get())` (Fabric without `.get()`).

Advanced:

```java
public class ExampleBlockRenderer<R extends BlockEntityRenderState & GeoRenderState> extends GeoBlockRenderer<ExampleBlockEntity, R> {
    public ExampleBlockRenderer(BlockEntityType<ExampleBlockEntity> blockEntityType) {
        super(blockEntityType);
    }
}
```

## JSON files (vanilla requirement, commonly missed)

Blockstate JSON at `assets/<modid>/blockstates/<block_id>.json`:

```json
{
  "variants": {
    "": { "model": "examplemod:block/example_block" }
  }
}
```

Block model JSON at `assets/<modid>/models/block/<block_id>.json`:

```json
{
  "textures": { "particle": "examplemod:block/example_block" }
}
```

The particle texture can point at another block's texture (vanilla chests use oak planks).

## Asset files

- Model: `assets/<mod_id>/geckolib/models/block/<block_id>.geo.json`
- Animations: `assets/<mod_id>/geckolib/animations/block/<block_id>.animation.json`
- Texture: `assets/<mod_id>/textures/block/<block_id>.png`

<!--
Source references:
- https://wiki.geckolib.com/docs/geckolib5/blocks/intro
- https://wiki.geckolib.com/docs/geckolib5/blocks/the-block-class
- https://wiki.geckolib.com/docs/geckolib5/blocks/the-blockentity-class
- https://wiki.geckolib.com/docs/geckolib5/blocks/the-blockentity-renderer
- https://wiki.geckolib.com/docs/geckolib5/blocks/the-block-asset-files
-->
