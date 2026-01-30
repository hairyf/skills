---
name: advanced-dynamic-routing
description: Adding and removing routes at runtime using router.addRoute() and router.removeRoute()
---

# Dynamic Routing

Add or remove routes at runtime using `router.addRoute()` and `router.removeRoute()`.

## Adding Routes

Add routes dynamically:

```js
router.addRoute({ path: '/about', component: About })
```

**Important**: After adding route, manually navigate if current location matches:

```js
router.addRoute({ path: '/about', component: About })
router.replace(router.currentRoute.value.fullPath)
```

Or await navigation:

```js
await router.replace(router.currentRoute.value.fullPath)
```

## Adding Routes in Navigation Guards

Return redirect instead of calling `router.replace()`:

```js
router.beforeEach(to => {
  if (!hasNecessaryRoute(to)) {
    router.addRoute(generateRoute(to))
    return to.fullPath // Trigger redirect
  }
})
```

## Removing Routes

Three ways to remove routes:

### 1. Add Route with Same Name

Routes with same name replace existing:

```js
router.addRoute({ path: '/about', name: 'about', component: About })
router.addRoute({ path: '/other', name: 'about', component: Other })
// First route removed, second added
```

### 2. Use Callback from addRoute()

```js
const removeRoute = router.addRoute(routeRecord)
removeRoute() // Removes the route
```

Useful when routes don't have names.

### 3. Use removeRoute()

Remove by name:

```js
router.addRoute({ path: '/about', name: 'about', component: About })
router.removeRoute('about')
```

Use `Symbol` for names to avoid conflicts:

```js
const aboutRouteName = Symbol('about')
router.addRoute({ path: '/about', name: aboutRouteName, component: About })
router.removeRoute(aboutRouteName)
```

**Note**: Removing route also removes all aliases and children.

## Adding Nested Routes

Add nested routes to existing route by name:

```js
router.addRoute({ name: 'admin', path: '/admin', component: Admin })
router.addRoute('admin', { path: 'settings', component: AdminSettings })
```

Equivalent to:

```js
router.addRoute({
  name: 'admin',
  path: '/admin',
  component: Admin,
  children: [{ path: 'settings', component: AdminSettings }],
})
```

## Checking Routes

Check if route exists or get all routes:

```js
router.hasRoute('about') // Check if route exists
router.getRoutes()       // Get array of all route records
```

## Key Points

- Use `router.addRoute()` to add routes at runtime
- Manually navigate after adding if current location matches
- Remove routes by name conflict, callback, or `removeRoute()`
- Adding nested routes: pass parent name as first argument
- Use `hasRoute()` and `getRoutes()` to inspect routes

<!--
Source references:
- https://router.vuejs.org/guide/advanced/dynamic-routing.html
-->
