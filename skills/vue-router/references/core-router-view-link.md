---
name: core-router-view-link
description: RouterView component for rendering route components and RouterLink component for navigation links
---

# RouterView and RouterLink

Components provided by Vue Router for rendering routes and creating navigation links.

## RouterView

`RouterView` renders the component matched by the current route:

```vue
<template>
  <div id="app">
    <RouterView />
  </div>
</template>
```

Place `RouterView` where you want route components to render. For nested routes, add `RouterView` in child components:

```vue
<!-- User.vue -->
<template>
  <div class="user">
    <h2>User {{ $route.params.id }}</h2>
    <RouterView /> <!-- Nested routes render here -->
  </div>
</template>
```

## RouterLink

`RouterLink` creates navigation links without page reload:

```vue
<template>
  <RouterLink to="/">Home</RouterLink>
  <RouterLink to="/about">About</RouterLink>
</template>
```

### RouterLink Props

```vue
<RouterLink
  to="/users/eduardo"
  replace
  custom
  active-class="active-link"
  exact-active-class="exact-active-link"
>
  User Profile
</RouterLink>
```

- `to`: Target route (string or location object)
- `replace`: Replace history entry instead of pushing
- `custom`: Use v-slot API instead of rendering `<a>` tag
- `active-class`: CSS class for active links
- `exact-active-class`: CSS class for exactly active links

### Named Routes

```vue
<RouterLink :to="{ name: 'user', params: { username: 'eduardo' } }">
  User Profile
</RouterLink>
```

### Query and Hash

```vue
<RouterLink :to="{ path: '/search', query: { q: 'vue' } }">
  Search
</RouterLink>
<RouterLink :to="{ path: '/about', hash: '#team' }">
  About
</RouterLink>
```

### Custom RouterLink with v-slot

```vue
<RouterLink
  to="/about"
  custom
  v-slot="{ href, route, navigate, isActive, isExactActive }"
>
  <a
    :href="href"
    @click="navigate"
    :class="{ active: isActive, 'exact-active': isExactActive }"
  >
    About
  </a>
</RouterLink>
```

## Global Registration

Both components are globally registered, so no import needed:

```vue
<template>
  <RouterView />
  <RouterLink to="/">Home</RouterLink>
</template>
```

You can also import locally:

```vue
<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>
```

## Component Name Format

Component names can be PascalCase or kebab-case in templates:

```vue
<RouterView /> <!-- Same as -->
<router-view />

<RouterLink /> <!-- Same as -->
<router-link />
```

## Key Points

- `RouterView` renders matched route components
- `RouterLink` creates navigation links without reload
- Both components are globally registered
- Use `custom` prop with v-slot for custom link rendering
- Active classes help style current route links

<!--
Source references:
- https://router.vuejs.org/guide/
- https://router.vuejs.org/guide/advanced/router-view-slot.html
-->
