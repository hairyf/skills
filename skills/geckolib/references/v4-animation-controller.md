---
name: geckolib-v4-animation-controller
description: GeckoLib 4 AnimationController — constructor settings, PlayState/AnimationState, RawAnimation, DefaultAnimations, transitions, easings, and custom loop/easing types.
---

# GeckoLib 4 Animation Controllers

`software.bernie.geckolib.core.animation.AnimationController` plays **one** animation at a time. Register several controllers for concurrent animation groups; controllers run in registration order, and later-registered controllers win bone conflicts. Register "broad" controllers (walk/idle) first, specific ones (attack) later.

## Constructors

```java
new AnimationController<>(this, "name", transitionTicks, state -> PlayState.CONTINUE)
```

Parameters:

- `animatable` — the `GeoAnimatable` instance.
- `name` — unique controller name (used by `triggerAnim`).
- `transitionTickTime` — ticks spent interpolating between animations (0 snaps instantly).
- `animationHandler` — predicate called **every render frame**; returns a `PlayState`.

## AnimationState handler

`AnimationState<T>` gives you live state:

- `isMoving()`, `getLimbSwing()`, `getLimbSwingAmount()`, `getPartialTick()`, `getAnimationTick()`, `getAnimatable()`
- `getData(DataTicket<D>)` — render context (entity, itemstack, perspective, ...)
- `setAndContinue(RawAnimation)` — start/keep an animation, returns `PlayState.CONTINUE`
- `setAnimation(RawAnimation)` — set the animation and return `PlayState.CONTINUE` separately
- `resetCurrentAnimation()` — force a non-looping animation to restart next time
- `isCurrentAnimation(RawAnimation)`, `isCurrentAnimationStage(String)` — checks
- `setControllerSpeed(float)` — per-frame speed override
- `getController()` — the controller itself

Returning `PlayState.STOP` stops the controller; `PlayState.CONTINUE` starts/continues the animation set in the handler.

```java
controllers.add(new AnimationController<>(this, "Walk/Run", 5, state -> {
    if (state.isMoving())
        return state.setAndContinue(MyEntity.this.isSprinting() ? DefaultAnimations.RUN : DefaultAnimations.WALK);
    return state.setAndContinue(DefaultAnimations.IDLE);
}));
```

## Animation manipulation

- `setAnimation(RawAnimation)` caches the last builder, so calling it every frame is safe; a non-looping animation will only play once. Call `forceAnimationReset()` to replay the same animation.
- `stop()` stops the controller; `hasAnimationFinished()` reports completion.
- `getAnimationState()` returns `Running`, `Transitioning`, or `Stopped`.
- `setTransitionLength(int)` / `transitionLength(int)` adjust interpolation dynamically.
- `setAnimationSpeed(double)` / `setAnimationSpeedHandler(Function<T, Double>)` change playback speed.
- `setOverrideEasingType(EasingType)` / `setOverrideEasingTypeFunction(...)` override per-controller easing (null reverts to the JSON easing).

## RawAnimation

```java
private static final RawAnimation DEPLOY_ANIM = RawAnimation.begin().thenPlay("misc.deploy").thenLoop("misc.idle");
```

Chain methods: `thenPlay(name)` (loop per JSON definition), `thenLoop(name)`, `thenPlayAndHold(name)`, `thenPlayXTimes(name, count)`, `thenWait(ticks)`, `then(name, LoopType)`, `RawAnimation.copyOf(other)`. By default the loop behavior comes from the animation JSON. Cache `RawAnimation` instances in `static final` fields.

## DefaultAnimations

`software.bernie.geckolib.constant.DefaultAnimations` ships raw animations and ready-made controller factories. Raw animations assume standard names (`misc.idle`, `move.walk`, `move.run`, `move.fly`, `attack.swing`, `attack.strike`, `attack.shoot`, `misc.die`, `misc.spawn`, ...).

```java
controllers.add(
    DefaultAnimations.genericWalkIdleController(this),
    DefaultAnimations.genericAttackAnimation(this, DefaultAnimations.ATTACK_STRIKE)
);
```

`genericAttackAnimation` requires the entity to actually swing (`swing()` or a goal that calls it); if your animation is longer than the default 6-tick swing, override `getCurrentSwingDuration()`.

## Custom loop and easing types

Register in your **mod constructor** (before JSON deserialization):

```java
GeckoLibUtil.addCustomLoopType("my_loop", (keyframeData, tick, animation, animatable, state) -> { ... });
GeckoLibUtil.addCustomEasingType("my_easing", x -> x * x); // input 0..1 -> output eased
```

Then use `"loop": "my_loop"` in animation JSON or `setOverrideEasingType` with your custom type.

## Triggered animations

`.triggerableAnim("shoot", SHOOT_ANIM)` registers a one-shot trigger; `triggerAnim` (server or client) plays it, bypassing the handler until it finishes. `.receiveTriggeredAnimations()` lets the handler interrupt them; check `isPlayingTriggeredAnimation()` in your predicate. See [Triggerable Animations & Data Syncing](v4-triggerable-animations.md).

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/The-Animation-Controller-(Geckolib4)
- https://github.com/bernie-g/geckolib/wiki/Defining-Animations-in-Code-(Geckolib4)
- https://github.com/bernie-g/geckolib/wiki/Geckolib-4-Changes
- https://github.com/bernie-g/geckolib/tree/1.20.1 (v4.4.9)
-->
