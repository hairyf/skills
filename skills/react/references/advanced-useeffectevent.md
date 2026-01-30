---
name: useEffectEvent
description: React Hook for extracting non-reactive logic from Effects
---

# useEffectEvent

`useEffectEvent` lets you extract non-reactive logic from Effects into reusable Effect Events. Helps avoid unnecessary Effect re-runs while accessing latest values.

## Usage

```js
import { useEffectEvent, useEffect } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.on('connected', onConnected);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // theme not in deps, but always reads latest value
}
```

### Basic structure

```js
const eventHandler = useEffectEvent(callback);
```

- `callback`: Function with non-reactive logic
- Returns: Event handler function for use in Effects

## Key Points

- **Non-reactive**: Doesn't cause Effect to re-run when values change
- **Latest values**: Always accesses latest props/state
- **Effect only**: Should only be called inside Effects
- **Not dependency shortcut**: Don't use to avoid dependencies

## Common Patterns

### Reading latest props without re-running

```js
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;
  
  const onNavigate = useEffectEvent((visitedUrl) => {
    logVisit(visitedUrl, numberOfItems);
  });
  
  useEffect(() => {
    onNavigate(url);
  }, [url]); // Effect runs when url changes, but always reads latest numberOfItems
}
```

### Separating events from effects

```js
function ChatRoom({ roomId, theme }) {
  const onMessage = useEffectEvent((message) => {
    showNotification(message, theme);
  });
  
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.on('message', onMessage);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // Effect doesn't re-run when theme changes
}
```

### Avoiding stale closures

```js
function Component({ userId }) {
  const [count, setCount] = useState(0);
  
  const onUpdate = useEffectEvent(() => {
    // Always reads latest count, even if Effect doesn't re-run
    console.log(`Count is ${count}`);
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1);
      onUpdate();
    }, 1000);
    return () => clearInterval(interval);
  }, []); // Effect runs once, but onUpdate always reads latest count
}
```

## When to use useEffectEvent

Use `useEffectEvent` when:
- Need to read latest values without re-running Effect
- Separating event handlers from Effect logic
- Avoiding stale closures in Effects
- Non-reactive logic in Effects

Don't use `useEffectEvent` when:
- Values should trigger Effect re-runs
- Trying to avoid dependencies (use proper deps instead)
- Logic is reactive and should be in dependency array

## Best Practices

- **Effect only**: Only call inside Effects
- **Latest values**: Use when you need latest values without re-running
- **Not for dependencies**: Don't use to avoid dependency arrays
- **Clear naming**: Name Effect Events clearly (e.g., `onConnected`, `onMessage`)

<!--
Source references:
- https://react.dev/reference/react/useEffectEvent
-->
