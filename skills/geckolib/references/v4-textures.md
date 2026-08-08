---
name: geckolib-v4-textures
description: GeckoLib 4 texture features — glowmask/emissive textures with AutoGlowingGeoLayer and vanilla-style animated .mcmeta textures.
---

# GeckoLib 4 Textures

## Emissive / glowmask textures

Add `AutoGlowingGeoLayer` to the renderer, then create a second copy of the base texture named with a `_glowmask` suffix:

```
my_entity_texture.png
my_entity_texture_glowmask.png
```

Erase every pixel in the glowmask that should **not** glow — only the remaining pixels render fullbright. This works on all GeckoLib animatables (entities, blocks, items, armor).

## Animated textures

GeckoLib 4 supports vanilla-style animated textures via `.mcmeta`:

1. Create `<texture>.png.mcmeta` next to the texture:
   ```json
   {
     "animation": {}
   }
   ```
2. Make the PNG a vertical sprite sheet of square frames (e.g. a 64×32 texture becomes 64×64 for two frames).
3. All standard `.mcmeta` animation properties (`frametime`, `frames`, `interpolate`) are supported.

Known limitations:

- Animated textures and glowmask textures are **not compatible** — a `_glowmask` texture cannot be animated.
- If the texture looks stretched, the `.mcmeta` is missing/misnamed or the frames aren't square.

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/Emissive-Textures-(Geckolib4)
- https://github.com/bernie-g/geckolib/wiki/Animated-Textures-(Geckolib4)
-->
