---
name: fabric-data-components
description: Registering and using custom DataComponentTypes on ItemStacks.
---

# Custom Data Components

Since 1.20.5, per-stack data uses **Data Components** (typed, codec-based) instead of raw NBT.

## Register a Component

```java
public class ModComponents {
    public static final DataComponentType<Integer> CLICK_COUNT = Registry.register(
        BuiltInRegistries.DATA_COMPONENT_TYPE,
        Identifier.fromNamespaceAndPath("example-mod", "click_count"),
        DataComponentType.<Integer>builder()
            .persistent(ExtraCodecs.POSITIVE_INT)
            .networkSynchronized(ExtraCodecs.POSITIVE_INT)
            .build()
    );

    public static void initialize() { }
}
```

## Reading / Writing

```java
int count = stack.get(ModComponents.CLICK_COUNT);                 // null if missing
int count = stack.getOrDefault(ModComponents.CLICK_COUNT, 0);     // safe default
boolean has = stack.has(ModComponents.CLICK_COUNT);
int old = stack.set(ModComponents.CLICK_COUNT, count + 1);        // returns old value
int removed = stack.remove(ModComponents.CLICK_COUNT);
```

Set a default on new items:

```java
new Item.Properties().component(ModComponents.CLICK_COUNT, 0)
```

## Composite Components

For multiple fields, use a `record` with a `RecordCodecBuilder` codec (`fieldOf` / `optionalFieldOf` / `forGetter` / `apply`), then register it as `persistent(codec)`. Update by replacing the whole record (records are immutable). Tooltips: implement `TooltipProvider` on the component and register via `ItemComponentTooltipProviderRegistry.addAfter(DataComponents.DAMAGE, component)` — preferred over the deprecated `appendHoverText`.

## Commands

```mcfunction
/give @p example-mod:counter[example-mod:click_count=5]
/give @p example-mod:counter[!example-mod:click_count]   # without the component
/give @p example-mod:advanced[example-mod:custom={temperature:8.2,burnt:true}]
```

## Key Points

- `persistent` codec saves to disk; `networkSynchronized` codec syncs to clients — provide both for synced components.
- Guard against missing components (`getOrDefault`/`has`) since `/give` can strip defaults.

<!--
Source references:
- https://docs.fabricmc.net/develop/items/custom-data-components
-->
