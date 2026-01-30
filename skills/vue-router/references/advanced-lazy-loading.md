---
name: advanced-lazy-loading
description: Lazy loading route components with dynamic imports, code splitting, and chunk grouping
---

# Lazy Loading Routes

Load route components on-demand using dynamic imports for code splitting.

## Basic Lazy Loading

Replace static imports with dynamic imports:

```js
// Static import
// import UserDetails from './views/UserDetails.vue'

// Dynamic import
const UserDetails = () => import('./views/UserDetails.vue')

const router = createRouter({
  routes: [
    { path: '/users/:id', component: UserDetails },
    // Or inline
    { path: '/users/:id', component: () => import('./views/UserDetails.vue') },
  ],
})
```

Vue Router fetches component only when entering route for first time, then caches it.

## Component Function

Component option accepts function returning Promise:

```js
const UserDetails = () =>
  Promise.resolve({
    /* component definition */
  })
```

**Best Practice**: Always use dynamic imports for all routes.

## Code Splitting

Bundlers like webpack automatically create separate chunks:

```js
const routes = [
  { path: '/users/:id', component: () => import('./views/UserDetails.vue') },
]
```

Each route becomes separate chunk, loaded on-demand.

## Grouping Components in Same Chunk

### With webpack

Use webpack chunk name comment:

```js
const UserDetails = () =>
  import(/* webpackChunkName: "group-user" */ './UserDetails.vue')
const UserDashboard = () =>
  import(/* webpackChunkName: "group-user" */ './UserDashboard.vue')
const UserProfileEdit = () =>
  import(/* webpackChunkName: "group-user" */ './UserProfileEdit.vue')
```

Components with same chunk name are grouped together.

### With Vite

Configure in `vite.config.js`:

```js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'group-user': [
            './src/UserDetails',
            './src/UserDashboard',
            './src/UserProfileEdit',
          ],
        },
      },
    },
  },
})
```

## Important Notes

- **Do not** use Vue async components for routes
- Route components are just dynamic imports
- Async components can still be used inside route components
- Babel users need `syntax-dynamic-import` plugin

## Key Points

- Use `() => import()` for lazy loading
- Components loaded on first visit, then cached
- Automatic code splitting with bundlers
- Group related routes in same chunk for better loading
- Always prefer lazy loading for all routes

<!--
Source references:
- https://router.vuejs.org/guide/advanced/lazy-loading.html
-->
