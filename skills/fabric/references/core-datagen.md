---
name: core-datagen
description: Fabric Data Generation — programmatically generate blockstates, models, recipes, loot tables, tags, sounds, and advancements.
---

# Data Generation

Fabric datagen replaces hand-written JSON with Java generators run via `runDatagen`.

## Setup

```java
public class MyModDataGenerator implements FabricDataGenerator.Pack.Factory {
    @Override
    public Pack create(FabricDataGenerator.Pack pack) {
        pack.addProvider(MyModelProvider::new);
        pack.addProvider(MyRecipeProvider::new);
        pack.addProvider(MyLootTableProvider::new);
        return pack;
    }
}
```

Register the entrypoint in `fabric.mod.json` (`"datagen": ["...MyModDataGenerator"]`) and enable datagen in `build.gradle`:

```groovy
fabricApi { configureDataGeneration() }
```

## Model + blockstate (simple block)

```java
public class MyModelProvider extends FabricModelProvider {
    public MyModelProvider(FabricDataGenerator.Pack pack) { super(pack); }

    @Override
    public void generateBlockStateModels(BlockStateModelGenerator gen) {
        gen.registerSimpleCubeAll(MyMod.MY_BLOCK);       // full cube
        gen.registerNorthDefaultHorizontalRotated(MyMod.MY_STAIRS, ...); // variants
    }

    @Override
    public void generateItemModels(ItemModelGenerator gen) {
        gen.register(MyMod.MY_ITEM, Models.GENERATED);
    }
}
```

## Recipes

```java
public class MyRecipeProvider extends FabricRecipeGenerator {
    @Override
    public void generate(RecipeExporter exporter) {
        ShapedRecipeJsonBuilder.create(RecipeCategory.MISC, MyMod.MY_ITEM, 1)
            .pattern("SSS").pattern("S S")
            .input('S', Items.STICK)
            .criterion("has_stick", RecipeProvider.conditionsFromItem(Items.STICK))
            .offerTo(exporter, new Identifier("mymod", "my_item"));
    }
}
```

## Loot table

```java
public class MyLootTableProvider extends FabricLootTableProvider {
    @Override
    public void generate() {
        addBlock(MyMod.MY_BLOCK, (block) ->
            LootTable.builder().pool(LootPool.builder().rolls(ConstantLootNumberProvider.create(1))
                .with(BlockLootTableGenerator.drops(block))));
    }
}
```

## Sounds.json via datagen

Use `SoundDefinitionsProvider` (or hand-write `assets/<modid>/sounds.json`):

```json
{
  "mymod:my_sound": { "subtitle": "subtitles.mymod.my_sound", "sounds": ["mymod:my_sound"] }
}
```

The audio file goes to `assets/<modid>/sounds/my_sound.ogg` (Vorbis, 44100 Hz mono recommended).

## Key points

- Generated files land in `src/main/generated/` — commit them; datagen output is a build artifact the game needs.
- A block needs a model, a blockstate mapping variants, and the item model before it renders correctly.
- Loot tables are required or blocks drop nothing.

<!--
Source references:
- https://docs.fabricmc.net/develop/data-generation
-->
