---
name: fabric-codecs
description: Mojang codec system: building, combining, transforming and dispatching codecs.
---

# Codecs

Codecs (Mojang's DataFixerUpper) serialize/deserialize objects to any `DynamicOps` format (JSON, NBT...). A codec defines structure; dynamic ops define the format — any codec works with any ops.

## Basic Usage

```java
DataResult<JsonElement> encoded = BlockPos.CODEC.encodeStart(JsonOps.INSTANCE, pos);
DataResult<BlockPos> decoded = BlockPos.CODEC.parse(JsonOps.INSTANCE, json);

Optional<BlockPos> value = decoded.result();               // success or empty
T valueOrHandle = decoded.resultOrPartial(error -> LOGGER.error("Failed: {}", error));
```

Built-ins: `Codec.INT/STRING/BOOL/FLOAT/DOUBLE/LONG`, `Codec.listOf(codec)` (immutable lists), `BlockPos.CODEC`, `Identifier.CODEC`, `ComponentSerialization.CODEC`, registry codecs via `BuiltInRegistries.ITEM.byNameCodec()` / `holderByNameCodec()`.

## Records

```java
public record CoolBeansClass(int count, Item item, List<BlockPos> positions) {
    public static final Codec<CoolBeansClass> CODEC = RecordCodecBuilder.create(instance -> instance.group(
        Codec.INT.fieldOf("count").forGetter(CoolBeansClass::count),
        BuiltInRegistries.ITEM.byNameCodec().fieldOf("item").forGetter(CoolBeansClass::item),
        BlockPos.CODEC.listOf().fieldOf("positions").forGetter(CoolBeansClass::positions)
    ).apply(instance, CoolBeansClass::new));
}
```

`fieldOf` produces a `MapCodec` (serializes as a map key); `optionalFieldOf(name, defaultValue)` makes fields optional; `MapCodec#codec` converts back to a `Codec`. Field order must match constructor argument order.

## Transformations

| Method | Decode always valid? | Encode always valid? |
--------|----------------------|----------------------|
| `xmap(to, from)` | yes | yes |
| `comapFlatMap` | no | yes |
| `flatComapMap` | yes | no |
| `flatXMap` | no | no |

Use the flat variants when conversion can fail (e.g. strings → `Identifier`).

## Composition Helpers

- `Codec.intRange(min, max)` / `floatRange` / `doubleRange` — inclusive numeric constraints.
- `Codec.pair(a, b)` — merges two field-based codecs into a map.
- `Codec.either(a, b)` — tries `a`, falls back to `b` (second error returned on total failure).
- `Codec.unboundedMap(keyCodec, valueCodec)` — maps with string-serializing keys (`Identifier.CODEC` works).
- `MapCodec.unit(value)` — constant value, serializes to nothing.
- `Codec.recursive(name, self -> ...)` — self-referential codecs (e.g. linked lists, `Component` trees).
- `dispatch` — registry dispatch: a `type` field selects the codec for the rest of the data. Requires per-type codecs, a `BeanType` record, a getter on the base type, and a registry (`Registry#byNameCodec`).

## Stream Codecs

For network transmission use `StreamCodec<FriendlyByteBuf, T>` (e.g. `StreamCodec.composite(...)`) — required by payloads, recipe serializers, and menu types.

<!--
Source references:
- https://docs.fabricmc.net/develop/serialization/codecs
-->
