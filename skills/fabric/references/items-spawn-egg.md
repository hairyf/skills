---
name: fabric-spawn-egg
description: Registering spawn egg items for custom entities.
---

# Spawn Eggs

Register like any item, using `SpawnEggItem::new`:

```java
public static final Item MINI_GOLEM_SPAWN_EGG = register(
    ModItemIds.CUSTOM_ENTITY_SPAWN_EGG,
    properties -> new SpawnEggItem(ModEntityTypes.MINI_GOLEM, 0x555555, 0x888888, properties),
    new Item.Properties()
);
```

`SpawnEggItem` constructor: entity type, base color, spot color, properties. (You can use a vanilla entity type like `EntityType.FROG` for testing.)

Assets:

- Texture: `assets/<mod>/textures/item/mini_golem_spawn_egg.png`.
- Model `assets/<mod>/models/item/mini_golem_spawn_egg.json`:

```json
{ "parent": "item/template_spawn_egg" }
```

- Client item `assets/<mod>/items/mini_golem_spawn_egg.json` → `{ "model": { "type": "minecraft:model", "model": "example-mod:item/mini_golem_spawn_egg" } }`.
- Translation `"item.example-mod.mini_golem_spawn_egg": "Mini Golem Spawn Egg"`.
- Add to the vanilla spawn egg creative tab via `CreativeModeTabEvents.modifyOutputEvent(CreativeModeTabs.SPAWN_EGGS)`.

<!--
Source references:
- https://docs.fabricmc.net/develop/items/spawn-egg
-->
