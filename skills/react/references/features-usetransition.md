---
name: useTransition
description: React Hook for non-blocking state updates
---

# useTransition

`useTransition` is a React Hook that lets you mark state updates as non-blocking transitions. Use it to keep the UI responsive during expensive updates.

## Usage

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');
  
  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  
  return (
    <>
      {isPending && <Spinner />}
      <TabButton onClick={() => selectTab('about')}>About</TabButton>
      <TabButton onClick={() => selectTab('posts')}>Posts</TabButton>
    </>
  );
}
```

### Basic structure

```js
const [isPending, startTransition] = useTransition();
```

- `isPending`: Boolean indicating if a transition is pending
- `startTransition`: Function to mark state updates as transitions

## Key Points

- **Non-blocking**: Transitions don't block user interactions
- **Interruptible**: New updates interrupt ongoing transitions
- **Loading indicators**: Use `isPending` to show loading states
- **Not for text inputs**: Can't be used to control text inputs

## Common Patterns

### Marking state updates as transitions

```js
function App() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');
  
  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  
  return (
    <>
      {isPending && <div>Loading...</div>}
      <TabButton onClick={() => selectTab('about')}>About</TabButton>
    </>
  );
}
```

### Preventing unwanted loading indicators

```js
function SearchResults({ query }) {
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState([]);
  
  function updateResults(newQuery) {
    startTransition(() => {
      setResults(computeResults(newQuery));
    });
  }
  
  // isPending stays false during transition
  // User doesn't see loading spinner
  return <ResultsList items={results} />;
}
```

### With async operations

```js
function Component() {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState(null);
  
  async function fetchData() {
    startTransition(async () => {
      const result = await fetch('/api/data');
      // Note: Need to wrap setData in another startTransition
      startTransition(() => {
        setData(await result.json());
      });
    });
  }
}
```

## When to use useTransition

Use `useTransition` when:
- Updating UI that's not immediately visible (tabs, filters)
- Updates can be interrupted by user interactions
- You want to keep UI responsive during expensive updates

Don't use `useTransition` for:
- Text inputs (use regular state updates)
- Urgent updates that must complete immediately
- Updates that should show loading indicators

## Differences from startTransition

- `useTransition` provides `isPending` flag
- `startTransition` can be used outside components
- Both mark updates as non-blocking transitions

<!--
Source references:
- https://react.dev/reference/react/useTransition
-->
