---
name: arch-nuxt-module-builder runtime
description: src/runtime/ layout — plugins, composables, components; mkdist transform and resolving runtime paths in setup.
---

# Runtime (src/runtime/)

Any runtime code the module provides (plugins, composables, server API, components) must live under `src/runtime/`. Each file is built individually with [unjs/mkdist](https://github.com/unjs/mkdist) into `dist/runtime/`.

## Layout

Typical structure:

```
src/runtime/
  plugins/     → addPlugin(resolver.resolve('./runtime/plugins/plugin'))
  composables/ → auto-imported when module is used
  components/  → auto-imported when module is used
  server/      → server API routes (if any)
```

## Resolving runtime in setup

Use `createResolver(import.meta.url)` and resolve paths **without** file extension (build emits `.js`):

```ts
import { addPlugin, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)
    addPlugin(resolver.resolve('./runtime/plugins/plugin'))  // no .ts
  },
})
```

During the main module build, imports that point at `src/runtime/` are rewritten to the corresponding `dist/runtime/` output so the built module stays correct.

## Transform behavior

- `.ts` / `.js` → `.js` + `.d.ts`
- `.vue` → compiled component + `.d.ts`
- `.tsx` / `.jsx` → Vue JSX (automatic, jsxImportSource: 'vue')
- `*.spec.*`, `*.test.*`, `*.stories.*` under runtime are ignored

## Key Points

- Do not add extensions in `resolver.resolve()` for runtime files.
- Types from runtime (e.g. shared types used in `src/module.ts`) are valid; the builder resolves them and externals `@nuxt/kit`, `#app`, `vue`, etc., so the module bundle stays clean.

<!--
Source references:
- https://github.com/nuxt/module-builder
- README.md (src/runtime/)
- src/commands/build.ts (entries, mkdist, externals)
- example/src/module.ts, example/src/runtime/
-->
