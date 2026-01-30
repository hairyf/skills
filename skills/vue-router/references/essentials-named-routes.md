---
name: essentials-named-routes
description: Named routes for navigation, avoiding hardcoded URLs, automatic param encoding, and route name uniqueness
---

# Named Routes

Give routes names for easier navigation without hardcoded URLs.

## Defining Named Routes

Add `name` property to route:

```js
const routes = [
  {
    path: '/user/:username',
    name: 'profile',
    component: User,
  },
]
```

## Using Named Routes

Navigate using route name:

```vue
<RouterLink :to="{ name: 'profile', params: { username: 'erina' } }">
  User Profile
</RouterLink>
```

Programmatic navigation:

```js
router.push({ name: 'profile', params: { username: 'erina' } })
```

## Advantages

- **No hardcoded URLs**: Change path without updating all references
- **Automatic encoding**: Params are automatically URL-encoded
- **Avoid typos**: TypeScript/IDE autocomplete for route names
- **Bypass path ranking**: Display lower-ranked route matching same path

## Route Name Uniqueness

Each name must be unique across all routes. If duplicate names exist, router keeps only the last one.

## Key Points

- Use `name` property to identify routes
- Navigate with `{ name: 'routeName', params: {...} }`
- Names must be unique across all routes
- Prefer named routes over hardcoded paths for maintainability

<!--
Source references:
- https://router.vuejs.org/guide/essentials/named-routes.html
-->
