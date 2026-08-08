---
name: veil-v1-colors-easings
description: Veil 1 Color utilities (filters, themes, properties) and the Easings class covering all easings.net curves.
---

# Veil 1 Colors & Easings

## Color

`foundry.veil.api.client.color.Color` (RGBA, 0-255 values stored as floats):

```java
Color c1 = new Color(255, 0, 0, 255);          // ints
Color c2 = new Color(1.0F, 0.0F, 0.0F, 1.0F);  // floats
Color c3 = new Color(0xFF0000FF);              // RGBA hex int
Color c4 = new Color("#FF0000");               // hex string
Color c5 = Color.of(0xFF0000FF);               // static factory
```

Utility methods: `getRed/getGreen/getBlue/getAlpha` (0-255 floats), `toHexString`, `lighten/darken/saturate/desaturate/invert/mix/add`, plus constants (`WHITE`, `BLACK`, `RED`, `GREEN`, `BLUE`, `CLEAR`, `VANILLA_TOOLTIP_BACKGROUND`, `VANILLA_TOOLTIP_BORDER_TOP`, `VANILLA_TOOLTIP_BORDER_BOTTOM`).

## Filters

`foundry.veil.api.client.color.Filter` applies color transforms:

```java
Color result = Filter.apply(color, 0.5F, Filter.SEPIA);
Color result2 = Filter.apply(color, 1.0F, Filter.GRAYSCALE);
```

`Filter.IFilterType` is a functional interface `(color, value) -> color`, so custom filters are easy.

## Color Themes

`ColorTheme` maps `Optional<String>` keys to either a `Color` or an `IThemeProperty`. Built-in property types: `BooleanThemeProperty`, `NumberThemeProperty`, `StringThemeProperty`, `ConsumerThemeProperty`. Themes power Veil's tooltips and can back any configurable color UI:

```java
theme.addColor("background", color);
theme.addProperty("animationSpeed", new NumberThemeProperty(2.0));
ConsumerThemeProperty prop = (ConsumerThemeProperty) theme.getAndCastProperty("consumerProp");
```

## Easings

`foundry.veil.api.client.util.Easings.Easing` implements all curves from [easings.net](https://easings.net):

```java
float t = Easings.Easing.easeOutQuad.ease(0.37F); // 0..1 input -> eased 0..1
```

Available: `linear`, `easeInQuad`, `easeOutQuad`, `easeInOutQuad`, `easeInCubic`, `easeOutCubic`, `easeInOutCubic`, ... (full quad/cubic/quart/quint/sine/expo/circ/back/elastic/bounce families). Pass an easing to keyframes (see [Animations](v1-animations.md)) or use directly in render math.

<!--
Source references:
- https://github.com/FoundryMC/Veil.wiki (Colors, Easings, 2024-12-02 revision)
- https://github.com/FoundryMC/Veil/tree/1.20 (1.0.0.228: foundry.veil.api.client.color.*, client.util.Easings)
-->
