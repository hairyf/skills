---
name: fabric-dynamic-sounds
description: Client-side SoundInstances: looping sounds that track entities/block entities with dynamic volume and pitch.
---

# Dynamic & Interactive Sounds

Plain `SoundEvent`s are one-shot broadcasts. For looping sounds that track a source and change volume/pitch over time, use client-side `SoundInstance`s.

## Client-Only

`AbstractSoundInstance` is `@Environment(EnvType.CLIENT)` — these classes must live in `src/client` and only run on the client. Using them on a logical server crashes multiplayer.

## Custom SoundInstance

Extend `MovingSoundInstance` (or `AbstractTickableSoundInstance`):

```java
public class CustomSoundInstance extends MovingSoundInstance {
    private final LivingEntity owner;

    protected CustomSoundInstance(SoundEvent sound, SoundSource category, LivingEntity owner) {
        super(sound, category, SoundInstance.createUnseededRandom());
        this.owner = owner;
        this.looping = true;
        this.volume = 1.0f;
        this.attenuation = Attenuation.LINEAR;
    }

    @Override
    public void tick() {
        if (owner.isRemoved()) {
            stop();
            return;
        }
        this.x = owner.getX(); this.y = owner.getY(); this.z = owner.getZ();
        this.volume = computeFromOwner();   // dynamic
        this.pitch = computeFromOwner();
    }
}
```

Play/stop via the client sound manager:

```java
client.getSoundManager().play(instance);
client.getSoundManager().stop(instance);
```

## Advanced Patterns

- Abstract `DynamicSoundSource` interface so one sound system works with entities and block entities.
- Central `DynamicSoundManager` (singleton) to track playing instances, dedupe (one engine = one engine sound), and handle transitions (fade in/out) instead of instant start/stop.
- Start/stop sounds from `onStartedTrackingBy`/`onStoppedTrackingBy` or custom clientbound packets.
- Sync source state (stress, overheat) via `EntityDataAccessor`, block-entity update packets, or custom S2C payloads; then adjust volume/pitch in `tick()`.
- Audio prep: trim to a seamless loop (cut start/stop transients, EQ out constant hums, crossfade end→start), export mono OGG.

<!--
Source references:
- https://docs.fabricmc.net/develop/sounds/dynamic-sounds
-->
