---
name: core-app-structure
description: app/ directory, app.vue, NuxtLayout, NuxtPage in arch-nuxt
---

# App structure (app/ and app.vue)

All application code lives under `app/`. The root component is `app/app.vue`, which wraps the app in a layout and renders the current page.

## Usage

```vue
<!-- app/app.vue -->
<script setup lang="ts">
import { appName } from '~/constants'

useHead({
  title: appName,
})
</script>

<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html, body, #__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
}
html.dark {
  color-scheme: dark;
}
</style>
```

## Key points

- **useHead** — Set default title (and other head fields) from `~/constants`.
- **VitePwaManifest** — Injects PWA manifest; required when using `@vite-pwa/nuxt`.
- **NuxtLayout** — Wraps the current page with the layout chosen via `definePageMeta({ layout: '...' })`. Default layout is `default`.
- **NuxtPage** — Renders the matched page component from `app/pages/`.
- **app/** — Contains `components/`, `composables/`, `config/`, `constants/`, `layouts/`, `pages/`. Components and composables are auto-imported.

<!--
Source references:
- https://github.com/antfu/vitesse-nuxt
- https://nuxt.com/docs/guide/directory-structure/app
-->
