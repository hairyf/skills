---
name: core-navigation
description: Navigation components and hooks: Link, NavLink, Form, useNavigate, redirect
---

# Navigation

React Router provides multiple ways to navigate between routes: declarative components, imperative hooks, and programmatic redirects.

## NavLink

`<NavLink>` provides active and pending states for navigation links.

```tsx
import { NavLink } from "react-router";

export function Navigation() {
  return (
    <nav>
      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/trending" end>Trending</NavLink>
      <NavLink to="/concerts">All Concerts</NavLink>
    </nav>
  );
}
```

### Active States

NavLink automatically applies CSS classes for different states:

```css
a.active {
  color: red;
}

a.pending {
  animation: pulse 1s infinite;
}

a.transitioning {
  /* CSS transition is running */
}
```

### Callback Props

Use callback functions for custom styling or conditional rendering:

```tsx
<NavLink
  to="/messages"
  className={({ isActive, isPending, isTransitioning }) =>
    [
      isPending ? "pending" : "",
      isActive ? "active" : "",
      isTransitioning ? "transitioning" : "",
    ].join(" ")
  }
>
  Messages
</NavLink>

<NavLink
  to="/tasks"
  style={({ isActive, isPending }) => ({
    fontWeight: isActive ? "bold" : "",
    color: isPending ? "red" : "black",
  })}
>
  Tasks
</NavLink>

<NavLink to="/items">
  {({ isActive }) => (
    <span className={isActive ? "active" : ""}>Items</span>
  )}
</NavLink>
```

## Link

Use `<Link>` for navigation links that don't need active styling.

```tsx
import { Link } from "react-router";

export function LoggedOutMessage() {
  return (
    <p>
      You've been logged out.{" "}
      <Link to="/login">Login again</Link>
    </p>
  );
}
```

## Form Navigation

`<Form>` can navigate with URL search params or submit data to actions.

### Navigation with Search Params

```tsx
import { Form } from "react-router";

<Form action="/search">
  <input type="text" name="q" />
  <button type="submit">Search</button>
</Form>
```

Submitting with "journey" navigates to `/search?q=journey`.

### Form Submission

Forms with `method="post"` submit data as `FormData` to route actions:

```tsx
<Form method="post" action="/projects/123">
  <input type="text" name="title" />
  <button type="submit">Submit</button>
</Form>
```

This causes navigation and adds a history entry. For non-navigating submissions, use `useFetcher()`.

## redirect

Return `redirect()` from loaders or actions to navigate programmatically.

```tsx
import { redirect } from "react-router";

export async function loader({ request }) {
  let user = await getUser(request);
  if (!user) {
    return redirect("/login");
  }
  return { userName: user.name };
}
```

Common pattern: redirect after creating a record:

```tsx
export async function action({ request }) {
  let formData = await request.formData();
  let project = await createProject(formData);
  return redirect(`/projects/${project.id}`);
}
```

## useNavigate

Imperative navigation hook. Use sparingly - prefer declarative APIs when possible.

```tsx
import { useNavigate } from "react-router";

export function useLogoutAfterInactivity() {
  let navigate = useNavigate();

  useInactivityHook(() => {
    navigate("/logout");
  });
}
```

**Reserve for:**
- Non-user-initiated navigation (timeouts, inactivity)
- Programmatic navigation without user interaction

### Navigate Options

```tsx
navigate("/path"); // push to history
navigate("/path", { replace: true }); // replace history entry
navigate(-1); // go back
navigate(1); // go forward
navigate("/path", { state: { key: "value" } }); // with state
```

## Key Points

- `<NavLink>` for links with active/pending states
- `<Link>` for simple navigation links
- `<Form>` for search params or action submissions
- `redirect()` in loaders/actions for server-side redirects
- `useNavigate()` for imperative navigation (use sparingly)
- Prefer declarative navigation over imperative when possible

<!--
Source references:
- https://reactrouter.com/start/framework/navigating
- https://reactrouter.com/start/declarative/navigating
- https://api.reactrouter.com/v7/functions/react-router.useNavigate.html
-->
