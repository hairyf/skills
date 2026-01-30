---
name: features-form-validation
description: Form validation patterns, error handling, and user feedback
---

# Form Validation

Form validation in React Router involves returning validation errors from actions and displaying them in the UI. This guide demonstrates the core mechanics.

## Basic Validation Pattern

### 1. Create Form with Fetcher

Use `useFetcher()` for non-navigating form submissions:

```tsx filename=signup.tsx
import type { Route } from "./+types/signup";
import { useFetcher } from "react-router";

export default function Signup(_: Route.ComponentProps) {
  let fetcher = useFetcher();
  return (
    <fetcher.Form method="post">
      <input type="email" name="email" />
      <input type="password" name="password" />
      <button type="submit">Sign Up</button>
    </fetcher.Form>
  );
}
```

### 2. Define Action with Validation

Return validation errors with a 400 status code:

```tsx
import { redirect, data } from "react-router";

export async function action({
  request,
}: Route.ActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const errors = {};

  if (!email.includes("@")) {
    errors.email = "Invalid email address";
  }

  if (password.length < 12) {
    errors.password = "Password should be at least 12 characters";
  }

  if (Object.keys(errors).length > 0) {
    return data({ errors }, { status: 400 });
  }

  // Success - redirect
  return redirect("/dashboard");
}
```

**Important:** Use `data({ errors }, { status: 400 })` to signal validation errors. Only 2xx status codes trigger page data revalidation, so 400 prevents normal revalidation.

### 3. Display Validation Errors

Access errors from `fetcher.data`:

```tsx
export default function Signup(_: Route.ComponentProps) {
  let fetcher = useFetcher();
  let errors = fetcher.data?.errors;

  return (
    <fetcher.Form method="post">
      <p>
        <input type="email" name="email" />
        {errors?.email ? <em>{errors.email}</em> : null}
      </p>

      <p>
        <input type="password" name="password" />
        {errors?.password ? (
          <em>{errors.password}</em>
        ) : null}
      </p>

      <button type="submit">Sign Up</button>
    </fetcher.Form>
  );
}
```

## Validation Best Practices

### Error Object Structure

Use a consistent error structure:

```tsx
const errors = {
  email: "Invalid email address",
  password: "Password too short",
  _form: "Server error occurred", // General form error
};
```

### Display Form-Level Errors

```tsx
{fetcher.data?.errors?._form && (
  <div className="error">
    {fetcher.data.errors._form}
  </div>
)}
```

### Pending State

Show loading state during submission:

```tsx
<button type="submit" disabled={fetcher.state !== "idle"}>
  {fetcher.state === "idle" ? "Sign Up" : "Submitting..."}
</button>
```

## Key Points

- Return errors with `data({ errors }, { status: 400 })` from actions
- Use 400 status to prevent automatic revalidation
- Access errors via `fetcher.data?.errors` in components
- Display field-specific errors next to inputs
- Show form-level errors separately
- Use `fetcher.state` for pending UI

<!--
Source references:
- https://reactrouter.com/how-to/form-validation
-->
