---
name: useId
description: React Hook for generating unique IDs for accessibility
---

# useId

`useId` is a React Hook for generating unique IDs that can be passed to accessibility attributes. Use it to associate form labels with inputs, descriptions with elements, etc.

## Usage

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  
  return (
    <>
      <input
        type="password"
        aria-describedby={passwordHintId}
      />
      <p id={passwordHintId}>
        Password must be at least 8 characters
      </p>
    </>
  );
}
```

### Basic structure

```js
const id = useId();
```

Returns a unique ID string associated with this component instance.

## Key Points

- **Unique per instance**: Each component instance gets a unique ID
- **Stable**: ID remains stable across re-renders
- **Accessibility**: Designed for accessibility attributes
- **Not for keys**: Don't use for list keys or cache keys

## Common Patterns

### Form labels and inputs

```js
function FormField({ label, type }) {
  const id = useId();
  
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} />
    </>
  );
}
```

### ARIA describedby

```js
function InputWithHint({ hint }) {
  const hintId = useId();
  
  return (
    <>
      <input aria-describedby={hintId} />
      <span id={hintId}>{hint}</span>
    </>
  );
}
```

### Multiple IDs

```js
function Component() {
  const labelId = useId();
  const descriptionId = useId();
  const errorId = useId();
  
  return (
    <div>
      <label id={labelId}>Name</label>
      <input aria-labelledby={labelId} aria-describedby={descriptionId} />
      <span id={descriptionId}>Enter your full name</span>
      <span id={errorId} role="alert">Error message</span>
    </div>
  );
}
```

## When NOT to use useId

### ❌ Don't use for list keys

```js
// ❌ Bad
function List({ items }) {
  return items.map(item => {
    const id = useId();
    return <Item key={id} item={item} />;
  });
}

// ✅ Good: Use data for keys
function List({ items }) {
  return items.map(item => (
    <Item key={item.id} item={item} />
  ));
}
```

### ❌ Don't use for cache keys

```js
// ❌ Bad
function Component() {
  const cacheKey = useId();
  const data = useMemo(() => fetchData(), [cacheKey]);
}

// ✅ Good: Use data for cache keys
function Component({ userId }) {
  const data = useMemo(() => fetchData(userId), [userId]);
}
```

## Best Practices

- **One ID per use case**: Create separate IDs for different purposes
- **Accessibility first**: Use for ARIA attributes and form associations
- **Stable IDs**: IDs remain stable, making them perfect for accessibility

<!--
Source references:
- https://react.dev/reference/react/useId
-->
