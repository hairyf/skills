---
name: best-practices-routing
description: File-based routing, dynamic and catch-all routes in arch-nuxt
---

# Routing (file-based)

Nuxt uses file-based routing under `app/pages/`. File and folder names map to route path and params. Use `[...all].vue` for 404 and dynamic segments like `[id].vue` for params.

## Usage

**Static** — `app/pages/index.vue` → `/`.

**Dynamic segment** — `app/pages/hi/[id].vue` → `/hi/:id`:

```vue
<script setup lang="ts">
const route = useRoute<'hi-id'>()
const name = route.params.id
</script>

<template>
  <div>Hi, {{ name }}!</div>
</template>
```

**Catch-all (404)** — `app/pages/[...all].vue` → matches any path not matched by other routes:

```vue
<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <main>
    <div>Not found</div>
    <button @click="router.back()">Back</button>
  </main>
</template>
```

## Key points

- **Convention** — `pages/index.vue` = `/`, `pages/hi/[id].vue` = `/hi/:id`, `pages/[...all].vue` = catch-all.
- **useRoute** — Typed route: `useRoute<'hi-id'>()` for `params.id`. Use for typed params when `experimental.typedPages` is enabled.
- **NuxtLink** — Use `<NuxtLink to="/">` for in-app navigation; use `<router-link>` only when you need Vue Router’s API.
- **Prerender** — `nitro.prerender.ignore` (e.g. `['/hi']`) excludes dynamic routes from static generation when using `nuxt generate`.

<!--
Source references:
- https://github.com/antfu/vitesse-nuxt
- https://nuxt.com/docs/guide/directory-structure/pages
-->
