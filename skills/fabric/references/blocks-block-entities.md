---
name: fabric-block-entities
description: Block entities, saving/loading, client sync, tickers, and block entity renderers.
---

# Block Entities

Block entities store data beyond block states (inventories, counters...).

## Register a Block Entity Type

```java
public static final BlockEntityType<CounterBlockEntity> COUNTER = Registry.register(
    BuiltInRegistries.BLOCK_ENTITY_TYPE,
    Identifier.fromNamespaceAndPath("example-mod", "counter"),
    BlockEntityType.Builder.of(CounterBlockEntity::new, ModBlocks.COUNTER_BLOCK).build(null)
);
```

## The Block

Extend `BaseEntityBlock` (or implement `EntityBlock`) and override `createBlockEntity` (returns a new instance or null) and `createCodec`. Get the entity in interactions with `level.getBlockEntity(pos)`.

## Save / Load

Serialization uses `ValueInput`/`ValueOutput` with codecs or primitive methods:

```java
@Override
protected void saveAdditional(ValueOutput output) {
    output.putInt("clicks", clicks);
}

@Override
protected void loadAdditional(ValueInput input) {
    clicks = input.getInt("clicks");
}
```

Call `setChanged()` after mutations so the game knows to persist.

## Sync to Clients

- `getUpdateTag` → full initial state when a player enters the chunk.
- `getUpdatePacket` + `setChanged` broadcasting → live updates to already-tracking players (fixes desyncs).

## Tickers

```java
public static <T extends BlockEntity> BlockEntityTicker<T> getTicker(Level level, BlockState state, BlockEntityType<T> type) {
    return level.isClientSide() ? null : createTickerHelper(type, ModBlockEntities.COUNTER, CounterBlockEntity::tick);
}
```

Make sure the `BlockEntityType.Builder` lists the valid blocks or ticking is skipped with a warning.

## Block Entity Renderers (client)

For dynamic visuals beyond the block model: create a `BlockEntityRenderState` (extracted data), a `BlockEntityRenderer` with `createRenderState` / `extractRenderState` / `submit`, and register via `BlockEntityRenderers.register(type, rendererProvider)` in the client initializer. Transformations use `PoseStack` (`pushPose`/`popPose`, `translate`, `mulPose(Axis.XP.rotationDegrees(...))`, `scale`); draw text with `submitText` on the `SubmitNodeCollector`. Keep these classes in `src/client` (server cannot load render classes).

<!--
Source references:
- https://docs.fabricmc.net/develop/blocks/block-entities
- https://docs.fabricmc.net/develop/blocks/block-entity-renderer
-->
