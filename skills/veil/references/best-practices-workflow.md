---
name: best-practices-workflow
description: Practical workflow for developing with Veil — editors, hot reload, error handling, and integration patterns.
---

# Veil Development Workflow

## Iterate with Editors & Hot Reload

- Install ImGuiMC in development; press **F6** for the Veil editor (Renderer/lights, Resources, particle editor).
- Edit JSON/GLSL in an external editor and press **F3+T** to hot-reload — most Veil data (shaders, render types, framebuffers, post pipelines, particles) reloads live.
- The in-game text editor/resource browser is currently disabled; don't rely on it.
- Use `/veilc buffers enable <type>` to inspect deferred buffers while debugging.

## Robustness Patterns

- **Null-check everything loaded at runtime**: `VeilRenderSystem.setShader(...)` returns null on failure; `VeilRenderType.get(...)` returns null on parse errors; `shader.getUniform(...)` returns null when absent.
- **Wrap particle/effect spawning in try/catch** — invalid data must never crash the client:

```java
try {
    ParticleEmitter emitter = VeilRenderSystem.renderer().getParticleManager().createEmitter(id);
    emitter.setPosition(pos);
    VeilRenderSystem.renderer().getParticleManager().addParticleSystem(emitter);
} catch (Exception ignored) {}
```

- **Render-thread discipline**: dynamic buffer enable/disable and vertex buffer operations must run on the render thread.
- **Unbind shaders** with `ShaderProgram.unbind()` after drawing.
- **Fixed buffers** should cover most stage-specific drawing; use level-stage events only as a last resort.

## Integration Tips

- Call `VeilRenderType#get` inside the render loop so resource reloads update rendering.
- For post-processing fragment shaders, use `veil:blit_screen` as the vertex program.
- Match framebuffer format and data type (`texture` vs `render_buffer`, integer vs float) or drivers refuse to draw.
- When bundling Veil into your mod jar (e.g. MinecraftFoundFootage), use `transitive = false` + `include(...)`.
- Require GPU features via `required_features` rather than hoping the shader fails gracefully.

## Troubleshooting

| Symptom | Check |
|---------|-------|
| Shader not loading | Missing stage files, include cycles, unmet `required_features`, compile errors in logs |
| Injection not applying | Missing `head()`/`tail()` marker; wrong target extension for `redirect` |
| Post output black | Wrong `out` framebuffer, depth write enabled without `gl_FragDepth`, missing `in` samplers |
| Particles invisible | `additive` + blend state, sprite path, `render_style` choice, invalid module JSON |

<!--
Source references:
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/Home.md
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/Quasar.md
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/PostProcessing.md
-->

