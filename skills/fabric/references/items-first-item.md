---
name: fabric-first-item
description: Registering an item, adding it to a creative tab, naming, texturing and modelling it.
---

# Creating Your First Item

Everything in Minecraft lives in registries; items are registered into the item registry.

## Item ID Class

```java
public class ModItemIds {
    public static ResourceKey<Item> item(String name) {
        return ResourceKey.create(Registries.ITEM, Identifier.fromNamespaceAndPath("example-mod", name));
    }
    public static final ResourceKey<Item> SUSPICIOUS_SUBSTANCE = item("suspicious_substance");
}
```

Resource keys are also used for datagen (item tags).

## Registration Helper

```java
public class ModItems {
    public static <T extends Item> T register(ResourceKey<Item> key, Function<Item.Properties, T> factory, Item.Properties properties) {
        return Registry.register(BuiltInRegistries.ITEM, key, factory.apply(properties));
    }

    public static final Item SUSPICIOUS_SUBSTANCE = register(
        ModItemIds.SUSPICIOUS_SUBSTANCE, Item::new, new Item.Properties()
    );

    public static void initialize() { } // call from ModInitializer to force static init
}
```

`Item.Properties` configures stack size (`stacksTo(n)` — ignored for damageable items), food, durability, components, etc.

## Creative Tab

```java
CreativeModeTabEvents.modifyOutputEvent(ModCreativeTabs.EXAMPLE_TAB).register(output -> {
    output.accept(ModItems.SUSPICIOUS_SUBSTANCE);
});
// or add to a vanilla tab:
CreativeModeTabEvents.modifyOutputEvent(CreativeModeTabs.INGREDIENTS).register(output -> {
    output.accept(ModItems.SUSPICIOUS_SUBSTANCE);
});
```

## Name, Texture, Model, Client Item

1. Translation: `assets/<mod>/lang/en_us.json` → `"item.example-mod.suspicious_substance": "Suspicious Substance"`.
2. Texture: 16×16 PNG at `assets/<mod>/textures/item/suspicious_substance.png`.
3. Item model `assets/<mod>/models/item/suspicious_substance.json`:

```json
{ "parent": "item/generated", "textures": { "layer0": "example-mod:item/suspicious_substance" } }
```

4. Client item `assets/<mod>/items/suspicious_substance.json` (tells the game which model to use):

```json
{ "model": { "type": "minecraft:model", "model": "example-mod:item/suspicious_substance" } }
```

Most items use `item/generated`; tools/weapons use `item/handheld`.

## Compostable / Fuel

```java
CompostableRegistry.register(ModItems.SUSPICIOUS_SUBSTANCE, 0.3f);
FuelValueEvents.BUILD.register(context -> context.add(ModItems.SUSPICIOUS_SUBSTANCE, 200));
```

## Tooltips

Override `appendHoverText` (deprecated) or better: implement `TooltipProvider` on a component class and register via `ItemComponentTooltipProviderRegistry.addAfter(...)`, or use `ItemTooltipCallback` on the client.

<!--
Source references:
- https://docs.fabricmc.net/develop/items/first-item
-->
