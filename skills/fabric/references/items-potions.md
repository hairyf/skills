---
name: fabric-potions
description: Registering custom potions and brewing recipes.
---

# Potions

## Register a Potion

```java
public class ExampleModPotions implements ModInitializer {
    public static final ResourceKey<Potion> TATER_KEY = ResourceKey.create(Registries.POTION,
        Identifier.fromNamespaceAndPath("example-mod", "tater"));
    public static final Holder<Potion> TATER = Registry.registerForHolder(BuiltInRegistries.POTION, TATER_KEY,
        new Potion(new MobEffectInstance(ModEffects.TATER, 20 * 30, 0)));

    @Override
    public void onInitialize() {
        FabricPotionBrewingBuilder.BUILD.register(builder ->
            builder.addMix(Potions.WATER, Items.POTATO, TATER));
    }
}
```

`MobEffectInstance` args: `Holder<MobEffect>` effect, duration in ticks, amplifier (`1` = level II). Use holders (`Registry.registerForHolder`) because brewing/vanilla APIs prefer `Holder<Potion>`.

## Brewing Recipe

`FabricPotionBrewingBuilder.BUILD` (the 26.x name; formerly `FabricBrewingRecipeRegistryBuilder`) — `addMix(from: Holder<Potion>, ingredient: Item, to: Holder<Potion>)`.

## Key Points

- Potion tags for datagen use the `ResourceKey`.
- Create custom effects first (see `entities-effects-and-damage`).

<!--
Source references:
- https://docs.fabricmc.net/develop/items/potions
-->
