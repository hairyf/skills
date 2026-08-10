---
name: core-setup
description: Fabric mod environment — JDK/Gradle/Loom, project layout, fabric.mod.json, and the build lifecycle.
---

# Setup

## Environment

- **JDK**: Java 17 (1.20.x) or Java 21 (newer versions).
- **Gradle**: the wrapper (`./gradlew`) is committed; no system Gradle needed.
- **Loom**: `fabric-loom` Gradle plugin (e.g. `1.9-SNAPSHOT`) wires Minecraft + mappings into the build.

## Project layout

```text
src/main/
├── java/<group>/<modid>/          # source
│   ├── MyMod.java                 # ModInitializer (common entrypoint)
│   ├── MyModClient.java           # ClientModInitializer (client entrypoint)
│   └── MyModDataGenerator.java    # FabricDataGenerator? entrypoint
└── resources/
    ├── fabric.mod.json
    ├── mymod.mixins.json
    ├── mymod.accesswidener
    ├── assets/<modid>/            # textures, models, blockstates, sounds, lang
    └── data/<modid>/              # recipes, loot_tables, tags, advancements
```

## fabric.mod.json

```json
{
  "schemaVersion": 1,
  "id": "mymod",
  "version": "1.0.0",
  "name": "My Mod",
  "environment": "*",
  "entrypoints": {
    "main": ["com.example.MyMod"],
    "client": ["com.example.MyModClient"],
    "datagen": ["com.example.MyModDataGenerator"]
  },
  "depends": {
    "fabricloader": ">=0.16.5",
    "minecraft": "~1.20.1",
    "java": ">=17",
    "fabric-api": "*"
  },
  "mixins": ["mymod.mixins.json"],
  "accessWidener": "mymod.accesswidener"
}
```

## gradle.properties (1.20.1 reference)

```properties
minecraft_version=1.20.1
yarn_mappings=1.20.1+build.10
loader_version=0.16.5
fabric_version=0.92.2+1.20.1
mod_version=1.0.0
maven_group=com.example
archives_base_name=mymod
```

## Build lifecycle

- `./gradlew build` — compiles, runs the mod jar, validates `fabric.mod.json`.
- `./gradlew runClient` — launches the game with the dev mod loaded.
- `./gradlew runDatagen` — executes the datagen entrypoint, writing JSON to `src/main/generated/`.
- `./gradlew runServer` — dedicated server test (no client code may load).

## Key points

- Yarn mappings give readable names (`Registry`, `Registries`); Mojang mappings via `parchment` or `mojmap` are an alternative.
- `fabric-api` is a collection of versioned modules — depend on `fabric-api` as a whole for simplicity.
- Never commit `run/` (the dev game directory) or Gradle caches.

<!--
Source references:
- https://docs.fabricmc.net/
- https://fabricmc.net/develop
- https://github.com/FabricMC/fabric-example-mod
-->
