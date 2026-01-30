---
name: useDeferredValue
description: React Hook for deferring non-critical UI updates
---

# useDeferredValue

`useDeferredValue` is a React Hook that lets you defer updating a part of the UI. It's useful for keeping the interface responsive while showing stale content.

## Usage

```js
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  
  return (
    <>
      <SearchInput value={query} onChange={setQuery} />
      <SearchResults query={deferredQuery} />
    </>
  );
}
```

### Basic structure

```js
const deferredValue = useDeferredValue(value, initialValue?);
```

- `value`: The value to defer
- `initialValue`: Optional initial value for first render
- Returns: Deferred version of the value

## Key Points

- **Shows stale content**: Displays old value while new value loads
- **Interruptible**: Background updates can be interrupted
- **Integrated with Suspense**: Works seamlessly with Suspense boundaries
- **No fixed delay**: Updates as soon as React finishes rendering

## Common Patterns

### Deferring expensive updates

```js
function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  
  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Suspense fallback={<ResultsSkeleton />}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

### With initial value

```js
function Component() {
  const [value, setValue] = useState('');
  const deferredValue = useDeferredValue(value, 'initial');
  
  // First render: deferredValue is 'initial'
  // Subsequent renders: deferredValue lags behind value
}
```

### Deferring object updates

```js
function Component() {
  const [options, setOptions] = useState({ filter: '', sort: 'name' });
  
  // ✅ Good: object created outside render
  const deferredOptions = useDeferredValue(options);
  
  // ❌ Bad: new object every render
  // const deferredOptions = useDeferredValue({ ...options });
}
```

## When to use useDeferredValue

Use `useDeferredValue` when:
- You want to show stale content while new content loads
- Updates are expensive and can be deferred
- User input should remain responsive

Don't use `useDeferredValue` for:
- Values that must update immediately
- Values used in text inputs
- Values that change frequently in rapid succession

## Differences from useTransition

- `useDeferredValue` defers a **value**
- `useTransition` defers **state updates**
- Both keep UI responsive but work differently

<!--
Source references:
- https://react.dev/reference/react/useDeferredValue
-->
