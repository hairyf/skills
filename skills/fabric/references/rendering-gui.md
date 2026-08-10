---
name: fabric-rendering-gui
description: GuiGraphicsExtractor drawing (rectangles, lines, textures, text), scissors, custom screens and widgets.
---

# Drawing to the GUI, Screens & Widgets

## GuiGraphicsExtractor

The main 2D rendering entrypoint (used from screens, HUD elements, and in-world extraction):

```java
// filled rectangle
graphics.fill(x1, y1, x2, y2, ARGB.opaque(color));
// outline / border
graphics.outline(x1, y1, x2, y2, ARGB.opaque(color));
// lines
graphics.horizontalLine(x1, x2, y, color);
graphics.verticalLine(x, y1, y2, color);
```

**Color note (1.21.6+)**: text/colors are ARGB; passing raw RGB renders transparent. Use `ARGB.opaque(...)` helpers when porting.

Scissor clipping — nested regions must be enabled/disabled in matching count:

```java
graphics.enableScissor(x1, y1, x2, y2);
// drawing is clipped to the region
graphics.disableScissor();
```

Textures (`blit` overloads): prefer specifying texture dimensions; choose the render pipeline (usually `RenderPipelines.GUI_TEXTURED`); `u`/`v` + `regionWidth`/`regionHeight` draw a sub-rectangle of the texture. Text: `graphics.text(font, text, x, y, color)`.

## Custom Screens

```java
public class CustomScreen extends Screen {
    public CustomScreen(Component title) { super(title); }

    @Override
    protected void init() {
        // widgets go here — width/height are valid only after init
        addRenderableWidget(Button.builder(Component.literal("Click"), b -> { ... })
            .bounds(width / 2 - 50, height / 2, 100, 20).build());
    }
}
```

Open/close: `Minecraft.getInstance().setScreen(new CustomScreen(Component.empty()))` / `setScreen(null)`. Keep a reference to the previous screen to restore it on close. Optionally override `extractRenderState` (call super) for per-frame GUI work.

## Custom Widgets

Extend `AbstractWidget` (implements `Renderable`, `GuiEventListener`, `NarrationSupplier`, `NarratableEntry`):

```java
public class CustomWidget extends AbstractWidget {
    public CustomWidget(int x, int y, int w, int h, Component message) { super(x, y, w, h, message); }

    @Override
    protected void renderWidget(GuiGraphicsExtractor graphics, int mouseX, int mouseY, float partialTick) {
        graphics.fill(getX(), getY(), getX() + width, getY() + height, ARGB.opaque(0x55FF0000));
        if (isHovered()) graphics.outline(getX(), getY(), getX() + width, getY() + height, ARGB.opaque(0xFFFFFFFF));
    }

    @Override
    protected void updateWidgetNarration(NarrationElementOutput output) { /* accessibility */ }
}
```

Handle input by overriding `mouseClicked`, `keyPressed`, etc. Add via `addRenderableWidget` in `init`.

<!--
Source references:
- https://docs.fabricmc.net/develop/rendering/gui-graphics
- https://docs.fabricmc.net/develop/rendering/gui/custom-screens
- https://docs.fabricmc.net/develop/rendering/gui/custom-widgets
-->
