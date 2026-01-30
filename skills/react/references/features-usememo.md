---
name: useMemo
description: React Hook for caching expensive calculations
---

# useMemo

`useMemo` is a React Hook that lets you cache the result of a calculation between re-renders. Use it to optimize performance by skipping expensive recalculations.

## Usage

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  
  return <ul>{visibleTodos.map(todo => <li key={todo.id}>{todo.text}</li>)}</ul>;
}
```

### Basic structure

```js
const cachedValue = useMemo(calculateValue, dependencies);
```

- `calculateValue`: Pure function that calculates the value (takes no arguments)
- `dependencies`: Array of reactive values used in the calculation

## Key Points

- **Performance optimization only**: Don't rely on `useMemo` for correctness
- **Caches calculation result**: Returns cached value if dependencies haven't changed
- **Pure function required**: Calculation function must be pure
- **React Compiler**: Consider using React Compiler for automatic memoization

## Common Patterns

### Skipping expensive calculations

```js
function ProductList({ products, filter }) {
  const filteredProducts = useMemo(() => {
    return products.filter(p => p.category === filter);
  }, [products, filter]);
  
  return <div>{filteredProducts.map(p => <Product key={p.id} {...p} />)}</div>;
}
```

### Memoizing object creation

```js
function Component({ userId }) {
  const userOptions = useMemo(() => ({
    userId,
    theme: 'dark',
    locale: 'en'
  }), [userId]);
  
  useEffect(() => {
    updateUserSettings(userOptions);
  }, [userOptions]);
}
```

### Memoizing array creation

```js
function Component({ items }) {
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);
  
  return <List items={sortedItems} />;
}
```

### Passing to memoized components

```js
const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  // Expensive rendering
});

function Parent({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  
  return <ExpensiveComponent data={visibleTodos} />;
}
```

## When NOT to use useMemo

- **Simple calculations**: Don't memoize fast operations
- **Everywhere**: Only use when you've identified a performance problem
- **For correctness**: If code breaks without `useMemo`, fix the underlying issue

## Performance Guidelines

1. **Measure first**: Use React DevTools Profiler to identify bottlenecks
2. **Memoize expensive operations**: Only calculations that are noticeably slow
3. **Dependencies rarely change**: More benefit when dependencies are stable
4. **Used as dependency**: When the memoized value is used in other hooks

<!--
Source references:
- https://react.dev/reference/react/useMemo
-->
