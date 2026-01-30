---
name: arch-unplugin Astro integration
description: Using the unplugin inside Astro via the Vite plugins hook.
---

# Astro Integration

Astro uses Vite under the hood. The Astro entry pushes the unplugin’s Vite plugin into `astro.config.vite.plugins`.

## Implementation

```ts
// src/astro.ts
import type { Options } from './types'
import unplugin from '.'

export default (options: Options): any => ({
  name: 'unplugin-starter',
  hooks: {
    'astro:config:setup': async (astro: any) => {
      astro.config.vite.plugins ||= []
      astro.config.vite.plugins.push(unplugin.vite(options))
    },
  },
})
```

- Use the default export from the main package (the `createUnplugin` result) and call `.vite(options)` to get the Vite plugin.
- In `astro:config:setup`, ensure `astro.config.vite.plugins` is an array, then push the plugin.

## Consumer Usage

Consumers would add the Astro integration to their Astro config and pass options the same way as for Vite. The integration is framework-specific (Astro) while the transform logic stays in the shared factory.

## Key Points

- Astro does not use a `create*Plugin` from unplugin; it uses the main export’s `.vite()` method.
- Hook name must be `astro:config:setup` and you must mutate `astro.config.vite.plugins`.
- Options type should match your shared `Options` interface.

<!--
Source references:
- https://github.com/unplugin/unplugin-starter
- src/astro.ts
-->
