---
name: advanced-navigation-guards
description: Global guards, per-route guards, in-component guards, and navigation flow control
---

# Navigation Guards

Control navigation by redirecting or canceling route changes.

## Global Before Guards

Register guards that run on every navigation:

```js
router.beforeEach((to, from) => {
  // Return false to cancel navigation
  if (!isAuthenticated && to.name !== 'Login') {
    return { name: 'Login' } // Redirect
  }
  // Return nothing/true/undefined to continue
})
```

Guards receive:
- `to`: Target route location
- `from`: Current route location

Return values:
- `false`: Cancel navigation
- Route location: Redirect to that location
- `undefined`/`true`: Continue navigation
- Throw error: Cancel and call error handler

### Async Guards

Guards can be async:

```js
router.beforeEach(async (to, from) => {
  const canAccess = await canUserAccess(to)
  if (!canAccess) return '/login'
})
```

## Global Resolve Guards

`beforeResolve` runs after all guards and async components resolve:

```js
router.beforeResolve(async to => {
  if (to.meta.requiresCamera) {
    await askForCameraPermission()
  }
})
```

## Global After Hooks

Run after navigation completes (cannot affect navigation):

```js
router.afterEach((to, from, failure) => {
  if (!failure) {
    sendToAnalytics(to.fullPath)
  }
})
```

## Per-Route Guard

Define `beforeEnter` on route:

```js
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) => {
      // Only triggers when entering route, not on param changes
      return false // Cancel
    },
  },
]
```

Use array for multiple guards:

```js
function removeQueryParams(to) {
  if (Object.keys(to.query).length)
    return { path: to.path, query: {}, hash: to.hash }
}

const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: [removeQueryParams, removeHash],
  },
]
```

## In-Component Guards

### Options API

```vue
<script>
export default {
  beforeRouteEnter(to, from, next) {
    // No access to `this` - component not created yet
    next(vm => {
      // Access component instance via callback
    })
  },
  beforeRouteUpdate(to, from) {
    // Called when route changes but component reused
    // Has access to `this`
    this.name = to.params.name
  },
  beforeRouteLeave(to, from) {
    // Called when leaving route
    const answer = window.confirm('Leave with unsaved changes?')
    if (!answer) return false
  },
}
</script>
```

### Composition API

```vue
<script setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteLeave((to, from) => {
  const answer = window.confirm('Leave?')
  if (!answer) return false
})

onBeforeRouteUpdate(async (to, from) => {
  if (to.params.id !== from.params.id) {
    userData.value = await fetchUser(to.params.id)
  }
})
</script>
```

## Navigation Flow

1. Navigation triggered
2. `beforeRouteLeave` in deactivated components
3. Global `beforeEach` guards
4. `beforeRouteUpdate` in reused components
5. `beforeEnter` in route configs
6. Resolve async route components
7. `beforeRouteEnter` in activated components
8. Global `beforeResolve` guards
9. Navigation confirmed
10. Global `afterEach` hooks
11. DOM updates
12. Callbacks passed to `next` in `beforeRouteEnter`

## Key Points

- Global guards: `beforeEach`, `beforeResolve`, `afterEach`
- Per-route: `beforeEnter` on route config
- In-component: `beforeRouteEnter`, `beforeRouteUpdate`, `beforeRouteLeave`
- Return `false` or route location to control navigation
- Guards can be async/return promises

<!--
Source references:
- https://router.vuejs.org/guide/advanced/navigation-guards.html
-->
