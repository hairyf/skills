---
name: fabric-rendering-hud
description: Fabric Hud API, HudElementRegistry, DeltaTracker partial ticks and time-based animation.
---

# Rendering in the HUD

## HudElementRegistry

Register HUD layers in the client initializer:

```java
HudElementRegistry.register(Identifier.fromNamespaceAndPath("example-mod", "custom_hud"),
    (graphics, deltaTracker) -> {
        // draw with GuiGraphicsExtractor (Matrix3x2fStack since 1.21.8)
    });
```

Elements are lambdas taking `(GuiGraphicsExtractor, DeltaTracker)`.

## DeltaTracker & Partial Ticks

`deltaTracker.getGameTimeDeltaPartialTick(ignoreFreeze)` returns progress (0..1) between the last and next game tick — use it for tick-synchronized animations (e.g. it freezes under `/tick freeze` when `ignoreFreeze=false`).

For real-time animations use `Util.getMillis()` instead (unaffected by game tick freeze):

```java
float t = (Util.getMillis() % 2000) / 2000f; // loops every 2s
int color = ColorHelper.lerp(t, 0xFFFF0000, 0xFF0000FF);
graphics.fill(10, 10, 110, 60, ARGB.opaque(color));
```

## Key Points

- `HudElementRegistry` is the Fabric-recommended HUD API; vanilla HUD internals change often, so prefer it over injection.
- Keep per-frame allocations low; extract data into render states where possible.

<!--
Source references:
- https://docs.fabricmc.net/develop/rendering/hud
-->
