---
name: geckolib-render-layers
description: GeoRenderLayer usage and the built-in layers — glow, held items, armor, custom bone textures, block/item attachments, and texture overlays.
---

# GeoRenderLayers

Render layers add extra rendering passes over a GeckoLib model. Each layer renders once, immediately after the main renderer.

## Usage

```java
public class ExampleRenderer<R extends LivingEntityRenderState & GeoRenderState> extends GeoEntityRenderer<ExampleEntity, R> {
    public ExampleRenderer(EntityRendererProvider.Context context) {
        super(context, EntityRegistry.EXAMPLE_ENTITY.get());
        addRenderLayer(new ExampleGeoRenderLayer(this));
    }
}
```

If a layer re-renders the same model, call `reRender` (not a full render pass). Layers use the same `<T, O, R>` generics and can add data to the render state via `addRenderData`.

## Built-in layers

| Layer | Purpose |
|---|---|
| `AutoGlowingGeoLayer` | Emissive `_glowmask` texture rendering; see [Glowmasks](features-glowmasks-and-textures.md) |
| `ItemInHandGeoLayer` | Renders held items on a GeoEntity. Requires tiny empty bones — recommended names `RightHandItem` / `LeftHandItem` (alternate constructor for custom names) |
| `ItemArmorGeoLayer` | Renders vanilla- or GeckoLib-style armor on your animatable. Pass `RenderData` per piece (`RenderData.head(HELMET_BONE)`, `RenderData.body(...)`, `RenderData.leftArm(...)`, etc.) and override `getRelevantBones`. The first cube in each bone defines positioning |
| `CustomBoneTextureGeoLayer` | Renders a custom texture on a single bone (replaces GeckoLib 4's `Dynamic*Renderer`s); auto-resizes the texture to the bone. Override `getRenderType` to change the RenderType |
| `TextureLayerGeoLayer` | Renders a second texture pass over the model with minimal boilerplate (e.g. glasses overlays) |
| `BlockAndItemGeoLayer` | Abstract layer rendering `BlockStates`/`ItemStacks` at defined bones; override `getRelevantBones` and `addRenderData` |

### Examples

```java
// Held items
addRenderLayer(new ItemInHandGeoLayer(this));

// Custom bone texture (old Dynamic renderer equivalent)
addRenderLayer(new CustomBoneTextureGeoLayer(this,
    "dynamic_bone",
    Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "textures/entity/example_entity_custom_bone.png")));

// Secondary texture pass
addRenderLayer(new TextureLayerGeoLayer<>(this,
    Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "textures/entity/glasses.png"),
    RenderType::armorCutoutNoCull));

// Armor on an entity
addRenderLayer(new ItemArmorGeoLayer<>(this, context) {
    private final List<RenderData> BONES = List.of(
        RenderData.head(HELMET_BONE), RenderData.body(CHESTPLATE_BONE),
        RenderData.leftArm(LEFT_SLEEVE_BONE), RenderData.rightArm(RIGHT_SLEEVE_BONE),
        RenderData.leftLeg(LEFT_ARMOR_LEG_BONE), RenderData.rightLeg(RIGHT_ARMOR_LEG_BONE),
        RenderData.leftFoot(LEFT_BOOT_BONE), RenderData.rightFoot(RIGHT_BOOT_BONE));

    @Override
    protected List<RenderData> getRelevantBones(R renderState, BakedGeoModel model) {
        return BONES;
    }
});
```

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/Render-Layers-(Geckolib5)
- https://wiki.geckolib.com/docs/geckolib5/updating/noteworthy/texturelayergeolayer
- https://wiki.geckolib.com/docs/geckolib5/updating/noteworthy/dynamic-renderers
-->
