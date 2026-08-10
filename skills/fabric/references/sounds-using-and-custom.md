---
name: fabric-sounds
description: Playing sound events, sound categories, volume/pitch, and registering custom sounds.
---

# Playing & Creating Sounds

## Playing Sounds

Prefer the **logical server** side so the game broadcasts to every client in range:

```java
entity.playSound(SoundEvents.AMETHYST_BLOCK_PLACE, 1.0f, 1.0f);
// or level.playSound(null, pos, soundEvent, SoundSource.BLOCKS, volume, pitch);
```

- `SoundCategory`/`SoundSource` selects which audio slider controls the volume.
- Volume `0..1` changes loudness; values above 1 only extend audible range (~`volume * 16` blocks).
- Pitch `0.5..1` lowers, above 1 raises pitch and playback speed; below 0.5 clamps.

## Registering a Custom Sound

1. Prepare a **mono OGG Vorbis** file (Minecraft's format; stereo breaks distance handling).
2. Put it at `assets/<mod>/sounds/metal_whistle.ogg`.
3. `assets/<mod>/sounds.json`:

```json
{
  "metal_whistle": {
    "subtitle": "subtitles.example-mod.metal_whistle",
    "sounds": ["example-mod:metal_whistle"]
  }
}
```

4. Register the `SoundEvent` (in an initializer or helper class):

```java
public static final SoundEvent METAL_WHISTLE = SoundEvent.createVariableRangeEvent(
    Identifier.fromNamespaceAndPath("example-mod", "metal_whistle"));
// Registry.register(BuiltInRegistries.SOUND_EVENT, id, METAL_WHISTLE);
```

5. Add the subtitle translation.

## Key Points

- Group registrations in a helper class with an `initialize()` so the initializer stays clean.
- For looping/dynamic sounds see `sounds-dynamic`.

<!--
Source references:
- https://docs.fabricmc.net/develop/sounds/using-sounds
- https://docs.fabricmc.net/develop/sounds/custom
-->
