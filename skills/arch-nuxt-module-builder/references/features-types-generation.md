---
name: arch-nuxt-module-builder types generation
description: Auto-generated types.d.mts, ModuleOptions inference, and shims for NuxtHooks, RuntimeConfig, #app.
---

# Types Generation

After the build, module-builder writes `dist/types.d.mts` so that Nuxt and the app get correct typings for your module.

## What gets generated

1. **Re-exports** — All type/named exports from the built `module.mjs` are re-exported from `types.d.mts`.
2. **ModuleOptions** — If the module does not export `ModuleOptions`, the file generates:  
   `export type ModuleOptions = typeof Module extends NuxtModule<infer O> ? Partial<O> : Record<string, any>`  
   so config key options are typed.
3. **Shims** (only if you export the corresponding interface):
   - `ModuleHooks` → `declare module '@nuxt/schema' { interface NuxtHooks extends ModuleHooks {} }`
   - `ModuleRuntimeHooks` → `declare module '#app' { interface RuntimeNuxtHooks extends ModuleRuntimeHooks {} }`
   - `ModuleRuntimeConfig` → `RuntimeConfig` in `@nuxt/schema`
   - `ModulePublicRuntimeConfig` → `PublicRuntimeConfig` in `@nuxt/schema`

Consumers get `nuxt.config` completion and type-safe hooks/config when they add your module.

## Export names

The build looks for these exact export names from the compiled module types. Export them from `src/module.ts` to enable shims:

- `ModuleOptions`
- `ModuleHooks`
- `ModuleRuntimeHooks`
- `ModuleRuntimeConfig`
- `ModulePublicRuntimeConfig`

## Key Points

- Use `types.d.mts` (not `.d.ts`) in `package.json` exports and typesVersions for modern Node/TS resolution.
- Do not add a top-level `types` field that points at a non-existent file; use `typesVersions` for export typing instead.

<!--
Source references:
- https://github.com/nuxt/module-builder
- src/commands/build.ts (writeTypes)
-->
