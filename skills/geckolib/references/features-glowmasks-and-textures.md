---
name: geckolib-glowmasks-and-textures
description: Emissive rendering with AutoGlowingGeoLayer and animated textures via .mcmeta files.
---

# Glowmasks & Animated Textures

## Glowmasks (emissive rendering)

Add the built-in `AutoGlowingGeoLayer` to your renderer for fullbright texture parts (like spider eyes):

```java
public class ExampleEntityRenderer extends GeoEntityRenderer<ExampleEntity, R> {
    public ExampleEntityRenderer(EntityRendererProvider.Context context, EntityType<ExampleEntity> entityType) {
        super(context, entityType);
        withRenderLayer(new AutoGlowingGeoLayer(this));
    }
}
```

Prepare the texture:

1. Duplicate your base texture and rename with `_glowmask` before `.png` (e.g. `example_entity_glowmask.png`).
2. Delete every pixel you don't want to glow — only the remaining pixels render emissive.

Two variants (same class):

- **Default**: full-sky brightness with slight face-shading respect — near-absolute brightness.
- Override `shouldRespectWorldLighting()` to `true`: slightly dimmer but blends naturally with world/block lighting.

Since GeckoLib 5, glowmasks are texture-based only — `.mcmeta`-based glowmasks are gone, and the base texture is never modified (glow can be applied conditionally/dynamically without missing texture chunks).

## Animated textures

GeckoLib supports animated textures on **all** animatable types using the standard vanilla `.mcmeta` format:

1. Create `my_texture.png.mcmeta` next to `my_texture.png`:

```json
{
  "animation": {}
}
```

2. If the frames are not square, add explicit frame dimensions:

```json
{
  "animation": {
    "width": 64,
    "height": 64
  }
}
```

Common mistakes:

- **Texture stretched / not animating** — missing, misnamed, or misplaced `.png.mcmeta` file.
- **Squished or misaligned animation** — non-square texture without explicit `width`/`height` in the animation section.

<!--
Source references:
- https://wiki.geckolib.com/docs/geckolib5/miscellaneous/glowmasks
- https://wiki.geckolib.com/docs/geckolib5/miscellaneous/animated-textures
- https://wiki.geckolib.com/docs/geckolib5/updating/noteworthy/glowmasks
-->
