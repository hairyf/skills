---
name: use
description: React API for reading Promise and Context values
---

# use

`use` is a React API that lets you read the value of a resource like a Promise or context. Unlike hooks, it can be called conditionally and in loops.

## Usage

```js
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  return <div>{message.text}</div>;
}

function Button() {
  const theme = use(ThemeContext);
  return <button className={theme}>Click</button>;
}
```

### Basic structure

```js
const value = use(resource);
```

- `resource`: A Promise or Context object
- Returns: Resolved value from Promise or context value

## Key Points

- **Can be conditional**: Unlike hooks, can be called in `if` statements and loops
- **Suspense integration**: Works with Suspense boundaries for Promises
- **Error boundaries**: Promise rejections trigger error boundaries
- **Must be in component**: Still must be called inside components or hooks

## Common Patterns

### Reading Promises

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  return <div>{message.text}</div>;
}

function App() {
  const messagePromise = fetch('/api/message').then(r => r.json());
  
  return (
    <Suspense fallback={<Loading />}>
      <MessageComponent messagePromise={messagePromise} />
    </Suspense>
  );
}
```

### Conditional context reading

```js
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return null;
}
```

### Reading context in loops

```js
function Component({ items }) {
  return items.map(item => {
    const theme = use(ThemeContext);
    return <Item key={item.id} item={item} theme={theme} />;
  });
}
```

### Streaming data from server

```js
// Server Component
async function ServerComponent() {
  const dataPromise = fetchData();
  return <ClientComponent dataPromise={dataPromise} />;
}

// Client Component
'use client';
function ClientComponent({ dataPromise }) {
  const data = use(dataPromise);
  return <div>{data.content}</div>;
}
```

## Differences from useContext

- `use` can be called conditionally and in loops
- `useContext` must be called at top level
- `use` is more flexible for dynamic context access

## Differences from async/await

- `use` works with Suspense boundaries
- `async/await` in Server Components doesn't suspend
- `use` re-renders after Promise resolves
- `async/await` continues rendering from await point

## Best Practices

- **Server Components**: Prefer `async/await` in Server Components
- **Client Components**: Use `use` for Promises in Client Components
- **Stable Promises**: Pass Promises from Server Components for stability
- **Error handling**: Combine with Error Boundaries

<!--
Source references:
- https://react.dev/reference/react/use
-->
