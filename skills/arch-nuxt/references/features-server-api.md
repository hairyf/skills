---
name: features-server-api
description: Nitro server API and defineEventHandler in arch-nuxt
---

# Server API (Nitro)

API routes live under `server/api/`. Each file exports a default handler via `defineEventHandler`. Path maps to filename (e.g. `server/api/pageview.ts` → `/api/pageview`).

## Usage

```ts
// server/api/pageview.ts
const startAt = Date.now()
let count = 0

export default defineEventHandler(() => ({
  pageview: count++,
  startAt,
}))
```

**Call from client** — Use `$fetch` or `useFetch` (auto-imported):

```ts
const data = await $fetch('/api/pageview')
// or
const { data } = await useFetch('/api/pageview')
```

## Key points

- **defineEventHandler** — Nitro helper; return value is serialized as JSON (or use `event.node.res` for custom response).
- **Path** — `server/api/foo.ts` → GET `/api/foo`; `server/api/foo/post.ts` → POST `/api/foo/post`. Use `[...].ts` for catch-all.
- **Runtime** — Runs in Nitro (Node); can use Node APIs, env, and other server-only code. Not included in client bundle.
- **Prerender** — Routes under `server/api/` are not prerendered by default; for SSG, use `nitro.prerender` and avoid relying on dynamic API state in static HTML.

<!--
Source references:
- https://github.com/antfu/vitesse-nuxt
- https://nitro.build
- https://nuxt.com/docs/guide/directory-structure/server
-->
