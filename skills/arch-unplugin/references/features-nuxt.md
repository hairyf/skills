---
name: arch-unplugin Nuxt module
description: Exposing the unplugin as a Nuxt module with addVitePlugin and addWebpackPlugin.
---

# Nuxt Module

The Nuxt entry wraps the unplugin so it runs in both Vite and Webpack modes (Nuxt 2 with Vite bridge and Nuxt 3).

## Module Definition

```ts
// src/nuxt.ts
import type { Options } from './types'
import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from '@nuxt/kit'
import vite from './vite'
import webpack from './webpack'

export interface ModuleOptions extends Options {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-unplugin-starter',
    configKey: 'unpluginStarter',
  },
  defaults: {
    // ...default options
  },
  setup(options, _nuxt) {
    addVitePlugin(() => vite(options))
    addWebpackPlugin(() => webpack(options))
  },
})
```

## Consumer Usage

```ts
// nuxt.config.js
export default defineNuxtConfig({
  modules: [
    ['unplugin-starter/nuxt', { /* options */ }],
  ],
})
```

- **configKey:** Used for typed options in nuxt config (e.g. `unpluginStarter: { ... }`).
- **addVitePlugin / addWebpackPlugin:** Both are called so the same plugin runs regardless of Nuxt’s bundler. Pass a function that returns the plugin instance so options are read at the right time.

## Key Points

- Extend `Options` in `ModuleOptions` so Nuxt config options stay typed.
- Use the existing Vite and Webpack entries (vite.ts, webpack.ts) instead of duplicating logic.
- Works with Nuxt 2 (with Vite) and Nuxt 3.

<!--
Source references:
- https://github.com/unplugin/unplugin-starter
- src/nuxt.ts
- README.md
-->
