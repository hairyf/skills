---
name: core-route-module
description: Route module API: component, loader, action, error boundary, headers, meta, and more
---

# Route Module API

Route modules define the behavior of routes in Framework mode. They export functions and components that React Router uses for data loading, rendering, error handling, and more.

## Component (default export)

The default export defines the component that renders when the route matches.

```tsx filename=app/routes/my-route.tsx
import type { Route } from "./+types/my-route";

export default function MyRouteComponent({
  loaderData,
  actionData,
  params,
  matches,
}: Route.ComponentProps) {
  return (
    <div>
      <h1>My Route</h1>
      <p>Loader Data: {JSON.stringify(loaderData)}</p>
      <p>Action Data: {JSON.stringify(actionData)}</p>
      <p>Params: {JSON.stringify(params)}</p>
    </div>
  );
}
```

## Loader

Provides data to the component before rendering. Runs on server for SSR/build.

```tsx
export async function loader({ params }: Route.LoaderArgs) {
  return { message: "Hello, world!" };
}

export default function MyRoute({ loaderData }) {
  return <h1>{loaderData.message}</h1>;
}
```

## ClientLoader

Runs only in the browser. Can call `serverLoader` to get server data.

```tsx
export async function clientLoader({ serverLoader }) {
  const serverData = await serverLoader();
  const clientData = getDataFromClient();
  return { ...serverData, ...clientData };
}
```

Set `hydrate = true` to run during hydration:

```tsx
export async function clientLoader() {
  // ...
}
clientLoader.hydrate = true as const;
```

## Action

Handles data mutations. Runs on server, removed from client bundles.

```tsx
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const title = formData.get("title");
  await updateItem({ title });
  return { ok: true };
}
```

## ClientAction

Runs only in the browser. Takes priority over server action when both exist.

```tsx
export async function clientAction({ serverAction }) {
  invalidateClientCache();
  const data = await serverAction();
  return data;
}
```

## ErrorBoundary

Catches errors from loaders, actions, and components.

```tsx
import { isRouteErrorResponse, useRouteError } from "react-router";

export function ErrorBoundary({
  error,
}: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status} {error.statusText}</h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
```

## HydrateFallback

Renders immediately on initial page load while `clientLoader` runs (when `hydrate = true`).

```tsx
export async function clientLoader() {
  const data = await loadLocalData();
  return data;
}

export function HydrateFallback() {
  return <p>Loading...</p>;
}

export default function Component({ loaderData }) {
  return <Game data={loaderData} />;
}
```

## Headers

Defines HTTP headers sent with server-rendered responses.

```tsx
export function headers() {
  return {
    "X-Custom-Header": "value",
    "Cache-Control": "max-age=300, s-maxage=3600",
  };
}
```

## Links

Defines `<link>` elements for the document `<head>`.

```tsx
export function links() {
  return [
    {
      rel: "icon",
      href: "/favicon.png",
      type: "image/png",
    },
    {
      rel: "stylesheet",
      href: "https://example.com/styles.css",
    },
    {
      rel: "preload",
      href: "/images/banner.jpg",
      as: "image",
    },
  ];
}
```

Render with `<Links />` in root:

```tsx
import { Links } from "react-router";

export default function Root() {
  return (
    <html>
      <head>
        <Links />
      </head>
      <body />
    </html>
  );
}
```

## Meta

Defines meta tags for the document `<head>`. Note: React 19 recommends using built-in `<meta>` elements instead.

```tsx
export function meta() {
  return [
    { title: "Page Title" },
    {
      property: "og:title",
      content: "Page Title",
    },
    {
      name: "description",
      content: "Page description",
    },
  ];
}
```

Render with `<Meta />` in root:

```tsx
import { Meta } from "react-router";

export default function Root() {
  return (
    <html>
      <head>
        <Meta />
      </head>
      <body />
    </html>
  );
}
```

## Handle

Adds custom data to route matches for abstractions like breadcrumbs.

```tsx
export const handle = {
  breadcrumb: "Dashboard",
  icon: "dashboard",
};
```

Access via `useMatches()`:

```tsx
import { useMatches } from "react-router";

function Breadcrumbs() {
  const matches = useMatches();
  return (
    <nav>
      {matches.map((match) => (
        <span key={match.id}>{match.handle?.breadcrumb}</span>
      ))}
    </nav>
  );
}
```

## ShouldRevalidate

Controls revalidation behavior for route loaders.

```tsx
import type { ShouldRevalidateFunctionArgs } from "react-router";

export function shouldRevalidate(
  arg: ShouldRevalidateFunctionArgs,
) {
  // Return false to skip revalidation
  return arg.formMethod !== "get";
}
```

## Middleware

Runs before and after handlers. See [features-middleware](features-middleware.md) for details.

```tsx
export const middleware: Route.MiddlewareFunction[] = [
  async ({ request, context }, next) => {
    console.log(request.method, request.url);
    const response = await next();
    return response;
  },
];
```

## Key Points

- Default export is the route component
- `loader` and `clientLoader` provide data
- `action` and `clientAction` handle mutations
- `ErrorBoundary` catches errors
- `HydrateFallback` renders during hydration
- `headers`, `links`, `meta` configure document head
- `handle` adds custom data to matches
- `shouldRevalidate` controls revalidation
- `middleware` runs before/after handlers

<!--
Source references:
- https://reactrouter.com/start/framework/route-module
- https://api.reactrouter.com/v7/modules/react_router.html
-->
