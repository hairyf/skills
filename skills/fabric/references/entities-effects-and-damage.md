---
name: fabric-effects-and-damage
description: Custom mob effects and data-driven damage types with death messages and tags.
---

# Mob Effects & Damage Types

## Custom Mob Effects

```java
public class TaterEffect extends MobEffect {
    public TaterEffect(MobEffectCategory category, int color) { super(category, color); }

    @Override
    public boolean applyEffectTick(ServerLevel level, LivingEntity entity, int amplifier) {
        entity.giveExperiencePoints(1); // every tick
        return true;
    }

    @Override
    public boolean shouldApplyEffectTickThisTick(int duration, int amplifier) { return true; }
}
```

Register: `Registry.register(BuiltInRegistries.MOB_EFFECT, Identifier.fromNamespaceAndPath("example-mod", "tater"), new TaterEffect(MobEffectCategory.NEUTRAL, 0xAA00AA))`. Icon: 18×18 PNG at `assets/<mod>/textures/mob_effect/tater.png`. Translation: `"effect.example-mod.tater": "Tater"`.

Apply with `LivingEntity#addEffect(new MobEffectInstance(effectHolder, durationTicks, amplifier, ambient, particles, icon))`. Test with `/effect give @p example-mod:tater`.

## Custom Damage Types (data-driven)

`data/<mod>/damage_type/tater.json`:

```json
{
  "message_id": "tater",
  "exhaustion": 0.1,
  "scaling": "when_caused_by_living_non_player",
  "effects": "hurt"
}
```

Build a `DamageSource` and hurt the entity:

```java
ResourceKey<DamageType> key = ResourceKey.create(Registries.DAMAGE_TYPE,
    Identifier.fromNamespaceAndPath("example-mod", "tater"));
DamageSource source = level.damageSources().source(key);
entity.hurtServer(level, source, 5.0f);
```

Death message: `"death.attack.tater": "%1$s died from Tater damage!"`. Control bypass behavior via damage type tags (`data/minecraft/tags/damage_type/bypasses_armor.json` with `"replace": false`).

<!--
Source references:
- https://docs.fabricmc.net/develop/entities/effects
- https://docs.fabricmc.net/develop/entities/damage-types
-->
