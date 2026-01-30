---
name: features-layouts
description: Layout system and definePageMeta layout selection in arch-nuxt
---

# Layouts

Layouts are Vue components in `app/layouts/`. The default layout is `default.vue` unless a page sets another via `definePageMeta({ layout: 'home' })`.

## Usage

**Define a layout** — Add a component named after the layout (e.g. `home.vue` → layout name `home`):

```vue
<!-- app/layouts/default.vue -->
<template>
  <main class="px-10 py-20 text-center">
    <slot />
    <Footer />
  </main>
</template>
```

**Use a layout in a page**:

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'home',
})
</script>
```

## Key points

- **Layout name** — Filename without extension (e.g. `default.vue` → `default`, `home.vue` → `home`).
- **Slot** — Layout wraps the page; the page content is rendered in the default `<slot />`.
- **Default** — If a page does not call `definePageMeta({ layout: '...' })`, `default` is used.
- **Shared UI** — Put shared structure (header, footer, nav) in layout components; keep page-specific content in `app/pages/`.

<!--
Source references:
- https://github.com/antfu/vitesse-nuxt
- https://nuxt.com/docs/guide/directory-structure/layouts
-->
