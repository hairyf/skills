---
name: geckolib-triggerable-animations
description: One-shot triggered animations — registering triggerableAnim, triggerAnim from client/server, items/armor specifics, and stopping animations.
---

# Triggerable Animations

Triggerable animations are one-shot animations fired on demand from either client or server, instead of being selected by a StateHandler predicate every frame.

## Registering

Append `.triggerableAnim(name, animation)` to the controller:

```java
@Override
public void registerControllers(AnimatableManager.ControllerRegistrar controllers) {
    controllers.add(new AnimationController<>(this, "shoot_controller", animTest -> PlayState.STOP)
        .triggerableAnim("shoot", DefaultAnimations.ATTACK_SHOOT));
}
```

## Triggering

Call `triggerAnim` on the animatable:

```java
if (!level().isClientSide())
    triggerAnim("shoot_controller", "shoot");
```

`triggerAnim(controllerName, animationName)` works on entities, block entities, and replaced entities from both sides.

## Items

Items are singletons, so they need network registration plus an owner + stack id when triggering:

```java
public ExampleItem(Properties properties) {
    super(properties);
    GeoItem.registerSyncedAnimatable(this);
}
```

```java
if (level instanceof ServerLevel serverLevel)
    triggerAnim(player, GeoItem.getOrAssignId(player.getItemInHand(hand), serverLevel), "shoot_controller", "shoot");
```

## Armor

Armor is two animatables (the `ItemStack` and the worn model). Use `triggerArmorAnim` to animate the worn armor model; register the item with `GeoItem.registerSyncedAnimatable(this)` first.

## Stopping

Stop a running triggered animation with the same arguments used to start it:

```java
stopTriggeredAnim("shoot_controller", "shoot");
```

## Trigger-only controller

If a controller exists only for triggers, use `DefaultAnimations.triggerOnlyController()` (controller name `Actions`):

```java
controllers.add(DefaultAnimations.triggerOnlyController()
    .triggerableAnim("Bite", DefaultAnimations.ATTACK_BITE));
```

## Use cases

- **One-off animations** — gun fire, monster roar: no state tracking needed.
- **Transition disguises** — a controller handles walk/idle states; a triggered "sit down"/"stand up" animation hides the swap between them.

<!--
Source references:
- https://wiki.geckolib.com/docs/geckolib5/miscellaneous/triggerable-animations
-->
