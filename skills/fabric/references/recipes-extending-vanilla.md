---
name: fabric-extending-vanilla-recipes
description: Extending Smithing, Crafting, and Stonecutter recipes for existing workstations.
---

# Extending Vanilla Recipes

For existing workstations you only add a recipe class + serializer + JSON — block/menu/screen already exist. The workstation's `RecipeType` constrains which recipe interface to implement:

## Smithing Table

Implement `SmithingRecipe` (or extend `SimpleSmithingRecipe`). Beyond the normal `template`/`base`/`addition` ingredients you can hold any data (e.g. an enchantment map) and compute the result in `assemble` via `EnchantmentHelper`. Provide `PlacementInfo` and a `RecipeDisplay`/`SlotDisplay` so the recipe book can show the (dynamic) result — use a custom `SlotDisplay` (plus a mixin invoker for `applyDemoTransformation`) when the result derives from the base stack.

## Crafting Table

Implement `CraftingRecipe`; if `ShapedRecipe`/`ShapelessRecipe` don't fit, extend `CustomRecipe` (e.g. potion-into-stew infusion with custom logic in `assemble`).

## Stonecutter

Extend the class `StonecutterRecipe` (not an interface) and override `assemble`. Stonecutter recipes are kept separate in `RecipeAccess` because the stonecutter menu lists all valid recipes for its single input.

## Common Steps

For each: create the recipe class, implement `matches`/`assemble`, build a serializer with `MapCodec` + `StreamCodec`, register the serializer (`BuiltInRegistries.RECIPE_SERIALIZER`), and add a data-driven recipe JSON (`"type": "<mod>:<serializer>"`). Register custom `SlotDisplay` types with `BuiltInRegistries.SLOT_DISPLAY`.

Remember: your recipes are limited by the menu's input/output slots unless you modify the underlying menu (see `blocks-containers` for workstations).

<!--
Source references:
- https://docs.fabricmc.net/develop/recipes/extending-vanilla-recipes
-->
