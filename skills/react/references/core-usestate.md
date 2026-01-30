---
name: useState
description: React Hook for managing component state
---

# useState

`useState` is a React Hook that lets you add state to your component. It returns a state variable and a setter function to update it.

## Usage

```js
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### Initial state

You can pass an initial value directly or use a function for lazy initialization:

```js
// Direct value
const [name, setName] = useState('Taylor');

// Lazy initialization (function runs only once)
const [todos, setTodos] = useState(() => createTodos());
```

### Updating state

Use the setter function to update state. You can pass a new value or an updater function:

```js
// Direct value
setCount(count + 1);

// Updater function (recommended when using previous state)
setCount(prevCount => prevCount + 1);
```

### Multiple state variables

Declare multiple state variables separately:

```js
function Form() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState('');
  // ...
}
```

## Key Points

- State updates are **batched** - React batches multiple state updates in event handlers
- State updates are **asynchronous** - reading state immediately after `setState` returns the old value
- State is **immutable** - never mutate state directly, always use the setter function
- State is **local** - each component instance has its own state
- In Strict Mode, React calls initializer/updater functions twice in development to detect impurities

## Common Patterns

### Updating objects in state

```js
const [person, setPerson] = useState({ name: 'Taylor', age: 28 });

// Create a new object
setPerson({ ...person, age: 29 });

// Or use updater function
setPerson(prev => ({ ...prev, age: 29 }));
```

### Updating arrays in state

```js
const [items, setItems] = useState(['apple', 'banana']);

// Add item
setItems([...items, 'orange']);

// Remove item
setItems(items.filter(item => item !== 'banana'));

// Update item
setItems(items.map(item => 
  item === 'apple' ? 'pear' : item
));
```

### Avoiding recreating initial state

Use a function for expensive initializations:

```js
// ❌ Bad: runs on every render
const [todos, setTodos] = useState(createTodos());

// ✅ Good: runs only once
const [todos, setTodos] = useState(() => createTodos());
```

<!--
Source references:
- https://react.dev/reference/react/useState
-->
