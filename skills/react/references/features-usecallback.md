---
name: useCallback
description: React Hook for caching function definitions
---

# useCallback

`useCallback` is a React Hook that lets you cache a function definition between re-renders. Use it to prevent child components from re-rendering unnecessarily when passing functions as props.

## Usage

```js
import { useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  
  return <ShippingForm onSubmit={handleSubmit} />;
}
```

### Basic structure

```js
const cachedFn = useCallback(fn, dependencies);
```

- `fn`: Function definition to cache
- `dependencies`: Array of reactive values used inside the function

## Key Points

- **Caches function reference**: Returns same function if dependencies haven't changed
- **Performance optimization only**: Don't rely on `useCallback` for correctness
- **Stable function identity**: Useful when passing functions to memoized components
- **React Compiler**: Consider using React Compiler for automatic memoization

## Common Patterns

### Preventing child re-renders

```js
const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // Expensive component
});

function ProductPage({ productId, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', orderDetails);
  }, [productId]);
  
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

### Passing to useEffect

```js
function ChatRoom({ roomId }) {
  const createConnection = useCallback(() => {
    return new Connection(roomId);
  }, [roomId]);
  
  useEffect(() => {
    const connection = createConnection();
    return () => connection.disconnect();
  }, [createConnection]);
}
```

### Custom hook dependencies

```js
function useData(url) {
  const [data, setData] = useState(null);
  
  const fetchData = useCallback(async () => {
    const response = await fetch(url);
    setData(await response.json());
  }, [url]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return data;
}
```

## When NOT to use useCallback

- **Simple functions**: Don't wrap every function
- **Not passed as prop**: If function isn't passed to memoized components
- **Dependencies change often**: Less benefit if dependencies change frequently
- **For correctness**: If code breaks without `useCallback`, fix the underlying issue

## Differences from useMemo

- `useCallback` caches the **function itself**
- `useMemo` caches the **result** of calling the function

```js
// useCallback - caches function
const fn = useCallback(() => doSomething(a, b), [a, b]);

// useMemo - caches result
const result = useMemo(() => doSomething(a, b), [a, b]);
```

<!--
Source references:
- https://react.dev/reference/react/useCallback
-->
