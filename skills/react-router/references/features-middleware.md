---
name: features-middleware
description: Middleware for authentication, logging, and request processing
---

# Middleware

Middleware runs code before and after Response generation for matched paths. It enables common patterns like authentication, logging, error handling, and data preprocessing in a reusable way.

## Middleware Chain

Middleware runs in a nested chain: parent → child on the way down, then child → parent on the way up.

```text
- Root middleware start
  - Parent middleware start
    - Child middleware start
      - Run loaders, generate HTML Response
    - Child middleware end
  - Parent middleware end
- Root middleware end
```

## Framework Mode Setup

### 1. Enable Middleware Flag

```ts filename=react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  future: {
    v8_middleware: true,
  },
} satisfies Config;
```

### 2. Create Context

Middleware uses type-safe context for passing data:

```ts filename=app/context.ts
import { createContext } from "react-router";
import type { User } from "~/types";

export const userContext = createContext<User | null>(null);
```

### 3. Export Middleware

```tsx filename=app/routes/dashboard.tsx
import { redirect } from "react-router";
import { userContext } from "~/context";

// Server middleware
async function authMiddleware({ request, context }) {
  const user = await getUserFromSession(request);
  if (!user) {
    throw redirect("/login");
  }
  context.set(userContext, user);
}

export const middleware: Route.MiddlewareFunction[] = [
  authMiddleware,
];

// Client middleware
async function timingMiddleware({ context }, next) {
  const start = performance.now();
  await next();
  const duration = performance.now() - start;
  console.log(`Navigation took ${duration}ms`);
}

export const clientMiddleware: Route.ClientMiddlewareFunction[] =
  [timingMiddleware];

export async function loader({
  context,
}: Route.LoaderArgs) {
  const user = context.get(userContext);
  const profile = await getProfile(user);
  return { profile };
}
```

## Data Mode Setup

```tsx
import { createContext } from "react-router";

const userContext = createContext<User | null>(null);

const routes = [
  {
    path: "/",
    middleware: [timingMiddleware],
    Component: Root,
    children: [
      {
        path: "profile",
        middleware: [authMiddleware],
        loader: profileLoader,
        Component: Profile,
      },
    ],
  },
];

async function authMiddleware({ context }) {
  const user = await getUser();
  if (!user) {
    throw redirect("/login");
  }
  context.set(userContext, user);
}
```

## Server vs Client Middleware

### Server Middleware

Runs on server for HTML document requests and `.data` requests. Returns HTTP `Response`:

```ts
async function serverMiddleware({ request }, next) {
  console.log(request.method, request.url);
  let response = await next();
  console.log(response.status);
  return response;
}

export const middleware: Route.MiddlewareFunction[] = [
  serverMiddleware,
];
```

### Client Middleware

Runs in browser for client-side navigations. No `Response` to return:

```ts
async function clientMiddleware({ request }, next) {
  console.log(request.method, request.url);
  await next(); // No return value needed
}

export const clientMiddleware: Route.ClientMiddlewareFunction[] =
  [clientMiddleware];
```

## When Middleware Runs

### Server Middleware

- Document requests (`GET /route`): Always runs (even without loaders)
- Data requests (`GET /route.data`): Only runs if loaders/actions exist

To force middleware on every navigation, add a `loader`:

```tsx
export const middleware: Route.MiddlewareFunction[] = [
  authMiddleware,
];

// Forces middleware to run on every navigation
export async function loader() {
  return null;
}
```

### Client Middleware

Runs on every client navigation, regardless of loaders.

## Context API

Use `createContext` for type-safe context:

```ts
import { createContext } from "react-router";

const userContext = createContext<User>();

// In middleware
context.set(userContext, user); // Type-safe

// In loaders/actions
const user = context.get(userContext); // Returns User type
```

## Common Patterns

### Authentication

```tsx
async function authMiddleware({ request, context }) {
  const session = await getSession(request);
  const userId = session.get("userId");
  
  if (!userId) {
    throw redirect("/login");
  }
  
  const user = await getUserById(userId);
  context.set(userContext, user);
}
```

### Logging

```tsx
async function loggingMiddleware({ request, context }, next) {
  const requestId = crypto.randomUUID();
  context.set(requestIdContext, requestId);
  
  console.log(`[${requestId}] ${request.method} ${request.url}`);
  
  const start = performance.now();
  const response = await next();
  const duration = performance.now() - start;
  
  console.log(`[${requestId}] Response ${response.status} (${duration}ms)`);
  
  return response;
}
```

### Response Headers

```tsx
async function headersMiddleware({ context }, next) {
  const response = await next();
  
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  
  return response;
}
```

## Key Points

- Middleware runs before and after handlers in nested chain
- Use `createContext()` for type-safe context
- Server middleware returns `Response`, client middleware doesn't
- Server middleware only runs on document/data requests with handlers
- Client middleware runs on every navigation
- Use `context.set()` and `context.get()` for type-safe data passing
- Can skip `next()` if no post-processing needed

<!--
Source references:
- https://reactrouter.com/how-to/middleware
- https://api.reactrouter.com/v7/functions/react-router.createContext.html
-->
