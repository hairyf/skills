---
name: unplugin-integration
description: How to install and register unplugin in Vite, Rollup, webpack, Rspack, esbuild, Farm, Rolldown, Bun, Nuxt, Vue CLI, Astro.
---

# Unplugin Integration

Consumers install the unplugin package and use the entry that matches their bundler or framework.

## Installation

```bash
pnpm add -D unplugin-foo
# or npm/yarn/bun
```

Requires Node.js 18.12.0+ and webpack 5+ when using webpack.

## Bundler Configs

### Vite

```ts
// vite.config.ts
import Foo from 'unplugin-foo/vite'

export default defineConfig({
  plugins: [
    Foo({ /* options */ }),
  ],
})
```

### Rollup

```js
// rollup.config.js
import Foo from 'unplugin-foo/rollup'

export default {
  plugins: [
    Foo({ /* options */ }),
  ],
}
```

### Rolldown

```js
// rolldown.config.js
import Foo from 'unplugin-foo/rolldown'

export default {
  plugins: [
    Foo({ /* options */ }),
  ],
}
```

### webpack

```js
// webpack.config.js
module.exports = {
  plugins: [
    require('unplugin-foo/webpack')({ /* options */ }),
  ],
}
```

### Rspack

```js
// rspack.config.js
module.exports = {
  plugins: [
    require('unplugin-foo/rspack')({ /* options */ }),
  ],
}
```

### esbuild

```js
// esbuild.config.js
import { build } from 'esbuild'
import Foo from 'unplugin-foo/esbuild'

build({
  entryPoints: ['src/index.ts'],
  outdir: 'dist',
  plugins: [Foo()],
})
```

### Farm

```ts
// farm.config.ts
import Foo from 'unplugin-foo/farm'

export default defineConfig({
  plugins: [
    Foo({ /* options */ }),
  ],
})
```

### Bun

```ts
// e.g. build script
import Foo from 'unplugin-foo/bun'

await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  plugins: [
    Foo({ /* options */ }),
  ],
})
```

## Framework Integration

### Nuxt

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    ['unplugin-foo/nuxt', { /* options */ }],
  ],
})
```

### Vue CLI (webpack)

```js
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-foo/webpack')({ /* options */ }),
    ],
  },
}
```

### Astro

Use the integration or plugin exported by the unplugin (e.g. Vite plugin via Astro’s Vite config). Example pattern:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import Foo from 'unplugin-foo/vite'

export default defineConfig({
  vite: {
    plugins: [Foo()],
  },
})
```

When helping users, always point them to the entry that matches their bundler: `unplugin-foo/vite`, `unplugin-foo/rollup`, `unplugin-foo/webpack`, etc.

<!--
Source references:
- https://unplugin.unjs.io/guide/
- sources/unplugin/docs/guide/index.md
-->
