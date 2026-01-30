---
name: features-search-params
description: Working with URL search parameters using useSearchParams hook
---

# Search Parameters

Use `useSearchParams` to read and update URL search parameters. Updating search params causes navigation.

## Basic Usage

```tsx
import { useSearchParams } from "react-router";

export function SomeComponent() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Read search params
  const tab = searchParams.get("tab");
  const filter = searchParams.get("filter");
  
  return (
    <div>
      <p>Current tab: {tab}</p>
      <button onClick={() => setSearchParams({ tab: "1" })}>
        Set Tab 1
      </button>
    </div>
  );
}
```

## Updating Search Params

`setSearchParams` accepts multiple formats:

### String

```tsx
setSearchParams("?tab=1");
```

### Object

```tsx
setSearchParams({ tab: "1" });
setSearchParams({ brand: ["nike", "reebok"] }); // Multiple values
```

### Array of Tuples

```tsx
setSearchParams([["tab", "1"]]);
```

### URLSearchParams Object

```tsx
setSearchParams(new URLSearchParams("?tab=1"));
```

### Function Callback

```tsx
setSearchParams((searchParams) => {
  searchParams.set("tab", "2");
  return searchParams;
});
```

**Note:** Function callback doesn't support React's `setState` queueing logic. Multiple calls in the same tick won't build on prior values.

## Default Values

Initialize with default values (doesn't change URL on first render):

```tsx
// String
useSearchParams("?tab=1");

// Object
useSearchParams({ tab: "1" });

// Array
useSearchParams([["tab", "1"]]);

// URLSearchParams
useSearchParams(new URLSearchParams("?tab=1"));
```

## Stable Reference

`searchParams` is a stable reference, safe for `useEffect` dependencies:

```tsx
useEffect(() => {
  console.log(searchParams.get("tab"));
}, [searchParams]);
```

**Warning:** `searchParams` is mutable. Don't modify it directly without calling `setSearchParams`, or URL won't reflect changes.

## Common Patterns

### Filter Component

```tsx
function FilterComponent() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const handleFilterChange = (key: string, value: string) => {
    setSearchParams((prev) => {
      prev.set(key, value);
      return prev;
    });
  };
  
  return (
    <div>
      <select
        value={searchParams.get("category") || ""}
        onChange={(e) => handleFilterChange("category", e.target.value)}
      >
        <option value="">All</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>
    </div>
  );
}
```

### Pagination

```tsx
function Pagination() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  
  const goToPage = (newPage: number) => {
    setSearchParams({ page: String(newPage) });
  };
  
  return (
    <div>
      <button onClick={() => goToPage(page - 1)}>Previous</button>
      <span>Page {page}</span>
      <button onClick={() => goToPage(page + 1)}>Next</button>
    </div>
  );
}
```

## Key Points

- `useSearchParams()` returns `[URLSearchParams, SetURLSearchParams]`
- Updating search params causes navigation
- `searchParams` is stable reference, safe for dependencies
- Don't mutate `searchParams` directly - use `setSearchParams`
- Supports string, object, array, URLSearchParams, or function formats
- Default values don't change URL on first render

<!--
Source references:
- https://api.reactrouter.com/v7/functions/react-router.useSearchParams.html
-->
