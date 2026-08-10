---
name: fabric-rendering-basic-concepts
description: BufferBuilder, vertex formats, draw modes, PoseStack/Matrix3x2fStack, quaternions, render pipelines.
---

# Basic Rendering Concepts

> 26.2 ships an optional **Vulkan** backend — raw OpenGL is not supported. Use the Blaze3D abstraction (`RenderPipeline`, `RenderType`, `RenderState`).

Since 1.21.6 the pipeline is being split into **extraction (preparation)** and **drawing** phases: game data is copied into render states during extraction so drawing can happen in parallel for the previous frame. Most mod code should use high-level APIs (`GuiGraphicsExtractor`, `HudElementRegistry`) rather than raw buffers.

## BufferBuilder & Vertex Formats

`BufferBuilder` formats and uploads vertex data. `DefaultVertexFormat` provides common layouts: `BLOCK` (position, color, uv, light, normal), `NEW_ENTITY`, `PARTICLE`, `POSITION`, `POSITION_COLOR`, `POSITION_TEX`, `POSITION_COLOR_TEX_LIGHTMAP`, etc.

Draw modes (`VertexFormat.Mode`): `LINES`, `LINE_STRIP`, `DEBUG_LINES`, `DEBUG_LINE_STRIP`, `TRIANGLES`, `TRIANGLE_STRIP`, `TRIANGLE_FAN`, `QUADS`.

Add vertices in the exact order the format declares (wrong order breaks rendering; wrong winding causes culling artifacts):

```java
buffer.addVertex(matrix, x, y, z).setColor(...).setUv(...);
```

## Matrix Stacks

- **World rendering**: `PoseStack` — `pushPose()`, `popPose()`, `last()`, `translate(x,y,z)`, `scale(...)`, `mulPose(...)`. Always push before transforming and pop after, or you corrupt the stack.
- **HUD rendering (1.21.8+)**: `Matrix3x2fStack` (2D; methods no longer take z). Obtain via `GuiGraphicsExtractor#pose()`.

## Quaternions

Use `Axis` utilities instead of raw quaternion math:

```java
poseStack.mulPose(Axis.ZP.rotationDegrees(45f));
// Axis.XP / YP / ZP; also rotation() for radians
```

## Custom Render Pipelines

When vanilla pipelines don't fit (e.g. render through walls), define a `RenderPipeline`:

```java
public static final RenderPipeline WAYPOINTS = RenderPipeline.builder(
        RenderType.create("example_mod:waypoints", RenderType.smallBufferSize()))
    .setVertexFormat(DefaultVertexFormat.POSITION_COLOR)
    .setDrawMode(VertexFormat.Mode.QUADS)
    .build();
```

Follow the extraction/drawing split:

1. **Extraction phase**: add `RenderState`s (e.g. `WaypointRenderState` list) using the pipeline's extractor (`beginExtraction`/`add`).
2. **Drawing phase**: `StagedVertexBuffer` sized for the pipeline (`RenderType.SMALL_BUFFER_SIZE`), draw the staged buffer, clear after.
3. **Cleanup**: inject into `GameRenderer#close` with a mixin to close resources.

Register the pipeline (`RenderPipelines.register`) and hook extraction into `LevelRenderEvents` (see `rendering-world-and-particles`).

<!--
Source references:
- https://docs.fabricmc.net/develop/rendering/basic-concepts
-->
