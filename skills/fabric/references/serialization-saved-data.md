---
name: fabric-saved-data
description: Persisting level-scoped data across sessions with SavedData.
---

# Saved Data

`SavedData` is the vanilla mechanism for data saved with the world (NBT on disk, codec-serialized).

## Data Class

```java
public class SavedBlockData extends SavedData {
    private int blocksBroken;

    public SavedBlockData(int blocksBroken) { this.blocksBroken = blocksBroken; }

    public int blocksBroken() { return blocksBroken; }

    public void incrementBlocksBroken() {
        blocksBroken++;
        setDirty(); // required: marks the data for saving
    }

    public static final Codec<SavedBlockData> CODEC = RecordCodecBuilder.create(instance -> instance.group(
        Codec.INT.fieldOf("blocks_broken").forGetter(SavedBlockData::blocksBroken)
    ).apply(instance, SavedBlockData::new));

    public static final SavedDataType<SavedBlockData> TYPE = new SavedDataType<>(
        "saved_block_data",      // filename in the world's data dir
        SavedBlockData::new,
        CODEC
    );
}
```

## Access

```java
public static SavedBlockData get(ServerLevel level) {
    DimensionDataStorage storage = level.getDataStorage();
    return storage.computeIfAbsent(TYPE);
}
```

`computeIfAbsent` loads existing data or creates a fresh instance.

## Usage

```java
PlayerBlockBreakEvents.AFTER.register((level, player, pos, state, blockEntity) -> {
    if (!level.isClientSide()) {
        SavedBlockData data = SavedBlockData.get((ServerLevel) level);
        data.incrementBlocksBroken();
    }
});
```

The count now survives restarts (world `data/saved_block_data.dat`).

## Key Points

- Call `setDirty()` on every mutation or the game won't write the file.
- Scope: attach to `ServerLevel` storage for per-dimension data; attach elsewhere (e.g. server-wide) for global data.

<!--
Source references:
- https://docs.fabricmc.net/develop/serialization/saved-data
-->
