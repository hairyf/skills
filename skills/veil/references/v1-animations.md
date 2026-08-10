---
name: veil-v1-animations
description: Veil 1 code-driven animations — the Keyframe/Path timeline system in foundry.veil.api.client.anim, and the Necromancer stub status in 1.0.0.228.
---

# Veil 1 Animations (Keyframe Paths)

Veil 1 ships a simple code-driven Vec3 keyframe system in `foundry.veil.api.client.anim` (`Keyframe`, `Frame`, `Path`).

## Keyframes

A `Keyframe` has a position (`Vec3`), rotation (`Vec3`), scale (`Vec3`), duration in ticks, and an `Easing`:

```java
new Keyframe(new Vec3(0.5, 0.5, -0.5), Vec3.ZERO, Vec3.ZERO, 20, Easings.Easing.linear)
```

## Paths

`Path` is an animation timeline built from a list of frames:

```java
Path arcPath = new Path(List.of(
        new Keyframe(new Vec3(0.5, 0.5, -0.5), Vec3.ZERO, Vec3.ZERO, 20, Easings.Easing.linear),
        new Keyframe(new Vec3(0.5, 0.5, -0.5), Vec3.ZERO, Vec3.ZERO, 5, Easings.Easing.easeInQuad),
        new Keyframe(new Vec3(0.5, 1.15, -0.5), Vec3.ZERO, Vec3.ZERO, 10, Easings.Easing.easeInBounce),
        new Keyframe(new Vec3(0.5, 1.2, -0.25), Vec3.ZERO, Vec3.ZERO, 5, Easings.Easing.easeInBounce)
), false /* loop */, true /* bezier interpolation */);
```

Sample it per-frame and use the returned `Frame` (position/rotation/scale) in a renderer:

```java
Vec3 renderPos = arcPath.frameAtProgress(processingTicks / 30.0F).position();
poseStack.translate(renderPos.x, renderPos.y, renderPos.z);
```

`frameAtProgress(float)` interpolates between keyframes using each keyframe's easing; `bezier = true` uses a cubic Bézier curve instead (ignoring easings). This is the building block for block-entity/item animations done entirely in code.

## Necromancer in 1.0.0.228 — not usable

The `foundry.veil.api.client.necromancer` package (`Skeleton`, `Bone`, `Animator`, `Skin`, `Mesh`) exists but is an **unfinished stub** in 1.0.0.228 — fields are package-private, `Skin.render` is empty, and `Mesh.createMesh` is TODO. Do not build on it for a 1.20.1/1.0.0.228 project. Use the [Graveyard](v1-graveyard.md) interpolated-skeleton system for entity animation, or the keyframe `Path` system above.

<!--
Source references:
- https://github.com/FoundryMC/Veil.wiki (Animations, 2024-12-02 revision)
- https://github.com/FoundryMC/Veil/tree/1.20 (1.0.0.228: foundry.veil.api.client.anim, foundry.veil.api.client.necromancer)
-->
