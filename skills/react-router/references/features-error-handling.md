---
name: features-error-handling
description: Error boundaries, error handling, and error responses
---

# Error Handling

Route modules automatically catch errors and render the closest `ErrorBoundary`. Error boundaries are for unexpected errors, not form validation or error reporting.

## Root Error Boundary

All applications should export a root error boundary handling three cases:

1. Thrown `data()` with status code
2. Error instances with stack traces
3. Randomly thrown values

### Framework Mode

In Framework mode, errors are passed as props:

```tsx filename=root.tsx
import { Route } from "./+types/root";
import { isRouteErrorResponse } from "react-router";

export function ErrorBoundary({
  error,
}: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
```

### Data Mode

In Data mode, use `useRouteError()` hook:

```tsx
import { useRouteError, isRouteErrorResponse } from "react-router";

let router = createBrowserRouter([
  {
    path: "/",
    ErrorBoundary: RootErrorBoundary,
    Component: Root,
  },
]);

function RootErrorBoundary() {
  let error = useRouteError();
  
  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
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

## Throwing Errors

### Throwing Data Responses

Throw `data()` with status codes for intentional errors like 404s:

```tsx
import { data } from "react-router";

export async function loader({ params }) {
  let record = await fakeDb.getRecord(params.id);
  if (!record) {
    throw data("Record Not Found", { status: 404 });
  }
  return record;
}
```

This renders the `isRouteErrorResponse` branch in the error boundary.

### Throwing Errors

Unintentional errors (bugs) throw Error instances:

```tsx
export async function loader() {
  return undefined(); // This will throw an Error
}
```

This renders the `instanceof Error` branch in the error boundary.

## Nested Error Boundaries

Errors bubble up to the closest error boundary in the route tree.

### Framework Mode

```tsx filename="routes.ts"
route("/app", "app.tsx", [ // ✅ has error boundary
  route("invoices", "invoices.tsx", [ // ❌ no error boundary
    route("invoices/:id", "invoice-page.tsx", [ // ✅ has error boundary
      route("payments", "payments.tsx"), // ❌ no error boundary
    ]),
  ]),
]);
```

| Error Origin | Rendered Boundary |
|--------------|-------------------|
| app.tsx | app.tsx |
| invoices.tsx | app.tsx |
| invoice-page.tsx | invoice-page.tsx |
| payments.tsx | invoice-page.tsx |

### Data Mode

```tsx
let router = createBrowserRouter([
  {
    path: "/app",
    Component: App,
    ErrorBoundary: AppErrorBoundary, // ✅
    children: [
      {
        path: "invoices",
        Component: Invoices, // ❌
        children: [
          {
            path: ":id",
            Component: Invoice,
            ErrorBoundary: InvoiceErrorBoundary, // ✅
            children: [
              {
                path: "payments",
                Component: Payments, // ❌
              },
            ],
          },
        ],
      },
    ],
  },
]);
```

## Error Sanitization

In Framework mode production builds, server errors are automatically sanitized before being sent to the browser to prevent leaking sensitive information (like stack traces).

A thrown `Error` will have a generic message and no stack trace in production. The original error remains untouched on the server.

Data sent with `throw data(yourData)` is not sanitized as it's intended to be rendered.

## What Errors Are Caught

Error boundaries catch errors from:
- Loaders
- Actions
- Components
- Headers
- Links
- Meta functions

## Key Points

- Export `ErrorBoundary` in route modules to catch errors
- Use `isRouteErrorResponse()` to check for thrown data responses
- Throw `data()` with status codes for intentional errors (404, etc.)
- Errors bubble to closest error boundary in route tree
- Server errors are sanitized in production builds
- Error boundaries are for unexpected errors, not form validation

<!--
Source references:
- https://reactrouter.com/how-to/error-boundary
- https://api.reactrouter.com/v7/functions/react-router.useRouteError.html
- https://api.reactrouter.com/v7/functions/react-router.isRouteErrorResponse.html
-->
