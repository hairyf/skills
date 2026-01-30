---
name: useReducer
description: React Hook for managing complex state with a reducer function
---

# useReducer

`useReducer` is a React Hook that lets you add a reducer to your component. It's useful for managing complex state logic that involves multiple sub-values or when the next state depends on the previous one.

## Usage

```js
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error('Unknown action');
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  
  return (
    <>
      <button onClick={() => dispatch({ type: 'increment' })}>
        +
      </button>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'decrement' })}>
        -
      </button>
    </>
  );
}
```

### Basic structure

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?);
```

- `reducer`: Function that takes `(state, action)` and returns the next state
- `initialArg`: Initial state value
- `init`: Optional initializer function `(initialArg) => initialState`

### Reducer function

The reducer must be pure and return the next state:

```js
function reducer(state, action) {
  // Calculate and return next state
  return nextState;
}
```

### Dispatch function

Call `dispatch` with an action object to update state:

```js
dispatch({ type: 'increment', payload: 5 });
```

## Key Points

- **Predictable updates**: All state updates go through the reducer
- **Complex state**: Better than `useState` when state has multiple sub-values
- **Stable dispatch**: `dispatch` function has stable identity (safe to omit from dependencies)
- **Batching**: React batches multiple dispatches in event handlers

## Common Patterns

### Simple counter

```js
function reducer(state, action) {
  return { count: state.count + action.payload };
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  
  return (
    <button onClick={() => dispatch({ type: 'add', payload: 1 })}>
      {state.count}
    </button>
  );
}
```

### Form state

```js
function formReducer(state, action) {
  switch (action.type) {
    case 'change':
      return { ...state, [action.field]: action.value };
    case 'reset':
      return { name: '', email: '' };
    default:
      return state;
  }
}

function Form() {
  const [state, dispatch] = useReducer(formReducer, { name: '', email: '' });
  
  return (
    <form>
      <input
        value={state.name}
        onChange={(e) => dispatch({
          type: 'change',
          field: 'name',
          value: e.target.value
        })}
      />
    </form>
  );
}
```

### Lazy initialization

```js
function init(initialCount) {
  return { count: initialCount };
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'reset':
      return init(action.payload);
    default:
      return state;
  }
}

function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  // ...
}
```

### With TypeScript

```ts
type State = { count: number };
type Action = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset'; payload: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: action.payload };
    default:
      return state;
  }
}
```

## When to use useReducer vs useState

Use `useReducer` when:
- State has multiple sub-values
- Next state depends on previous state
- Complex state update logic
- You want predictable state updates

Use `useState` when:
- Simple state values
- Independent state updates
- Straightforward update logic

<!--
Source references:
- https://react.dev/reference/react/useReducer
-->
