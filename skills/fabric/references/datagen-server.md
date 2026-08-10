---
name: fabric-datagen-server
description: Generating recipes, tags, loot tables, advancements, and enchantments.
---

# Server-Side Data Generation

## Recipes

```java
public class ExampleModRecipeProvider extends FabricRecipeProvider {
    // constructor with output + registries
    @Override
    public void buildRecipes(RecipeOutput exporter) {
        shapeless(RecipeCategory.MISC, ModItems.SUSPICIOUS_SUBSTANCE)
            .requires(Items.STICK).requires(Items.COAL)
            .unlockedBy("has_stick", has(Items.STICK))
            .save(exporter);

        shaped(RecipeCategory.BUILDING_BLOCKS, ModBlocks.CONDENSED_DIRT)
            .pattern("##").pattern("##")
            .define('#', Items.DIRT)
            .unlockedBy("has_dirt", has(Items.DIRT))
            .save(exporter);

        // smelting with experience; smoking uses its own generator;
        // dye recipes: specialDyeRecipe(...)
        // resource conditions: exporter.withConditions(condition)
    }
}
```

## Tags

```java
public class ExampleModItemTagProvider extends FabricTagsProvider.ItemTagsProvider {
    // constructor with output + registries + block provider
    @Override
    public void addTags(ItemTagProvider tagBuilder) {
        TagKey<Item> key = TagKey.create(Registries.ITEM, Identifier.fromNamespaceAndPath("example-mod", "smelly"));
        tagBuilder.getOrCreateTagBuilder(key)
            .add(ModItems.SUSPICIOUS_SUBSTANCE)
            .addOptionalTag(ItemTags.DIRT)   // tag may not exist yet
            .forceAddTag(ItemTags.SWORDS);   // add even if malformed
    }
}
```

One provider per registry type (items, blocks, fluids, entity types, enchantments...). `replace(false)` semantics can be set on the builder.

## Loot Tables

- Blocks: extend `FabricBlockLootSubProvider` (26.x name; was `FabricBlockLootTableProvider`) — helpers like `dropSelf(block)`, `dropOther(block, item)`, `when(...)` conditions, `apply(...)` functions.
- Chests/containers/entities: extend `SimpleFabricLootTableSubProvider` with a `ResourceKey<LootTable>` from a `ModLootTables` class (main source set), build pools with `LootPool.lootPool()`, entries, rolls/bonus rolls.
- Resource conditions: `withConditions(...)` before dropping.

## Advancements

Extend `FabricAdvancementProvider`; build with `Advancement.Builder.advancement()`:

- `.parent(parentRef)` or `.parent(Identifier)` placeholder for vanilla parents.
- `.addCriterion("got_dirt", has(Items.DIRT))`; multiple criteria default to AND; supply a different `AdvancementRequirements` strategy for OR.
- `.rewards(AdvancementRewards.Builder.experience(10).loot(table))`.
- Custom criteria: `SimpleCriterionTrigger` subclass + `Conditions` (with a player predicate + `CODEC`), registered in a `ModCriteria` class, triggered from your code.

## Enchantments (Dynamic Registry)

Extend `FabricDynamicRegistryProvider`; override `configure` + `getName`, add a `register` helper and `bootstrap` that builds `Enchantment.Builder.enchantment(...).withEffect(...)` entries. Register the bootstrap in `buildRegistry` (`registryBuilder.addRegistry(Registries.ENCHANTMENT, ...)`). Use `EnchantmentTags.NON_TREASURE` for enchanting-table availability and `CURSE` tag for curses via a `FabricTagsProvider<Enchantment>`.

<!--
Source references:
- https://docs.fabricmc.net/develop/data-generation/recipes
- https://docs.fabricmc.net/develop/data-generation/tags
- https://docs.fabricmc.net/develop/data-generation/loot-tables
- https://docs.fabricmc.net/develop/data-generation/advancements
- https://docs.fabricmc.net/develop/data-generation/enchantments
-->
