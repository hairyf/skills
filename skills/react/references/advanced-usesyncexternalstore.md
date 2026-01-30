---
name: useSyncExternalStore
description: React Hook for subscribing to external stores
---

# useSyncExternalStore

`useSyncExternalStore` is a React Hook that lets you subscribe to an external store. Use it to integrate with third-party state management libraries or browser APIs.

## Usage

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(
    todosStore.subscribe,
    todosStore.getSnapshot
  );
  
  return <div>{todos.map(todo => <Todo key={todo.id} {...todo} />)}</div>;
}
```

### Basic structure

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?);
```

- `subscribe`: Function that subscribes to store changes
- `getSnapshot`: Function that returns current store snapshot
- `getServerSnapshot`: Optional function for server rendering

## Key Points

- **External stores**: Integrates with non-React state management
- **Immutable snapshots**: `getSnapshot` must return immutable values
- **Server rendering**: Requires `getServerSnapshot` for SSR
- **Synchronous**: Store mutations trigger synchronous updates

## Common Patterns

### Subscribing to external store

```js
function createStore(initialState) {
  let state = initialState;
  let listeners = new Set();
  
  return {
    getSnapshot: () => state,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setState: (newState) => {
      state = newState;
      listeners.forEach(listener => listener());
    }
  };
}

const store = createStore({ count: 0 });

function Component() {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  return <div>{state.count}</div>;
}
```

### Browser API integration

```js
function useOnlineStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    },
    () => navigator.onLine
  );
}
```

### With server snapshot

```js
function Component() {
  const data = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    () => store.getServerSnapshot() // For SSR
  );
  
  return <div>{data}</div>;
}
```

## Best Practices

- **Immutable snapshots**: Always return new objects/arrays when data changes
- **Stable subscribe**: Declare `subscribe` outside component to avoid re-subscribing
- **Server snapshot**: Provide `getServerSnapshot` for SSR compatibility
- **Don't suspend**: Avoid suspending based on store values

<!--
Source references:
- https://react.dev/reference/react/useSyncExternalStore
-->
