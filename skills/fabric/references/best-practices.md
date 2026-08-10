---
name: best-practices
description: Fabric mod best practices — client/server separation, resource layout, common pitfalls.
---

# Best Practices

## Client/server separation

- The common entrypoint (`ModInitializer`) runs on both sides — only touch classes safe on the server.
- Client code (renderers, screens, key binds, HUD, client-only packets) goes in the `client` entrypoint.
- Use `@Environment(EnvType.CLIENT)` (or `EnvType.SERVER`) to document/gate API misuse.
- Test with `runServer` — a crash there means client code leaked to the common path.

## Resource layout

```text
assets/<modid>/
├── blockstates/<block>.json
├── models/block/<block>.json
├── models/item/<item>.json
├── textures/block|item|entity/...
├── sounds/<sound>.ogg
├── sounds.json
└── lang/en_us.json

data/<modid>/
├── recipes/  loot_tables/  tags/  advancements/  worldgen/...
```

- Every block needs: blockstate + model + texture + (usually) item model + loot table.
- Sounds: `.ogg` Vorbis 44100 Hz mono recommended; declare in `sounds.json`.

## Common pitfalls

| Pitfall | Fix |
|---------|-----|
| `NoClassDefFoundError` on client classes | client code leaked into common entrypoint |
| Block invisible / missing texture | missing model/blockstate/texture paths |
| Block drops nothing | missing loot table |
| Registration twice | register once in a static init |
| Wrong registry class for the version | 1.19.3+ → `net.minecraft.registry.Registries` |
| Mod not loading | validate `fabric.mod.json` (schema, entrypoints, depends) |

## Forking (二开) an existing mod

- Change `archives_base_name`, `maven_group`, and `mod_version` in `gradle.properties`.
- Keep the same `id` only if replacing the original; otherwise rename `id` in `fabric.mod.json`.
- Look for `Registry.register` calls to find all registered content to extend.
- Data-generated JSON under `src/main/generated/` should be regenerated with `runDatagen` after changes.

<!--
Source references:
- https://docs.fabricmc.net/
- https://fabricmc.net/develop
-->
