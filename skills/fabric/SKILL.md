---
name: fabric
description: Minecraft Fabric mod development in Java — Fabric Loader, Loom, Yarn mappings, registries (blocks/items/entities/sounds), events, data generation, mixins, access wideners, and client/server separation. Use when developing or forking/二开 a Fabric mod (e.g. Minecraft 1.20.1 mods).
metadata:
  author: Hairy
  version: "2026.8.7"
---

# Fabric (Minecraft Modding)

Develop and fork Minecraft mods on the **Fabric** toolchain: Fabric Loader + Fabric API + Gradle (`fabric-loom`). Covers the patterns you need to register content, hook events, generate data, and split client/server code.

## Key facts

| Item | Value |
|------|-------|
| Stack | Java 17/21 + Gradle + `fabric-loom` + Yarn (or Mojang) mappings |
| Mod metadata | `src/main/resources/fabric.mod.json` |
| API | `net.fabricmc.fabric-api` (Fabric API modules) |
| Registries (1.19.3+) | `net.minecraft.registry.Registries` + `Registry.register(...)` |
| Common versions | 1.20.1 (yarn `1.20.1+build.10`, loader 0.16.x, fabric-api 0.92.x) |

## Quick start

```bash
# Generate a Fabric mod project
npx create-fabric-mod@latest   # or clone https://github.com/FabricMC/fabric-example-mod

# Build / run
./gradlew build
./gradlew runClient
./gradlew runServer
./gradlew runDatagen
```

## Registration in 3 lines (1.20.1)

```java
public static final Block MY_BLOCK = Registry.register(
    Registries.BLOCK, new Identifier("mymod", "my_block"), new Block(Block.Settings.copy(Blocks.STONE)));
public static final Item MY_ITEM = Registry.register(
    Registries.ITEM, new Identifier("mymod", "my_item"), new Item(new Item.Settings()));
```

## References

### Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Setup | Environment, project structure, `fabric.mod.json`, build | [core-setup](references/core-setup.md) |
| Registration | Blocks, items, entities, sounds, block entities, creative tabs | [core-registration](references/core-registration.md) |
| Data generation | Models, blockstates, recipes, loot, tags, sounds, advancements | [core-datagen](references/core-datagen.md) |
| Mixin & Access Widener | `@Mixin` injection and widening access to vanilla internals | [core-mixin](references/core-mixin.md) |

### Features

| Topic | Description | Reference |
|-------|-------------|-----------|
| Events | Fabric API event system (lifecycle, tick, player, networking) | [features-events](references/features-events.md) |
| Client side | `@Environment(EnvType.CLIENT)`, rendering, key binds, HUD | [features-client](references/features-client.md) |
| Best practices | Client/server separation, common pitfalls, resource layout | [best-practices](references/best-practices.md) |

## Source references

- https://docs.fabricmc.net/
- https://fabricmc.net/develop
- https://github.com/FabricMC/fabric-example-mod
