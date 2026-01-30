---
name: core-navigation
description: Programmatic navigation using router.push(), router.replace(), router.go(), and navigation methods
---

# Programmatic Navigation

Navigate programmatically using router instance methods instead of `<router-link>`.

## Navigate with push()

`router.push()` pushes a new entry into history stack:

```js
// String path
router.push('/users/eduardo')

// Object with path
router.push({ path: '/users/eduardo' })

// Named route with params
router.push({ name: 'user', params: { username: 'eduardo' } })

// With query
router.push({ path: '/register', query: { plan: 'private' } })

// With hash
router.push({ path: '/about', hash: '#team' })
```

**Important**: `params` are ignored if `path` is provided. Use `name` with `params`:

```js
const username = 'eduardo'
router.push(`/user/${username}`) // Manual URL building
router.push({ path: `/user/${username}` }) // Same
router.push({ name: 'user', params: { username } }) // Recommended - auto encoding
router.push({ path: '/user', params: { username } }) // ❌ params ignored
```

## Replace Current Location

`router.replace()` replaces current history entry instead of pushing:

```js
router.replace({ path: '/home' })
// Equivalent to
router.push({ path: '/home', replace: true })
```

## Traverse History

`router.go()` moves forward/backward in history:

```js
router.go(1)   // Forward one step (same as router.forward())
router.go(-1)  // Back one step (same as router.back())
router.go(3)   // Forward 3 steps
router.go(-100) // Fails silently if not enough history
```

## Navigation Methods Return Promises

All navigation methods return promises:

```js
router.push('/about').then(() => {
  // Navigation completed
}).catch((err) => {
  // Navigation failed
})

// Or with async/await
try {
  await router.push('/about')
  // Navigation succeeded
} catch (err) {
  // Navigation failed
}
```

## Key Points

- `router.push()` adds history entry, `router.replace()` replaces it
- Use `name` + `params` for automatic URL encoding
- `params` must be string/number (or array for repeatable params)
- Navigation methods work consistently regardless of history mode
- Methods return promises for handling navigation completion/failure

<!--
Source references:
- https://router.vuejs.org/guide/essentials/navigation.html
-->
