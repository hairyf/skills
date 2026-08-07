---
name: fabric-first-block
description: Registering blocks (with/without items), translations, models, blockstates, loot and tool tags.
---

# Creating Your First Block

## ID Classes

Blocks with items use `BlockItemId` (holds both ids); item-less blocks use `ResourceKey<Block>`:

```java
public static final BlockItemId CONDENSED_DIRT = BlockItemId.of("example-mod", "condensed_dirt");
```

## Registration

```java
public static final Block CONDENSED_DIRT = register(
    ModBlockItemIds.CONDENSED_DIRT,
    Block::new,
    BlockBehaviour.Properties.ofFullCopy(Blocks.DIRT),
    true // shouldRegisterItem
);
```

`BlockBehaviour.Properties` controls sounds, hardness, explosion resistance, light (`lightLevel`), requires correct tool, etc. `ofFullCopy(...)` clones another block's settings. Add the block item to a creative tab with `Block.asItem()`.

## Assets

- Translation: `"block.example-mod.condensed_dirt": "Condensed Dirt"`.
- Texture: `assets/<mod>/textures/block/condensed_dirt.png`.
- Model `assets/<mod>/models/block/condensed_dirt.json`: `{ "parent": "block/cube_all", "textures": { "all": "example-mod:block/condensed_dirt" } }`.
- Client item `assets/<mod>/items/condensed_dirt.json` (only when a `BlockItem` exists).
- Blockstate `assets/<mod>/blockstates/condensed_dirt.json`:

```json
{ "variants": { "": { "model": "example-mod:block/condensed_dirt" } } }
```

## Drops & Harvesting

Loot table `data/<mod>/loot_tables/blocks/condensed_dirt.json`:

```json
{
  "type": "minecraft:block",
  "pools": [{ "rolls": 1, "entries": [{ "type": "minecraft:item", "name": "example-mod:condensed_dirt" }] }]
}
```

Tool tags in `data/minecraft/tags/block/mineable/` (`shovel.json`, `pickaxe.json`, `axe.json`, `hoe.json`) control harvest speed; `.requiresCorrectToolForDrops()` plus `needs_stone_tool`/`needs_iron_tool`/`needs_diamond_tool` tags make a tool mandatory.

<!--
Source references:
- https://docs.fabricmc.net/develop/blocks/first-block
-->
