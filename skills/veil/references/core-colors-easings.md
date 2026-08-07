---
name: core-colors-easings
description: Use Veil's Color utilities and easing functions for colors, themes, and smooth motion.
---

# Colors & Easings

Veil provides a rich `Color` class (`foundry.veil.api.client.color.Color`) and all easing functions from https://easings.net.

## Color

Create colors from RGBA float values, RGBA int values, or hex strings (including `0xRRGGBBAA` forms), and convert back:

```java
Color c = new Color(0.3F, 0.6F, 0.9F, 1.0F);   // floats
Color d = Color.of(255, 128, 0, 255);           // ints
Color e = Color.parse("0xFFAA00");              // hex string
```

Utility methods include saturate/desaturate, lighten/darken, invert, and mix. Veil ships default colors plus useful vanilla Minecraft colors (e.g. the three tooltip colors). Colors are used throughout the API, such as `handle.getLightData().setColor(Color.RED)` for deferred lights.

## Easing

All easings.net functions are exposed as constants on `Easing`; call `Easing#ease(float)`:

```java
float t = Easing.EASE_OUT_QUAD.ease(progress);
```

Flare property modifier curves reference easings by snake_case name (e.g. `"easing": "ease_out_quad"`).

<!--
Source references:
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/Colors.md
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/Easings.md
-->
