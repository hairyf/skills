---
name: unplugin-bundler-specific
description: meta.framework, escape hatches (vite, rollup, webpack, rspack, esbuild, farm, bun), and bundler-only API.
---

# Unplugin Bundler-Specific Logic

Unplugin abstracts the common subset of plugin APIs. For bundler-specific behavior, use the **meta** argument and the **escape hatch** keys on the options object.

## meta Argument

The factory receives `(options, meta)`:

```ts
createUnplugin((options, meta) => {
  console.log(meta.framework) // 'vite' | 'rollup' | 'webpack' | 'esbuild' | 'rspack' | 'farm' | 'rolldown' | 'bun' | 'unloader'
  return {
    name: 'my-plugin',
    // ...
    vite: {
      configureServer(server) {
        // Vite-only
      },
    },
    webpack(compiler) {
      // webpack compiler
    },
    rspack(compiler) {
      // Rspack compiler
    },
    esbuild: {
      onResolveFilter: /\.custom$/,
      onLoadFilter: /\.custom$/,
      loader: (code, id) => 'ts',
      setup(build) {
        // Custom esbuild setup
      },
    },
    farm: { /* Farm plugin */ },
    bun: { /* Bun plugin */ },
  }
})
```

Use `meta.framework` to branch or to attach bundler-specific options.

## Escape Hatches

Return these keys from the factory to extend or replace behavior per bundler:

| Key       | Type                    | Purpose |
|----------|-------------------------|--------|
| `vite`   | `Partial<VitePlugin>`   | Vite-specific hooks (e.g. `configureServer`) |
| `rollup` | `Partial<RollupPlugin>` | Rollup-specific options |
| `rolldown` | `Partial<RolldownPlugin>` | Rolldown-specific options |
| `webpack` | `(compiler: WebpackCompiler) => void` | Configure webpack compiler |
| `rspack` | `(compiler: RspackCompiler) => void` | Configure Rspack compiler |
| `esbuild` | `{ onResolveFilter?, onLoadFilter?, loader?, setup? }` | esbuild filters, loader, or custom setup |
| `farm`   | `Partial<FarmPlugin>`   | Farm-specific options |
| `bun`    | `Partial<BunPlugin>`   | Bun-specific options |

**esbuild**:

- `onResolveFilter` / `onLoadFilter`: RegExp to limit which ids are handled by the esbuild plugin.
- `loader`: Default loader or `(code, id) => Loader` (Unplugin otherwise guesses from extension).
- `setup`: Full custom `(build: PluginBuild) => void` if you need to replace default wiring.

## Bundler-Only Factory Functions

To build a plugin for a single bundler (and avoid pulling others into the bundle), use:

```ts
import {
  createVitePlugin,
  createRollupPlugin,
  createRolldownPlugin,
  createWebpackPlugin,
  createRspackPlugin,
  createEsbuildPlugin,
  createFarmPlugin,
  createBunPlugin,
} from 'unplugin'

const vitePlugin = createVitePlugin(factory)
const rollupPlugin = createRollupPlugin(factory)
const rolldownPlugin = createRolldownPlugin(factory)
const webpackPlugin = createWebpackPlugin(factory)
const rspackPlugin = createRspackPlugin(factory)
const esbuildPlugin = createEsbuildPlugin(factory)
const farmPlugin = createFarmPlugin(factory)
const bunPlugin = createBunPlugin(factory)
```

The factory has the same signature; each function returns only that bundler’s plugin.

<!--
Source references:
- sources/unplugin/docs/guide/index.md
- sources/unplugin/src/define.ts
- sources/unplugin/src/types.ts
-->
