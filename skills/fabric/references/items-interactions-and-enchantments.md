---
name: fabric-item-interactions-and-enchantments
description: Overridable item events and custom data-driven enchantment effects.
---

# Item Interactions & Enchantment Effects

## InteractionResult

Returned by interactions to signal `PASS` / `FAIL` / `SUCCESS`; a success can transform the held stack:

```java
ItemStack held = user.getStackInHand(hand);
held.decrement(1);
return InteractionResult.SUCCESS.heldItemTransformedTo().success(held);
```

## Overridable Item Methods

| Method | When it runs |
--------|--------------|
| `hurtEnemy` | Player hits an entity. |
| `mineBlock` | Player mines a block. |
| `inventoryTick` | Every tick while in an inventory. |
| `onCraftedPostProcess` | Item is crafted. |
| `useOn` | Right-click a block with the item. |
| `use` | Right-click the item in air. |

Example (lightning stick):

```java
@Override
public InteractionResult use(Level level, Player user, InteractionHand hand) {
    if (!level.isClientSide()) {
        Vec3 look = user.getLookAngle();
        LightningBolt bolt = EntityType.LIGHTNING_BOLT.create(level);
        bolt.moveTo(user.getX() + look.x * 10, user.getY(), user.getZ() + look.z * 10);
        level.addFreshEntity(bolt);
    }
    return InteractionResult.SUCCESS;
}
```

## Custom Enchantment Effects

Enchantments are data-driven since 1.21; custom *effects* are code. Implement an effect interface (e.g. `EnchantmentEntityEffect`):

```java
public record LightningEnchantmentEffect() implements EnchantmentEntityEffect {
    public static final MapCodec<LightningEnchantmentEffect> CODEC = MapCodec.unit(LightningEnchantmentEffect::new);

    @Override
    public void apply(ServerLevel level, int enchantmentLevel, EnchantmentContext context, Entity target, Vec3 pos) {
        // strike target with lightning, scaled by enchantmentLevel
    }

    @Override
    public MapCodec<? extends EnchantmentEntityEffect> codec() { return CODEC; }
}
```

Register the codec (`Registry.register(BuiltInRegistries.ENCHANTMENT_ENTITY_EFFECT_TYPE, id, CODEC)`), then define the enchantment JSON in `data/<mod>/enchantment/<id>.json` referencing your effect. Translate with `enchantment.<mod>.<id>`.

<!--
Source references:
- https://docs.fabricmc.net/develop/items/custom-item-interactions
- https://docs.fabricmc.net/develop/items/custom-enchantment-effects
-->
