---
name: fabric-block-containers
description: Implementing Container/WorldlyContainer on block entities and creating container menus and screens.
---

# Block Containers & Menus

## Container

Implement `Container` on your block entity to make it hopper-compatible. Copy the `ImplementedContainer` helper (from the reference mod) for the repetitive methods, keep an item list, and save with `ContainerHelper.saveAllItems(output, items)` / `ContainerHelper.loadAllItems(input, items)`.

Interact via `useItemOn` (check empty slot, move stack, return `InteractionResult.SUCCESS`).

## Worldly Containers

Implement `WorldlyContainer` for side-aware insert/extract:

- `getSlotsForFace(Direction)` — slot indices per face.
- `canPlaceItemThroughFace(int, ItemStack, Direction)` / `canTakeItemThroughFace(...)` — insertion/extraction rules.

## Container Menus

Opening a container needs a `Menu` (sync + shift-click logic) and a `Screen` (rendering).

Block entity implements `MenuProvider` (`getDisplayName` + `createMenu`):

```java
@Override
public Component getDisplayName() {
    return Component.translatable("block.example-mod.dirt_chest");
}

@Override
public Menu createMenu(int syncId, Inventory inv, Player player) {
    return new DirtChestMenu(syncId, inv, this);
}
```

Open from the block's `useWithoutItem` with `player.openMenu(blockEntity)`. The menu extends `AbstractContainerMenu` (two constructors: client creates an empty container; server passes the real one), implements `quickMoveStack` for shift-click, and `stillValid` uses `ContainerHelper.stillValid(...)` so the menu closes out of range.

Register the menu type:

```java
public static final MenuType<DirtChestMenu> DIRT_CHEST = Registry.register(
    BuiltInRegistries.MENU, Identifier.fromNamespaceAndPath("example-mod", "dirt_chest"),
    new MenuType<>(DirtChestMenu::new));
```

Screen extends `AbstractContainerScreen<DirtChestMenu>` (constructor + `renderBg`), bound on the client:

```java
MenuScreens.register(ModMenuTypes.DIRT_CHEST, DirtChestScreen::new);
```

## Workstations (Crafting-Style Menus)

Workstation menus can skip block entities: make the block return a `SimpleMenuProvider` from `useWithoutItem` (`player.openMenu(...)`), build a menu with input slots + a custom result `Slot` (`mayPlace` false, `onTake` consumes inputs), use `ContainerLevelAccess.execute` for safe level access, check recipes via `serverLevel.recipeAccess().getRecipeFor(...)`, drop inputs in `removed`, and implement careful `quickMoveStack` (result → inventory → inputs → hotbar). `stillValid` must reference the **block opening the menu** or the UI closes immediately.

<!--
Source references:
- https://docs.fabricmc.net/develop/blocks/block-containers
- https://docs.fabricmc.net/develop/blocks/container-menus
- https://docs.fabricmc.net/develop/blocks/workstations
-->
