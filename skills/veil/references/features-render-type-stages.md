---
name: features-render-type-stages
description: Add custom RenderStateShards to any render type, register fixed buffers, draw at level stages, and use layered render types.
---

# Render Type Stages

## Custom Shards

`RenderTypeShardRegistry` adds custom (or vanilla) `RenderStateShard`s to any `RenderType`:

```java
// Arbitrary setup/clear code on the solid render type
RenderTypeShardRegistry.addStage(RenderType.solid(), new RenderStateShard("coolmod:debug",
        () -> System.out.println("Setting up solid blocks"),
        () -> System.out.println("Clearing up solid blocks")) {});

// Regular states work too
RenderTypeShardRegistry.addStage(RenderType.cutout(), RenderType.TRANSLUCENT_TARGET);

// Add the particle shader to all render types without one
RenderTypeShardRegistry.addGenericStage(renderType -> renderType.state().shaderState == RenderType.NO_SHADER,
        new RenderStateShard.ShaderStateShard(GameRenderer::getParticleShader));

// String ids let you modify other mods' render types
RenderTypeShardRegistry.addStage("coolmod:custom_render_type", RenderType.TRANSLUCENT_TARGET);
```

## Fixed Buffers

Vanilla's fixed buffers are hardcoded; Veil's `VeilRegisterFixedBuffersEvent` lets render types join the fixed buffer map so they auto-finish at a stage:

```java
VeilEventPlatform.INSTANCE.onVeilRegisterFixedBuffers(registry -> {
    // Batched with other render types, drawn automatically after particles
    registry.registerFixedBuffer(VeilRenderLevelStageEvent.Stage.AFTER_PARTICLES, CUSTOM_RENDER_TYPE);
    // Registered but never auto-finished; you end it manually
    registry.registerFixedBuffer(null, COOL_CUSTOM_RENDER_TYPE);
});
```

## Level Stage Rendering

`VeilRenderLevelStageEvent` fires at defined points in level rendering (e.g. `AFTER_SKY`, `AFTER_PARTICLES`). Use it as a last resort for stage-specific drawing; prefer fixed buffers for batching:

```java
VeilEventPlatform.INSTANCE.onVeilRenderTypeStageRender((stage, levelRenderer, bufferSource,
        poseStack, projectionMatrix, renderTick, partialTicks, camera, frustum) -> {
    if (stage == VeilRenderLevelStageEvent.Stage.AFTER_SKY) {
        VertexConsumer builder = bufferSource.getBuffer(CUSTOM_RENDER_TYPE);
        // draw; don't end batch — it's a fixed buffer
    } else if (stage == VeilRenderLevelStageEvent.Stage.AFTER_PARTICLES) {
        bufferSource.endBatch(COOL_CUSTOM_RENDER_TYPE);
    }
});
```

Fabric's event implementation is provided by Veil, but custom stage registration is not supported.

## Layered Render Types

Drawing the same mesh with several render types is expensive in vanilla; `VeilRenderType.layered(...)` uploads once and reuses the data:

```java
RenderType COOL_RENDER_TYPE = VeilRenderType.layered(
        RenderType.entityCutoutNoCull(BASE_TEXTURE),
        RenderType.entityCutoutNoCull(ARMOR_TEXTURE),
        RenderType.entityCutoutNoCull(SPOT_TEXTURE));
```

<!--
Source references:
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/RenderTypeStage.md
-->

