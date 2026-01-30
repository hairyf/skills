---
name: core-hooks
description: Essential React Router hooks: useNavigation, useLocation, useParams, useMatches, and more
---

# Core Hooks

React Router provides hooks for accessing routing state, navigation, and route data.

## useNavigation

Returns current navigation state for pending UI:

```tsx
import { useNavigation } from "react-router";

function SomeComponent() {
  let navigation = useNavigation();
  
  navigation.state; // "idle" | "loading" | "submitting"
  navigation.formData; // FormData from form submission
  navigation.formAction; // Action URL
  navigation.formMethod; // "get" | "post" | "put" | "patch" | "delete"
  
  return (
    <div>
      {navigation.state !== "idle" && <Spinner />}
    </div>
  );
}
```

## useLocation

Returns current location object:

```tsx
import { useLocation } from "react-router";

function SomeComponent() {
  let location = useLocation();
  
  location.pathname; // "/users/123"
  location.search; // "?tab=profile"
  location.hash; // "#section"
  location.state; // Navigation state
  location.key; // Unique key for this location
  
  return <div>Current path: {location.pathname}</div>;
}
```

## useParams

Returns route parameters from URL:

```tsx
import { useParams } from "react-router";

// Route: /users/:userId/posts/:postId
function Post() {
  let params = useParams();
  
  params.userId; // "123"
  params.postId; // "456"
  
  return <div>User {params.userId}, Post {params.postId}</div>;
}
```

## useMatches

Returns array of all matched routes:

```tsx
import { useMatches } from "react-router";

function Breadcrumbs() {
  let matches = useMatches();
  
  return (
    <nav>
      {matches.map((match) => (
        <span key={match.id}>
          {match.handle?.breadcrumb || match.pathname}
        </span>
      ))}
    </nav>
  );
}
```

Each match includes:
- `id` - Route ID
- `pathname` - Matched pathname
- `params` - Route parameters
- `data` - Loader data
- `handle` - Custom handle data

## useLoaderData

Returns loader data from closest route:

```tsx
import { useLoaderData } from "react-router";

export async function loader() {
  return { user: await getUser() };
}

export default function Component() {
  let data = useLoaderData<typeof loader>();
  return <div>{data.user.name}</div>;
}
```

## useActionData

Returns action data from closest route:

```tsx
import { useActionData } from "react-router";

export async function action() {
  return { success: true };
}

export default function Component() {
  let actionData = useActionData<typeof action>();
  return actionData?.success ? <div>Success!</div> : null;
}
```

## useRouteLoaderData

Get loader data from a specific route by ID:

```tsx
import { useRouteLoaderData } from "react-router";

function SomeComponent() {
  let rootData = useRouteLoaderData("root");
  return <div>{rootData.user.name}</div>;
}
```

## useOutletContext

Pass context to child routes via `<Outlet>`:

```tsx
// Parent route
function Dashboard() {
  let [theme, setTheme] = useState("light");
  return (
    <div>
      <Outlet context={{ theme, setTheme }} />
    </div>
  );
}

// Child route
function Settings() {
  let { theme, setTheme } = useOutletContext();
  return <div>Current theme: {theme}</div>;
}
```

## useSearchParams

Read and update URL search parameters:

```tsx
import { useSearchParams } from "react-router";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("filter");
  
  return (
    <select
      value={filter || ""}
      onChange={(e) => setSearchParams({ filter: e.target.value })}
    >
      <option value="">All</option>
      <option value="active">Active</option>
    </select>
  );
}
```

## useNavigate

Imperative navigation (use sparingly):

```tsx
import { useNavigate } from "react-router";

function SomeComponent() {
  let navigate = useNavigate();
  
  return (
    <button onClick={() => navigate("/users")}>
      Go to Users
    </button>
  );
}
```

## Key Points

- `useNavigation()` - Navigation state for pending UI
- `useLocation()` - Current location object
- `useParams()` - Route parameters from URL
- `useMatches()` - All matched routes
- `useLoaderData()` - Loader data from closest route
- `useActionData()` - Action data from closest route
- `useRouteLoaderData(id)` - Loader data from specific route
- `useOutletContext()` - Context from parent `<Outlet>`
- `useSearchParams()` - Read/update URL search params
- `useNavigate()` - Imperative navigation

<!--
Source references:
- https://api.reactrouter.com/v7/functions/react-router.useNavigation.html
- https://api.reactrouter.com/v7/functions/react-router.useLocation.html
- https://api.reactrouter.com/v7/functions/react-router.useParams.html
- https://api.reactrouter.com/v7/functions/react-router.useMatches.html
-->
