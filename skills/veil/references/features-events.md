---
name: features-events
description: Veil events — post-processing PRE/POST, level-stage rendering, fixed buffers, render-type stages.
---

# Veil Events & Render Stages

Veil wraps its events for both Forge and Fabric. The platform-agnostic entry point is `VeilEventPlatform.INSTANCE`; Fabric also exposes dedicated `FabricVeil*Event` classes.

## Post-processing events

```java
// Fabric client entrypoint
FabricVeilPostProcessingEvent.PRE.register((name, pipeline, context) -> {
    if (name.equals(VHS_PIPELINE)) {
        pipeline.setFloat("Exposure", 0.8F);
        pipeline.setInt("FrameIndex", frame);
        pipeline.setVector("Tint", 1.0F, 0.5F, 0.5F, 1.0F);
    }
});

FabricVeilPostProcessingEvent.POST.register((name, pipeline, context) -> { ... });
```

Common code equivalent: `VeilEventPlatform.INSTANCE.preVeilPostProcessing((name, pipeline, context) -> ...)`. Events only fire when there are post-processing steps to run.

## Level-stage rendering

Draw custom geometry at a specific point in the level render:

```java
VeilEventPlatform.INSTANCE.onVeilRenderTypeStageRender((stage, levelRenderer, bufferSource, poseStack,
        projectionMatrix, renderTick, partialTicks, camera, frustum) -> {
    if (stage == VeilRenderLevelStageEvent.Stage.AFTER_SKY) {
        VertexConsumer builder = bufferSource.getBuffer(CUSTOM_RENDER_TYPE);
        // draw ...
    }
});
```

`VeilRenderLevelStageEvent.Stage` has values such as `AFTER_SKY`, `AFTER_PARTICLES`, etc. Fabric equivalent: `FabricVeilRenderLevelStageEvent.EVENT.register(...)`.

## Fixed buffers

Register a render type to be batched and finished automatically after a stage:

```java
VeilEventPlatform.INSTANCE.onVeilRegisterFixedBuffers(registry ->
    registry.registerFixedBuffer(VeilRenderLevelStageEvent.Stage.AFTER_PARTICLES, CUSTOM_RENDER_TYPE));
```

## Render-type stages

Attach custom `RenderStateShard`s to vanilla render types:

```java
RenderTypeShardRegistry.addStage(RenderType.solid(), new RenderStateShard("mymod:debug",
    () -> System.out.println("setup"), () -> System.out.println("clear")) { });
RenderTypeShardRegistry.addStage(RenderType.cutout(), RenderType.TRANSLUCENT_TARGET);
RenderTypeShardRegistry.addGenericStage(renderType -> renderType.state().shaderState == RenderType.NO_SHADER,
    new RenderStateShard.ShaderStateShard(GameRenderer::getParticleShader));
```

## Other events

- `FabricVeilRendererEvent` / `VeilRendererEvent` — fired when the `VeilRenderer` is created (use to grab the renderer).
- `FreeNativeResourcesEvent` (`FabricFreeNativeResourcesEvent.EVENT`) — release native/OpenGL resources on shutdown/reload.
- `VeilRegisterBlockLayerEvent` / `VeilRegisterFixedBuffersEvent` — register extra block render layers / fixed buffers.

## Key points

- All these events are client-side; register them from a `ClientModInitializer`.
- Pipeline uniforms set in `PRE` apply to the pipeline's shaders for that frame.

<!--
Source references:
- https://github.com/FoundryMC/Veil/wiki/Events
- https://github.com/FoundryMC/Veil/wiki/RenderTypeStage
-->
