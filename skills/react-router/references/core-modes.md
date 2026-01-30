---
name: core-modes
description: Understanding React Router's three modes: Framework, Data, and Declarative
---

# React Router Modes

React Router is a multi-strategy router for React that supports three primary modes, each offering different levels of features and architectural control.

## Three Modes

### Declarative Mode

Basic routing features: URL matching, navigation, and active states. Uses `<BrowserRouter>` with declarative `<Routes>` and `<Route>` components.

```tsx
import { BrowserRouter } from "react-router";

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

**Use when:**
- You want the simplest possible setup
- Coming from React Router v6 and happy with `<BrowserRouter>`
- You have your own data layer that handles pending states
- Coming from Create React App

### Data Mode

Adds data loading, actions, pending states, and more. Uses `createBrowserRouter` with route configuration outside React rendering.

```tsx
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

let router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    loader: loadRootData,
  },
]);

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />,
);
```

**Use when:**
- You want data features but also want control over bundling and server abstractions
- You started a data router in v6.4 and are happy with it

### Framework Mode

Full React Router experience with Vite plugin: type-safe `href`, Route Module API, intelligent code splitting, SPA/SSR/SSG strategies.

```ts filename=routes.ts
import { index, route } from "@react-router/dev/routes";

export default [
  index("./home.tsx"),
  route("products/:pid", "./product.tsx"),
];
```

```tsx filename=product.tsx
import { Route } from "./+types/product.tsx";

export async function loader({ params }: Route.LoaderArgs) {
  let product = await getProduct(params.pid);
  return { product };
}

export default function Product({
  loaderData,
}: Route.ComponentProps) {
  return <div>{loaderData.product.name}</div>;
}
```

**Use when:**
- You're new and want the full framework experience
- Considering Next.js, Solid Start, SvelteKit, etc. and want to compare
- Coming from Remix (React Router v7 is the "next version" after Remix v2)
- Migrating from Next.js

## Mode Decision

The mode depends on which "top level" router API you're using. Features are additive - moving from Declarative → Data → Framework adds more features at the cost of architectural control.

Every mode supports any architecture and deployment target (SPA, SSR, etc.), so the question is about how much you want to do yourself vs. how much help you want from React Router.

## Key Points

- **Declarative**: Basic routing with `<BrowserRouter>`, `<Routes>`, `<Route>`
- **Data**: Route configuration with `createBrowserRouter`, loaders, actions
- **Framework**: File-based routes with Route Module API, type safety, code splitting
- Features are cumulative - Framework includes all Data features, Data includes all Declarative features
- All modes support SPA, SSR, and static rendering strategies

<!--
Source references:
- https://reactrouter.com/start/modes
- https://reactrouter.com/start/declarative/installation
- https://reactrouter.com/start/data/installation
- https://reactrouter.com/start/framework/installation
-->
