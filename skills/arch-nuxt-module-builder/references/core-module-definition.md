---
name: arch-nuxt-module-builder module definition
description: defineNuxtModule, ModuleOptions, ModuleHooks, ModuleRuntimeHooks, ModuleRuntimeConfig, ModulePublicRuntimeConfig in src/module.ts.
---

# Module Definition (src/module.ts)

The entrypoint must default-export a module created with `defineNuxtModule`. Export `ModuleOptions` for user config typing; optionally export hook and runtime config interfaces so module-builder can generate shims.

## Required

- **Default export:** `defineNuxtModule<ModuleOptions>({ meta, defaults?, setup })`
- **ModuleOptions:** Exported interface for the module's options (used in `nuxt.config` and for generated types)

## Optional exports (for type generation)

| Export | Effect |
|--------|--------|
| `ModuleHooks` | Merged into `NuxtHooks` in `@nuxt/schema` shim |
| `ModuleRuntimeHooks` | Merged into `RuntimeNuxtHooks` in `#app` shim |
| `ModuleRuntimeConfig` | Merged into `RuntimeConfig` |
| `ModulePublicRuntimeConfig` | Merged into `PublicRuntimeConfig` |

If you do not export `ModuleOptions`, the builder infers `Partial<O>` from the default-exported module type.

## Example

```ts
import { defineNuxtModule } from '@nuxt/kit'

export interface ModuleOptions {
  apiKey: string
}

export interface ModuleHooks {
  'my-module:init': (payload: unknown) => void
}

export interface ModuleRuntimeHooks {
  'my-module:runtime-hook': () => void
}

export interface ModuleRuntimeConfig {
  PRIVATE_NAME: string
}

export interface ModulePublicRuntimeConfig {
  NAME: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'my-module',
    configKey: 'myModule',
  },
  defaults: {
    apiKey: 'test',
  },
  async setup(moduleOptions, nuxt) {
    // Module logic; use createResolver(import.meta.url) for runtime paths
  },
})
```

## Key Points

- `meta.name` and `meta.configKey` are used by Nuxt and by module-builder metadata.
- Types exported from `src/module.ts` are collected and re-exported in `dist/types.d.mts`; the shims give Nuxt config and app typings for your module.

<!--
Source references:
- https://github.com/nuxt/module-builder
- README.md (src/module.ts)
- src/commands/build.ts (writeTypes)
-->
