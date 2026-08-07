---
name: fabric-food
description: Edible items via FoodProperties and Consumable components.
---

# Food Items

Balance hunger/nutrition, saturation, and effects against other foods.

## Basic Food

```java
new Item.Properties()
    .food(new FoodProperties.Builder()
        .nutrition(4)                 // hunger points restored
        .saturationModifier(0.3f)     // saturation added
        .alwaysEdible()               // edible regardless of hunger
        .build());
```

## Effects on Eat

To grant mob effects, add a `Consumable` component alongside `FoodProperties`:

```java
public static final Item POISONOUS_APPLE = register(ModItemIds.POISONOUS_APPLE, Item::new,
    new Item.Properties()
        .food(new FoodProperties.Builder().nutrition(4).saturationModifier(0.3f).alwaysEdible().build())
        .component(DataComponents.CONSUMABLE, /* Consumable with an ApplyMobEffects entry: Poison II, 6s */));
```

See the reference mod's `ModItems#custom_food` for the exact `Consumable` builder shape (`Consumable` + `ConsumableEffects`/`ApplyMobEffects`).

## Key Points

- `nutrition` adds hunger points; `saturationModifier` adds saturation; `alwaysEdible` allows eating at full hunger.
- Effects use `MobEffectInstance`s with durations in ticks.

<!--
Source references:
- https://docs.fabricmc.net/develop/items/food
-->
