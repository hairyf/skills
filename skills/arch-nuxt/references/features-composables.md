---
name: features-composables
description: useCount, useState, and auto-imported composables in arch-nuxt
---

# Composables

Composables in `app/composables/` are auto-imported. Use them for shared state and logic (e.g. `useState` for SSR-safe state, or custom composables like `useCount`).

## Usage

**SSR-safe state with useState**:

```ts
// app/composables/count.ts
export function useCount() {
  const count = useState('count', () => Math.round(Math.random() * 20))

  function inc() {
    count.value += 1
  }
  function dec() {
    count.value -= 1
  }

  return {
    count,
    inc,
    dec,
  }
}
```

**In a page or component** — No import needed (auto-import):

```vue
<script setup lang="ts">
const { count, inc, dec } = useCount()
</script>

<template>
  <button @click="dec">-</button>
  <span>{{ count }}</span>
  <button @click="inc">+</button>
</template>
```

## Key points

- **useState(key, init)** — Nuxt built-in; SSR-safe shared state. Key must be unique; init can be a function.
- **Auto-import** — Composables under `app/composables/` (and Nuxt/VueUse composables) are available without importing.
- **Naming** — Use `use*` for composables so they are clearly recognizable and work with auto-import.

<!--
Source references:
- https://github.com/antfu/vitesse-nuxt
- https://nuxt.com/docs/guide/directory-structure/composables
-->
