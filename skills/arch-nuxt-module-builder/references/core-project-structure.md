---
name: arch-nuxt-module-builder project structure
description: Required project layout for module-builder — src/module.ts, src/runtime/, package.json, optional build.config.ts.
---

# Project Structure

Module-builder expects a specific layout. Use the [module template](https://github.com/nuxt/starter/tree/module) as reference.

## Required Layout

| Path | Purpose |
|------|---------|
| `src/module.ts` | Module entrypoint; default export must be `defineNuxtModule`; export `ModuleOptions` (and optionally hooks/config types) |
| `src/runtime/` | Runtime code (plugins, composables, components) — each file transformed to `dist/runtime/` via mkdist |
| `package.json` | Exports, types, `prepack` script calling `nuxt-module-build build` |

## Optional

- **`build.config.ts`** — Extend unbuild config (e.g. extra entries, hooks). Module-builder is an unbuild preset; see [build command](https://github.com/nuxt/module-builder/blob/main/src/commands/build.ts) for defaults.
- **`package.json` → `build.entries`** — Additional build entries (e.g. `./src/utils`) on top of `src/module` and `src/runtime/`.

## Example package.json (minimal)

```json
{
  "name": "my-module",
  "exports": {
    ".": {
      "types": "./dist/types.d.mts",
      "import": "./dist/module.mjs"
    }
  },
  "main": "./dist/module.mjs",
  "typesVersions": { "*": { ".": ["./dist/types.d.mts"] } },
  "files": ["dist"],
  "scripts": { "prepack": "nuxt-module-build build" },
  "dependencies": { "@nuxt/kit": "latest" },
  "devDependencies": { "@nuxt/module-builder": "latest" }
}
```

## Key Points

- Do not add file extensions when resolving runtime paths in setup (e.g. `resolver.resolve('./runtime/plugins/plugin')`); extensions are handled by the build.
- Runtime imports from `src/runtime/` are rewritten during build to point at `dist/runtime/` outputs.

<!--
Source references:
- https://github.com/nuxt/module-builder
- README.md (Project structure, package.json, build.config.ts)
-->
