---
name: arch-unplugin bundler integration
description: Using the same unplugin in Vite, Rollup, Webpack, esbuild, Farm, and Rspack.
---

# Bundler Integration

The same factory is wired to each bundler via unplugin’s `create*Plugin` helpers. Consumers use the subpath that matches their tool.

## Vite

```ts
// vite.config.ts
import Starter from 'unplugin-starter/vite'

export default defineConfig({
  plugins: [
    Starter({ /* options */ }),
  ],
})
```

Entry: `createVitePlugin(unpluginFactory)` in `src/vite.ts`.

## Rollup

```ts
// rollup.config.js
import Starter from 'unplugin-starter/rollup'

export default {
  plugins: [
    Starter({ /* options */ }),
  ],
}
```

Entry: `createRollupPlugin(unpluginFactory)` in `src/rollup.ts`.

## Webpack

```ts
// webpack.config.js
module.exports = {
  plugins: [
    require('unplugin-starter/webpack')({ /* options */ }),
  ],
}
```

For Vue CLI, put the same plugin inside `configureWebpack.plugins`. Entry: `createWebpackPlugin(unpluginFactory)` in `src/webpack.ts`.

## esbuild

```ts
// esbuild.config.js
import { build } from 'esbuild'
import Starter from 'unplugin-starter/esbuild'

build({
  plugins: [Starter()],
})
```

Entry: `createEsbuildPlugin(unpluginFactory)` in `src/esbuild.ts`.

## Farm

Use the Farm plugin from `unplugin-starter/farm`; entry uses `createFarmPlugin(unpluginFactory)` in `src/farm.ts`.

## Rspack

Use the Rspack plugin from `unplugin-starter/rspack`; entry uses `createRspackPlugin(unpluginFactory)` in `src/rspack.ts`.

## Key Points

- Each entry file only imports the factory and the right `create*Plugin`, then exports the result. No duplicate transform logic.
- Peer dependencies (vite, rollup, webpack, esbuild, etc.) are optional so only the bundler in use is required.
- Playground in the repo typically uses Vite (`playground/vite.config.ts`) for quick iteration.

<!--
Source references:
- https://github.com/unplugin/unplugin-starter
- README.md, src/vite.ts, src/rollup.ts, src/webpack.ts, src/esbuild.ts, src/farm.ts, src/rspack.ts
-->
