---
name: advanced-streaming
description: Streaming with Suspense, deferring non-critical data, and React Suspense integration
---

# Streaming with Suspense

Streaming with React Suspense speeds up initial renders by deferring non-critical data and unblocking UI rendering. React Router supports Suspense by returning promises from loaders and actions.

## Basic Streaming

Return promises from loaders instead of awaiting them:

```tsx
import type { Route } from "./+types/my-route";

export async function loader({}: Route.LoaderArgs) {
  // Non-critical data - return promise, don't await
  let nonCriticalData = new Promise((res) =>
    setTimeout(() => res("non-critical"), 5000),
  );

  // Critical data - await before returning
  let criticalData = await new Promise((res) =>
    setTimeout(() => res("critical"), 300),
  );

  return { nonCriticalData, criticalData };
}
```

**Note:** You can't return a single promise, it must be an object with keys.

## Rendering with Await

Use `<Await>` component to await promises and trigger Suspense:

```tsx
import * as React from "react";
import { Await } from "react-router";

export default function MyComponent({
  loaderData,
}: Route.ComponentProps) {
  let { criticalData, nonCriticalData } = loaderData;

  return (
    <div>
      <h1>Streaming example</h1>
      <h2>Critical data: {criticalData}</h2>

      <React.Suspense fallback={<div>Loading...</div>}>
        <Await resolve={nonCriticalData}>
          {(value) => <h3>Non critical: {value}</h3>}
        </Await>
      </React.Suspense>
    </div>
  );
}
```

## React 19 Support

With React 19, use `React.use()` instead of `<Await>`:

```tsx
<React.Suspense fallback={<div>Loading...</div>}>
  <NonCriticalUI p={nonCriticalData} />
</React.Suspense>

function NonCriticalUI({ p }: { p: Promise<string> }) {
  let value = React.use(p);
  return <h3>Non critical: {value}</h3>;
}
```

## Error Handling

Handle promise rejections with error boundaries or `Await` errorElement:

```tsx
<React.Suspense fallback={<div>Loading...</div>}>
  <Await
    resolve={nonCriticalData}
    errorElement={<div>Error loading data</div>}
  >
    {(value) => <h3>Non critical: {value}</h3>}
  </Await>
</React.Suspense>
```

## Stream Timeout

By default, loaders and actions reject outstanding promises after 4950ms. Control this in `entry.server.tsx`:

```ts filename=entry.server.tsx
// Reject all pending promises after 10 seconds
export const streamTimeout = 10_000;
```

## Multiple Promises

Return multiple promises for different parts of the UI:

```tsx
export async function loader() {
  return {
    user: await getUser(), // Critical
    posts: getPosts(), // Promise
    comments: getComments(), // Promise
  };
}

export default function Component({ loaderData }) {
  return (
    <div>
      <h1>{loaderData.user.name}</h1>
      
      <React.Suspense fallback={<div>Loading posts...</div>}>
        <Await resolve={loaderData.posts}>
          {(posts) => <PostsList posts={posts} />}
        </Await>
      </React.Suspense>
      
      <React.Suspense fallback={<div>Loading comments...</div>}>
        <Await resolve={loaderData.comments}>
          {(comments) => <CommentsList comments={comments} />}
        </Await>
      </React.Suspense>
    </div>
  );
}
```

## Key Points

- Return promises from loaders to enable streaming
- Use `<Await>` component to await promises
- Wrap `<Await>` in `<Suspense>` for fallback UI
- Promises must be returned as object properties, not directly
- Use `streamTimeout` to control promise rejection timeout
- React 19 supports `React.use()` for promise handling

<!--
Source references:
- https://reactrouter.com/how-to/suspense
- https://api.reactrouter.com/v7/functions/react-router.Await.html
-->
