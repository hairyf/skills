---
name: core-data-loading
description: Loading data with loaders and clientLoaders in route modules
---

# Data Loading

Route modules provide data to components through `loader` (server) and `clientLoader` (browser) functions. Loader data is automatically serialized and deserialized, supporting primitives, promises, maps, sets, dates, and more.

## Server Loaders

`loader` runs on the server for SSR and during build for pre-rendering. It's removed from client bundles.

```tsx filename=app/product.tsx
import type { Route } from "./+types/product";
import { fakeDb } from "../db";

export async function loader({ params }: Route.LoaderArgs) {
  const product = await fakeDb.getProduct(params.pid);
  return product;
}

export default function Product({
  loaderData,
}: Route.ComponentProps) {
  const { name, description } = loaderData;
  return (
    <div>
      <h1>{name}</h1>
      <p>{description}</p>
    </div>
  );
}
```

## Client Loaders

`clientLoader` runs only in the browser. Useful for client-only data fetching.

```tsx filename=app/product.tsx
import type { Route } from "./+types/product";

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  const res = await fetch(`/api/products/${params.pid}`);
  const product = await res.json();
  return product;
}

// HydrateFallback renders while client loader runs
export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function Product({
  loaderData,
}: Route.ComponentProps) {
  const { name, description } = loaderData;
  return (
    <div>
      <h1>{name}</h1>
      <p>{description}</p>
    </div>
  );
}
```

## Using Both Loaders

Use `loader` for SSR and `clientLoader` for client navigations. The `loader` runs on initial SSR, then `clientLoader` runs on subsequent navigations.

```tsx filename=app/product.tsx
export async function loader({ params }: Route.LoaderArgs) {
  return fakeDb.getProduct(params.pid);
}

export async function clientLoader({
  serverLoader,
  params,
}: Route.ClientLoaderArgs) {
  const res = await fetch(`/api/products/${params.pid}`);
  const serverData = await serverLoader();
  return { ...serverData, ...res.json() };
}
```

## Hydration

Force `clientLoader` to run during hydration by setting `hydrate = true`:

```tsx
export async function clientLoader() {
  // ...
}
clientLoader.hydrate = true as const; // `as const` for type inference

export function HydrateFallback() {
  return <div>Loading...</div>;
}
```

## Static Data Loading

For pre-rendering, loaders fetch data during the build. Specify URLs in `react-router.config.ts`:

```ts filename=react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  async prerender() {
    let products = await readProductsFromCSVFile();
    return products.map(
      (product) => `/products/${product.id}`,
    );
  },
} satisfies Config;
```

## Loader Parameters

Loaders receive a context object with:

- `params`: Route parameters from the URL
- `request`: Request object (URL, headers, etc.)
- `context`: Custom context from middleware
- `serverLoader`: Call the server loader from `clientLoader`

## Accessing Loader Data

In Framework mode, use `Route.ComponentProps`:

```tsx
export default function Component({
  loaderData,
}: Route.ComponentProps) {
  // loaderData is automatically typed
}
```

In Data mode, use `useLoaderData()`:

```tsx
import { useLoaderData } from "react-router";

export default function Component() {
  let data = useLoaderData<typeof loader>();
}
```

## Key Points

- `loader` runs on server (SSR/build), removed from client bundles
- `clientLoader` runs in browser only
- Both can be used together for hybrid approaches
- Set `clientLoader.hydrate = true` to run during hydration
- Loader data is automatically serialized/deserialized
- Type safety is automatic in Framework mode via `Route.ComponentProps`

<!--
Source references:
- https://reactrouter.com/start/framework/data-loading
- https://reactrouter.com/start/data/data-loading
- https://api.reactrouter.com/v7/functions/react-router.useLoaderData.html
-->
