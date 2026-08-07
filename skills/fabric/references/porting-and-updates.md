---
name: fabric-porting-and-updates
description: Updating mods between Minecraft versions, the unobfuscation switch, and Fabric API rename lists.
---

# Porting & Version Updates

## Update the Build Script

1. `./gradlew wrapper --gradle-version latest`.
2. Bump Minecraft, Loader, Loom, and API versions (check https://fabricmc.net/develop/ for the recommended set).
3. Refresh Gradle (`--refresh-dependencies` if needed); compare against the matching branch of `FabricMC/fabric-example-mod`.
4. Review the release blog posts (Fabric blog + Minecraft changelog) and the versioned migration primer for vanilla code changes.

## The 26.1 Unobfuscation Switch

Minecraft 26.1+ ships unobfuscated with parameter names:

- Use `net.fabricmc.fabric-loom` (no remapping) for 26.1+; `net.fabricmc.fabric-loom-remap` for 1.21.11 and older.
- **Yarn is deprecated**; migrate to Mojang Mappings **before** bumping to 26.1 (`migrateMappings` Gradle task or the Ravel IntelliJ plugin — see `core-mappings-and-migration`).
- Class tweakers/access wideners must be remapped (`migrateClassTweakerMappings`); Mixin targets must be reviewed manually.

## Fabric API 26.1 Renames

Fabric API renamed broadly to match official mappings — the changes are **not backwards compatible** and are not handled by mapping migration tools. Key patterns:

- `World` → `Level` everywhere (`ClientLevelEvents`, `ServerLevelEvents`, `LevelRenderEvents`, `PlayerLookup.level(...)`, `FakePlayer` fields).
- `ItemGroupEvents` → `CreativeModeTabEvents`; `KeyBindingHelper` → `KeyMappingHelper`; `FabricItemGroup` → `FabricCreativeModeTab`.
- Networking: `PayloadTypeRegistry.playC2S/playS2C` → `serverboundPlay/clientboundPlay`; `createC2SPacket/createS2CPacket` → `createServerboundPacket/createClientboundPacket`; `PacketByteBufs` → `FriendlyByteBufs`.
- Datagen: `FabricTagProvider` → `FabricTagsProvider`, `FabricBlockLootTableProvider` → `FabricBlockLootSubProvider`, `FabricDataOutput` → `FabricPackOutput`, `FabricRecipeExporter` → `FabricRecipeOutput`.
- Rendering: `WorldRenderEvents` → `LevelRenderEvents` (fields `matrices`→`poseStack`, `consumers`→`bufferSource`, `tickCounter`→`deltaTracker`); `EntityModelLayerRegistry` → `ModelLayerRegistry`; `ColorProviderRegistry.BLOCK` → `BlockColorRegistry`; `ParticleFactoryRegistry` → `ParticleProviderRegistry`.
- Misc: `CompostingChanceRegistry` → `CompostableRegistry`, `FuelRegistryEvents` → `FuelValueEvents`, `FabricBrewingRecipeRegistryBuilder` → `FabricPotionBrewingBuilder`, `ScreenHandler` → `Menu`/`MenuProvider`, `FabricItem$Settings` → `FabricItem$Properties`, `PointOfInterestHelper` → `PoiHelper`.

The 26.1 porting page includes the full class/member migration map (also downloadable as an IntelliJ migration map).

<!--
Source references:
- https://docs.fabricmc.net/develop/porting/
- https://docs.fabricmc.net/26.1/develop/porting/fabric-api
-->
