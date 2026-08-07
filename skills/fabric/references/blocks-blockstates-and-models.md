---
name: fabric-blockstates-and-models
description: Blockstate JSON, custom state properties, block models, lighting and tint indices.
---

# Block States & Block Models

Blockstates store lightweight per-block data (rotation, lit, age...) without block-entity overhead.

## Vanilla Properties: Pillar Blocks

`RotatedPillarBlock` exposes `axis`. Models: `block/cube_column` (vertical) and `block/cube_column_horizontal`. Blockstate:

```json
{
  "variants": {
    "axis=x": { "model": "example-mod:block/condensed_oak_log_horizontal", "x": 90, "y": 90 },
    "axis=y": { "model": "example-mod:block/condensed_oak_log" },
    "axis=z": { "model": "example-mod:block/condensed_oak_log_horizontal", "x": 90 }
  }
}
```

## Custom Properties

```java
public class PrismarineLampBlock extends Block {
    public static final BooleanProperty ACTIVATED = BooleanProperty.create("activated");

    public PrismarineLampBlock(Properties settings) {
        super(settings.lightLevel(PrismarineLampBlock::getLuminance));
        this.registerDefaultState(this.getStateDefinition().any().setValue(ACTIVATED, false));
    }

    @Override
    protected void createBlockStateDefinition(StateDefinition.Builder<Block, BlockState> builder) {
        builder.add(ACTIVATED);
    }

    @Override
    protected InteractionResult useWithoutItem(BlockState state, Level level, BlockPos pos, Player player, BlockHitResult hit) {
        level.setBlockAndUpdate(pos, state.cycle(ACTIVATED));
        return InteractionResult.SUCCESS;
    }

    private static int getLuminance(BlockState state) {
        return state.getValue(ACTIVATED) ? 15 : 0;
    }
}
```

Blockstate file must cover **every combination** of properties.

## Block Model Structure

Same element/face JSON as item models plus `ambientocclusion` (default true). Cuboids span `from`/`to` in 0–16 units (range -16..32), faces: `down/up/north/south/west/east` with `uv`, `texture` (`#var`), `cullface`, `rotation` (90° increments), `tintindex` (`-1` = no tint, other values look up `BlockColors`).

## Block Tinting

Dynamic colors (like grass/leaves) via `BlockColorRegistry` in the client initializer:

```java
BlockColorRegistry.register((state, level, pos, tintIndex) ->
    state.is(Blocks.GRASS_BLOCK) ? 0x00AA00 : 0x8B4513, ModBlocks.WAXCAP);
```

The texture should be grayscale; the returned ARGB tint colors it.

<!--
Source references:
- https://docs.fabricmc.net/develop/blocks/blockstates
- https://docs.fabricmc.net/develop/blocks/block-models
- https://docs.fabricmc.net/develop/blocks/block-tinting
-->
