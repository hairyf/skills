---
name: features-quasar
description: Build data-driven particle emitters with Quasar — emitters, shapes, particle data, modules, and spawning.
---

# Quasar Particles

Quasar is a fully data-driven particle system. Particles are defined as *emitters* under `assets/{modid}/quasar`:

```
quasar/
  emitters/            # emitter definitions
  modules/
    init/              # init modules
    update/            # update modules
    render/            # render modules
    particle_data/     # particle data
    emitter/
      particle/        # particle settings
      shape/           # emitter shapes
```

## Emitter

`emitters/burst.json`:

```json5
{
  "max_lifetime": 20,          // ticks the emitter emits
  "loop": true,
  "rate": 1,                   // ticks between emissions
  "count": 2,                  // particles per emission
  "emitter_settings": {
    "shape": "modid:burst_shape",
    "particle_settings": "modid:burst_settings",
    "force_spawn": false
  },
  "particle_data": "modid:burst_data"
}
```

## Particle Settings

`modules/emitter/particle/burst_settings.json` (all fields required) — lifetime, size, speed, direction and their random ranges:

```json5
{
  "random_speed": true,
  "random_size": true,
  "random_lifetime": true,
  "initial_direction": [1.0, 1.0, 1.0],
  "random_initial_direction": true,
  "random_initial_rotation": false,
  "particle_size_variation": 0.15,
  "particle_lifetime": 40,
  "particle_lifetime_variation": 20,
  "particle_speed": 1.0,
  "base_particle_size": 0.1
}
```

## Emitter Shapes

`modules/emitter/shape/burst_shape.json`. Built-in shapes: `veil:point|hemisphere|cylinder|sphere|cube|torus|disc|plane`:

```json5
{
  "shape": "veil:sphere",
  "dimensions": [0.5, 0.5, 0.5],
  "rotation": [0.0, 0.0, 0.0],
  "from_surface": true
}
```

## Particle Data

`modules/particle_data/burst_data.json` — `render_style` is `CUBE` (textureless colored cube) or `BILLBOARD` (textured, always faces the player):

```json5
{
  "render_style": "CUBE",
  "modules": [ ... ],
  "sprite_data": {
    "sprite": "modid:path/to/particle/sprite",
    "frame_count": 2,
    "frame_time": 2.0,
    "frame_width": 16,
    "frame_height": 16,
    "stretch_to_lifetime": true
  },
  "additive": false,
  "should_collide": true,
  "face_velocity": false,
  "velocity_stretch_factor": 1.0
}
```

## Modules

Each module JSON picks a registered module id (`ParticleModuleTypeRegistry`) and adds parameters. Example module set:

```json5
{
  "modules": [
    { "module": "light", "gradient": { "color": "0xFFFFFFFF" }, "brightness": "3 - q.agePercent * 3", "radius": 5 },
    { "module": "drag", "strength": 0.9 },
    { "module": "tick_size", "size": "0.1 - q.agePercent * 0.1" },
    { "module": "die_on_collision" },
    {
      "module": "color",
      "gradient": {
        "rgb_points": [ { "percent": 0, "color": "0xFF0000" }, { "percent": 1, "color": "0x0000FF" } ],
        "alpha_points": [ { "percent": 0, "alpha": 1 }, { "percent": 1, "alpha": 0 } ]
      },
      "interpolant": "q.agePercent"
    }
  ]
}
```

Module fields use Molang expressions (`q.agePercent` = 0..1 progress through lifetime). The `color` module's RGB points take `0xRRGGBB` (alpha is separate); the `light` module takes static ARGB.

## Spawning

```java
try {
    ParticleSystemManager manager = VeilRenderSystem.renderer().getParticleManager();
    ParticleEmitter emitter = manager.createEmitter(id);
    emitter.setAttachedEntity(entity);   // or emitter.setPosition(vec3)
    manager.addParticleSystem(emitter);
} catch (Exception ignored) {
    // invalid particle — never crash spawning
}
```

Or client-side: `/quasar <particleemitter> <position>` (player-executed only).

## Custom Modules

- **Module data**: JSON parameters (a record implementing `ParticleModuleData`), which calls `addModules` on spawn — e.g. `LightModuleData` picks `StaticLightModule` or `DynamicLightModule`.
- **Module**: implements `ParticleModule` plus lifecycle interfaces `InitParticleModule`, `ForceParticleModule`, `UpdateParticleModule`, `CollisionParticleModule`, `RenderParticleModule`.
- Register the module type in `ParticleModuleTypeRegistry` so Veil can decode it.

The particle editor (Veil >= 4.3.0 + ImGuiMC) lives under the F6 menu → Resources tab for live editing.

<!--
Source references:
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/Quasar.md
-->

