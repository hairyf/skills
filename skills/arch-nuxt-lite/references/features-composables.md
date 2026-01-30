---
name: features-composables
description: Auto-imported composables and dark mode in arch-nuxt-lite
---

# Composables (unplugin-auto-import)

Vue, Vue Router, VueUse, and exports from `src/composables` are auto-imported. No need to import `ref`, `computed`, `useRouter`, `useRoute`, or composables from `~/composables` in script or template.

## Usage

**src/composables/dark.ts** — Dark mode with VueUse:

```ts
export const isDark = useDark()
export const toggleDark = useToggle(isDark)
```

**src/composables/index.ts** — Re-export for a single entry:

```ts
export * from './dark'
```

In components or pages, use directly:

```vue
<script setup lang="ts">
// ref, useRouter, useRoute, useCounter, etc. are auto-imported
const name = ref('')
const router = useRouter()
</script>
<template>
  <button @click="toggleDark()">Toggle dark</button>
</template>
```

VueUse APIs (e.g. `useCounter`, `useDark`, `useToggle`) are auto-imported via the AutoImport plugin config.

## Key points

- **dirs: ['./src/composables']** in vite.config.ts registers all exports from that directory.
- **dts: true** generates `auto-imports.d.ts`; commit it for TypeScript.
- Dark mode: `useDark()` + `useToggle(isDark)`; persistence and initial state are handled in `index.html` (e.g. `localStorage.getItem('color-schema')` and `prefers-color-scheme`).

<!--
Source references:
- https://github.com/antfu-collective/vitesse-lite
- https://github.com/antfu/unplugin-auto-import
-->
