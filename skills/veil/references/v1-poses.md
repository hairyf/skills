---
name: veil-v1-poses
description: Veil 1 item-use poses — ExtendedPose, PoseData, PoseRegistry, and VeilPoseable for custom first/third-person item animations.
---

# Veil 1 Poses

The pose system (`foundry.veil.api.client.pose`) applies custom `ExtendedPose`s to the player model, primarily for custom item-using animations (bows, crossbows, wands, etc.).

## ExtendedPose & PoseData

`ExtendedPose` is an abstract class implementing `VeilPoseable`. It exposes hooks for both perspectives:

- Third person: `pose(HumanoidModel<?>)`, `poseMainHand(ModelPart)`, `poseOffHand(ModelPart)`, `poseHead`, `poseBody`, `poseLeftArm/poseRightArm/poseLeftLeg/poseRightLeg`, `poseItem(ItemInHandRenderer)`.
- First person: `poseItemUsing(ItemInHandRenderer)`, `poseMainHandFirstPerson(PoseStack)`, `poseOffHandFirstPerson(PoseStack)`.
- Flags: `overrideItemTransform()`, `forceRenderOffhand()`, `forceRenderMainHand()`.

The pose reads live data from `public PoseData data`:

```java
public class PoseData {
    public float ageInTicks;      // entity age
    public float walkTime;
    public float limbSwing;
    public float limbSwingAmount;
    public float headYaw;
    public float headPitch;
    public float useTime;
    public float maxUseTime;
    // + main/offhand model parts, first-person pose stack/item stack/equip progress
}
```

## PoseRegistry

`foundry.veil.api.client.registry.PoseRegistry` maps items to poses:

```java
PoseRegistry.registerPose(item, new ExtendedPose() {
    @Override
    public void poseMainHand(ModelPart mainHand) {
        mainHand.xRot = -1.5F + this.data.useTime * 0.1F;
    }
});

// Or by predicate, so one pose covers many items
PoseRegistry.registerPose(item -> item instanceof MyWandItem, myWandPose);
```

Veil pre-registers `PoseRegistry.BOW` and `PoseRegistry.CROSSBOW`.

The JavaDoc on `PoseRegistry` and `VeilPoseable` contains the full field lists and worked examples.

<!--
Source references:
- https://github.com/FoundryMC/Veil.wiki (Poses, 2024-12-02 revision)
- https://github.com/FoundryMC/Veil/tree/1.20 (1.0.0.228: foundry.veil.api.client.pose.*, client.registry.PoseRegistry)
-->
