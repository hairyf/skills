---
name: geckolib-animation-controller
description: AnimationController logic — StateHandler predicates, PlayState, controller ordering, additive controllers, and DefaultAnimations.
---

# Animation Controllers

`AnimationController` is the class that decides when and how animations play for a `GeoAnimatable`. Each controller plays **one animation at a time**; an animatable can have as many controllers as it needs (one per simultaneously-playing animation group).

## Registration

Controllers are added in `registerControllers`:

```java
@Override
public void registerControllers(AnimatableManager.ControllerRegistrar controllers) {
    controllers.add(new AnimationController<>(animTest -> PlayState.STOP));
}
```

## StateHandler / AnimationTest

The predicate passed to the controller constructor is called **every render frame** and decides what to play. It receives an `AnimationTest` (GeckoLib 5's replacement for the old `AnimationState`) and returns a `PlayState`.

Use `setAndContinue` to both select an animation and keep playing:

```java
controllers.add(new AnimationController<>(test -> {
    if (test.isMoving())
        return test.setAndContinue(DefaultAnimations.WALK);

    return test.setAndContinue(DefaultAnimations.IDLE);
}));
```

Return `PlayState.STOP` to stop animating (the animatable keeps its last pose unless another controller covers it).

Common predicates:

- `test.isMoving()` — walk/run/idle switching
- `MyEntity.this.tickCount <= 100` — one-shot spawn animation
- `MyEntity.this.swinging` — attack animation

Repeatedly setting the same animation every pass is fine; GeckoLib ignores no-ops.

### The `swinging` boolean

- Non-`Monster` entities must call `updateSwingTime()` in `aiStep()` to advance arm swing.
- If the attack animation is longer than 6 ticks, override `getCurrentSwingDuration()` to return the animation length in ticks + 1 (e.g. `21` for a 1-second animation).

## Controller configuration

Chainable factory methods on the `AnimationController`:

| Method | Purpose |
|---|---|
| `setAnimationSpeed(double)` | Speed multiplier (`2` = twice as fast) |
| `setTransitionTicks(int)` | Ticks to transition into/out of/between animations |
| `setOverrideEasingType(EasingType)` | Force-override animation-defined easings |
| `additiveAnimations()` | Play additively instead of with priority |
| `setSoundKeyframeHandler(...)` | Handle sound keyframes |
| `setParticleKeyframeHandler(...)` | Handle particle keyframes |
| `setCustomInstructionKeyframeHandler(...)` | Handle custom instruction keyframes |
| `receiveTriggeredAnimations()` | Accept triggered animations in the StateHandler |
| `triggerableAnim(name, RawAnimation)` | Register a one-shot triggerable animation |

## Controller ordering & additive mode

A controller **overwrites** the same bone/transform animated by previously registered controllers. Register base animations (walk/idle) **before** higher-priority ones (attack):

```java
controllers.add(
    DefaultAnimations.genericWalkIdleController(),
    DefaultAnimations.genericAttackController(this));
```

Alternatively mark a controller additive — its values are added on top of earlier controllers instead of replacing them:

```java
controllers.add(
    DefaultAnimations.genericWalkIdleController(),
    DefaultAnimations.genericAttackController(this).additiveAnimations());
```

## DefaultAnimations

The `DefaultAnimations` class provides pre-built controllers and `RawAnimation` instances; prefer them over hand-rolled controllers whenever possible:

```java
controllers.add(DefaultAnimations.genericWalkIdleController());
controllers.add(DefaultAnimations.genericAttackController(this));
controllers.add(DefaultAnimations.triggerOnlyController());
```

Available controller factories (all take `GeoAnimatable`-typed `T` unless noted):

- `genericWalkIdleController()`, `genericWalkController()`, `genericIdleController()`, `genericLivingController()`
- `genericSwimController()`, `genericSwimIdleController()`, `genericFlyController()`, `genericFlyIdleController()`, `genericWalkFlyIdleController(Mob)`
- `genericDeathController()` (requires `LivingEntity`), `genericAttackAnimation(RawAnimation)`, `basicPredicateController(predicate)`, `getSpawnController(int spawnTicks)`, `triggerOnlyController()`

Pre-built `RawAnimation` constants include `WALK`, `RUN`, `SWIM`, `FLY`, `CRAWL`, `SNEAK`, `JUMP`, `IDLE`, `IDLE_FLYING`, `LIVING`, `SIT`, `DIE`, `SPAWN`, `INTERACT`, `ATTACK_SWING`, `ATTACK_BITE`, `ATTACK_SHOOT`, `ATTACK_STRIKE`, and more. They expect matching animation JSON names such as `misc.idle`, `misc.die`, `move.walk`, `move.run`, `attack.swing`, `attack.shoot`.

## RawAnimation builder

Build custom animations from animation JSON names:

```java
RawAnimation.begin()
    .thenPlay("attack.swing")     // play once
    .thenLoop("misc.idle")        // loop until changed/stopped
    .thenPlayAndHold("misc.sit")  // play once, hold last frame
    .thenWait(20)                 // hold current pose for ticks
    .thenPlayXTimes("move.walk", 3)
    .then("move.run", LoopType.LOOP); // explicit loop type
```

Loop types can be customized at runtime with `GeckoLibUtil.addCustomLoopType(name, LoopType)` (see [Keyframes & Molang](core-keyframes-and-molang.md)).

<!--
Source references:
- https://wiki.geckolib.com/docs/geckolib5/concepts/animation/controller/overview
- https://wiki.geckolib.com/docs/geckolib5/concepts/animation/controller/statehandler
- https://wiki.geckolib.com/docs/geckolib5/concepts/animation/controller/ordering
- https://wiki.geckolib.com/docs/geckolib5/concepts/animation/controller/defaultanimations
- https://wiki.geckolib.com/docs/geckolib5/updating/important/animationstate
-->
