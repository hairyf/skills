---
name: veil-v1-graveyard
description: Veil 1 Graveyard animation system — InterpolatedSkeleton, InterpolatedBone, AnimationProperties, meshes, constraints, and entity renderers.
---

# Veil 1 Graveyard (Interpolated Skeletons)

The Graveyard (`foundry.veil.api.client.graveyard`) is Veil 1's entity animation system: custom skeletons whose bones interpolate every tick, driven by `AnimationProperties`, rendered through custom entity renderers. (This later evolved into the Flare/Necromancer systems in Veil 4.)

## Skeleton

`InterpolatedSkeleton` is abstract — implement `animate(AnimationProperties)`:

```java
public class ExampleSkeleton extends InterpolatedSkeleton {
    private final InterpolatedBone body = new InterpolatedBone("body");
    private final InterpolatedBone head = new InterpolatedBone("head");

    public ExampleSkeleton() {
        this.body.setInitialTransform(0F, 16F, 0F, new Quaternionf());
        this.head.setInitialTransform(0F, 8F, 0F, new Quaternionf());
        this.body.addChild(this.head);
        this.addBone(this.body, new StaticMesh(/* vertices */));
        this.addBone(this.head, new StaticMesh(/* vertices */));
        this.buildRoots(); // call after all bones are added
    }

    @Override
    public void animate(AnimationProperties properties) {
        // mutate bones based on properties (e.g. walk cycle)
        this.head.rotate(Mth.sin(properties.getNumProperty("ageInTicks") * 0.1F) * 0.2F, Direction.Axis.Y);
    }
}
```

Key members:

- `addBone(InterpolatedBone, ModelMesh)` — attach a bone + its mesh (meshes can be `StaticMesh`, `ModelMesh`, or `DynamicMesh`).
- `addConstraint(Constraint)` / `buildRoots()` — constraints apply after `animate` each tick.
- `tick(AnimationProperties)` — advances interpolation, calls `animate`, then applies constraints.
- `render(...)` — draws all roots with the attached meshes.
- `addAnimationProperties(properties, parent)` — auto-fills `entity`, `limbSwing`, `limbSwingAmount`, `ageInTicks`, `bodyYaw`, `netHeadYaw`, `headPitch` when the parent is a `LivingEntity`.

## AnimationProperties

`AnimationProperties` is a named-property bag: `addProperty(name, float|Object)`, `setProperty(...)`, `getProperty(name)`, `getNumProperty(name)`. Read it in `animate()` for frame data.

## Constraints

`Constraint` (with `apply()`) and the built-in `InverseKinematicsConstraint` run after animation to adjust the pose (e.g. foot placement). Debug-render them with `renderDebug`.

## Rendering entities

`InterpolatedEntityRenderer<T extends LivingEntity>` (a `LivingEntityRenderer` subclass) creates the skeleton from a `SkeletonFactory<T>` (`create()`), ticks it each frame, and renders it. Add `InterpolatedEntityRenderLayer`s for extra layers. The entity should implement `InterpolatedSkeletonParent` if it needs automatic skeleton attachment.

<!--
Source references:
- https://github.com/FoundryMC/Veil/tree/1.20 (1.0.0.228: foundry.veil.api.client.graveyard.*)
- https://github.com/FoundryMC/Veil.wiki (Necromancer, 2024-12-02 revision — describes the later unified API; v1 uses the graveyard classes)
-->
