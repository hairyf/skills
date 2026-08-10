---
name: fabric-custom-recipe-types
description: RecipeInput, Recipe, serializers (MapCodec + StreamCodec), recipe book hooks, and synchronization.
---

# Custom Recipe Types

Custom recipe types let you data-drive your own crafting mechanics (e.g. an upgrading block).

## Recipe Input

```java
public record UpgradingRecipeInput(ItemStack base, ItemStack addition) implements RecipeInput {
    @Override
    public ItemStack getItem(int index) { return index == 0 ? base : addition; }

    @Override
    public int size() { return 2; }
}
```

## Recipe Class

Implement `Recipe<UpgradingRecipeInput>` with fields for `Ingredient`s and result. Key methods:

- `matches(input, level)` — `ingredient.test(input.base())` etc.
- `assemble(input, registries)` — build the result `ItemStack`.
- `getSerializer()` / `getType()` — return registered objects.
- Recipe book hooks: `placementInfo()` (return `PlacementInfo.NOT_PLACEABLE`), `showNotification()`, `group()`, `recipeBookCategory()`; override `isSpecial()` → true to prevent recipe-book logic errors.

## Serializer

```java
public static final RecipeSerializer<UpgradingRecipe> SERIALIZER = new SimpleRecipeSerializer<>(UpgradingRecipe::new) {
    @Override
    public MapCodec<UpgradingRecipe> codec() {
        return RecordCodecBuilder.mapCodec(instance -> instance.group(
            Ingredient.CODEC.fieldOf("base").forGetter(UpgradingRecipe::base),
            Ingredient.CODEC.fieldOf("addition").forGetter(UpgradingRecipe::addition),
            ItemStack.CODEC.fieldOf("result").forGetter(UpgradingRecipe::result)
        ).apply(instance, UpgradingRecipe::new));
    }

    @Override
    public StreamCodec<RegistryFriendlyByteBuf, UpgradingRecipe> streamCodec() {
        return StreamCodec.composite(
            Ingredient.STREAM_CODEC, UpgradingRecipe::base,
            Ingredient.STREAM_CODEC, UpgradingRecipe::addition,
            ItemStack.STREAM_CODEC, UpgradingRecipe::result,
            UpgradingRecipe::new);
    }
};
```

Register type + serializer:

```java
public static final RecipeType<UpgradingRecipe> TYPE = Registry.register(
    BuiltInRegistries.RECIPE_TYPE, Identifier.fromNamespaceAndPath("example-mod", "upgrading"),
    new RecipeType<>() { });
public static final RecipeSerializer<UpgradingRecipe> SERIALIZER = Registry.register(
    BuiltInRegistries.RECIPE_SERIALIZER, Identifier.fromNamespaceAndPath("example-mod", "upgrading"), SERIALIZER);
```

Recipe JSON: `data/<mod>/recipe/upgrading/diamond_pickaxe.json` with `"type": "example-mod:upgrading"` plus the codec fields.

## Client Synchronization

Recipes are server-side only by default. If clients need them (stonecutter-style displays, JEI-like viewers):

```java
RecipeSynchronization.synchronizeRecipeSerializer(UpgradingRecipe.SERIALIZER);
```

Then read recipes on the client via `client.level.recipeAccess().getRecipeFor(...)`.

<!--
Source references:
- https://docs.fabricmc.net/develop/recipes/custom-recipe-types
-->
