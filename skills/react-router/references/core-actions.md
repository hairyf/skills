---
name: core-actions
description: Data mutations with actions and clientActions in route modules
---

# Actions

Route actions handle data mutations. When an action completes, all loader data on the page is automatically revalidated to keep the UI in sync.

## Server Actions

`action` runs only on the server and is removed from client bundles.

```tsx filename=app/project.tsx
import type { Route } from "./+types/project";
import { Form } from "react-router";
import { fakeDb } from "../db";

export async function action({
  request,
}: Route.ActionArgs) {
  let formData = await request.formData();
  let title = formData.get("title");
  let project = await fakeDb.updateProject({ title });
  return project;
}

export default function Project({
  actionData,
}: Route.ComponentProps) {
  return (
    <div>
      <h1>Project</h1>
      <Form method="post">
        <input type="text" name="title" />
        <button type="submit">Submit</button>
      </Form>
      {actionData ? (
        <p>{actionData.title} updated</p>
      ) : null}
    </div>
  );
}
```

## Client Actions

`clientAction` runs only in the browser and takes priority over server action when both are defined.

```tsx filename=app/project.tsx
import type { Route } from "./+types/project";
import { Form } from "react-router";
import { someApi } from "./api";

export async function clientAction({
  request,
}: Route.ClientActionArgs) {
  let formData = await request.formData();
  let title = formData.get("title");
  let project = await someApi.updateProject({ title });
  return project;
}

export default function Project({
  actionData,
}: Route.ComponentProps) {
  return (
    <div>
      <h1>Project</h1>
      <Form method="post">
        <input type="text" name="title" />
        <button type="submit">Submit</button>
      </Form>
      {actionData ? (
        <p>{actionData.title} updated</p>
      ) : null}
    </div>
  );
}
```

## Calling Actions

### With Form Component

```tsx
import { Form } from "react-router";

function SomeComponent() {
  return (
    <Form action="/projects/123" method="post">
      <input type="text" name="title" />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

This causes navigation and adds a browser history entry.

### With useSubmit

Submit form data imperatively:

```tsx
import { useSubmit } from "react-router";

function useQuizTimer() {
  let submit = useSubmit();

  let cb = useCallback(() => {
    submit(
      { quizTimedOut: true },
      { action: "/end-quiz", method: "post" },
    );
  }, []);

  useTimer(tenMinutes, cb);
}
```

### With Fetcher

Fetchers allow submitting without navigation (no history entry):

```tsx
import { useFetcher } from "react-router";

function Task() {
  let fetcher = useFetcher();
  let busy = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post" action="/update-task/123">
      <input type="text" name="title" />
      <button type="submit">
        {busy ? "Saving..." : "Save"}
      </button>
    </fetcher.Form>
  );
}
```

Or imperatively:

```tsx
fetcher.submit(
  { title: "New Title" },
  { action: "/update-task/123", method: "post" },
);
```

## Action Parameters

Actions receive a context object with:

- `request`: Request object with formData, headers, etc.
- `params`: Route parameters from the URL
- `context`: Custom context from middleware
- `serverAction`: Call the server action from `clientAction`

## Accessing Action Data

In Framework mode, use `Route.ComponentProps`:

```tsx
export default function Component({
  actionData,
}: Route.ComponentProps) {
  // actionData is automatically typed
}
```

In Data mode, use `useActionData()`:

```tsx
import { useActionData } from "react-router";

export default function Component() {
  let actionData = useActionData<typeof action>();
}
```

## Automatic Revalidation

After an action completes, all loaders on the page are automatically revalidated. This keeps your UI in sync without manual cache invalidation.

## Key Points

- `action` runs on server, removed from client bundles
- `clientAction` runs in browser, takes priority over server action
- Actions are called via `<Form>`, `useSubmit()`, or `fetcher.submit()`
- Action data is available via `actionData` prop or `useActionData()` hook
- All loaders revalidate automatically after action completes
- Use fetchers for non-navigating submissions

<!--
Source references:
- https://reactrouter.com/start/framework/actions
- https://reactrouter.com/start/data/actions
- https://api.reactrouter.com/v7/functions/react-router.useActionData.html
- https://api.reactrouter.com/v7/functions/react-router.useSubmit.html
-->
