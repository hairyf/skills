---
name: veil-v1-lights
description: Veil 1 deferred lights — PointLight/AreaLight/DirectionalLight, LightTypeRegistry, LightRenderer, the deferred framebuffer attachments, and the light editor.
---

# Veil 1 Deferred Lights

Veil 1's lighting API is `foundry.veil.api.client.render.deferred.light.*`. It replaces vanilla block lighting with deferred lights rendered into the `veil:deferred` framebuffer.

## Light classes

All lights extend `Light` (color via `setColor(float,float,float)` / `setColor(int)` / `setColor(Vector3fc)`, brightness via `setBrightness(float)`):

| Class | Properties |
|---|---|
| `PointLight` | `setPosition(x,y,z)`, `setRadius(float)` — uniform emission from a point |
| `AreaLight` | position + `setDistance`, `setAngle`, `setOrientation` — emission from a quad |
| `DirectionalLight` | `setDirection(x,y,z)` — sun-like, no position |

Each light keeps a `dirty` flag; changing any property calls `markDirty()` so the GPU data re-uploads on the next frame.

## Adding/removing lights

```java
LightRenderer lightRenderer = VeilRenderSystem.renderer().getDeferredRenderer().getLightRenderer();

PointLight lamp = new PointLight()
        .setPosition(pos.getX() + 0.5, pos.getY() + 0.75, pos.getZ() + 0.5)
        .setRadius(8.0F)
        .setColor(1.0F, 0.85F, 0.6F)
        .setBrightness(1.2F);

lightRenderer.addLight(lamp);   // must be called on the render thread
// ...
lightRenderer.removeLight(lamp);
```

Keep references to your lights — `LightRenderer` stores what you add and cannot look them back up by id (`getLights(LightType)` returns all lights of a type). Remove lights when the block entity is removed (`onRemoved`/`setRemoved`) and on resource reload.

`LightRenderer` also exposes `enableVanillaLight()/disableVanillaLight()` (vanilla lightmap + directional shading) and `enableAmbientOcclusion()/disableAmbientOcclusion()`.

## Light types & custom renderers

`foundry.veil.api.client.registry.LightTypeRegistry` has built-in `POINT`, `AREA`, and `DIRECTIONAL` types (each with an associated `LightTypeRenderer`: `InstancedLightRenderer` / `IndirectLightRenderer` subclasses). Custom light types register via `LightTypeRegistry.REGISTRY` with a renderer factory.

## Deferred framebuffer

The deferred renderer writes into the `veil:deferred` framebuffer; its attachments follow the deferred layout (`AlbedoSampler`, `NormalSampler`, `MaterialSampler`, `EmissiveSampler`, `VanillaLightSampler`, depth). Lights are stored in a GPU buffer per type — `PointLight#store(ByteBuffer)` writes `position.xyz`, `color.rgb * brightness`, `radius`. Enable/disable the whole deferred pipeline with `VeilRenderSystem.renderer().getDeferredRenderer().enable()/disable()`; `isActive()` tells whether it is currently in use.

## Light editor

F6 → **Renderer** tab → **Add Light** spawns a light at the camera; edit position/radius/color live. Useful for tuning streetlamp lights before hardcoding values.

<!--
Source references:
- https://github.com/FoundryMC/Veil/tree/1.20 (1.0.0.228: deferred.light package, LightRenderer, VeilDeferredRenderer)
- https://github.com/FoundryMC/Veil.wiki (Home/Feature list, 2024-12-02 revision)
-->
