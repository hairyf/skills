---
name: fabric-rendering-world-and-particles
description: World/level render events, extraction & drawing phases, and custom particles.
---

# Rendering in the World & Particles

## Level Render Events

Inject into vanilla world rendering via `LevelRenderEvents` (renamed from `WorldRenderEvents` in 26.1):

- `START`, `END_MAIN`, `BEFORE_ENTITIES`, `AFTER_ENTITIES`, `BEFORE_TRANSLUCENT`, `END_EXTRACTION`, `DEBUG_RENDER`, `BEFORE_BLOCK_OUTLINE`, `AFTER_BLOCK_OUTLINE_EXTRACTION`.
- Contexts expose `poseStack` (was `matrices`), `bufferSource` (was `consumers`), `deltaTracker` (was `tickCounter`), `submitNodeCollector` (was `commandQueue`), `levelRenderer`.

Add custom world elements during the **extraction** phase (even if methods are named `draw*`), because the buffer builder is finalized when drawing starts.

## Custom Render Pipelines

Define a `RenderPipeline` (`RenderPipeline.builder(RenderType.create(...)).setVertexFormat(...).setDrawMode(...)`), register it, then:

- Extraction: push `RenderState`s via the pipeline's extractor (`beginExtraction`/`add`).
- Drawing: draw a `StagedVertexBuffer` sized for the pipeline (`RenderType.SMALL_BUFFER_SIZE`), then clear.
- Cleanup: mixin into `GameRenderer#close`.

## Custom Particles

1. Common code — register a `ParticleType`:

```java
public static final SimpleParticleType SPARKLE_PARTICLE = FabricParticleTypes.simple();
// in onInitialize:
Registry.register(BuiltInRegistries.PARTICLE_TYPE,
    Identifier.fromNamespaceAndPath("example-mod", "sparkle_particle"), SPARKLE_PARTICLE);
```

2. Client code — register the provider (factory), reusing vanilla behavior:

```java
ParticleProviderRegistry.register(ExampleMod.SPARKLE_PARTICLE,
    EndRodParticle.Provider::new);
```

3. Assets:

- `assets/<mod>/textures/particle/sparkle_particle_texture.png`
- `assets/<mod>/particles/sparkle_particle.json`:

```json
{ "textures": ["example-mod:sparkle_particle_texture"] }
```

Multiple textures = animated particle (cycles in order).

4. Test: `/particle example-mod:sparkle_particle ~ ~1 ~`.

<!--
Source references:
- https://docs.fabricmc.net/develop/rendering/world
- https://docs.fabricmc.net/develop/rendering/particles/creating-particles
-->
