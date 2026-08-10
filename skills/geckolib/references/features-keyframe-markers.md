---
name: geckolib-keyframe-markers
description: Sound, particle, and custom-instruction keyframes — defining them in Blockbench and handling them in AnimationController.
---

# Keyframe Markers / Triggers

Keyframes can fire callbacks at precise animation times for sounds, particles, or arbitrary custom logic.

## Defining in Blockbench

In Blockbench: `Animation` → `Animate Effects` to open the effects panel, then add **global keyframes** to the timeline. GeckoLib supports three marker types:

- Sounds
- Particles
- Custom Instructions

## Handling in code

Attach handlers to the controller with the matching factory methods:

```java
controllers.add(new AnimationController<>(animTest -> PlayState.STOP)
    .setSoundKeyframeHandler(state -> {
        Player player = ClientUtil.getClientPlayer();
        if (player != null)
            player.playSound(SoundRegistry.EXAMPLE_SOUND.get(), 1, 1);
    })
    .setParticleKeyframeHandler(state -> {
        // spawn particles
    })
    .setCustomInstructionKeyframeHandler(state -> {
        // custom logic
    }));
```

Each handler receives the keyframe event context (including the keyframe name/data) at the marked time.

## AutoPlayingSoundKeyframeHandler

Skip the boilerplate for sound keyframes:

```java
controllers.add(new AnimationController<>(animTest -> PlayState.STOP)
    .setSoundKeyframeHandler(new AutoPlayingSoundKeyframeHandler()));
```

Then encode the sound directly in the animation JSON keyframe instruction:

1. `namespace:soundid`
2. `namespace:soundid|volume|pitch`

<!--
Source references:
- https://wiki.geckolib.com/docs/geckolib5/miscellaneous/keyframe-markers
-->
