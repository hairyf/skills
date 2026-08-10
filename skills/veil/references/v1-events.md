---
name: veil-v1-events
description: Veil 1 events — VeilEventPlatform bridge methods and the Forge/Fabric event classes for post-processing, renderer availability, fixed buffers, block layers, and level stages.
---

# Veil 1 Events

Veil wraps platform events behind `foundry.veil.platform.VeilEventPlatform.INSTANCE` so common code stays loader-agnostic. Each bridge method also has a Forge event class (`foundry.veil.forge.event.*`) and a Fabric event class (`foundry.veil.fabric.event.*`).

## Bridge methods

```java
VeilEventPlatform.INSTANCE.onFreeNativeResources(() -> {
    // free native resources (OpenCL, GPU buffers) when the game does
});

VeilEventPlatform.INSTANCE.onVeilRendererAvailable(event -> {
    // VeilRenderer is ready — cache renderer-dependent stuff here
});

VeilEventPlatform.INSTANCE.preVeilPostProcessing((pipelineName, pipeline, context) -> {
    // upload per-pipeline uniforms before the pipeline runs
});

VeilEventPlatform.INSTANCE.postVeilPostProcessing((pipelineName, pipeline, context) -> {
    // after pipeline
});

VeilEventPlatform.INSTANCE.onVeilRegisterFixedBuffers(registry -> {
    registry.registerFixedBuffer(VeilRenderLevelStageEvent.Stage.AFTER_PARTICLES, myRenderType);
});

VeilEventPlatform.INSTANCE.onVeilRegisterBlockLayers(event -> {
    // add custom render layers for block rendering
});

VeilEventPlatform.INSTANCE.onVeilRenderTypeStageRender((stage, levelRenderer, bufferSource,
        poseStack, projectionMatrix, renderTick, partialTicks, camera, frustum) -> {
    // draw at specific level stages
});
```

## Platform-specific examples

Common:

```java
public class ModCommon {
    public static void initCommon() {
        VeilEventPlatform.INSTANCE.onFreeNativeResources(() -> { /* ... */ });
    }
}
```

Forge:

```java
@Mod("modid")
public class ModForge {
    public ModForge() {
        MinecraftForge.EVENT_BUS.register(this);
    }

    @SubscribeEvent
    public void onEvent(ForgeFreeNativeResourcesEvent event) { /* ... */ }
}
```

Fabric:

```java
public class ModFabric implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        FabricFreeNativeResourcesEvent.EVENT.register(() -> { /* ... */ });
    }
}
```

`VeilPostProcessingEvent.Pre/Post` contexts give access to the pipeline and its shaders (`context.getShader(id)`) for uniform uploads.

<!--
Source references:
- https://github.com/FoundryMC/Veil.wiki (Events, 2024-12-02 revision)
- https://github.com/FoundryMC/Veil/tree/1.20 (1.0.0.228: VeilEventPlatform, foundry.veil.api.event.*)
-->
