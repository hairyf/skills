---
name: useRef
description: React Hook for referencing values that don't trigger re-renders
---

# useRef

`useRef` is a React Hook that lets you reference a value that's not needed for rendering. Unlike state, changing a ref doesn't trigger a re-render.

## Usage

```js
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(null);
  
  function handleStart() {
    intervalRef.current = setInterval(() => {
      // ...
    }, 1000);
  }
  
  function handleStop() {
    clearInterval(intervalRef.current);
  }
  
  // ...
}
```

### Basic structure

```js
const ref = useRef(initialValue);
```

Returns an object with a `current` property:
- Initially set to `initialValue`
- Can be mutated without causing re-renders
- Persists between renders

## Key Points

- **Mutable**: You can mutate `ref.current` directly
- **No re-renders**: Changing `ref.current` doesn't trigger re-renders
- **Persistent**: Ref object persists across renders
- **Don't read/write during render**: Except for initialization

## Common Use Cases

### Storing timeout/interval IDs

```js
function Timer() {
  const intervalRef = useRef(null);
  
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      // ...
    }, 1000);
    
    return () => clearInterval(intervalRef.current);
  }, []);
}
```

### Storing previous values

```js
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

### Avoiding recreating objects

```js
function Component() {
  // ❌ Bad: new object every render
  const options = { enabled: true };
  
  // ✅ Good: same object every render
  const optionsRef = useRef({ enabled: true });
  const options = optionsRef.current;
}
```

### DOM references

```js
function Input() {
  const inputRef = useRef(null);
  
  function handleFocus() {
    inputRef.current?.focus();
  }
  
  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleFocus}>Focus</button>
    </>
  );
}
```

### Storing mutable values

```js
function Component() {
  const countRef = useRef(0);
  
  function handleClick() {
    countRef.current += 1;
    console.log(countRef.current); // No re-render
  }
  
  return <button onClick={handleClick}>Click</button>;
}
```

## Differences from useState

| Feature | useRef | useState |
|---------|--------|----------|
| Triggers re-render | ❌ No | ✅ Yes |
| Mutable | ✅ Yes | ❌ No (use setter) |
| Initial value | Direct | Direct or function |
| Returns | `{ current: value }` | `[value, setter]` |

## Rules

- **Don't read/write `ref.current` during render** (except initialization)
- Use refs for values that don't affect rendering
- Use state for values that should trigger re-renders

<!--
Source references:
- https://react.dev/reference/react/useRef
-->
