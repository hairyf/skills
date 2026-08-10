---
name: geckolib-v4-keyframe-triggers
description: GeckoLib 4 keyframe triggers — sound, particle, and custom instruction keyframes, plus the built-in AutoPlayingSoundKeyframeHandler.
---

# GeckoLib 4 Keyframe Triggers

GeckoLib can fire callbacks from animation keyframes. In Blockbench, use **Animation → Animate Effects** to add global keyframes, which land in the animation JSON as `sound`, `particle`, or custom instruction events.

## Sound keyframes

Attach a `SoundKeyframeHandler` to the controller:

```java
controllers.add(new AnimationController<>(this, "controller", 5, state -> PlayState.CONTINUE)
        .setSoundKeyframeHandler(event -> {
            // event.getKeyframeData() has the sound id/params
            SoundEvent sound = event.getKeyframeData().getSound(event.getAnimatable());
            // play the sound...
        }));
```

### AutoPlayingSoundKeyframeHandler

Skip the boilerplate with the built-in handler:

```java
controllers.add(new AnimationController<>(this, "controller", 5, state -> PlayState.CONTINUE)
        .setSoundKeyframeHandler(new AutoPlayingSoundKeyframeHandler()));
```

Then the JSON instruction can be either of:

```
namespace:soundid
namespace:soundid|volume|pitch
```

## Particle keyframes

Attach a `ParticleKeyframeHandler` with `setParticleKeyframeHandler`; it is called at the keyframe time with the particle data (`event.getKeyframeData()` gives position/velocity/effects; see `ParticleKeyframeData`).

## Custom instruction keyframes

Attach a handler with `setCustomInstructionKeyframeHandler`; `CustomInstructionKeyframeData` carries the custom string from the animation JSON. Useful for anything that isn't a sound or particle (flags, knockback, teleports, state changes).

All three handler types are per-controller, so different controllers can trigger different effects.

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/Keyframe-Triggers-(Geckolib4)
- https://github.com/bernie-g/geckolib/tree/1.20.1 (v4.4.9)
-->
