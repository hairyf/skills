---
name: arch-nuxt-module-builder dist output
description: Generated dist files — module.mjs, module.json, types.d.mts, runtime/* — and their roles.
---

# Dist Output

Running `nuxt-module-build build` produces the following under `dist/` (or custom `--out-dir`).

## Files

| Output | Description |
|--------|-------------|
| `module.mjs` | Built module entry from `src/module.ts` (ESM only; no CJS) |
| `module.json` | Module meta (name, version, configKey, etc.) plus builder metadata (module-builder version, unbuild version) |
| `types.d.mts` | Re-exports from module types + shims for `@nuxt/schema` and `#app` (NuxtHooks, RuntimeConfig, etc.) |
| `runtime/*` | Per-file transform of `src/runtime/` via [unjs/mkdist](https://github.com/unjs/mkdist): `.ts`/`.js` → `.js` + `.d.ts`, `.vue` → component + `.d.ts`, other assets copied as-is |

## Runtime transform rules

- JS/TS → `.js` with separate `.d.ts`
- Vue → compiled component + `.d.ts`
- Stories and `*.spec/test` files under `src/runtime/` are excluded from build
- JSX in runtime uses Vue JSX (jsxImportSource: 'vue', automatic JSX)

## Key Points

- Publish only `dist` (list it in `package.json` `files`).
- Point `package.json` `exports` and `typesVersions` at `dist/types.d.mts` and `dist/module.mjs`; do not use legacy `types` or `module.cjs` for new modules.

<!--
Source references:
- https://github.com/nuxt/module-builder
- README.md (Dist files)
- src/commands/build.ts
-->
