# Veil Shader / Post-Processing Capability

When the user asks to **add custom shaders, post-processing effects (VHS/CRT/noise/scanlines/chromatic aberration), custom framebuffers, or deferred rendering to a Minecraft Fabric/NeoForge mod**, use Veil (foundry.veil).

## Common commands

```bash
# In-game debug: view framebuffers / dynamic buffers / lights (Veil dev tools)
# Open the editor menu with F6, or use the client command:
/veilc buffers enable albedo normal
```

## Key rules

- All Veil assets live under `src/main/resources/assets/<modid>/pinwheel/` — shaders in `shaders/program/` + `shaders/include/`, pipelines in `post/`, framebuffers in `framebuffers/`, injections in `shader_injection/`.
- A post pipeline is JSON + GLSL; the fragment shader samples the scene from `DiffuseSampler0` (color) and `DiffuseDepthSampler` (depth) and writes `fragColor`.
- Always draw the final stage into `veil:post` so the result reaches the screen.
- Java-side uniform updates go in `FabricVeilPostProcessingEvent.PRE` (client only, `onInitializeClient`).
- Veil is **client-side only** — never reference Veil classes from a server entrypoint.
- The wiki uses Mojang mappings; on a Yarn project map `ResourceLocation`→`Identifier`, `PoseStack`→`MatrixStack`, `Level`→`World`.
- 1.20.1 uses Veil `1.0.0.x`; newer MC (1.21+) uses Veil 4.x with the same `pinwheel` resource layout but a different Java API surface.
