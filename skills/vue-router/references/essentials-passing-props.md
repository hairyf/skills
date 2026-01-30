---
name: essentials-passing-props
description: Passing route params and data as component props instead of accessing $route directly
---

# Passing Props to Route Components

Decouple components from route by passing route data as props.

## Boolean Mode

Set `props: true` to pass `route.params` as component props:

```js
const routes = [
  { path: '/user/:id', component: User, props: true },
]
```

```vue
<!-- User.vue -->
<script setup>
defineProps({
  id: String,
})
</script>

<template>
  <div>User {{ id }}</div>
</template>
```

## Object Mode

Pass static props as object:

```js
const routes = [
  {
    path: '/promotion/from-newsletter',
    component: Promotion,
    props: { newsletterPopup: false },
  },
]
```

## Function Mode

Create function to transform route data:

```js
const routes = [
  {
    path: '/search',
    component: SearchUser,
    props: route => ({ query: route.query.q }),
  },
]
```

URL `/search?q=vue` passes `{query: 'vue'}` as props.

## Named Views

For routes with named views, define props per view:

```js
const routes = [
  {
    path: '/user/:id',
    components: { default: User, sidebar: Sidebar },
    props: { default: true, sidebar: false },
  },
]
```

## Via RouterView Slot

Pass props through RouterView slot (applies to all views):

```vue
<RouterView v-slot="{ Component }">
  <component :is="Component" view-prop="value" />
</RouterView>
```

**Warning**: This passes props to all view components, which may not be desired.

## Key Points

- `props: true` passes `route.params` as props
- Object mode passes static props
- Function mode transforms route data to props
- Keep props function stateless (only evaluated on route changes)
- Prefer route-level props over RouterView slot props

<!--
Source references:
- https://router.vuejs.org/guide/essentials/passing-props.html
-->
