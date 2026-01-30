---
name: features-pinia-state
description: Pinia store with defineStore and HMR in arch-nuxt
---

# Pinia state (useUserStore)

State that is not tied to route or request (e.g. user name, UI preferences) is a good fit for Pinia. The template uses `defineStore` with the composition API style and HMR acceptance.

## Usage

```ts
// app/composables/user.ts
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const savedName = ref('')
  const previousNames = ref(new Set<string>())

  const usedNames = computed(() => Array.from(previousNames.value))
  const otherNames = computed(() =>
    usedNames.value.filter(name => name !== savedName.value)
  )

  function setNewName(name: string) {
    if (savedName.value)
      previousNames.value.add(savedName.value)
    savedName.value = name
  }

  return {
    setNewName,
    otherNames,
    savedName,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
```

**In a page** — Store is auto-imported:

```vue
<script setup lang="ts">
const user = useUserStore()
</script>

<template>
  <div>{{ user.savedName }}</div>
  <ul>
    <li v-for="otherName in user.otherNames" :key="otherName">{{ otherName }}</li>
  </ul>
</template>
```

## Key points

- **defineStore(id, setup)** — Use composition-style setup with `ref`/`computed` and return the public state and methods.
- **acceptHMRUpdate** — Keeps store state across HMR when editing the store file; use when `import.meta.hot` is available.
- **Module** — `@pinia/nuxt` is in `nuxt.config.ts`; no extra setup needed. Prefer Pinia for global/client state; use `useState` for SSR-shared state when appropriate.

<!--
Source references:
- https://github.com/antfu/vitesse-nuxt
- https://pinia.vuejs.org
-->
