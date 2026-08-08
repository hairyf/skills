---
name: geckolib-v4-animatable-pattern
description: The GeckoLib 4 animatable pattern — GeoAnimatable, per-type interfaces, AnimatableInstanceCache creation, controller registration, and DataTickets.
---

# GeckoLib 4 Animatable Pattern

Every GeckoLib 4 animatable implements `software.bernie.geckolib.core.animatable.GeoAnimatable` (directly or through a type interface) and overrides two methods:

```java
@Override
public void registerControllers(AnimatableManager.ControllerRegistrar controllers) { ... }

@Override
public AnimatableInstanceCache getAnimatableInstanceCache() {
    return this.cache;
}
```

Cache field (must be a `final` field, created once):

```java
private final AnimatableInstanceCache cache = GeckoLibUtil.createInstanceCache(this);
```

`createInstanceCache` picks `InstancedAnimatableInstanceCache` for entities/block entities and `SingletonAnimatableInstanceCache` for items/armor/other singletons automatically. Never instantiate the cache classes directly — use the factory so GeckoLib chooses correctly.

## Type interfaces

| Animatable | Interface | Renderer |
|---|---|---|
| Entity / projectile | `GeoEntity` | `GeoEntityRenderer` |
| Block entity | `GeoBlockEntity` | `GeoBlockRenderer` |
| Item | `GeoItem` | `GeoItemRenderer` (via render provider) |
| Armor | `GeoItem` (on `ArmorItem`) | `GeoArmorRenderer` (via render provider) |
| Replaced vanilla entity | `GeoReplacedEntity` | `GeoReplacedEntityRenderer` |
| Non-entity singleton | `SingletonGeoAnimatable` | varies |

Item/armor singletons must additionally register for network sync in the constructor:

```java
SingletonGeoAnimatable.registerSyncedAnimatable(this);
```

## Other GeoAnimatable defaults

- `getTick(Object)` — animation age in ticks; entities return `tickCount`, items use the ItemStack, block entities the world game time.
- `getBoneResetTime()` — how fast bones return to their default pose when no animation touches them (default 1).
- `shouldPlayAnimsWhileGamePaused()` — default false.
- `animatableCacheOverride()` — only override if you know what you're doing.

## DataTickets

`AnimationState#getData(DataTicket<D>)` retrieves render-time context. Built-in tickets in `software.bernie.geckolib.constant.DataTickets`:

| Ticket | Value |
|---|---|
| `ENTITY` | the entity being rendered |
| `BLOCK_ENTITY` | the block entity |
| `ITEMSTACK` | the item stack |
| `EQUIPMENT_SLOT` | armor slot |
| `ENTITY_MODEL_DATA` | head yaw/pitch (for head tracking) |
| `TICK` | current tick |
| `ITEM_RENDER_PERSPECTIVE` | `ItemDisplayContext` for perspective-aware items |

Serializable tickets (synced over network) are covered in [Triggerable Animations & Data Syncing](v4-triggerable-animations.md).

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/Defining-Animations-in-Code-(Geckolib4)
- https://github.com/bernie-g/geckolib/wiki/Geckolib-4-Changes
- https://github.com/bernie-g/geckolib/tree/1.20.1 (v4.4.9)
-->
