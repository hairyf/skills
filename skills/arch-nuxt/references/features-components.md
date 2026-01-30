---
name: features-components
description: Auto-imported components, Counter, Footer, NuxtLink in arch-nuxt
---

# Components (auto-import)

Vue components in `app/components/` are auto-imported. Use them by name (PascalCase from filename); no import needed in pages or layouts.

## Usage

**Define a component** — Add a file under `app/components/` (e.g. `Counter.vue`):

```vue
<!-- app/components/Counter.vue -->
<script setup lang="ts">
const { count, inc, dec } = useCount()
</script>

<template>
  <div inline-flex m="y-3">
    <button btn p-2 rounded-full @click="dec()">
      <div i-carbon-subtract />
    </button>
    <div font="mono" w="15" m-auto inline-block>{{ count }}</div>
    <button btn p-2 rounded-full @click="inc()">
      <div i-carbon-add />
    </button>
  </div>
</template>
```

**Use in a page or layout** — Reference by name:

```vue
<template>
  <Footer />
  <Counter />
  <NuxtLink to="/">Home</NuxtLink>
</template>
```

## Key points

- **Auto-import** — Components under `app/components/` are registered globally; use `<Counter />`, `<Footer />`, etc. No manual import.
- **Naming** — Filename maps to component name: `Counter.vue` → `Counter`, `DarkToggle.vue` → `DarkToggle`. Use PascalCase in templates.
- **Composables** — Components can use composables (e.g. `useCount()`, `useColorMode()`) and they are auto-imported.
- **NuxtLink** — Use `<NuxtLink to="...">` for in-app navigation; it respects Nuxt routing and prefetch.

<!--
Source references:
- https://github.com/antfu/vitesse-nuxt
- https://nuxt.com/docs/guide/directory-structure/components
-->
