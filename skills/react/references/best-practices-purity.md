---
name: Component Purity
description: Rules for keeping React components and hooks pure
---

# Component Purity

Components and Hooks must be pure to work correctly with React's rendering model. Purity means components are idempotent and have no side effects during render.

## What is purity?

A pure component or hook:
- **Idempotent**: Always returns the same output for the same inputs
- **No side effects in render**: Side effects run in event handlers or Effects
- **No mutation of non-local values**: Only mutate locally created values

## Idempotency

Components must return the same output for the same props, state, and context.

### ❌ Not idempotent

```js
function Clock() {
  const time = new Date(); // ❌ Different result every render
  return <span>{time.toLocaleString()}</span>;
}

function Random() {
  const value = Math.random(); // ❌ Different result every render
  return <span>{value}</span>;
}
```

### ✅ Idempotent

```js
function Clock({ time }) {
  return <span>{time.toLocaleString()}</span>;
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  
  return time;
}
```

## Side effects in render

Side effects must not run during render. Move them to event handlers or Effects.

### ❌ Side effect in render

```js
function Component({ product }) {
  document.title = product.title; // ❌ Side effect in render
  return <div>{product.name}</div>;
}
```

### ✅ Side effect in Effect

```js
function Component({ product }) {
  useEffect(() => {
    document.title = product.title; // ✅ Side effect in Effect
  }, [product.title]);
  
  return <div>{product.name}</div>;
}
```

## Mutation

### ✅ Local mutation is fine

```js
function FriendList({ friends }) {
  const items = []; // ✅ Locally created
  for (let friend of friends) {
    items.push(<Friend key={friend.id} friend={friend} />); // ✅ Local mutation
  }
  return <section>{items}</section>;
}
```

### ❌ Non-local mutation

```js
const items = []; // ❌ Created outside component

function FriendList({ friends }) {
  for (let friend of friends) {
    items.push(<Friend key={friend.id} friend={friend} />); // ❌ Mutates non-local
  }
  return <section>{items}</section>;
}
```

## Props and state immutability

Never mutate props or state directly.

### ❌ Mutating props

```js
function Component({ item }) {
  item.url = new URL(item.url, base); // ❌ Mutating props
  return <Link url={item.url}>{item.title}</Link>;
}
```

### ✅ Creating new values

```js
function Component({ item }) {
  const url = new URL(item.url, base); // ✅ New value
  return <Link url={url}>{item.title}</Link>;
}
```

### ❌ Mutating state

```js
function Counter() {
  const [count, setCount] = useState(0);
  
  function handleClick() {
    count = count + 1; // ❌ Mutating state directly
  }
}
```

### ✅ Using setter

```js
function Counter() {
  const [count, setCount] = useState(0);
  
  function handleClick() {
    setCount(count + 1); // ✅ Using setter
  }
}
```

## Render phase vs commit phase

- **Render**: Calculating what UI should look like (must be pure)
- **Commit**: Applying changes to DOM (side effects allowed)

Code at the top level of a component runs during render. Event handlers and Effects run outside render.

```js
function Component() {
  // This runs during render (must be pure)
  const value = computeValue();
  
  // This runs outside render (side effects OK)
  useEffect(() => {
    // Side effect
  }, []);
  
  const handleClick = () => {
    // This runs outside render (side effects OK)
  };
  
  return <div onClick={handleClick}>{value}</div>;
}
```

## Benefits of purity

- **Predictable**: Same inputs = same output
- **Optimizable**: React can skip unnecessary renders
- **Debuggable**: Easier to reason about component behavior
- **Testable**: Pure functions are easier to test

<!--
Source references:
- https://react.dev/reference/rules/components-and-hooks-must-be-pure
-->
