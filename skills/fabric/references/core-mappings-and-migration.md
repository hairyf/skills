---
name: fabric-mappings-and-migration
description: Yarn vs Mojang mappings, unobfuscated 26.1+, and migrating mappings with Loom or Ravel.
---

# Mappings & Migration

## What Mappings Are

Minecraft was obfuscated until 1.21.11. Loom uses mapping sets to translate obfuscated names:

- **Intermediary** — stable names (`class_1548`) used by compiled mods for obfuscated versions; stable across releases.
- **Yarn** — open-source human-friendly names (`CreeperEntity`); the historical default. **Deprecated in 2025** — no longer maintained.
- **Mojang Mappings** — official obfuscation mappings (`Creeper`); lack parameter names/javadoc, so some layer Parchment.

**Minecraft 26.1+ ships unobfuscated** with parameter names — no mappings needed at all. For 26.1+ use `net.fabricmc.fabric-loom` and Mojang naming (e.g. `Level`, `BlockPos`, `Identifier`, `ItemStack`).

## Migrating an Existing Mod (Yarn → Mojang)

Migrate **before** bumping Minecraft to 26.1. Two tools:

### Loom (`migrateMappings` task)

```powershell
./gradlew.bat migrateMappings --mappings "net.minecraft:mappings:1.21.11" --overrideInputsIHaveABackup
```

- Back up your sources first; the task rewrites them.
- Split sources: use `migrateClientMappings`; class tweakers: `migrateClassTweakerMappings`.
- Customize `--input` / `--output` / `--mappings` for other cases.
- Does **not** support Kotlin code.
- Then swap `mappings "net.fabricmc:yarn:...:v2"` → `mappings loom.officialMojangMappings()`.

### Ravel (IntelliJ plugin)

`Refactor > Remap Using Ravel`; supports Java, **Kotlin**, Mixins, class tweakers, access wideners. Add Yarn `mappings.tiny` (source `named` → destination `official`) plus Mojang `client.txt` (source `target` → destination `source`). Search for `TODO(Ravel)` afterwards.

## Porting to New Minecraft Versions

1. Update `gradle/wrapper/gradle-wrapper.properties`, `gradle.properties`, `build.gradle` — get recommended versions from https://fabricmc.net/develop/.
2. `./gradlew wrapper --gradle-version latest`; `./gradlew --refresh-dependencies` if the IDE refresh button isn't available.
3. Review the Fabric blog post and the versioned migration primer (e.g. NeoForge's 26.1 → 26.2 primer) for vanilla code changes.

Fabric API renamed many symbols when moving to official mappings (`world` → `level`, `KeyBindingHelper` → `KeyMappingHelper`, `ItemGroupEvents` → `CreativeModeTabEvents`, etc.). The 26.1 porting page ships a full rename list plus an IntelliJ migration map — grep the old names and replace.

<!--
Source references:
- https://docs.fabricmc.net/develop/porting/mappings/
- https://docs.fabricmc.net/develop/porting/mappings/loom
- https://docs.fabricmc.net/develop/porting/mappings/ravel
- https://docs.fabricmc.net/develop/porting/
- https://docs.fabricmc.net/26.1/develop/porting/fabric-api
-->
