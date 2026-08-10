---
name: fabric-datagen-setup
description: Enabling data generation, the fabric-datagen entrypoint, Pack and providers, running datagen.
---

# Data Generation Setup

Datagen programmatically generates recipes, advancements, tags, models, language files, loot tables, and worldgen JSON.

## Enable

Check "Enable Data Generation" in the template generator, or manually:

```gradle
fabricApi {
  configureDataGeneration {
    client = true
    // outputDirectory = file("src/generated/resources")
  }
}
```

Add the entrypoint to `fabric.mod.json`:

```json
"entrypoints": {
  "client": ["com.example.ModClient"],
  "fabric-datagen": ["com.example.ModDataGenerator"]
}
```

## Entrypoint & Pack

```java
public class ExampleModDataGenerator implements DataGeneratorEntrypoint {
    @Override
    public void onInitializeDataGenerator(FabricPackOutput packOutput, DynamicRegistryManager registryManager, FeatureFlagSet featureFlags, Pack.PackType packType) {
        Pack pack = Pack.create("example-mod-datagen");
        // pack.addProvider(...) for each provider
        pack.build(packOutput);
    }

    @Override
    public void buildRegistry(RegistryBuilder registryBuilder) {
        // register dynamic registry bootstraps (enchantments, worldgen)
        registryBuilder.addRegistry(Registries.ENCHANTMENT, ExampleModEnchantmentGenerator::bootstrap);
        registryBuilder.addRegistry(Registries.CONFIGURED_FEATURE, ExampleModWorldConfiguredFeatures::configure);
        registryBuilder.addRegistry(Registries.PLACED_FEATURE, ExampleModWorldPlacedFeatures::configure);
    }
}
```

## Run

`./gradlew runDatagen` (or the IDE run configuration). Output goes to `src/main/generated` by default; files are added to the mod resources automatically (`addToResources`).

## Key Points

- Providers: `FabricLanguageProvider`, `FabricModelProvider`, `FabricTagsProvider`, `FabricAdvancementProvider`, `FabricBlockLootSubProvider`, `SimpleFabricLootTableSubProvider`, `FabricRecipeProvider`, `FabricDynamicRegistryProvider`.
- Custom criteria/predicates belong in the **main** source set (server evaluates them); providers themselves can be client-side.

<!--
Source references:
- https://docs.fabricmc.net/develop/data-generation/setup
-->
