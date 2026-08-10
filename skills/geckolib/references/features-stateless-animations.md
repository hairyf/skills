---
name: geckolib-stateless-animations
description: Controller-free animation via StatelessAnimatable — stateless interfaces and play/stop methods.
---

# Stateless Animations

Stateless animations are an alternative to `AnimationController`s for developers who don't want a single point of entry for animations. They are less efficient and less responsive, and offer no functional advantages — purely a preference.

## Interfaces

Implement the stateless equivalent of your animatable interface:

| Normal interface | Stateless equivalent |
|---|---|
| `GeoBlockEntity` | `StatelessGeoBlockEntity` |
| `GeoEntity` | `StatelessGeoEntity` |
| `GeoItem` | `StatelessGeoSingletonAnimatable` |
| `GeoReplacedEntity` | `StatelessGeoReplacedEntity` |
| `SingletonGeoAnimatable` | `StatelessGeoSingletonAnimatable` |

```java
public class ExampleEntity extends PathfinderMob implements StatelessGeoEntity {
    // ...
}
```

## Playing animations

Use the `StatelessAnimatable` methods from client or server at any time:

- `playAnimation(RawAnimation)` — play until it ends (looping animations play until stopped)
- `stopAnimation(RawAnimation)` — stop an animation

Each played animation is independent, so multiple animations run simultaneously — you are responsible for stopping conflicting ones.

```java
@Override
public void tick() {
    super.tick();

    if (level().isClientSide()) {
        playAnimation(DefaultAnimations.LIVING);

        if (getDeltaMovement().horizontalDistanceSqr() > 0.01) {
            playAnimation(DefaultAnimations.WALK);
            stopAnimation(DefaultAnimations.IDLE);
        }
        else {
            playAnimation(DefaultAnimations.IDLE);
            stopAnimation(DefaultAnimations.WALK);
        }
    }
}
```

<!--
Source references:
- https://wiki.geckolib.com/docs/geckolib5/miscellaneous/stateless-animations
-->
