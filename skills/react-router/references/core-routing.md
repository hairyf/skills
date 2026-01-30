---
name: core-routing
description: Route configuration, path patterns, nested routes, and route matching
---

# Routing Configuration

Routes define how URLs map to components and data loading functions. React Router supports multiple routing strategies depending on the mode.

## Framework Mode Routing

Routes are configured in `app/routes.ts` with URL patterns and file paths to route modules.

```ts filename=app/routes.ts
import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("./home.tsx"),
  route("about", "./about.tsx"),

  layout("./auth/layout.tsx", [
    route("login", "./auth/login.tsx"),
    route("register", "./auth/register.tsx"),
  ]),

  ...prefix("concerts", [
    index("./concerts/home.tsx"),
    route(":city", "./concerts/city.tsx"),
    route("trending", "./concerts/trending.tsx"),
  ]),
] satisfies RouteConfig;
```

## Declarative Mode Routing

Routes are configured with JSX using `<Routes>` and `<Route>` components.

```tsx
import { BrowserRouter, Routes, Route } from "react-router";

<BrowserRouter>
  <Routes>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    
    <Route element={<AuthLayout />}>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Route>
  </Routes>
</BrowserRouter>
```

## Path Patterns

### Dynamic Segments

Use `:` prefix to create dynamic segments that capture URL values.

```ts
route("teams/:teamId", "./team.tsx")
```

```tsx
// Access via Route.ComponentProps or useParams()
export default function Team({ params }: Route.ComponentProps) {
  // params.teamId is a string
}
```

### Optional Segments

Add `?` to make segments optional.

```ts
route(":lang?/categories", "./categories.tsx")
route("users/:userId/edit?", "./user.tsx")
```

### Splats (Catchall)

Use `/*` to match any remaining path segments.

```ts
route("files/*", "./files.tsx")
```

```tsx
export default function Files({ params }: Route.ComponentProps) {
  const { "*": splat } = params; // remaining path after "files/"
}
```

### Catchall Route

Use `*` alone to catch unmatched routes.

```ts
route("*", "./catchall.tsx")
```

## Nested Routes

Child routes are nested inside parent routes and render through `<Outlet />`.

```ts filename=app/routes.ts
route("dashboard", "./dashboard.tsx", [
  index("./home.tsx"),
  route("settings", "./settings.tsx"),
])
```

```tsx filename=app/dashboard.tsx
import { Outlet } from "react-router";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet /> {/* Renders child routes */}
    </div>
  );
}
```

## Layout Routes

Layout routes create nesting without adding URL segments. Use `layout()` in Framework mode or `<Route element={...}>` without `path` in Declarative mode.

```ts
layout("./marketing/layout.tsx", [
  index("./marketing/home.tsx"),
  route("contact", "./marketing/contact.tsx"),
])
```

## Index Routes

Index routes render at the parent's URL into the parent's `<Outlet />`.

```ts
route("dashboard", "./dashboard.tsx", [
  index("./dashboard-home.tsx"), // renders at /dashboard
  route("settings", "./dashboard-settings.tsx"),
])
```

## Route Prefixes

Use `prefix()` to add a path prefix to multiple routes without creating a parent route.

```ts
...prefix("projects", [
  index("./projects/home.tsx"),
  route(":pid", "./projects/project.tsx"),
])
```

This is equivalent to:

```ts
route("projects/home", "./projects/home.tsx"),
route("projects/:pid", "./projects/project.tsx"),
```

## Component Routes

You can also use `<Routes>` and `<Route>` components anywhere in the component tree for component-level routing (doesn't participate in data loading or code splitting).

```tsx
function Wizard() {
  return (
    <div>
      <Routes>
        <Route index element={<StepOne />} />
        <Route path="step-2" element={<StepTwo />} />
        <Route path="step-3" element={<StepThree />} />
      </Routes>
    </div>
  );
}
```

## Key Points

- Framework mode uses `routes.ts` with route configuration functions
- Declarative mode uses JSX `<Routes>` and `<Route>` components
- Dynamic segments use `:param` syntax
- Optional segments use `:param?` syntax
- Splats use `/*` to match remaining path
- Nested routes render through parent's `<Outlet />`
- Layout routes create nesting without URL segments
- Index routes render at parent URL

<!--
Source references:
- https://reactrouter.com/start/framework/routing
- https://reactrouter.com/start/declarative/routing
- https://reactrouter.com/start/data/routing
-->
