---
name: features-fetchers
description: Using fetchers for concurrent data interactions without navigation
---

# Fetchers

Fetchers enable complex, dynamic UIs with multiple concurrent data interactions without causing navigation. They track independent state and can load data, submit forms, and interact with loaders and actions.

## Creating a Fetcher

```tsx
import { useFetcher } from "react-router";

function SomeComponent() {
  let fetcher = useFetcher();
  
  // Fetcher state
  fetcher.state; // "idle" | "loading" | "submitting"
  fetcher.data; // data returned from action or loader
  fetcher.formData; // FormData being submitted
  
  return (
    <fetcher.Form method="post">
      <input type="text" name="title" />
      <button type="submit">Submit</button>
    </fetcher.Form>
  );
}
```

## Submitting to Actions

Fetchers can submit data to actions without navigation:

```tsx
import { useFetcher, useLoaderData } from "react-router";

export async function clientLoader() {
  let title = localStorage.getItem("title") || "No Title";
  return { title };
}

export async function clientAction({ request }) {
  let data = await request.formData();
  localStorage.setItem("title", data.get("title"));
  return { ok: true };
}

export default function Component() {
  let data = useLoaderData();
  let fetcher = useFetcher();
  
  return (
    <div>
      <h1>{data.title}</h1>
      <fetcher.Form method="post">
        <input type="text" name="title" />
        {fetcher.state !== "idle" && <p>Saving...</p>}
      </fetcher.Form>
    </div>
  );
}
```

## Optimistic UI

Use `fetcher.formData` to render optimistic updates:

```tsx
export default function Component() {
  let data = useLoaderData();
  let fetcher = useFetcher();
  // Use formData if submitting, otherwise use loader data
  let title = fetcher.formData?.get("title") || data.title;

  return (
    <div>
      <h1>{title}</h1>
      <fetcher.Form method="post">
        <input type="text" name="title" />
        {fetcher.state !== "idle" && <p>Saving...</p>}
      </fetcher.Form>
    </div>
  );
}
```

## Error Handling

Access action return data for validation errors:

```tsx
export async function clientAction({ request }) {
  let data = await request.formData();
  let title = data.get("title") as string;
  
  if (title.trim() === "") {
    return { ok: false, error: "Title cannot be empty" };
  }
  
  localStorage.setItem("title", title);
  return { ok: true, error: null };
}

export default function Component() {
  let fetcher = useFetcher();
  
  return (
    <fetcher.Form method="post">
      <input type="text" name="title" />
      {fetcher.data?.error && (
        <p style={{ color: "red" }}>{fetcher.data.error}</p>
      )}
    </fetcher.Form>
  );
}
```

## Loading Data

Fetchers can load data from routes without navigation:

```tsx filename=./search-users.tsx
export async function loader({ request }) {
  let url = new URL(request.url);
  let query = url.searchParams.get("q");
  return users.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase()),
  );
}
```

```tsx
import { useFetcher } from "react-router";
import type { loader } from "./search-users";

export function UserSearchCombobox() {
  let fetcher = useFetcher<typeof loader>();
  
  return (
    <div>
      <fetcher.Form method="get" action="/search-users">
        <input
          type="text"
          name="q"
          onChange={(event) => {
            fetcher.submit(event.currentTarget.form);
          }}
        />
      </fetcher.Form>
      {fetcher.data && (
        <ul style={{
          opacity: fetcher.state === "idle" ? 1 : 0.25,
        }}>
          {fetcher.data.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Programmatic Submission

Submit data imperatively:

```tsx
fetcher.submit(
  { title: "New Title" },
  { action: "/update-task/123", method: "post" },
);

// Or submit a form element
fetcher.submit(formElement, { method: "post" });
```

## Fetcher Keys

Use keys to share fetcher state across components:

```tsx
function SomeComp() {
  let fetcher = useFetcher({ key: "my-key" });
  // ...
}

// Somewhere else
function AnotherComp() {
  // Same fetcher, sharing state
  let fetcher = useFetcher({ key: "my-key" });
  // ...
}
```

## Fetcher Methods

```tsx
fetcher.load("/some/route"); // Load data
fetcher.submit(data, options); // Submit data
fetcher.reset(); // Reset fetcher state
```

## Key Points

- Fetchers enable concurrent data interactions without navigation
- Use `fetcher.Form` for non-navigating form submissions
- Access `fetcher.state` for pending states
- Use `fetcher.formData` for optimistic UI
- Use `fetcher.data` for action return values and errors
- Load data with `fetcher.load()` or `fetcher.Form method="get"`
- Submit imperatively with `fetcher.submit()`
- Share fetchers across components with `key` option

<!--
Source references:
- https://reactrouter.com/how-to/fetchers
- https://api.reactrouter.com/v7/functions/react-router.useFetcher.html
-->
