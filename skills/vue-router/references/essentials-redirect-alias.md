---
name: essentials-redirect-alias
description: Route redirects and aliases for URL mapping and navigation
---

# Redirect and Alias

Map URLs to routes using redirects and aliases.

## Redirect

Redirect from one path to another:

```js
const routes = [
  { path: '/home', redirect: '/' },
  { path: '/home', redirect: { name: 'homepage' } },
]
```

### Function Redirect

Dynamic redirect using function:

```js
const routes = [
  {
    path: '/search/:searchText',
    redirect: to => {
      return { path: '/search', query: { q: to.params.searchText } }
    },
  },
]
```

### Relative Redirect

Redirect relative to current path:

```js
const routes = [
  {
    path: '/users/:id/posts',
    redirect: to => {
      return to.path.replace(/posts$/, 'profile')
    },
  },
]
```

**Note**: Navigation guards are not applied on redirect route, only on target.

## Alias

Alias allows multiple URLs to match same route:

```js
const routes = [
  { path: '/', component: Homepage, alias: '/home' },
]
```

Visiting `/home` keeps URL as `/home` but matches `/` route.

### Multiple Aliases

Provide array for multiple aliases:

```js
const routes = [
  {
    path: '/users',
    component: UsersLayout,
    children: [
      {
        path: '',
        component: UserList,
        alias: ['/people', 'list'], // /users, /users/list, /people
      },
    ],
  },
]
```

### Absolute Aliases in Nested Routes

Start alias with `/` for absolute path:

```js
const routes = [
  {
    path: '/users/:id',
    component: UsersByIdLayout,
    children: [
      {
        path: 'profile',
        component: UserDetails,
        alias: ['/:id', ''], // /users/24, /users/24/profile, /24
      },
    ],
  },
]
```

## Key Points

- Redirect: Replace URL and navigate to target route
- Alias: Multiple URLs match same route, URL stays unchanged
- Redirects can be string, object, or function
- Aliases can be string or array
- Use absolute aliases (`/path`) in nested routes for root paths

<!--
Source references:
- https://router.vuejs.org/guide/essentials/redirect-and-alias.html
-->
