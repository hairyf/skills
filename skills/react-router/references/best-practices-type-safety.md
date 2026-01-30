---
name: best-practices-type-safety
description: Type safety with Route types, automatic type inference, and type generation
---

# Type Safety

React Router generates types for each route to provide type safety for route module exports. In Framework mode, types are automatically generated and inferred.

## Route Types

Import route-specific types from the generated `+types` directory:

```tsx filename=app/routes/product.tsx
import type { Route } from "./+types/product";

export function loader({ params }: Route.LoaderArgs) {
  // params is typed as { id: string }
  return { planet: `world #${params.id}` };
}

export default function Component({
  loaderData, // Typed as { planet: string }
}: Route.ComponentProps) {
  return <h1>Hello, {loaderData.planet}!</h1>;
}
```

## Generated Types

React Router generates these types for each route:

- `Route.LoaderArgs` - Arguments for `loader` function
- `Route.ClientLoaderArgs` - Arguments for `clientLoader` function
- `Route.ActionArgs` - Arguments for `action` function
- `Route.ClientActionArgs` - Arguments for `clientAction` function
- `Route.ComponentProps` - Props for default component export
- `Route.ErrorBoundaryProps` - Props for `ErrorBoundary` export
- `Route.HydrateFallbackProps` - Props for `HydrateFallback` export

## Type Generation

Types are automatically generated when running `react-router dev`. Manually generate with:

```sh
react-router typegen
```

Watch mode:

```sh
react-router typegen --watch
```

## How It Works

React Router executes your route config (`app/routes.ts`) to determine routes, then generates `+types/<route file>.d.ts` files in `.react-router/types/` directory. With `rootDirs` configured in `tsconfig.json`, TypeScript imports these as if they were next to route modules.

## Using Route Types

### Loader Types

```tsx
import type { Route } from "./+types/product";

export async function loader({ params }: Route.LoaderArgs) {
  // params is typed based on route path
  // e.g., route("products/:id", ...) → { id: string }
  return { product: await getProduct(params.id) };
}
```

### Component Props

```tsx
import type { Route } from "./+types/product";

export default function Product({
  loaderData, // Typed from loader return
  actionData, // Typed from action return
  params, // Typed from route path
  matches, // Typed array of matches
}: Route.ComponentProps) {
  // All props are fully typed
  return <div>{loaderData.product.name}</div>;
}
```

### Action Types

```tsx
import type { Route } from "./+types/product";

export async function action({
  request,
}: Route.ActionArgs) {
  const formData = await request.formData();
  // Return type inferred for actionData
  return { success: true };
}
```

### Error Boundary Types

```tsx
import type { Route } from "./+types/product";

export function ErrorBoundary({
  error, // Typed error
}: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return <div>{error.status} {error.statusText}</div>;
  }
  return <div>Error</div>;
}
```

## Data Mode Type Safety

In Data mode, use generic type parameters with hooks:

```tsx
import { useLoaderData } from "react-router";
import type { loader } from "./product";

export default function Product() {
  let data = useLoaderData<typeof loader>();
  // data is typed from loader return type
}
```

## Type Inference

React Router infers types from:

- Route path patterns → `params` types
- Loader return types → `loaderData` types
- Action return types → `actionData` types
- Route matches → `matches` types

## Key Points

- Types are automatically generated in Framework mode
- Import `Route` type from `./+types/<route-name>`
- All route module exports are type-safe
- `Route.ComponentProps` provides typed props for components
- Use `typeof loader` for Data mode type inference
- Types update automatically when route config changes

<!--
Source references:
- https://reactrouter.com/explanation/type-safety
- https://reactrouter.com/how-to/route-module-type-safety
-->
