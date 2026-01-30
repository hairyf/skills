---
name: advanced-typed-routes
description: TypeScript typed routes for autocomplete and type safety in navigation
---

# Typed Routes

Configure TypeScript types for routes to get autocomplete and type safety.

## Manual Configuration

Define route map interface:

```ts
import type { RouteRecordInfo } from 'vue-router'

export interface RouteNamedMap {
  home: RouteRecordInfo<
    'home',
    '/',
    Record<never, never>, // Raw params (for router.push)
    Record<never, never>,  // Normalized params (from useRoute)
    never                 // Child route names
  >
  'user-profile': RouteRecordInfo<
    'user-profile',
    '/user/:username',
    { username: string | number },
    { username: string },
    never
  >
  'article-details': RouteRecordInfo<
    'article-details',
    '/articles/:id+',
    { id: Array<number | string> },
    { id: string[] },
    never
  >
}
```

Augment Vue Router types:

```ts
declare module 'vue-router' {
  interface TypesConfig {
    RouteNamedMap: RouteNamedMap
  }
}
```

## Using Typed Routes

After configuration, get autocomplete:

```ts
router.push({ name: 'user-profile', params: { username: 'eduardo' } })
// ✅ Autocomplete for route names
// ✅ Type checking for params

const route = useRoute()
route.params.username // ✅ Typed as string
```

## Recommended: unplugin-vue-router

Manual configuration is tedious. Use [unplugin-vue-router](https://github.com/posva/unplugin-vue-router) for automatic type generation from file-based routing.

## Key Points

- Define `RouteNamedMap` interface with route names
- Use `RouteRecordInfo` type for each route
- Augment `vue-router` module with `TypesConfig`
- Provides autocomplete and type safety for navigation
- Consider using unplugin-vue-router for automatic generation

<!--
Source references:
- https://router.vuejs.org/guide/advanced/typed-routes.html
-->
