---
name: fabric-datagen-features
description: Configured features, placed features, placement modifiers, and biome modifications.
---

# World Generation (Features)

Three layers: **configured feature** (what it is), **placed feature** (how/where it's placed), **biome modification** (which biomes get it).

## Provider Setup

`ExampleModWorldgenProvider extends FabricDynamicRegistryProvider` — in `configure` call `addAll` for your feature registry keys. Register its bootstraps in `DataGeneratorEntrypoint#buildRegistry`:

```java
registryBuilder.addRegistry(Registries.CONFIGURED_FEATURE, ExampleModWorldConfiguredFeatures::configure);
registryBuilder.addRegistry(Registries.PLACED_FEATURE, ExampleModWorldPlacedFeatures::configure);
```

## Configured Features

```java
public static final ResourceKey<ConfiguredFeature<?, ?>> DIAMOND_BLOCK_ORE_KEY = key("diamond_block_vein");

public static void configure(BootstrapContext<ConfiguredFeature<?, ?>> context) {
    RuleTest ruleTest = new TagMatchTest(BlockTags.DEEPSLATE_ORE_REPLACEABLES);
    OreConfiguration config = new OreConfiguration(ruleTest, ModBlocks.DIAMOND_BLOCK.defaultBlockState(), 8);
    context.register(DIAMOND_BLOCK_ORE_KEY, Feature.ORE.configured(config));
}
```

Multiple replace targets: pass a list of `OreConfiguration.TargetBlockState`. Trees use `TreeConfiguration` (trunk provider/placer, foliage placer, tapering) and `Feature.TREE.configured(treeConfig)`.

## Placed Features

```java
public static void configure(BootstrapContext<PlacedFeature> context) {
    HolderGetter<ConfiguredFeature<?, ?>> configured = context.lookup(Registries.CONFIGURED_FEATURE);
    context.register(DIAMOND_BLOCK_ORE_PLACED_KEY,
        configured.getOrThrow(DIAMOND_BLOCK_ORE_KEY)
            .placed(List.of(
                CountPlacement.of(3),              // veins per chunk
                InSquarePlacement.spread(),        // pseudo-random horizontal spread
                HeightRangePlacement.uniform(VerticalAnchor.absolute(-64), VerticalAnchor.absolute(16)),
                BiomeFilter.biome()                // biome filter
            )));
}
```

Height distributions: `uniform` (equal), `trapezoid` (median-biased), `biasedBelow` (log scale toward bottom). Surface features (trees) should use `PlacedFeatures.WORLD_SURFACE_WG_HEIGHTMAP` instead of a height range.

## Biome Modifications

In the mod initializer:

```java
BiomeModifications.addFeature(
    BiomeSelectors.foundInOverworld(),
    GenerationStep.Decoration.UNDERGROUND_ORES,
    ExampleModWorldPlacedFeatures.DIAMOND_BLOCK_ORE_PLACED_KEY
);

// trees: GenerationStep.Decoration.VEGETAL_DECORATION
// biome-restricted:
BiomeModifications.addFeature(BiomeSelectors.tag(BiomeTags.IS_FOREST),
    GenerationStep.Decoration.VEGETAL_DECORATION, ExampleModWorldPlacedFeatures.DIAMOND_TREE_PLACED_KEY);
```

Debug placement with `/place feature example-mod:diamond_block_vein`.

<!--
Source references:
- https://docs.fabricmc.net/develop/data-generation/features
-->
