---
name: useImperativeHandle
description: React Hook for customizing ref handles exposed to parent components
---

# useImperativeHandle

`useImperativeHandle` lets you customize the ref handle exposed to parent components. Use it to expose specific methods instead of the entire DOM node.

## Usage

```js
import { useImperativeHandle, useRef } from 'react';

function MyInput({ ref }) {
  const inputRef = useRef(null);
  
  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current?.focus();
      },
      scrollIntoView() {
        inputRef.current?.scrollIntoView();
      }
    };
  }, []);
  
  return <input ref={inputRef} />;
}
```

### Basic structure

```js
useImperativeHandle(ref, createHandle, dependencies?);
```

- `ref`: Ref received from parent (via `forwardRef` or as prop in React 19+)
- `createHandle`: Function returning the handle to expose
- `dependencies`: Optional dependency array

## Key Points

- **Custom handle**: Expose only specific methods, not entire DOM node
- **Rarely needed**: Most cases don't need this hook
- **React 19**: `ref` available as prop, no `forwardRef` needed
- **Imperative**: Breaks React's declarative paradigm

## Common Patterns

### Exposing specific methods

```js
function MyInput({ ref }) {
  const inputRef = useRef(null);
  
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => {
      inputRef.current.value = '';
      inputRef.current.focus();
    },
    getValue: () => inputRef.current?.value
  }), []);
  
  return <input ref={inputRef} />;
}
```

### With forwardRef (React 18)

```js
import { forwardRef, useImperativeHandle, useRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);
  
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus()
  }), []);
  
  return <input ref={inputRef} />;
});
```

### Scrolling to element

```js
function ScrollableList({ ref }) {
  const listRef = useRef(null);
  
  useImperativeHandle(ref, () => ({
    scrollToItem: (index) => {
      const item = listRef.current.children[index];
      item?.scrollIntoView({ behavior: 'smooth' });
    }
  }), []);
  
  return <div ref={listRef}>{/* items */}</div>;
}
```

## When to use useImperativeHandle

Use `useImperativeHandle` when:
- Parent needs to call specific methods on child
- You want to hide internal implementation
- Building reusable component libraries

Prefer regular refs when:
- Parent just needs DOM node access
- Standard DOM methods are sufficient
- Following React's declarative patterns

## Best Practices

- **Minimal API**: Expose only necessary methods
- **Document behavior**: Clearly document exposed methods
- **Avoid overuse**: Most cases don't need this hook
- **TypeScript**: Use TypeScript for type-safe ref handles

<!--
Source references:
- https://react.dev/reference/react/useImperativeHandle
-->
