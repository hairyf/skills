---
name: veil-v1-render-type-stages
description: Veil 1 render type stages — adding RenderStateShards to any render type, generic stages, fixed buffers, and level-stage rendering.
---

# Veil 1 Render Type Stages

`foundry.veil.api.client.registry.RenderTypeStageRegistry` injects custom `RenderStateShard`s into any `RenderType`:

```java
// Add arbitrary setup/clear code to the solid render type
RenderTypeStageRegistry.addStage(RenderType.solid(), new RenderStateShard("coolmod:debug",
        () -> System.out.println("setting up solid"),
        () -> System.out.println("clearing solid")) {});

// Add existing shards (e.g. a render target)
RenderTypeStageRegistry.addStage(RenderType.cutout(), RenderType.TRANSLUCENT_TARGET);

// Generic filter: add the particle shader to any render type lacking one
RenderTypeStageRegistry.addGenericStage(
        renderType -> renderType.state().shaderState == RenderType.NO_SHADER,
        new RenderStateShard.ShaderStateShard(GameRenderer::getParticleShader));

// By string name (other mods' render types)
RenderTypeStageRegistry.addStage("coolmod:custom_render_type", RenderType.TRANSLUCENT_TARGET);
```

## Fixed buffers

Vanilla "fixed" buffers batch geometry and end at hardcoded points. Veil lets you register render types as fixed buffers that end automatically after a given stage:

```java
VeilEventPlatform.INSTANCE.onVeilRegisterFixedBuffers(registry -> {
    // Batched and drawn automatically after particles
    registry.registerFixedBuffer(VeilRenderLevelStageEvent.Stage.AFTER_PARTICLES, CUSTOM_RENDER_TYPE);
    // Fixed buffer that never auto-ends — end it yourself
    registry.registerFixedBuffer(null, COOL_CUSTOM_RENDER_TYPE);
});
```

## Level-stage rendering

`VeilEventPlatform.INSTANCE.onVeilRenderTypeStageRender((stage, levelRenderer, bufferSource, poseStack, projectionMatrix, renderTick, partialTicks, camera, frustum) -> { ... })` fires for each `VeilRenderLevelStageEvent.Stage`: `AFTER_SKY`, `AFTER_SOLID_BLOCKS`, `AFTER_CUTOUT_MIPPED_BLOCKS`, `AFTER_CUTOUT_BLOCKS`, `AFTER_ENTITIES`, `AFTER_BLOCK_ENTITIES`, `AFTER_TRANSLUCENT_BLOCKS`, `AFTER_TRIPWIRE_BLOCKS`, `AFTER_PARTICLES`, `AFTER_WEATHER`, `AFTER_LEVEL`.

This is a last-resort hook — prefer fixed buffers for batching. (Fabric does not support custom stage registration in v1.)

<!--
Source references:
- https://github.com/FoundryMC/Veil.wiki (RenderTypeStage, 2024-12-02 revision)
- https://github.com/FoundryMC/Veil/tree/1.20 (1.0.0.228: RenderTypeStageRegistry, VeilRenderLevelStageEvent)
-->
