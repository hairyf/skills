---
name: features-necromancer
description: Animate bones procedurally with Necromancer — skeletons, animators, skins, and entity attachment.
---

# Necromancer Animations

Necromancer is Veil's animation framework: `Skeleton` holds `Bone`s, an `Animator` puppeteers them, and a `Skin` is what gets rendered.

## Skeleton & Bones

```java
public class ExampleSkeleton extends Skeleton<ExampleEntity> {
    protected final Bone Head, Body, LeftLeg, RightLeg;

    public ExampleSkeleton(ExampleEntity parent) {
        this.Body = new Bone("Body");
        this.Body.setInitialTransform(0F, 16F, 0F, new Quaternionf().rotationZYX(0F, 0F, 0F));
        this.addBone(Body);
        this.Head = new Bone("Head");
        this.Head.setInitialTransform(0F, 8F, 0F, new Quaternionf().rotationZYX(0F, 0F, 0F));
        this.addBone(Head);
        // ... more bones ...
        this.Body.addChild(Head);
        this.Body.addChild(LeftLeg);
        this.Body.addChild(RightLeg);
        this.buildRoots(); // call after adding bones
    }
}
```

Skeletons compute animation data each tick; bones interpolate between values automatically. Bones can also be added dynamically.

## Animator & Animations

`Animator#animate` applies animations and constraints each tick. Animations should be statically created and shared across animators:

```java
public class ExampleAnimator extends Animator<ExampleEntity, ExampleSkeleton> {
    final AnimationEntry<ExampleEntity, ExampleSkeleton> walk;

    public ExampleAnimator(ExampleEntity entity, ExampleSkeleton skeleton) {
        this.walk = this.addAnimation(WalkAnimation.INSTANCE, 0);
    }

    public void animate(ExampleEntity entity) {
        super.animate(entity);
        this.walk.setTime(entity.walkAnimation.position());
        this.walk.setMixFactor(entity.walkAnimation.speed());
        skeleton.Body.y += Mth.sin(entity.tickCount * 0.05F) * 2; // procedural idle
    }

    static class WalkAnimation extends Animation<ExampleEntity, ExampleSkeleton> {
        static final WalkAnimation INSTANCE = new WalkAnimation();
        public void apply(ExampleEntity entity, ExampleSkeleton skeleton, float blendFactor, float time) {
            skeleton.LeftLeg.rotateDeg(45 * Mth.sin(time) * blendFactor, Direction.Axis.Z);
            skeleton.RightLeg.rotateDeg(45 * -Mth.cos(time) * blendFactor, Direction.Axis.Z);
        }
    }
}
```

- `AnimationEntry` (from `addAnimation`) — time is **not** auto-updated; set it yourself.
- `TimedAnimationEntry` (from `addTimedAnimation`) — one-shot animations with known length; time auto-updates.
- `KeyframedAnimation` is work-in-progress; `Constraint`s are applied after animations (none implemented yet).

## Skin

`Skin` sits on the skeleton and is what is drawn: a list of meshes, each tagged with the id of the `Bone` whose transform it inherits.

## Attaching to Entities

- `SkeletonParent` interface: implement on an entity and Necromancer automatically attaches a `Skeleton` + `Animator` via the entity's renderer.
- `NecromancerEntityRenderer`: vanilla `EntityRenderer` subclass for `SkeletonParent` entities; handles skeleton/animator lifecycle, drawing through a `Skin`, and render layers.
- `NecromancerEntityRenderLayer`: the `EntityRenderLayer` equivalent; add in the renderer constructor via `addLayer`.

<!--
Source references:
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/Necromancer.md
-->

