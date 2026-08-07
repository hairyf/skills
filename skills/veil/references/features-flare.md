---
name: features-flare
description: Create data-driven effects with Flare — shells, properties, property modifiers, templates, modules, and controllers.
---

# Flare Effects

Flare is a data-driven effect system (based on Waterfall) for complex, animatable effects. All paths go off `assets/{modid}/flare`.

## Shells

Shells are texture-stripped models exported from Blockbench, placed in `flare/shells/`. They support models larger than 3 blocks and single-axis rotations at any angle.

## Properties

Properties hold values that feed shader uniforms and/or model data:

```json5
{
  "name": "Color",
  "type": "vec3",                       // bool|int|float|vec2|vec3|vec4|mat3|mat4|sampler2d; mods add "modid:type"
  "value": [0.3, 0.6, 0.9]
}
```

## Property Modifiers

Modifiers take a controller value, evaluate it through curves, and append to a property:

```json5
{
  "name": "modifierName",
  "class": "plumeA",                    // optional; all classes if omitted/model data
  "controller": "throttle",
  "property": "Speed",
  "type": "float",                      // float|vec2|vec3|vec4
  "curve": [
    { "time": 0.0, "value": 0.0, "easing": "ease_out_quad" },
    { "time": 1.0, "value": 1.0, "easing": "linear" }
  ],
  "mode": "replace"                     // replace|add|subtract|multiply
}
```

Vec2/3/4 use `"curves"` (array of curve arrays). Host-bound controllers pull values via `EffectHost#getValue(name)`; **global** controllers (e.g. `random`) are registered with a `global::` prefix.

## Materials & Models

```json5
{
  "class": "plumeA",
  "renderType": "veil:rendertype",
  "randomizeSeed": false,               // adds _Seed property when true
  "properties": []
}
```

Models reference a shell plus offsets; `positionOffset`/`rotationOffset`/`scaleOffset` are exposed as the model properties `model::position`, `model::rotation`, `model::scale`. A `ModelToWorld` mat4 (and its inverse `IModelToWorld`) is applied automatically.

```json5
{
  "path": "veil:cube",
  "positionOffset": [0, 0, 0],
  "rotationOffset": [0, 0, 0],
  "scaleOffset": [1, 1, 1],
  "materials": { /* single or array */ }
}
```

## Layers, Templates, Modules

- **Effect layer**: `{ "name": "...", "disabled": false, "model": {...}, "modifiers": [] }`
- **Template** (`flare/templates/`): `{ "layers": [...] }`
- **Module** (`flare/module/`): `{ "subModules": { "plume": "veil:plume", "splash": ["veil:splash", "veil:plume"] } }` — you choose which sub-module renders, and it renders all its templates.

Shell overrides let you swap shells at render time for dynamic/custom models.

## Rendering

```java
FlareEffectManager.getModule(module).getSubModule(subModule).render(host, matrixStack, partialTick);
FlareEffectManager.getTemplate(template).render(host, matrixStack, partialTick);
```

Wrap in try/catch — effects can be missing or invalid.

## Built-ins

- Every material gets `_Time` (vec4 `t/2, t, t*2, t*3`, `t` = seconds since launch).
- Materials with `randomizeSeed: true` get `_Seed` (random 0..1, not modifiable).
- `random` controller is accessed as `global::random`.

<!--
Source references:
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/Flare.md
-->

