---
name: useDebugValue
description: React Hook for adding labels to custom hooks in React DevTools
---

# useDebugValue

`useDebugValue` is a React Hook that lets you add a label to a custom Hook in React DevTools. Improves debugging experience for custom hooks.

## Usage

```js
import { useDebugValue, useState } from 'react';

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useDebugValue(isOnline ? 'Online' : 'Offline');
  
  return isOnline;
}
```

### Basic structure

```js
useDebugValue(value, format?);
```

- `value`: Value to display in DevTools
- `format`: Optional formatting function

## Key Points

- **DevTools only**: Only affects React DevTools display
- **Custom hooks**: Use in custom hooks, not components
- **Optional formatting**: Can provide formatting function
- **No production impact**: Doesn't affect production builds

## Common Patterns

### Simple debug value

```js
function useCounter(initialValue) {
  const [count, setCount] = useState(initialValue);
  
  useDebugValue(count);
  
  return [count, setCount];
}
```

### Formatted debug value

```js
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useDebugValue(
    { data, loading },
    (value) => `${value.loading ? 'Loading' : 'Loaded'}: ${value.data?.length || 0} items`
  );
  
  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [url]);
  
  return { data, loading };
}
```

### Conditional formatting

```js
function useAuth() {
  const [user, setUser] = useState(null);
  
  useDebugValue(
    user,
    (user) => user ? `Logged in as ${user.name}` : 'Not logged in'
  );
  
  return { user, setUser };
}
```

## When to use useDebugValue

Use `useDebugValue` when:
- Building custom hooks
- Hook state is complex
- Want better DevTools experience
- Debugging hook behavior

Don't use `useDebugValue` when:
- Hook is simple and self-explanatory
- Value is obvious from hook name
- Not building reusable hooks

## Best Practices

- **Custom hooks only**: Use in custom hooks, not components
- **Meaningful labels**: Provide clear, descriptive labels
- **Format complex values**: Use formatter for complex objects
- **Optional**: Not required, but improves DX

<!--
Source references:
- https://react.dev/reference/react/useDebugValue
-->
