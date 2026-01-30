---
name: startTransition
description: React API for marking non-blocking state updates
---

# startTransition

`startTransition` lets you mark state updates as non-blocking transitions. Similar to `useTransition`, but can be used outside components.

## Usage

```js
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');
  
  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  
  return <TabButton onClick={() => selectTab('about')}>About</TabButton>;
}
```

### Basic structure

```js
startTransition(action);
```

- `action`: Function that updates state
- Marks all state updates inside as transitions

## Key Points

- **Non-blocking**: Keeps UI responsive during updates
- **No pending flag**: Doesn't provide `isPending` like `useTransition`
- **Works outside components**: Can be called from data libraries
- **Interruptible**: New updates interrupt ongoing transitions

## Common Patterns

### Marking updates as transitions

```js
import { startTransition } from 'react';

function updateTab(nextTab) {
  startTransition(() => {
    setTab(nextTab);
  });
}
```

### In data libraries

```js
// In a data fetching library
function fetchData(query) {
  startTransition(() => {
    setData(computeData(query));
  });
}
```

### With async operations

```js
async function handleSubmit() {
  startTransition(async () => {
    const result = await submitForm();
    // Need to wrap in another startTransition
    startTransition(() => {
      setResult(result);
    });
  });
}
```

## Differences from useTransition

| Feature | startTransition | useTransition |
|---------|----------------|---------------|
| Pending flag | ❌ No | ✅ Yes (`isPending`) |
| Use outside components | ✅ Yes | ❌ No |
| Hook | ❌ No | ✅ Yes |
| Use case | Data libraries | Components |

## When to use startTransition

Use `startTransition` when:
- You need to mark updates from outside components
- Building data libraries that update state
- You don't need pending indicators

Use `useTransition` when:
- You need `isPending` flag
- Working inside components
- You want to show loading states

## Best Practices

- **Wrap state updates**: Wrap all state updates that should be non-blocking
- **Don't use for text inputs**: Can't control text inputs with transitions
- **Handle async**: Wrap state updates after `await` in another `startTransition`

<!--
Source references:
- https://react.dev/reference/react/startTransition
-->
