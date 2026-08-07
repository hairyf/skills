---
name: features-lights
description: Add deferred point, area, directional, and spot lights to the world, define custom light types, and use DDA occlusion.
---

# Deferred Lights

Veil's deferred lighting replaces vanilla block lighting with realistic, data-driven lights.

## Built-in Light Types

| Type | Data Class | Behavior |
|------|-----------|----------|
| Point | `PointLightData` | Uniform emission from a point; `position` + `radius` |
| Area | `AreaLightData` | Emission from a rotatable quad; `position` + `distance`, `angle`, `orientation` |
| Directional | `DirectionalLightData` | No position, just `direction`; simulates the sun |
| Spot | `SpotLightData` | Like area lights but a single `size` value |

`LightData` subclasses hold per-light fields; use `InstancedLightData`/`IndirectLightData` for renderer compatibility. Custom light types register in `LightTypeRegistry` with their own `LightTypeRenderer`.

## DDA Occlusion

For cheap shadows, implement `DDALightRenderer` (renderer) and `DDALightData` (data). DDA occlusion only occludes full blocks — complex models like entities are not occluded.

## Adding Lights from the Editor

Open the editor (F6) → **Renderer** menu → **Add Light**; pick a type, then edit properties via the dropdown. Lights get random names from `DebugEntityNameGenerator`.

## Adding Lights in Code

```java
PointLightData light = new PointLightData();
light.setPosition(position);
light.setRadius(radius);

// The handle lets you mutate the light at runtime
LightRenderHandle<PointLightData> handle =
        VeilRenderSystem.renderer().getLightRenderer().addLight(light);
handle.getLightData().setColor(Color.RED);

// Remove it
handle.free();
```

<!--
Source references:
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/Lights.md
-->
