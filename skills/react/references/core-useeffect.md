---
name: useEffect
description: React Hook for synchronizing components with external systems
---

# useEffect

`useEffect` is a React Hook that lets you synchronize a component with an external system. Use it for side effects like data fetching, subscriptions, or manually changing the DOM.

## Usage

```js
import { useEffect } from 'react';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
}
```

### Basic structure

```js
useEffect(setup, dependencies?)
```

- `setup`: Function with your effect's logic, optionally returns a cleanup function
- `dependencies`: Array of reactive values (props, state, variables) used inside the effect

### Dependencies

- **With dependencies**: Effect runs when dependencies change
- **Empty array `[]`**: Effect runs only once after mount
- **No dependencies**: Effect runs after every render

```js
// Runs when roomId changes
useEffect(() => {
  // ...
}, [roomId]);

// Runs only once after mount
useEffect(() => {
  // ...
}, []);

// Runs after every render (usually avoid this)
useEffect(() => {
  // ...
});
```

### Cleanup function

Return a cleanup function to clean up subscriptions, timers, or other resources:

```js
useEffect(() => {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  
  return () => {
    clearInterval(intervalId);
  };
}, []);
```

## Key Points

- Effects run **after** the browser paints the screen (use `useLayoutEffect` if you need to measure layout)
- Effects **only run on the client** - they don't run during server rendering
- In Strict Mode, React runs setup+cleanup twice in development to detect missing cleanup
- Effects are an **escape hatch** - if you're not synchronizing with an external system, you might not need an Effect

## Common Patterns

### Fetching data

```js
useEffect(() => {
  let cancelled = false;
  
  async function fetchData() {
    const response = await fetch(`/api/user/${userId}`);
    const data = await response.json();
    if (!cancelled) {
      setUser(data);
    }
  }
  
  fetchData();
  
  return () => {
    cancelled = true;
  };
}, [userId]);
```

### Subscribing to events

```js
useEffect(() => {
  function handleScroll() {
    // ...
  }
  
  window.addEventListener('scroll', handleScroll);
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);
```

### Updating document title

```js
useEffect(() => {
  document.title = `${count} items`;
}, [count]);
```

### Controlling non-React widgets

```js
useEffect(() => {
  const map = new MapWidget(containerRef.current);
  map.setZoomLevel(zoomLevel);
  
  return () => {
    map.destroy();
  };
}, [zoomLevel]);
```

## Avoiding Common Mistakes

### Missing dependencies

```js
// ❌ Bad: missing 'userId' dependency
useEffect(() => {
  fetchUser(userId);
}, []);

// ✅ Good: includes all dependencies
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

### Infinite loops

```js
// ❌ Bad: creates new object every render
useEffect(() => {
  setOptions({ ...options, color: 'red' });
}, [options]);

// ✅ Good: use updater function
useEffect(() => {
  setOptions(prev => ({ ...prev, color: 'red' }));
}, []);
```

### Reading latest props/state

```js
// If you need the latest value without re-running effect
useEffect(() => {
  const id = setInterval(() => {
    setCount(c => c + 1); // Uses updater function
  }, 1000);
  
  return () => clearInterval(id);
}, []); // Empty deps - effect doesn't re-run
```

<!--
Source references:
- https://react.dev/reference/react/useEffect
-->
