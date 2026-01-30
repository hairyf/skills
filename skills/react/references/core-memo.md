---
name: memo
description: React higher-order component for memoizing component renders
---

# memo

`memo` lets you skip re-rendering a component when its props are unchanged. It's a performance optimization that compares props using shallow equality.

## Usage

```js
import { memo } from 'react';

const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});
```

### Basic structure

```js
const MemoizedComponent = memo(Component, arePropsEqual?);
```

- `Component`: Component to memoize
- `arePropsEqual`: Optional custom comparison function

## Key Points

- **Shallow comparison**: By default, compares props using `Object.is`
- **Performance optimization**: Not a guarantee - React may still re-render
- **State/context changes**: Component still re-renders if its own state or context changes
- **React Compiler**: Consider using React Compiler for automatic memoization

## Common Patterns

### Basic memoization

```js
const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  // Expensive rendering logic
  return <div>{/* complex UI */}</div>;
});
```

### With useCallback

```js
const Child = memo(function Child({ onClick }) {
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const handleClick = useCallback(() => {
    // ...
  }, []);
  
  return <Child onClick={handleClick} />;
}
```

### Custom comparison

```js
const Component = memo(
  function Component({ items }) {
    return <div>{items.map(item => <Item key={item.id} {...item} />)}</div>;
  },
  (prevProps, nextProps) => {
    // Custom comparison logic
    return prevProps.items.length === nextProps.items.length;
  }
);
```

### With TypeScript

```ts
interface Props {
  name: string;
  age: number;
}

const Component = memo(function Component({ name, age }: Props) {
  return <div>{name} is {age}</div>;
});
```

## When to use memo

Use `memo` when:
- Component renders frequently with same props
- Component is expensive to render
- Parent re-renders often but props don't change

Don't use `memo` when:
- Component always receives new props
- Component is cheap to render
- Premature optimization without profiling

## Limitations

- **Shallow comparison**: Only compares props, not nested objects
- **Function props**: New function references cause re-renders (use `useCallback`)
- **Object props**: New object references cause re-renders (use `useMemo`)

<!--
Source references:
- https://react.dev/reference/react/memo
-->
