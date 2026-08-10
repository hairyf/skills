---
name: core-animation-controller
description: GeckoLib 4.x AnimationController — state handlers, PlayState, RawAnimation, triggers, DefaultAnimations.
---

# Animation Controllers

`AnimationController` is the class that decides which animation plays. Each controller handles **one** animation at a time; an animatable can have many controllers for concurrent, layered animations.

## Registration

```java
@Override
public void registerControllers(AnimatableManager.ControllerRegistrar controllers) {
    controllers.add(new AnimationController<>(this, "move", 5, this::moveHandler));
}

protected PlayState moveHandler(AnimationState<MyEntity> state) {
    return state.isMoving()
        ? state.setAndContinue(RawAnimation.begin().thenLoop("move.walk"))
        : state.setAndContinue(RawAnimation.begin().thenLoop("misc.idle"));
}
```

Constructor: `(animatable, name, transitionTickTime, animationStateHandler)`. `transitionTickTime` smooths blending between animations (in ticks).

## PlayState & state handler

- The handler is called **every render frame** — treat it as the current state, not a start/stop command.
- Return `state.setAndContinue(anim)` to ensure that animation plays, or `PlayState.STOP` to play nothing.
- `state.isMoving()`, `state.resetCurrentAnimation()` (restart from the beginning), and arbitrary entity conditions (e.g. `swinging` / `handSwinging`, `tickCount < 100`) drive the logic.

```java
// attack: reset when the swing ends so it can replay
controllers.add(new AnimationController<>(this, "attack", 0, state -> {
    if (this.handSwinging)
        return state.setAndContinue(RawAnimation.begin().thenPlay("attack.swing"));
    state.resetCurrentAnimation();
    return PlayState.STOP;
}));
```

## RawAnimation

```java
RawAnimation.begin().thenLoop("move.walk").thenPlay("attack.swing");
```

Chain `.thenLoop(...)`, `.thenPlay(...)`, `.thenPlayXTimes(anim, n)`. Names must match the animation JSON.

## Multiple controllers

Controllers run in registration order; **later controllers override earlier ones**. Register broad animations first (walk/idle), specific ones later (attack) so they layer.

## Triggered (one-shot) animations

```java
controllers.add(new AnimationController<>(this, "shoot", state -> PlayState.STOP)
    .triggerableAnim("shoot", RawAnimation.begin().thenPlay("attack.shoot")));
```

Trigger from server side (works in 4.x):

```java
if (entity instanceof GeoEntity geo)
    geo.triggerAnim("shoot", "shoot");
```

While a triggered animation plays, the state handler is skipped; it resumes when finished. `.receiveTriggeredAnimations()` opts a controller back into state handling (check `isPlayingTriggeredAnimation()`).

## DefaultAnimations

`DefaultAnimations` ships ready-made constants and controllers:

```java
DefaultAnimations.IDLE, .WALK, .RUN, .ATTACK_SWING, .SWIM, ...
DefaultAnimations.genericWalkIdleController(this)
```

Using them assumes standard animation names in the JSON: `move.walk`, `misc.idle`, etc.

## Controller factory settings

- `setSoundKeyframeHandler(...)`, `setParticleKeyframeHandler(...)`, `setCustomInstructionKeyframeHandler(...)` — keyframe triggers.
- `setAnimationSpeed(2.0)`, `setAnimationSpeedHandler(...)` — playback rate.
- `setOverrideEasingType(...)` — force easing.

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/The-Animation-Controller-(Geckolib4)
- https://github.com/bernie-g/geckolib/wiki/Triggerable-Animations-(Geckolib4)
-->
