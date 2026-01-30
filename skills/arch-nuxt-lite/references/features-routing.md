---
name: features-routing
description: File-based routing and typed routes in arch-nuxt-lite
---

# File-based routing (unplugin-vue-router)

Routes are generated from Vue files under `src/pages` with the same file structure. Use `useRouter()`, `useRoute(path?)`, and typed route helpers. Routes are exported from `vue-router/auto-routes`.

## Usage

**main.ts** — Create router with generated routes:

```ts
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  routes,
  history: createWebHistory(import.meta.env.BASE_URL),
})
```

**In a page** — Navigate and read params with types:

```ts
const router = useRouter()
router.push(`/hi/${encodeURIComponent(name.value)}`)

// Typed route params (unplugin-vue-router)
const params = useRoute('/hi/[name]').params
// params.name is string
```

**Catch-all** — `src/pages/[...all].vue` handles unmatched paths (e.g. 404).

## Route file rules

- `src/pages/index.vue` → `/`
- `src/pages/hi/[name].vue` → `/hi/:name`
- `src/pages/[...all].vue` → `/:all(.*)`

Generated types live in `typed-router.d.ts` (or similar); commit this file. Optional: `definePage`, `defineLoader` from the plugin for page-level metadata or loaders.

## Key points

- Do not manually add route records for files in `src/pages`; the plugin generates them.
- Use `useRoute('/path/[param]')` for typed params when using TypeScript.
- Path alias `~/` points to `src/` for imports (e.g. `~/composables`).

<!--
Source references:
- https://github.com/antfu-collective/vitesse-lite
- https://github.com/posva/unplugin-vue-router
-->
