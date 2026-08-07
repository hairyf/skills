---
name: fabric-datagen-models-and-translations
description: Generating block/item models, blockstates, client items and language files.
---

# Model & Translation Generation

## Language Provider

```java
public class ExampleModEnglishLangProvider extends FabricLanguageProvider {
    public ExampleModEnglishLangProvider(FabricPackOutput output, CompletableFuture<HolderLookup.Provider> registries) {
        super(output, "en_us", registries);
    }

    @Override
    public void generateTranslations(TranslationBuilder translationBuilder) {
        translationBuilder.add(ModItems.SUSPICIOUS_SUBSTANCE, "Suspicious Substance");
        translationBuilder.add(ModBlocks.CONDENSED_DIRT, "Condensed Dirt");
        translationBuilder.add(CreativeModeTabTranslationKeys.of(ModCreativeTabs.EXAMPLE_TAB_KEY), "Example Mod");
        // also items, blocks, tags, stats, entities, effects, attributes, enchantments...
    }
}
```

One provider per language.

## Model Provider

```java
public class ExampleModModelProvider extends FabricModelProvider {
    public ExampleModModelProvider(FabricPackOutput output) { super(output); }

    @Override
    public void generateBlockStateModels(BlockStateModelGenerator gen) {
        gen.registerCubeAllModelTexturePool(ModBlocks.STEEL_BLOCK);            // cube_all + blockstate
        gen.registerSingleton(ModBlocks.PIPE_BLOCK, TexturedModel.CUBE_COLUMN); // textured singleton
        gen.registerCubeAllModelTexturePool(ModBlocks.RUBY_BLOCK)
            .family(ModBlocks.RUBY_FAMILY);                                     // stairs/slab/fence...
        gen.registerDoor(ModBlocks.RUBY_DOOR);                                  // top+bottom textures + item
        gen.registerTrapdoor(ModBlocks.RUBY_TRAPDOOR);                          // orientable variant available
    }

    @Override
    public void generateItemModels(ItemModelGenerators gen) {
        gen.registerFlatItemModel(ModItems.RUBY);                     // item/generated
        gen.registerHeldItemModel(ModItems.GUIDITE_AXE);              // item/handheld
        gen.registerDyeableItem(ModItems.LEATHER_GLOVES, 0xFFA06540); // dyeable + DyeRecipe needed
    }
}
```

Advanced item models: conditional (`IsKeybindDown`, `IsUsingItem`, `Broken`, `HasComponent`), composite (layered via `itemModelOutput.accept(...)`), select (`ContextDimension`, `MainHand`, `DisplayContext`, `ContextEntityType`), range dispatch (`Count`, `Cooldown`, `UseDuration`, `Damage`).

Custom parents/models: build `Model`/`ModelTemplate` referencing a hand-authored JSON (e.g. `scaled2x.json`), map `TextureSlot`s via `TextureMapping` (all slots in the parent must be mapped), and emit with `modelOutput`/`itemModelOutput`.

Register providers in `onInitializeDataGenerator` (`pack.addProvider(...)`).

<!--
Source references:
- https://docs.fabricmc.net/develop/data-generation/translations
- https://docs.fabricmc.net/develop/data-generation/block-models
- https://docs.fabricmc.net/develop/data-generation/item-models
-->
