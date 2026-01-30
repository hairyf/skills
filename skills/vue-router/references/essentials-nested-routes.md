---
name: essentials-nested-routes
description: Nested route configuration with children option, nested RouterView components, and parent-child route relationships
---

# Nested Routes

Express nested component relationships using nested route configurations.

## Basic Nested Routes

Add `children` option to parent route:

```js
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        path: 'profile',
        component: UserProfile,
      },
      {
        path: 'posts',
        component: UserPosts,
      },
    ],
  },
]
```

Add `<RouterView>` in parent component:

```vue
<!-- User.vue -->
<template>
  <div class="user">
    <h2>User {{ $route.params.id }}</h2>
    <RouterView /> <!-- Child routes render here -->
  </div>
</template>
```

When visiting `/user/eduardo/profile`, `UserProfile` renders inside `User`'s `<RouterView>`.

## Empty Nested Path

Render default component when parent path matches:

```js
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      { path: '', component: UserHome }, // Renders at /user/:id
      { path: 'profile', component: UserProfile },
    ],
  },
]
```

## Nested Paths Starting with /

Paths starting with `/` are treated as root paths:

```js
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      { path: 'profile', component: UserProfile }, // /user/:id/profile
      { path: '/settings', component: Settings },  // /settings (root path)
    ],
  },
]
```

## Omitting Parent Component

Group routes without nesting components (useful for guards or meta):

```js
const routes = [
  {
    path: '/admin',
    children: [
      { path: '', component: AdminOverview },
      { path: 'users', component: AdminUserList },
      { path: 'users/:id', component: AdminUserDetails },
    ],
  },
]
```

Since parent has no `component`, top-level `<RouterView>` renders child components directly.

## Nested Named Routes

Name child routes for navigation:

```js
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      { path: '', name: 'user', component: UserHome },
    ],
  },
]
```

## Key Points

- Use `children` array to define nested routes
- Add `<RouterView>` in parent component to render children
- Empty path `''` renders default child at parent path
- Paths starting with `/` are absolute (root paths)
- Can omit parent `component` to group routes without nesting

<!--
Source references:
- https://router.vuejs.org/guide/essentials/nested-routes.html
-->
