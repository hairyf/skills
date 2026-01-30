---
name: core-router-setup
description: Create and configure Vue Router instance, register router plugin, and access router/route in components
---

# Router Setup

Creating a router instance and registering it as a Vue plugin.

## Creating Router Instance

Create a router instance using `createRouter()`:

```js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './HomeView.vue'
import AboutView from './AboutView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
```

The `routes` option maps URL paths to components. The `history` option controls how routes map to URLs.

## Registering Router Plugin

Register the router as a plugin before mounting the app:

```js
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

The `use()` call must happen before `mount()`. This plugin:
- Globally registers `RouterView` and `RouterLink` components
- Adds global `$router` and `$route` properties
- Enables `useRouter()` and `useRoute()` composables
- Triggers initial route resolution

## Accessing Router and Route

### In Templates

Access router and route directly in templates:

```vue
<template>
  <p>Current path: {{ $route.fullPath }}</p>
  <button @click="$router.push('/about')">Go to About</button>
</template>
```

### Options API

Access via component instance:

```js
export default {
  methods: {
    navigate() {
      this.$router.push('/about')
    },
  },
  mounted() {
    console.log(this.$route.params)
  },
}
```

### Composition API

Use composables:

```vue
<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

function navigate() {
  router.push('/about')
}
</script>
```

## Key Points

- Router instance is created with `createRouter()` and route configuration
- Must register router with `app.use(router)` before mounting
- Access router via `$router`/`useRouter()` for navigation
- Access current route via `$route`/`useRoute()` for route data
- `route` object is reactive - watch specific properties, not the whole object

<!--
Source references:
- https://router.vuejs.org/guide/
- https://router.vuejs.org/guide/essentials/navigation.html
-->
