---
name: best-practices-page-meta
description: definePageMeta for layout, middleware, and route behavior in arch-nuxt
---

# Page meta (definePageMeta)

Use `definePageMeta` in a page to set layout, middleware, or other route-level options. It must be called at the top level of the script (not inside conditionals).

## Usage

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'home',
})
</script>

<template>
  <div>Page content</div>
</template>
```

**Layout** — Switch away from default:

```ts
definePageMeta({
  layout: 'home',  // use app/layouts/home.vue
})
```

**Default layout** — Omit `definePageMeta` or use `layout: 'default'` to use `app/layouts/default.vue`.

## Key points

- **Layout** — `layout: 'home'` uses the component `app/layouts/home.vue`. Name must match filename without extension.
- **Static** — `definePageMeta` is compiled at build time; do not use dynamic values or conditionals.
- **Scope** — Only valid inside page components under `app/pages/`. Use for layout, middleware, keepalive, and other Nuxt page meta.

<!--
Source references:
- https://github.com/antfu/vitesse-nuxt
- https://nuxt.com/docs/api/utils/define-page-meta
-->
