# Fabric Mod Development Capability

When the user asks to **develop, build, fork (二开), or debug a Minecraft Fabric mod**, follow these patterns.

## Common commands

```bash
./gradlew build          # compile + validate resources
./gradlew runClient      # launch the game with the mod
./gradlew runDatagen     # generate blockstate/model/recipe/loot JSON
```

## Key rules

- Register everything through `Registry.register(Registries.X, new Identifier("modid", "name"), value)` (1.19.3+; use `Registry.X` only for ≤1.19.2).
- `fabric.mod.json` declares entrypoints: `main`, `client`, `server`, `datagen`, plus `depends`, `mixins`, `accessWidener`, `environment`.
- Client-only code (renderers, key binds, screens) belongs in the `client` entrypoint and must not run on the server — guard with `@Environment(EnvType.CLIENT)` or by class location.
- Data generation outputs to `src/main/generated/`; run `runDatagen` and commit generated JSON.
- Assets live under `src/main/resources/assets/<modid>/` (textures/models/blockstates/sounds/lang) and `data/<modid>/` (recipes/loot/tags/advancements).
- When in doubt about an API, check the version: 1.20.1 uses `net.minecraft.registry` (not `net.minecraft.util.registry`).
