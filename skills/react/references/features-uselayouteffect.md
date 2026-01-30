---
name: useLayoutEffect
description: React Hook that fires synchronously before browser repaint
---

# useLayoutEffect

`useLayoutEffect` is a version of `useEffect` that fires synchronously before the browser repaints the screen. Use it when you need to measure layout or perform DOM mutations that must happen before paint.

## Usage

```js
import { useLayoutEffect, useRef, useState } from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);
  
  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
  
  return (
    <div ref={ref} style={{ top: tooltipHeight > 100 ? 'below' : 'above' }}>
      Tooltip content
    </div>
  );
}
```

### Basic structure

```js
useLayoutEffect(setup, dependencies?);
```

Same API as `useEffect`, but runs synchronously before browser paint.

## Key Points

- **Runs before paint**: Executes synchronously before browser repaints
- **Blocks painting**: Can hurt performance if overused
- **Measure layout**: Use for DOM measurements that affect rendering
- **Prefer useEffect**: Use `useEffect` when possible

## Common Patterns

### Measuring layout

```js
function Tooltip({ children, targetRef }) {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  
  useLayoutEffect(() => {
    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    setPosition({
      top: targetRect.bottom + 10,
      left: targetRect.left + (targetRect.width - tooltipRect.width) / 2
    });
  }, [targetRef]);
  
  return (
    <div ref={tooltipRef} style={{ position: 'fixed', ...position }}>
      {children}
    </div>
  );
}
```

### Preventing visual flicker

```js
function Component() {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);
  
  useLayoutEffect(() => {
    // Measure before paint to prevent flicker
    setWidth(ref.current.offsetWidth);
  }, []);
  
  return <div ref={ref} style={{ width: width || 'auto' }}>Content</div>;
}
```

### DOM mutations before paint

```js
function Component() {
  const inputRef = useRef(null);
  
  useLayoutEffect(() => {
    // Focus input before browser paints
    inputRef.current?.focus();
  }, []);
  
  return <input ref={inputRef} />;
}
```

## When to use useLayoutEffect

Use `useLayoutEffect` when:
- You need to measure DOM layout
- You need to mutate DOM before paint
- Visual flicker would occur with `useEffect`

Prefer `useEffect` when:
- Side effects don't affect layout
- You don't need synchronous execution
- Performance is a concern

## Performance Considerations

- **Blocks painting**: Can make app feel slow
- **Use sparingly**: Only when necessary
- **Measure first**: Profile to confirm it's needed

<!--
Source references:
- https://react.dev/reference/react/useLayoutEffect
-->
