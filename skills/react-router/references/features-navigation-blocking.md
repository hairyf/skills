---
name: features-navigation-blocking
description: Blocking navigation with useBlocker for unsaved form data
---

# Navigation Blocking

Use `useBlocker` to prevent navigation when users have unsaved changes, like a form with dirty state.

## Basic Setup

### 1. Create Form Route

```tsx filename=routes/contact.tsx
import { useFetcher } from "react-router";
import type { Route } from "./+types/contact";

export async function action({
  request,
}: Route.ActionArgs) {
  let formData = await request.formData();
  let email = formData.get("email");
  let message = formData.get("message");
  console.log(email, message);
  return { ok: true };
}

export default function Contact() {
  let fetcher = useFetcher();

  return (
    <fetcher.Form method="post">
      <input name="email" type="email" />
      <textarea name="message" />
      <button type="submit">
        {fetcher.state === "idle" ? "Send" : "Sending..."}
      </button>
    </fetcher.Form>
  );
}
```

### 2. Track Dirty State

```tsx
import { useState } from "react";

export default function Contact() {
  let [isDirty, setIsDirty] = useState(false);
  let fetcher = useFetcher();

  return (
    <fetcher.Form
      method="post"
      onChange={(event) => {
        let email = event.currentTarget.email.value;
        let message = event.currentTarget.message.value;
        setIsDirty(Boolean(email || message));
      }}
    >
      {/* form fields */}
    </fetcher.Form>
  );
}
```

### 3. Block Navigation

```tsx
import { useBlocker } from "react-router";
import { useCallback } from "react";

export default function Contact() {
  let [isDirty, setIsDirty] = useState(false);
  let fetcher = useFetcher();
  let blocker = useBlocker(
    useCallback(() => isDirty, [isDirty]),
  );

  // ...
}
```

### 4. Show Confirmation UI

```tsx
export default function Contact() {
  let [isDirty, setIsDirty] = useState(false);
  let fetcher = useFetcher();
  let blocker = useBlocker(
    useCallback(() => isDirty, [isDirty]),
  );

  return (
    <fetcher.Form method="post" onChange={...}>
      {/* form fields */}

      {blocker.state === "blocked" && (
        <div>
          <p>Wait! You didn't send the message yet:</p>
          <p>
            <button
              type="button"
              onClick={() => blocker.proceed()}
            >
              Leave
            </button>{" "}
            <button
              type="button"
              onClick={() => blocker.reset()}
            >
              Stay here
            </button>
          </p>
        </div>
      )}
    </fetcher.Form>
  );
}
```

## Reset Blocker After Submission

Reset blocker when action resolves:

```tsx
import { useEffect } from "react";

useEffect(() => {
  if (fetcher.data?.ok) {
    if (blocker.state === "blocked") {
      blocker.reset();
    }
  }
}, [fetcher.data]);
```

## Proceed After Submission

Alternatively, proceed with blocked navigation after successful submission:

```tsx
useEffect(() => {
  if (fetcher.data?.ok) {
    if (blocker.state === "blocked") {
      blocker.proceed(); // Navigate to blocked route
    } else {
      formRef.current?.reset();
    }
  }
}, [fetcher.data]);
```

## Blocker API

```tsx
let blocker = useBlocker(shouldBlock);

// Blocker state
blocker.state; // "unblocked" | "blocked" | "proceeding"

// Methods
blocker.proceed(); // Continue with blocked navigation
blocker.reset(); // Cancel blocker, stay on current page
```

## Key Points

- Use `useBlocker()` with a callback that returns boolean
- Block navigation when form has unsaved changes
- Show confirmation UI when `blocker.state === "blocked"`
- Call `blocker.proceed()` to continue navigation
- Call `blocker.reset()` to cancel and stay
- Reset blocker after successful form submission
- Can proceed with navigation after submission if desired

<!--
Source references:
- https://reactrouter.com/how-to/navigation-blocking
- https://api.reactrouter.com/v7/functions/react-router.useBlocker.html
-->
