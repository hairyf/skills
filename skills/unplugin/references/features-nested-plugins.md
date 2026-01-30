---
name: unplugin-nested-plugins
description: Returning an array of plugins from the factory to behave as a single plugin.
---

# Unplugin Nested Plugins

The factory can return an **array** of Rollup-style plugin options instead of a single object. Unplugin then exposes one plugin per bundler that wraps this list, so they behave as a single plugin.

## Usage

```ts
import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'

export interface Options {
  // ...
}

export const unpluginFactory: UnpluginFactory<Options, true> = options => [
  {
    name: 'plugin-a',
    transform(code) {
      return code.replace(/<template>/, '<template><div>Injected</div>')
    },
  },
  {
    name: 'plugin-b',
    resolveId(id) {
      return id
    },
  },
]

export const unplugin = createUnplugin(unpluginFactory)
export default unplugin
```

Typing: use `UnpluginFactory<Options, true>` so the return type is `UnpluginOptions[]` and the instance’s `.vite` / `.rollup` etc. are arrays of plugins.

## Bundler Support

| Bundler  | Nested support        |
|----------|------------------------|
| Rollup   | ✅ >= 3.1.0            |
| Vite     | ✅                     |
| webpack  | ✅                     |
| Rspack   | ✅                     |
| esbuild  | ✅                     |
| Farm     | ✅                     |
| Rolldown | ✅                     |
| Bun      | ✅                     |

For Rollup, require `>= 3.1.0` when documenting or when your plugin uses nested plugins.

## When to Use

- Split one “meta” plugin into several logical plugins (e.g. one for resolve, one for transform) while still shipping a single package and a single `createUnplugin` call.
- Compose multiple small hooks (e.g. different `transform` handlers) under one name and one options object.

<!--
Source references:
- https://github.com/rollup/rollup/releases/tag/v3.1.0
- sources/unplugin/docs/guide/index.md
- sources/unplugin/src/types.ts
-->
