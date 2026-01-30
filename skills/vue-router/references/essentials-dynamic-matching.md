---
name: essentials-dynamic-matching
description: Dynamic route matching with params, accessing route.params, and reacting to param changes
---

# Dynamic Route Matching

Match routes with dynamic segments using params.

## Basic Dynamic Routes

Use colon `:` prefix for dynamic segments:

```js
const routes = [
  { path: '/users/:id', component: User },
]
```

URLs like `/users/johnny` and `/users/jolyne` both match this route.

## Accessing Params

Access params via `route.params`:

```vue
<template>
  <div>User {{ $route.params.id }}</div>
</template>
```

With Composition API:

```vue
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
console.log(route.params.id)
</script>
```

## Multiple Params

Routes can have multiple params:

```js
const routes = [
  { path: '/users/:username/posts/:postId', component: UserPost },
]
```

| Pattern | Matched Path | route.params |
|---------|-------------|--------------|
| `/users/:username` | `/users/eduardo` | `{ username: 'eduardo' }` |
| `/users/:username/posts/:postId` | `/users/eduardo/posts/123` | `{ username: 'eduardo', postId: '123' }` |

## Reacting to Param Changes

When navigating between `/users/johnny` and `/users/jolyne`, the same component instance is reused. Watch params to react:

### Composition API

```vue
<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(
  () => route.params.id,
  async (newId, oldId) => {
    // Fetch new user data
    userData.value = await fetchUser(newId)
  }
)
</script>
```

### Options API

```vue
<script>
export default {
  created() {
    this.$watch(
      () => this.$route.params.id,
      async (newId, oldId) => {
        this.userData = await fetchUser(newId)
      }
    )
  },
}
</script>
```

### Using Navigation Guard

```vue
<script setup>
import { onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteUpdate(async (to, from) => {
  userData.value = await fetchUser(to.params.id)
})
</script>
```

## Catch-All / 404 Route

Match anything with catch-all route:

```js
const routes = [
  // Matches everything under route.params.pathMatch
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]
```

Navigate to catch-all route:

```js
router.push({
  name: 'NotFound',
  params: { pathMatch: route.path.substring(1).split('/') },
  query: route.query,
  hash: route.hash,
})
```

## Key Points

- Use `:paramName` for dynamic segments
- Access params via `route.params`
- Component instances are reused for same route with different params
- Watch params or use `onBeforeRouteUpdate` to react to changes
- Use catch-all route `/:pathMatch(.*)*` for 404 pages

<!--
Source references:
- https://router.vuejs.org/guide/essentials/dynamic-matching.html
-->
