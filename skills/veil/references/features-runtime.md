---
name: features-runtime
description: Veil Java runtime API — setShader, post-processing events, uniforms, render stages, definitions, dynamic buffers.
---

# Runtime API

## Using a shader program directly

```java
import foundry.veil.api.client.render.VeilRenderSystem;
import foundry.veil.api.client.render.shader.program.ShaderProgram;
import foundry.veil.api.client.render.shader.uniform.ShaderUniformAccess;
import net.minecraft.util.Identifier;

private static final Identifier CUSTOM_SHADER = new Identifier("modid", "my_shader");

public static void render(...) {
    ShaderProgram shader = VeilRenderSystem.setShader(CUSTOM_SHADER);
    if (shader == null) return;

    ShaderUniformAccess customValue = shader.getUniform("CustomValue");
    if (customValue != null) customValue.setFloat(32.2F);

    shader.bind();
    // ... render geometry ...
    ShaderProgram.unbind();
}
```

Always null-check uniforms — they are null when absent from the shader.

## Post-processing events

Fabric (client entrypoint):

```java
FabricVeilPostProcessingEvent.PRE.register((name, pipeline, context) -> {
    if (name.equals(CUSTOM_PIPELINE)) {
        pipeline.setFloat("Exposure", 0.8F);
        pipeline.setInt("Frame", 42);
        pipeline.setVector("Tint", 1.0F, 0.5F, 0.5F, 1.0F);
    }
});
FabricVeilPostProcessingEvent.POST.register((name, pipeline, context) -> { ... });
```

Platform-agnostic equivalent: `VeilEventPlatform.INSTANCE.preVeilPostProcessing((name, pipeline, context) -> ...)`.

`PostPipeline` implements `MutableUniformAccess`: `setFloat`, `setInt`, `setVector`, `setMatrix`, etc. `PostPipeline.Context` gives `getDrawFramebuffer()`, `getPipeline(id)`, `getShader(id)`, `setSampler(name, id)`, `setFramebuffer(id, fbo)`.

## Render stage hooks

```java
// Draw at a specific point in the level render
VeilEventPlatform.INSTANCE.onVeilRenderTypeStageRender((stage, levelRenderer, bufferSource, poseStack,
        projectionMatrix, renderTick, partialTicks, camera, frustum) -> {
    if (stage == VeilRenderLevelStageEvent.Stage.AFTER_SKY) {
        // draw into bufferSource
    }
});

// Fixed buffers: batch a render type and finish it after a stage
VeilEventPlatform.INSTANCE.onVeilRegisterFixedBuffers(registry ->
    registry.registerFixedBuffer(VeilRenderLevelStageEvent.Stage.AFTER_PARTICLES, CUSTOM_RENDER_TYPE));
```

Fabric event classes: `FabricVeilRenderLevelStageEvent`, `FabricVeilRegisterFixedBuffersEvent`, `FabricVeilRendererEvent`.

## Shader definitions & dynamic buffers

```java
VeilRenderer renderer = VeilRenderSystem.renderer();
renderer.getShaderDefinitions().set("MY_FLAG");     // injects #define MY_FLAG, recompiles dependents

renderer.enableBuffers(...);   // enable deferred-style dynamic buffers (albedo/normal/light_uv/light_color)
renderer.disableBuffers(...);  // must be called on the render thread
```

In shaders, mark a value with `// #veil:normal` (or `albedo`, `light_uv`, `light_color`) to output it to a dynamic buffer; guards `VEIL_NORMAL` etc. are defined when the buffer is enabled.

## Key points

- Post-processing events fire only when pipelines exist and run.
- Veil is client-side only — keep all calls in client code.
- `VeilRenderSystem.setShader` returns null if the shader failed to load (e.g. unsupported `required_features`).

<!--
Source references:
- https://github.com/FoundryMC/Veil/wiki/Shader
- https://github.com/FoundryMC/Veil/wiki/Events
- https://github.com/FoundryMC/Veil/wiki/RenderTypeStage
- https://github.com/FoundryMC/Veil/wiki/DynamicBuffer
-->
