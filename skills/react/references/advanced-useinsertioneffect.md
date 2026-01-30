---
name: useInsertionEffect
description: React Hook for CSS-in-JS libraries to inject styles before layout effects
---

# useInsertionEffect

`useInsertionEffect` allows inserting elements into the DOM before any layout Effects fire. Primarily for CSS-in-JS library authors.

## Usage

```js
import { useInsertionEffect } from 'react';

// Inside your CSS-in-JS library
function useCSS(rule) {
  useInsertionEffect(() => {
    // Inject <style> tags here
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(createStyleElement(rule));
    }
  });
  return rule;
}
```

### Basic structure

```js
useInsertionEffect(setup, dependencies?);
```

Same API as `useEffect`, but runs before layout Effects.

## Key Points

- **For library authors**: Primarily for CSS-in-JS libraries
- **Runs before layout**: Executes before `useLayoutEffect`
- **No state updates**: Can't update state from inside
- **Refs not attached**: Refs may not be attached when it runs

## Common Patterns

### CSS-in-JS style injection

```js
let isInserted = new Set();

function useCSS(rule) {
  useInsertionEffect(() => {
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      const style = document.createElement('style');
      style.textContent = rule;
      document.head.appendChild(style);
    }
  });
  return rule;
}
```

### Cleanup styles

```js
function useCSS(rule) {
  useInsertionEffect(() => {
    const style = document.createElement('style');
    style.textContent = rule;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [rule]);
}
```

## When to use useInsertionEffect

Use `useInsertionEffect` when:
- Building a CSS-in-JS library
- Need to inject styles before layout calculations
- Need to ensure styles are available before `useLayoutEffect`

Prefer `useEffect` or `useLayoutEffect` for:
- Regular component side effects
- DOM measurements
- Most other use cases

## Performance Considerations

- **Runtime injection**: Not recommended for performance
- **Static extraction**: Prefer CSS files for static styles
- **Inline styles**: Use inline styles for dynamic styles

<!--
Source references:
- https://react.dev/reference/react/useInsertionEffect
-->
