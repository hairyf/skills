---
name: advanced-meta
description: Route meta fields for attaching custom data, accessing meta in guards, and TypeScript typing
---

# Route Meta Fields

Attach custom data to routes using `meta` property.

## Defining Meta

Add `meta` object to route:

```js
const routes = [
  {
    path: '/posts',
    component: PostsLayout,
    children: [
      {
        path: 'new',
        component: PostsNew,
        meta: { requiresAuth: true },
      },
      {
        path: ':id',
        component: PostsDetail,
        meta: { requiresAuth: false },
      },
    ],
  },
]
```

## Accessing Meta

Access `meta` via `route.meta` (merged from parent to child):

```js
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }
})
```

In components:

```vue
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
if (route.meta.requiresAuth) {
  // Check auth
}
</script>
```

## Meta Merging

Meta fields are merged from parent to child:

```js
const routes = [
  {
    path: '/admin',
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'users',
        meta: { section: 'users' },
        // Final meta: { requiresAuth: true, role: 'admin', section: 'users' }
      },
    ],
  },
]
```

## TypeScript Typing

Extend `RouteMeta` interface:

```ts
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    isAdmin?: boolean
    transition?: string
  }
}
```

Now `route.meta` is typed:

```ts
const route = useRoute()
route.meta.requiresAuth // ✅ Typed
```

## Common Use Cases

- Authentication requirements
- Page transitions
- Breadcrumbs
- Page titles
- Permissions/roles
- Analytics tracking

## Key Points

- Add `meta` object to route configuration
- Access via `route.meta` (merged from parent to child)
- Use in navigation guards for route protection
- Extend `RouteMeta` interface for TypeScript support
- Meta is non-recursive merge (parent to child only)

<!--
Source references:
- https://router.vuejs.org/guide/advanced/meta.html
-->
