---
name: fabric-creative-tabs
description: Building and registering custom creative mode tabs.
---

# Custom Creative Tabs

```java
public static final ResourceKey<CreativeModeTab> EXAMPLE_TAB_KEY = ResourceKey.create(
    Registries.CREATIVE_MODE_TAB, Identifier.fromNamespaceAndPath("example-mod", "tab"));

public static final CreativeModeTab EXAMPLE_TAB = Registry.register(
    BuiltInRegistries.CREATIVE_MODE_TAB,
    EXAMPLE_TAB_KEY,
    FabricCreativeModeTab.builder()
        .title(Component.translatable("creativeTab.example-mod"))
        .icon(() -> new ItemStack(ModItems.SUSPICIOUS_SUBSTANCE))
        .build()
);
```

Add items via `CreativeModeTabEvents.modifyOutputEvent(EXAMPLE_TAB_KEY)` (26.x name for `ItemGroupEvents`). Translation key for the tab title: `creativeTab.<namespace>`.

## Key Points

- Use a `Component.translatable` title and ship the `creativeTab.example-mod` translation.
- `FabricCreativeModeTab.builder()` supports `.build()` with custom icon lambda; keep ordering/insert helpers (`output.insertAfter(...)`) for compatibility with other mods.

<!--
Source references:
- https://docs.fabricmc.net/develop/items/custom-creative-tabs
-->
