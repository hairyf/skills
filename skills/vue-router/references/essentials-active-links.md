---
name: essentials-active-links
description: Active link CSS classes, router-link-active vs router-link-exact-active, and customizing active classes
---

# Active Links

RouterLink automatically adds CSS classes to active links for styling.

## Active Link Classes

RouterLink adds two classes:
- `router-link-active`: Link is active (matches route or ancestor)
- `router-link-exact-active`: Link is exactly active (exact match only)

## When Links Are Active

A link is **active** if:
1. Matches same route record as current location
2. Has same `params` values as current location

Ancestor routes in nested routes are also considered active if params match.

**Note**: `query` and `hash` are not considered when determining active state.

## Exact Active Links

Exact match does not include ancestor routes:

```js
const routes = [
  {
    path: '/user/:username',
    component: User,
    children: [
      { path: 'role/:roleId', component: Role },
    ],
  },
]
```

```vue
<RouterLink to="/user/erina">User</RouterLink>
<RouterLink to="/user/erina/role/admin">Role</RouterLink>
```

If current path is `/user/erina/role/admin`:
- Both links have `router-link-active`
- Only second link has `router-link-exact-active`

## Customizing Classes

### Per Link

```vue
<RouterLink
  to="/about"
  active-class="border-indigo-500"
  exact-active-class="border-indigo-700"
>
  About
</RouterLink>
```

### Globally

```js
const router = createRouter({
  linkActiveClass: 'border-indigo-500',
  linkExactActiveClass: 'border-indigo-700',
  routes: [...],
})
```

## Key Points

- `router-link-active`: Active or ancestor route matches
- `router-link-exact-active`: Exact route match only
- Active state considers route record and params, not query/hash
- Customize classes per-link or globally

<!--
Source references:
- https://router.vuejs.org/guide/essentials/active-links.html
-->
