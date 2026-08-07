---
name: fabric-first-fluid
description: Custom fluids: source/flowing states, liquid block, bucket, tags, and rendering.
---

# Creating Your First Fluid

A fluid needs two registered instances (source + flowing), a `LiquidBlock`, a `BucketItem`, and a fluid tag.

## Fluid Class

Extend `FlowingFluid` with an abstract base plus `Source`/`Flowing` subclasses. Override the shared behavior in the base: `animateTick` (particles/sound), `entityInside` (effects on entities inside), `canBeReplacedWith` (flowing logic), `getSource`/`getFlowing`/`getBlock`/`getBucket` to point at registered instances.

## Registration

```java
// in ModFluids (init via ModInitializer)
public static final Fluid ACID_STILL = Registry.register(BuiltInRegistries.FLUID,
    ModFluidIds.ACID, new AcidFluid.Source());
public static final Fluid ACID_FLOWING = Registry.register(BuiltInRegistries.FLUID,
    ModFluidIds.ACID_FLOWING, new AcidFluid.Flowing());
```

Register the `LiquidBlock` in `ModBlocks` (needed by `/setblock` and world placement) and the bucket:

```java
new BucketItem(ModFluids.ACID_STILL, new Item.Properties().stacksTo(1))
```

## Tags

`data/<mod>/tags/fluid/acid.json` lists both states:

```json
{ "replace": false, "values": ["example-mod:acid", "example-mod:acid_flowing"] }
```

Add to `minecraft:water` / `minecraft:lava` fluid tags to inherit water/lava behavior (fog, sponge absorption, swimming). Add your bucket to `ConventionalItemTags.BUCKET` for cross-mod compatibility.

## Rendering

In the client initializer, `FluidRenderHandlerRegistry.register(ModFluids.ACID, FluidModel.Unbaked(...))` with the still/flowing textures and a `BlockTintSource` (e.g. `BlockTintSources.constant(0x00FF00)` for a green acid using vanilla water textures).

<!--
Source references:
- https://docs.fabricmc.net/develop/fluids/first-fluid
-->
