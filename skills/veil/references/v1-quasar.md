---
name: veil-v1-quasar
description: Veil 1 Quasar particles — resource layout, emitter/module/particle-data/shape JSON, codecs, spawning from Java and commands, and custom modules.
---

# Veil 1 Quasar (Particles)

Quasar is Veil's fully resource-pack-driven particle system. All files live under `assets/<modid>/quasar/` (this is the one resource folder outside `pinwheel/`).

## Folder structure

```
quasar/
  emitters/            Particle emitter definitions
  modules/             Module parameter JSON
    init/ render/ update/ force/ collision/
  particle_data/       Particle data (modules + textures + style)
  shapes/              Emitter shapes
  settings/            Particle settings
```

Everything is Mojang-codec driven — unknown fields fail loudly, so check the codec definitions in `foundry.veil.api.quasar.data.*` when in doubt.

## Key concepts

- **Particle Emitter** (`ParticleEmitterData`) — lifetime (`max_lifetime`), `loop`, emission `rate`/`count`, `max_particles`, plus `emitter_settings` and `particle_data`.
- **Emitter settings** (`EmitterSettings`) — `shape` reference + particle settings reference.
- **Shape** (`EmitterShapeSettings`) — where particles spawn: `point`, `hemisphere`, `cylinder`, `sphere`, `cube`, `torus`, `disc`, `plane`. A random surface point is picked per particle.
- **Particle data** (`QuasarParticleData`) — `should_collide`, render style (`BILLBOARD` textured / `CUBE` colored), texture(s), and the module list.
- **Particle settings** (`ParticleSettings`) — `particle_speed`, `particle_size`, `lifetime`, `initial_direction` and their randomization ranges.
- **Modules** — JSON-instanced code attached to particles, executed at `init`/`render`/`update`/`force`/`collision` stages.

Example module JSON:

```json
{
  "module": "die_on_collision"
}
```

Built-in module ids (from `ModuleType` in 1.0.0.228): `initial_velocity`, `init_color`, `init_sub_emitter`, `init_size`, `init_random_rotation`, `light`, `block`, `trail`, `color`, `tick_size`, `tick_sub_emitter`, `die_on_collision`, `sub_emitter_collision`, `gravity`, `vortex`, `point_attractor`, `vector_field`, `drag`, `wind`, `point_force`.

## Spawning particles

Java (client-side):

```java
public static void spawnParticle(Vec3 position, ResourceLocation id) {
    try {
        ParticleSystemManager manager = VeilRenderSystem.renderer().getParticleManager();
        ParticleEmitter emitter = manager.createEmitter(id);
        emitter.setPosition(position);
        manager.addParticleSystem(emitter);
    } catch (Exception ignored) {
        // never crash rendering on a bad particle file
    }
}
```

Command: `/quasar <particleemitter> <position>` — client-side only, so only a player can run it.

## Custom modules

Custom module types register in `ParticleModuleTypeRegistry` with a codec (`ParticleModuleData` subclasses). Module *data* (JSON parameters) and *module* (runtime `ParticleModule` implementing `Render`/`Update`/`Init`/`Force`/`Collision` interfaces) are separate — e.g. `LightModuleData` picks `StaticLightModule` or `DynamicLightModule` depending on whether a gradient is defined.

## Editing workflow

Use the F6 resource browser (Resource tab) to edit any `quasar/` JSON in-game, then F3+T to reload — emitters update at runtime. The dedicated particle editor is not finished in v1.

<!--
Source references:
- https://github.com/FoundryMC/Veil.wiki (Quasar, 2024-12-02 revision)
- https://github.com/FoundryMC/Veil/tree/1.20 (1.0.0.228: foundry.veil.api.quasar.*)
-->
