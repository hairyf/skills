---
name: arch-unplugin project structure
description: Package exports, src layout, and entry points for an unplugin-starter-based package.
---

# Project Structure

## Package Exports

The template exposes one main export and one per bundler/framework:

| Export | Purpose |
|--------|---------|
| `.` | Core plugin factory and `createUnplugin` result (for programmatic use) |
| `./vite` | Vite plugin |
| `./rollup` | Rollup plugin |
| `./webpack` | Webpack plugin |
| `./esbuild` | esbuild plugin |
| `./farm` | Farm plugin |
| `./rspack` | Rspack plugin |
| `./nuxt` | Nuxt module |
| `./astro` | Astro integration |
| `./types` | Options and shared types |

Consumers install once and require the subpath for their bundler, e.g. `unplugin-starter/vite` or `unplugin-starter/webpack`.

## Source Layout

```
src/
  index.ts    # UnpluginFactory, createUnplugin, default export
  types.ts    # Options interface (and any shared types)
  vite.ts     # createVitePlugin(unpluginFactory)
  rollup.ts   # createRollupPlugin(unpluginFactory)
  webpack.ts  # createWebpackPlugin(unpluginFactory)
  esbuild.ts  # createEsbuildPlugin(unpluginFactory)
  farm.ts     # createFarmPlugin(unpluginFactory)
  rspack.ts   # createRspackPlugin(unpluginFactory)
  nuxt.ts     # defineNuxtModule, addVitePlugin/addWebpackPlugin
  astro.ts    # Astro config hook that pushes unplugin.vite() into Vite plugins
```

- **Single factory:** All bundler entries import `unpluginFactory` from `./index` (or `.`) and pass it to the corresponding `create*Plugin` from `unplugin`.
- **Nuxt and Astro** are wrappers: Nuxt uses the module API and registers Vite/Webpack plugins; Astro pushes the Vite plugin into `astro.config.vite.plugins`.

## Build and Output

- Build is typically done with a single command (e.g. `tsdown`), producing `dist/` with the same structure (e.g. `dist/index.js`, `dist/vite.js`).
- `package.json` `files` usually includes only `dist` so only built assets are published.

## Key Points

- Keep plugin logic and options in `index.ts` and `types.ts`; entry files stay thin (createX + factory).
- Peer dependencies for each bundler (vite, rollup, webpack, etc.) are optional so consumers only need the ones they use.

<!--
Source references:
- https://github.com/unplugin/unplugin-starter
- package.json exports, src/*.ts
-->
