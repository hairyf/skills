---
name: arch-unplugin options and types
description: Defining and exporting plugin options and keeping types in sync across entries.
---

# Options and Types

## Options Interface

Define plugin options in a single place and reuse them in all entries:

```ts
// src/types.ts
export interface Options {
  // define your plugin options here
}
```

- Use one `Options` interface for the factory and for Nuxt `ModuleOptions` (e.g. `export interface ModuleOptions extends Options {}`).
- Optional options: use `UnpluginFactory<Options | undefined>` and default to `{}` in Nuxt `defaults` so the plugin works with no config.

## Typing Entry Points

- **Vite / Rollup / Webpack / esbuild / Farm / Rspack:** The `create*Plugin` helpers infer types from your factory; no extra typing needed if `Options` is used in the factory.
- **Nuxt:** Type the module with `defineNuxtModule<ModuleOptions>` so options are validated and visible in nuxt config.
- **Astro:** Use `Options` for the integration function parameter so Astro users get the same shape as Vite users.

## Exporting Types

Expose `./types` in `package.json` exports so consumers can import your options:

```json
"./types": "./dist/types.js"
```

Re-export from `src/types.ts` in your build so `dist/types.js` (and `.d.ts`) exist.

## Key Points

- Single source of truth for options in `types.ts`; no duplicate interfaces per bundler.
- Use `Options | undefined` in the factory if the plugin is usable with no arguments.
- Export types for consumers who need to type their config or wrap the plugin.

<!--
Source references:
- https://github.com/unplugin/unplugin-starter
- src/types.ts, src/index.ts, src/nuxt.ts
- package.json exports
-->
