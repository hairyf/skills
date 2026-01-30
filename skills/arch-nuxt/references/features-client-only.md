---
name: features-client-only
description: ClientOnly, Suspense, useOnline, and fallback in arch-nuxt
---

# Client-only and Suspense

Use `<ClientOnly>` for content that must run only on the client (e.g. API-dependent UI). Use `<Suspense>` with a fallback when the child is async (e.g. `useFetch`). Combine with `useOnline()` to hide or replace content when offline.

## Usage

```vue
<script setup lang="ts">
definePageMeta({ layout: 'home' })

const online = useOnline()
</script>

<template>
  <ClientOnly>
    <Suspense>
      <PageView v-if="online" />
      <div v-else text-gray:80>You're offline</div>
      <template #fallback>
        <div op50 italic>
          <span animate-pulse>Loading...</span>
        </div>
      </template>
    </Suspense>
    <template #fallback>
      <div op50>
        <span animate-pulse>...</span>
      </div>
    </template>
  </ClientOnly>
</template>
```

## Key points

- **ClientOnly** — Renders the default slot only on the client; use `#fallback` for SSR placeholder (e.g. loading dots). Avoids hydration mismatch for client-only APIs or DOM.
- **Suspense** — Wraps async setup (e.g. component using `await useFetch()`). Shows `#fallback` until the async child resolves. Use when the page or child does top-level await.
- **useOnline()** — VueUse composable (auto-imported via `@vueuse/nuxt`). Reactive boolean for navigator.onLine. Use to show "offline" message or hide API-dependent content when offline.
- **Order** — Typical pattern: `ClientOnly` outer (skip SSR for block), then `Suspense` with async child and fallback.

<!--
Source references:
- https://github.com/antfu/vitesse-nuxt
- https://nuxt.com/docs/api/components/client-only
- https://vuejs.org/guide/built-ins/suspense.html
-->
