---
name: features-data-fetching
description: useFetch, useTimeAgo, and async component data in arch-nuxt
---

# Data fetching (useFetch and VueUse)

Use `useFetch` for API calls with caching and SSR support. Use VueUse composables like `useTimeAgo` for derived display. Combine with `<Suspense>` when the component does top-level await.

## Usage

```vue
<script setup lang="ts">
const { data } = await useFetch('/api/pageview')

const time = useTimeAgo(() => data.value?.startAt || 0)
</script>

<template>
  <div text-gray:80>
    <span text-gray font-500>{{ data?.pageview }}</span>
    page views since
    <span text-gray>{{ time }}</span>
  </div>
</template>
```

## Key points

- **useFetch(url)** — Nuxt built-in; returns `{ data, pending, error, refresh }`. Caches by key (default: url); runs on server during SSR and on client. Use `await useFetch(...)` in setup for top-level await (then wrap in Suspense if used in a page).
- **useTimeAgo(source)** — VueUse composable (auto-imported). Pass a getter (e.g. `() => data.value?.startAt`); returns a reactive human-readable relative time that updates over time.
- **Optional chaining** — Use `data.value?.pageview` and `data.value?.startAt` because `data` is ref and may be undefined before the request completes.
- **SSR** — useFetch runs on server and serializes `data` into the payload so the client gets the same data without re-fetching (unless refresh is called).

<!--
Source references:
- https://github.com/antfu/vitesse-nuxt
- https://nuxt.com/docs/api/composables/use-fetch
- https://vueuse.org/core/useTimeAgo/
-->
