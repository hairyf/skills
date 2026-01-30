---
name: arch-unplugin factory and API
description: UnpluginFactory, createUnplugin, transformInclude, transform, and universal plugin object shape.
---

# Factory and API

## UnpluginFactory

Your plugin is a function that takes options and returns a universal plugin object:

```ts
import type { UnpluginFactory } from 'unplugin'
import type { Options } from './types'
import { createUnplugin } from 'unplugin'

export const unpluginFactory: UnpluginFactory<Options | undefined> = options => ({
  name: 'unplugin-starter',
  transformInclude(id) {
    return id.endsWith('main.ts')
  },
  transform(code) {
    return code.replace('__UNPLUGIN__', `Hello Unplugin! ${options}`)
  },
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)
export default unplugin
```

- **Options:** Typed via your `Options` interface (e.g. in `types.ts`). Pass `undefined` if the plugin supports no options.
- **Return object:** Can include `name`, `transformInclude`, `transform`, `resolveId`, `load`, and other hooks that unplugin maps to each bundler.

## createUnplugin

`createUnplugin(unpluginFactory)` returns an object with bundler-specific methods:

- `unplugin.vite(options)` — Vite plugin
- `unplugin.rollup(options)` — Rollup plugin
- `unplugin.webpack(options)` — Webpack plugin
- `unplugin.esbuild(options)` — esbuild plugin
- etc.

Entry files (e.g. `vite.ts`) can either call `createVitePlugin(unpluginFactory)` and export the result, or export `unplugin.vite`; the starter uses the former for clarity.

## transformInclude

Optional. A function `(id: string) => boolean` that filters which files the plugin runs on. Only files for which it returns `true` will be passed to `transform`. Use it to avoid running on irrelevant files (e.g. only `main.ts` or only `*.vue`).

## transform

`transform(code: string, id: string): string | { code: string; map?: SourceMap }` — runs on each file that passed `transformInclude`. Return a string or an object with `code` and optional `map`. This is where you do code replacement, AST transforms, etc.

## Key Points

- Use `transformInclude` to limit work and avoid unnecessary transforms.
- Mark the `createUnplugin` call with `/* #__PURE__ */` so bundlers can tree-shake unused adapters.
- Export both the factory (for custom wrappers like Nuxt/Astro) and the default unplugin instance.

<!--
Source references:
- https://github.com/unplugin/unplugin-starter
- src/index.ts
- https://github.com/unjs/unplugin
-->
