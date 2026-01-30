---
name: arch-nuxt-module-builder setup patterns
description: createResolver, addPlugin without extension, and referencing runtime from module setup.
---

# Setup Patterns

When implementing `setup()` in `src/module.ts`, follow these patterns so the built module works and stays type-safe.

## Resolving runtime paths

Always use `createResolver(import.meta.url)` and resolve paths **without** file extension:

```ts
import { createResolver, addPlugin } from '@nuxt/kit'

export default defineNuxtModule({
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)
    addPlugin(resolver.resolve('./runtime/plugins/plugin'))
  },
})
```

The build will resolve these to `dist/runtime/` outputs; adding `.ts` or `.js` can break resolution.

## Using runtime types in module

You can import types from runtime in `src/module.ts` (e.g. for options or hooks). The builder externals runtime paths and rewrites them in the bundle:

```ts
import type { SharedTypeFromRuntime } from './runtime/plugins/plugin'

export interface ModuleOptions {
  apiKey: string
  shared?: SharedTypeFromRuntime
}
```

Ensure the runtime file exports the type; it will be compiled and the type will be available from the built module.

## Defaults and meta

- Set `defaults` so users get typed and documented defaults.
- Use `meta.configKey` so the module is configurable via `nuxt.config` under that key (e.g. `myModule: { apiKey: '...' }`).

## Key Points

- Do not add extensions when calling `resolver.resolve()` for files under `src/runtime/`.
- Prefer importing types from runtime with `import type` to avoid pulling runtime code into the module entry.
- Use Nuxt Kit utilities (`addPlugin`, `addComponent`, `addImports`, etc.) so the module integrates correctly with Nuxt’s build and dev server.

<!--
Source references:
- https://github.com/nuxt/module-builder
- README.md (src/runtime/, TODO about addressing runtime from setup)
- example/src/module.ts
-->
