---
name: essentials-named-views
description: Multiple RouterView components with named views for complex layouts like sidebars and main content
---

# Named Views

Display multiple views simultaneously instead of nesting them.

## Basic Named Views

Use multiple `<RouterView>` components with `name` attribute:

```vue
<template>
  <RouterView name="LeftSidebar" />
  <RouterView /> <!-- Default view -->
  <RouterView name="RightSidebar" />
</template>
```

Use `components` (plural) option in route:

```js
const routes = [
  {
    path: '/',
    components: {
      default: Home,
      LeftSidebar,
      RightSidebar,
    },
  },
]
```

## Nested Named Views

Combine named views with nested routes:

```vue
<!-- UserSettings.vue -->
<template>
  <div>
    <h1>User Settings</h1>
    <NavBar />
    <RouterView /> <!-- Default nested view -->
    <RouterView name="helper" /> <!-- Helper nested view -->
  </div>
</template>
```

```js
const routes = [
  {
    path: '/settings',
    component: UserSettings,
    children: [
      {
        path: 'emails',
        component: UserEmailsSubscriptions,
      },
      {
        path: 'profile',
        components: {
          default: UserProfile,
          helper: UserProfilePreview,
        },
      },
    ],
  },
]
```

## Key Points

- Use `name` attribute on `<RouterView>` for named views
- Use `components` (plural) option in route configuration
- Default view uses `default` key or no name
- Combine with nested routes for complex layouts

<!--
Source references:
- https://router.vuejs.org/guide/essentials/named-views.html
-->
