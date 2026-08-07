---
name: fabric-project-structure
description: Layout of a Fabric mod project and the role of each folder/file.
---

# Fabric Mod Project Structure

## Source Sets

| Path | Purpose |
------|---------|
| `src/main/java` | Common code (both sides: client and server). |
| `src/main/resources` | Common resources: `fabric.mod.json`, mixin configs, `assets/<mod>/`, `data/<mod>/`. |
| `src/client/java` | Client-only Java (rendering, screens, keybinds) when using split source sets. |
| `src/client/resources` | Client-only resources. |
| `src/test/java` | Unit tests (Fabric Loader JUnit). |
| `src/gametest/java` | Server/client game tests when `configureTests { createSourceSet = true }`. |

`src/main/generated` holds datagen output (models, recipes, tags, language files).

## `fabric.mod.json`

The manifest at the JAR root that tells Fabric Loader how to load the mod. Key fields: `id`, `name`, `environment` (`*` / `client` / `server`), `entrypoints`, `depends`, `mixins`, `accessWidener`. See `core-fabric-mod-json`.

## Entrypoints

Entrypoints bootstrap your mod during game boot:

- `main` → class implementing `ModInitializer` (`onInitialize`) — common code, registry registration.
- `client` → `ClientModInitializer` (`onInitializeClient`) — runs after `main`, client only.
- `server` → `DedicatedServerModInitializer` — physical server only.
- `fabric-datagen` → `DataGeneratorEntrypoint` — run during datagen only.

```java
public class ExampleMod implements ModInitializer {
    public static final String MOD_ID = "example-mod";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

    @Override
    public void onInitialize() {
        // Register items, blocks, events, recipes...
    }
}
```

Static fields are only initialized when the class is loaded, so classes holding registrations usually expose an empty `initialize()` that the initializer calls to force static initialization.

## Assets & Data Layout

Resources mirror resource-pack/datapack layout:

- Block/item textures: `assets/<mod>/textures/block|item/...`
- Models: `assets/<mod>/models/block|item/...`
- Client item definitions: `assets/<mod>/items/...`
- Blockstate definitions: `assets/<mod>/blockstates/...`
- Language: `assets/<mod>/lang/en_us.json`
- Recipes, loot tables, tags, advancements, damage types, worldgen: `data/<mod>/...`

<!--
Source references:
- https://docs.fabricmc.net/develop/getting-started/project-structure
-->
