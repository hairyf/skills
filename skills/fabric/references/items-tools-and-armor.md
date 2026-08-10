---
name: fabric-tools-and-armor
description: ToolMaterial, tool items, ArmorMaterial, armor items, textures and equipment models.
---

# Tools & Armor

## Tool Material

```java
public static final ToolMaterial GUIDITE = new ToolMaterial(
    TagKey.create(Registries.BLOCK, Identifier.fromNamespaceAndPath("example-mod", "incorrect_for_guidite_tool")),
    750,   // durability
    6.0f,  // mining speed
    2.5f,  // attack damage bonus
    15,    // enchantment value
    ModTags.Items.GUIDITE_REPAIR // repair item tag
);
```

The `incorrectBlocksForDrops` tag lists blocks that do **not** drop when mined with this material (vanilla pattern: `minecraft:incorrect_for_*_drops`). Inherit from weaker tags and remove entries, or append extra blocks to stronger ones. Don't pass an existing tag directly as the material's tag — define your own so users can configure it.

## Tool Items

```java
public static final Item GUIDITE_SWORD = register(ModItemIds.GUIDITE_SWORD,
    p -> new SwordItem(GUIDITE, 1f, 1f, p), new Item.Properties());
public static final Item GUIDITE_AXE = register(ModItemIds.GUIDITE_AXE,
    p -> new AxeItem(GUIDITE, 1f, 1f, p), new Item.Properties());
```

The two floats are attack damage and attack speed. Use `ShovelItem`/`AxeItem`/`HoeItem` for tool-specific right-click behaviors. Models use parent `item/handheld`. Add the items to `ItemTags.SWORDS` etc. for enchantability/sweeping.

## Armor Material

```java
public static final ResourceKey<EquipmentAsset> GUIDITE_EQUIPMENT = ResourceKey.create(
    Registries.EQUIPMENT_ASSET, Identifier.fromNamespaceAndPath("example-mod", "guidite"));

public static final ArmorMaterial GUIDITE_ARMOR_MATERIAL = new ArmorMaterial(
    15, // base durability
    Map.of(EquipmentType.HELMET, 2, EquipmentType.CHESTPLATE, 5, EquipmentType.LEGGINGS, 4, EquipmentType.BOOTS, 2),
    15,                       // enchantment value
    SoundEvents.ARMOR_EQUIP_DIAMOND, // equip sound
    0.0f,                     // toughness
    0.0f,                     // knockback resistance
    ModTags.Items.GUIDITE_REPAIR,
    GUIDITE_EQUIPMENT
);
```

Armor material does **not** store durability — pass `maxDamage(BASE_DURABILITY)` per piece:

```java
public static final Item GUIDITE_HELMET = register(ModItemIds.GUIDITE_HELMET,
    p -> new ArmorItem(GUIDITE_ARMOR_MATERIAL, EquipmentType.HELMET, p),
    new Item.Properties().maxDamage(15 * 11));
```

## Armor Textures & Equipment Models

Two texture layers, named after the asset id (`guidite.png`):

- `assets/<mod>/textures/entity/equipment/humanoid/guidite.png` (upper body + boots)
- `assets/<mod>/textures/entity/equipment/humanoid_leggings/guidite.png` (leggings)

Equipment model definition `assets/<mod>/equipment/guidite.json` (layers for `humanoid`/`humanoid_leggings`). Tag armor pieces (`ItemTags.CHEST_ARMOR`, ...).

<!--
Source references:
- https://docs.fabricmc.net/develop/items/custom-tools
- https://docs.fabricmc.net/develop/items/custom-armor
-->
