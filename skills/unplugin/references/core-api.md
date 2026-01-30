---
name: unplugin-core-api
description: createUnplugin, factory signature, options type, and bundler-specific creators.
---

# Unplugin Core API

## createUnplugin

The main entry. Accepts a factory and returns an instance with one plugin per bundler:

```ts
import { createUnplugin } from 'unplugin'

export interface Options {
  // your plugin options
}

const unplugin = createUnplugin<Options>((options, meta) => ({
  name: 'my-unplugin',
  transform(code, id) {
    // ...
  },
}))

// Use in configs
export const vitePlugin = unplugin.vite
export const rollupPlugin = unplugin.rollup
export const webpackPlugin = unplugin.webpack
export const rspackPlugin = unplugin.rspack
export const esbuildPlugin = unplugin.esbuild
export const farmPlugin = unplugin.farm
export const rolldownPlugin = unplugin.rolldown
export const bunPlugin = unplugin.bun
```

- **Default export**: Often the result of `createUnplugin(...)` so users can `import MyPlugin from 'unplugin-foo'` and then use `MyPlugin.vite` etc.
- **Subpath exports**: Export `unplugin-foo/vite`, `unplugin-foo/webpack`, etc., each pointing at the corresponding property.

## Factory Signature

```ts
type UnpluginFactory<UserOptions, Nested = false> = (
  options: UserOptions,
  meta: UnpluginContextMeta
) => Nested extends true ? UnpluginOptions[] : UnpluginOptions
```

- **options**: User-provided config (your plugin’s first argument).
- **meta**: Includes `meta.framework` (`'vite' | 'rollup' | 'webpack' | 'esbuild' | 'rspack' | 'farm' | 'rolldown' | 'bun' | 'unloader'`) and, for webpack/rspack, compiler references. Use for bundler-specific logic or escape hatches.

## Bundler-Only Creators

When you only target one bundler, use the specific creator so the package doesn’t pull in others:

```ts
import {
  createVitePlugin,
  createRollupPlugin,
  createWebpackPlugin,
  createRspackPlugin,
  createEsbuildPlugin,
  createFarmPlugin,
  createRolldownPlugin,
  createBunPlugin,
} from 'unplugin'

const vitePlugin = createVitePlugin(factory)
const rollupPlugin = createRollupPlugin(factory)
// ...
```

Same factory shape; each returns the single bundler’s plugin.

## Parsing (this.parse)

For bundlers that don’t ship a built-in parser, you must call `setParseImpl` once so `this.parse` works in hooks:

```ts
import { setParseImpl } from 'unplugin'
import * as acorn from 'acorn'

setParseImpl(acorn.parse)
```

Typical choices: [Acorn](https://github.com/acornjs/acorn), Babel, or [Oxc](https://oxc.rs/).

<!--
Source references:
- https://github.com/unjs/unplugin
- sources/unplugin/src/define.ts
- sources/unplugin/src/types.ts
- sources/unplugin/docs/guide/index.md
-->
