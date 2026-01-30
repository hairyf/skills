---
name: best-practices-routing
description: File-based routing patterns and dynamic routes in arch-nuxt-lite
---

# Routing best practices

- **One route per file** — Each Vue file under `src/pages` becomes one route; use nested folders for path segments.
- **Dynamic segments** — Use `[param]` for a single segment (e.g. `src/pages/hi/[name].vue` → `/hi/:name`). Access typed params with `useRoute('/hi/[name]').params`.
- **Catch-all** — Use `[...all].vue` for 404 or fallback; path is available as `params.all`.
- **Encoding** — When pushing dynamic segments (e.g. user input), use `encodeURIComponent(value)` to avoid invalid URLs.
- **Route names** — Prefer path-based navigation (`router.push('/hi/' + name)`) or typed route helpers; generated route names are available in `typed-router.d.ts` if needed.
- **definePage / defineLoader** — Optionally use these from unplugin-vue-router for page metadata or route-level data loading; not required for basic CRUD-style pages.

<!--
Source references:
- https://github.com/posva/unplugin-vue-router
- https://github.com/antfu-collective/vitesse-lite
-->
