---
name: fabric-events
description: Fabric API event system: listening, loot table modification, and custom events.
---

# Events

Fabric API events are hooks (`net.fabricmc.fabric.api.event.Event`) that let mods react to game actions without mixins. Callbacks are usually exposed through a static `EVENT` field on a callback interface (e.g. `AttackBlockCallback.EVENT`); some APIs group events (`ClientTickEvents`, `ServerTickEvents`, `LootTableEvents`).

## Listening to an Event

Register in your initializer:

```java
AttackBlockCallback.EVENT.register((player, level, hand, pos, face) -> {
    // return PASS / SUCCESS / FAIL
    return InteractionResult.PASS;
});
```

## Modifying Loot Tables Without Overriding

Use `LootTableEvents.MODIFY` instead of shipping a replacement loot table JSON (which would break other mods):

```java
LootTableEvents.MODIFY.register((registries, key, builder, source) -> {
    if (key.equals(Blocks.COAL_ORE.getLootTable())) {
        LootPool pool = LootPool.lootPool()
            .add(LootItem.lootTableItem(Items.EGG))
            .build();
        builder.withPool(pool);
    }
});
```

## Custom Events

Create an interface with the callback method, a static `Event` field, and a default listener:

```java
@FunctionalInterface
public interface SheepShearCallback {
    Event<SheepShearCallback> EVENT = EventFactory.createArrayBacked(SheepShearCallback.class,
        listeners -> (player, sheep) -> {
            for (SheepShearCallback listener : listeners) {
                InteractionResult result = listener.interact(player, sheep);
                if (result != InteractionResult.PASS)
                    return result;
            }
            return InteractionResult.PASS;
        });

    InteractionResult interact(Player player, Sheep sheep);
}
```

Trigger it from a mixin using `SheepShearCallback.EVENT.invoker().interact(...)`. Use `InteractionResult` return values so listeners can cancel (`FAIL`), finish (`SUCCESS`), or defer (`PASS`) cooperatively.

## Key Points

- Prefer events over mixins when Fabric API provides a hook — better compatibility and performance.
- Events are the place to register callbacks like `CommandRegistrationCallback`, `CreativeModeTabEvents.modifyOutputEvent`, `FuelValueEvents.BUILD`, `FabricPotionBrewingBuilder.BUILD`.

<!--
Source references:
- https://docs.fabricmc.net/develop/events
-->
