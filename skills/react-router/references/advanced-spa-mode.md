---
name: advanced-spa-mode
description: Single Page App mode with SSR disabled and client-side routing
---

# SPA Mode

SPA Mode disables runtime server rendering and generates a single `index.html` file that hydrates as a Single Page Application.

## Enable SPA Mode

Set `ssr: false` in `react-router.config.ts`:

```ts filename=react-router.config.ts
import { type Config } from "@react-router/dev/config";

export default {
  ssr: false,
} satisfies Config;
```

This disables runtime server rendering but still server-renders the root route at build time to generate `index.html`.

## HydrateFallback

Add `HydrateFallback` to root route for loading UI:

```tsx filename=root.tsx
import LoadingScreen from "./components/loading-screen";

export function Layout() {
  return <html>{/*...*/}</html>;
}

export function HydrateFallback() {
  return <LoadingScreen />;
}

export default function App() {
  return <Outlet />;
}
```

## Root Loader

Use a `loader` on root route (runs at build time):

```tsx filename=root.tsx
import { Route } from "./+types/root";

export async function loader() {
  return {
    version: await getVersion(),
  };
}

export function HydrateFallback({
  loaderData,
}: Route.ComponentProps) {
  return (
    <div>
      <h1>Loading version {loaderData.version}...</h1>
      <AwesomeSpinner />
    </div>
  );
}
```

**Note:** Only root route can have a `loader` in SPA mode (unless pre-rendering other routes).

## Client Loaders and Actions

Use `clientLoader` and `clientAction` for route data:

```tsx filename=some-route.tsx
import { Route } from "./+types/some-route";

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  let data = await fetch(`/some/api/stuff/${params.id}`);
  return data;
}

export async function clientAction({
  request,
}: Route.ClientActionArgs) {
  let formData = await request.formData();
  return await processPayment(formData);
}
```

## Deployment

After `react-router build`, deploy `build/client` directory to a static host.

Configure host to serve `index.html` for all routes:

### _redirects file

```
/*    /index.html   200
```

### sirv-cli

```sh
sirv-cli build/client --single index.html
```

## SPA vs Pre-rendering

- **SPA Mode** (`ssr: false` without `prerender`): Single HTML file, client-side routing only
- **Pre-rendering** (`ssr: false` with `prerender`): Multiple pre-rendered HTML files + SPA fallback

## Key Points

- Set `ssr: false` to enable SPA mode
- Root route is server-rendered at build time
- Only root route can have `loader` (unless pre-rendering)
- Use `clientLoader` and `clientAction` for route data
- Add `HydrateFallback` for loading UI
- Configure host to serve `index.html` for all routes
- Routes must be SSR-safe (no `window`, etc.) even with `ssr: false`

<!--
Source references:
- https://reactrouter.com/how-to/spa
-->
