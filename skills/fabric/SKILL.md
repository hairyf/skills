---
name: fabric
description: Fabric mod development for Minecraft — project setup with Loom, Fabric Loader and Fabric API, registering items/blocks/entities/fluids, networking, events, commands, rendering, data generation, serialization, mixins, class tweakers, and porting. Use when writing or maintaining Fabric mods for Minecraft (26.1+/1.21.x).
metadata:
  author: Hairy
  version: "2026.8.7"
  source: Generated from https://github.com/FabricMC/fabric-docs, scripts at https://github.com/hairyf/skills
---

# Fabric (Minecraft Modding)

> Based on fabric-docs at commit `4313db4` (2026-08-05), targeting **Minecraft 26.2** with Fabric Loader 0.19.x, Loom 1.16, Fabric API 0.155.2+26.2 and Mojang mappings (unobfuscated since 26.1). Generated on 2026-08-07.

Fabric is a lightweight modding toolchain for Minecraft: Java Edition built from three components: **Fabric Loader** (mod loading + class transformation), **Fabric API** (events, networking, registry helpers, datagen, tests), and **Fabric Loom** (the Gradle plugin that sets up the development environment). This skill covers the full developer workflow from project scaffolding to advanced rendering and porting.

## Preferences

- Target current Minecraft (26.x) with Mojang mappings; only use Yarn/remapping Loom for pre-26.1 versions.
- Use modern APIs: data components over NBT, codecs over raw JSON, events over mixins, datagen over hand-written JSON.
- Register everything in classes with static initializers called from entrypoints; keep client-only code in `src/client`.

## Core & Setup

| Topic | Description | Reference |
|-------|-------------|-----------|
| Getting Started | Template generator, JDK 25, IDE setup, launching, sources, building | [core-getting-started](references/core-getting-started.md) |
| Project Structure | Source sets, resources layout, entrypoints | [core-project-structure](references/core-project-structure.md) |
| fabric.mod.json | Manifest spec: mandatory fields, entrypoints, dependencies, version ranges | [core-fabric-mod-json](references/core-fabric-mod-json.md) |
| Fabric Loom | Gradle plugin: DSL options, dependency configurations, tasks, production runs | [core-loom](references/core-loom.md) |
| Mappings & Migration | Yarn vs Mojang mappings, 26.1 unobfuscation, migrateMappings/Ravel | [core-mappings-and-migration](references/core-mappings-and-migration.md) |
| Events | Listening to Fabric API events, loot table modification, custom events | [core-events](references/core-events.md) |
| Networking | Custom payloads, StreamCodecs, sending/receiving, PlayerLookup | [core-networking](references/core-networking.md) |
| Text & Translations | Components, translatable text, serialization, ChatFormatting | [core-text-and-translations](references/core-text-and-translations.md) |
| Testing & Debugging | Fabric Loader JUnit, game tests, CI, logging, breakpoints, crash logs | [core-testing-and-debugging](references/core-testing-and-debugging.md) |
| Key Mappings & Game Rules | KeyMappingHelper, client tick reactions, custom game rules | [core-key-mappings-and-game-rules](references/core-key-mappings-and-game-rules.md) |

## Items

| Topic | Description | Reference |
|-------|-------------|-----------|
| First Item | Registration, creative tab, name/texture/model/client item | [items-first-item](references/items-first-item.md) |
| Food | FoodProperties and Consumable effects | [items-food](references/items-food.md) |
| Potions | Custom potions and brewing recipes | [items-potions](references/items-potions.md) |
| Spawn Eggs | SpawnEggItem registration and assets | [items-spawn-egg](references/items-spawn-egg.md) |
| Tools & Armor | ToolMaterial, tools, ArmorMaterial, armor layers and equipment models | [items-tools-and-armor](references/items-tools-and-armor.md) |
| Item Models & Appearance | Model JSON structure, display transforms, custom tint sources | [items-models-and-appearance](references/items-models-and-appearance.md) |
| Creative Tabs | FabricCreativeModeTab builder and registration | [items-creative-tabs](references/items-creative-tabs.md) |
| Interactions & Enchantments | use/useOn overrides, custom enchantment effects | [items-interactions-and-enchantments](references/items-interactions-and-enchantments.md) |
| Data Components | Custom DataComponentType, composite components, tooltips | [items-data-components](references/items-data-components.md) |

## Blocks

| Topic | Description | Reference |
|-------|-------------|-----------|
| First Block | Registration with/without item, assets, loot tables, tool tags | [blocks-first-block](references/blocks-first-block.md) |
| Block States & Models | Properties, blockstate JSON, model elements, tinting | [blocks-blockstates-and-models](references/blocks-blockstates-and-models.md) |
| Block Entities | Types, NBT save/load, client sync, tickers, BERs | [blocks-block-entities](references/blocks-block-entities.md) |
| Containers & Menus | Container/WorldlyContainer, menus, screens, workstations | [blocks-containers](references/blocks-containers.md) |

## Fluids

| Topic | Description | Reference |
|-------|-------------|-----------|
| First Fluid | Source/flowing states, liquid block, bucket, tags, rendering | [fluids-first-fluid](references/fluids-first-fluid.md) |

## Entities

| Topic | Description | Reference |
|-------|-------------|-----------|
| First Entity | Registration, goals, models, renderers, animations, synced data | [entities-first-entity](references/entities-first-entity.md) |
| Attributes | Custom attributes, attach/read/modify | [entities-attributes](references/entities-attributes.md) |
| Effects & Damage | Custom mob effects, data-driven damage types, death messages, tags | [entities-effects-and-damage](references/entities-effects-and-damage.md) |

## Sounds

| Topic | Description | Reference |
|-------|-------------|-----------|
| Playing & Custom Sounds | SoundEvents, categories, volume/pitch, sounds.json | [sounds-using-and-custom](references/sounds-using-and-custom.md) |
| Dynamic Sounds | Client SoundInstances: looping, tracking sources, transitions | [sounds-dynamic](references/sounds-dynamic.md) |

## Commands

| Topic | Description | Reference |
|-------|-------------|-----------|
| Commands & Suggestions | Brigadier basics, requirements, sub-commands, client commands, suggestions | [commands-basics-and-suggestions](references/commands-basics-and-suggestions.md) |
| Arguments | Built-in arguments, optional args, custom ArgumentType | [commands-arguments](references/commands-arguments.md) |

## Recipes

| Topic | Description | Reference |
|-------|-------------|-----------|
| Custom Recipe Types | RecipeInput, Recipe, serializers, recipe book hooks, sync | [recipes-custom-types](references/recipes-custom-types.md) |
| Extending Vanilla Recipes | Smithing/Crafting/Stonecutter recipe extensions | [recipes-extending-vanilla](references/recipes-extending-vanilla.md) |

## Rendering

| Topic | Description | Reference |
|-------|-------------|-----------|
| Basic Concepts | BufferBuilder, vertex formats, matrices, quaternions, render pipelines | [rendering-basic-concepts](references/rendering-basic-concepts.md) |
| GUI, Screens & Widgets | GuiGraphicsExtractor, scissor, textures/text, custom screens/widgets | [rendering-gui](references/rendering-gui.md) |
| HUD | HudElementRegistry, DeltaTracker partial ticks | [rendering-hud](references/rendering-hud.md) |
| World & Particles | LevelRenderEvents, extraction/drawing phases, custom particles | [rendering-world-and-particles](references/rendering-world-and-particles.md) |

## Data Generation

| Topic | Description | Reference |
|-------|-------------|-----------|
| Setup | fabric-datagen entrypoint, Pack, providers, runDatagen | [datagen-setup](references/datagen-setup.md) |
| Models & Translations | Language provider, block/item models, client items | [datagen-models-and-translations](references/datagen-models-and-translations.md) |
| Server Data | Recipes, tags, loot tables, advancements, enchantments | [datagen-server](references/datagen-server.md) |
| World Generation | Configured/placed features, placement modifiers, biome modifications | [datagen-features](references/datagen-features.md) |

## Serialization

| Topic | Description | Reference |
|-------|-------------|-----------|
| Codecs | Building/composing/transforming codecs, dispatch, stream codecs | [serialization-codecs](references/serialization-codecs.md) |
| Data Attachments | Attaching synced/persistent data to entities/levels/chunks | [serialization-data-attachments](references/serialization-data-attachments.md) |
| Saved Data | Level-scoped persistent data with SavedData | [serialization-saved-data](references/serialization-saved-data.md) |

## Mixins & Class Tweakers

| Topic | Description | Reference |
|-------|-------------|-----------|
| JVM Bytecode | Descriptors, LVT, operand stack, common instructions | [mixins-bytecode](references/mixins-bytecode.md) |
| Accessors & Invokers | @Accessor/@Invoker for fields, methods, constructors | [mixins-accessors](references/mixins-accessors.md) |
| Class Tweakers | Access widening, interface injection, enum extension | [class-tweakers](references/class-tweakers.md) |

## Porting & Misc

| Topic | Description | Reference |
|-------|-------------|-----------|
| Porting & Updates | Version bumps, unobfuscation switch, Fabric API rename maps | [porting-and-updates](references/porting-and-updates.md) |
| Resource Conditions & Stats | Conditional loading, custom statistics | [misc-resource-conditions-and-statistics](references/misc-resource-conditions-and-statistics.md) |

## Quick Reference

### Minimal build.gradle (Minecraft 26.2)

```gradle
plugins { id 'net.fabricmc.fabric-loom' version '1.16' }

dependencies {
  minecraft "com.mojang:minecraft:26.2"
  mappings loom.officialMojangMappings()
  modImplementation "net.fabricmc.fabric-api:fabric-api:0.155.2+26.2"
  implementation "net.fabricmc:fabric-loader:0.19.2"
}

loom {
  splitEnvironmentSourceSets()
  mods { "example-mod" { sourceSet sourceSets.main; sourceSet sourceSets.client } }
}
```

### Minimal fabric.mod.json

```json
{
  "schemaVersion": 1,
  "id": "example-mod",
  "version": "1.0.0",
  "entrypoints": {
    "main": ["com.example.ExampleMod"],
    "client": ["com.example.ExampleModClient"]
  },
  "depends": {
    "fabricloader": ">=0.19.0",
    "minecraft": "~26.2",
    "java": ">=25",
    "fabric-api": "*"
  }
}
```

### Common Commands

```bash
./gradlew runClient        # dev run
./gradlew build            # build release JAR (build/libs)
./gradlew genSources       # decompile Minecraft sources
./gradlew runDatagen       # run data generation
./gradlew runClientGameTest # client game tests
./gradlew validateAccessWidener # validate class tweaker entries
```

### Key API Notes

- Registration: `Registry.register(BuiltInRegistries.X, Identifier.fromNamespaceAndPath("mod", "name"), value)`.
- 26.x uses Mojang names: `Level` (not World), `BlockPos`, `ItemStack`, `Item.Properties`, `BlockBehaviour.Properties`, `FriendlyByteBuf`.
- Entrypoints: `ModInitializer`, `ClientModInitializer`, `DedicatedServerModInitializer`, `DataGeneratorEntrypoint` (`fabric-datagen`).
