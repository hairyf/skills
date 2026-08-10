---
name: geckolib-v4-render-layers
description: GeckoLib 4 render layers — GeoRenderLayer, built-in layers (glow, held items/blocks, bone filter, worn armor), DynamicGeoEntityRenderer, and GeoRenderEvent.
---

# GeckoLib 4 Render Layers & Render Events

`GeoRenderLayer<T>` layers extra rendering over a GeckoLib renderer. Add layers in the renderer constructor:

```java
public class ExampleRenderer extends GeoEntityRenderer<ExampleEntity> {
    public ExampleRenderer(EntityRendererProvider.Context context) {
        super(context, new ExampleEntityModel());
        addRenderLayer(new ExampleGeoRenderLayer(this));
    }
}
```

## Built-in layers

| Layer | Purpose |
|---|---|
| `AutoGlowingGeoLayer` | Emissive rendering from a `_glowmask` texture (see [Textures](v4-textures.md)). |
| `BlockAndItemGeoLayer` | Render `ItemStack`s or `BlockState`s on bones. Override `getStackForBone` / `getBlockForBone` (return `super` for irrelevant bones), and optionally `getTransformTypeForStack`, `renderStackForBone`, `renderBlockForBone`. |
| `ItemArmorGeoLayer` | Render worn armor pieces on an entity. Override `getEquipmentSlotForBone`, `getModelPartForBone`, `getArmorItemForBone`. The layer uses the **first cube** of the bone for position/size. |
| `FastBoneFilterGeoLayer` | Hide/show or manipulate specific bones at render time; remember to reset the bone when the condition is false. |
| `BoneFilterGeoLayer` | Base class for per-bone filters (v4.4). |

## DynamicGeoEntityRenderer

`DynamicGeoEntityRenderer` (formerly `ExtendedGeoEntityRenderer`) provides per-bone render overrides — custom textures or render types per bone. Use it when you need different textures/render types on different parts of one model (e.g. the FakeGlass example).

## GeoRenderEvent (Fabric API)

`software.bernie.geckolib.event.GeoRenderEvent` exposes `Pre`, `Post`, and `CompileRenderLayers` events per renderer type:

- `GeoRenderEvent.Entity` — `GeoEntityRenderer`/`DynamicGeoEntityRenderer`
- `GeoRenderEvent.Block` — `GeoBlockRenderer`
- `GeoRenderEvent.Item` — `GeoItemRenderer`
- `GeoRenderEvent.Armor` — `GeoArmorRenderer`
- `GeoRenderEvent.Object` — `GeoObjectRenderer`
- `GeoRenderEvent.ReplacedEntity` — `GeoReplacedEntityRenderer`

`Pre` is cancellable (return `false` to skip rendering); `Post` fires after; `CompileRenderLayers` is one-time and lets you add layers:

```java
GeoRenderEvent.Entity.CompileRenderLayers.EVENT.register(event ->
        event.addLayer(new AutoGlowingGeoLayer(event.getRenderer())));
```

Forge uses the equivalent Forge event classes under `software.bernie.geckolib.event` Forge source set.

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/Render-Layers-(Geckolib4)
- https://github.com/bernie-g/geckolib/wiki/Geckolib-4-Changes
- https://github.com/bernie-g/geckolib/tree/1.20.1 (v4.4.9)
-->
