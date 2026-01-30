---
name: core-constants
description: app/constants for appName, appDescription in arch-nuxt
---

# Constants (app/constants)

Shared app metadata (name, description) lives in `app/constants/`. Import in `nuxt.config.ts`, PWA config, and `useHead` so titles and meta stay in one place.

## Usage

```ts
// app/constants/index.ts
export const appName = 'Vitesse for Nuxt 4'
export const appDescription = 'Vitesse for Nuxt 4'
```

**In nuxt.config and PWA**:

```ts
// nuxt.config.ts
import { appDescription } from './app/constants/index'

export default defineNuxtConfig({
  app: {
    head: {
      meta: [{ name: 'description', content: appDescription }],
    },
  },
})
```

```ts
// app/config/pwa.ts
import { appDescription, appName } from '../constants/index'

export const pwa = {
  manifest: {
    name: appName,
    short_name: appName,
    description: appDescription,
  },
}
```

**In app.vue**:

```vue
<script setup lang="ts">
import { appName } from '~/constants'

useHead({ title: appName })
</script>
```

## Key points

- **Single source** — Define `appName` and `appDescription` once; use in head meta, PWA manifest, and any other copy. Easier to change later.
- **Alias** — Use `~/constants` (or `~/constants/index`) so path is stable if you move files.
- **No reactivity** — Constants are plain values; use them in config and in `useHead` (optionally with a getter if you need reactive title).

<!--
Source references:
- https://github.com/antfu/vitesse-nuxt
-->
