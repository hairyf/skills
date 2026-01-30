---
name: cache
description: React Server Components API for caching function results
---

# cache

`cache` lets you cache the result of a data fetch or computation in React Server Components. Prevents duplicate work across multiple components.

## Usage

```js
import { cache } from 'react';
import calculateMetrics from './lib/metrics';

const getMetrics = cache(calculateMetrics);

function Chart({ data }) {
  const report = getMetrics(data);
  return <div>{report.value}</div>;
}
```

### Basic structure

```js
const cachedFn = cache(fn);
```

- `fn`: Function to cache
- Returns: Cached version of function
- **Server Components only**: Only works in Server Components

## Key Points

- **Server Components only**: Can only be used in Server Components
- **Request-scoped**: Cache invalidated per server request
- **Memoization**: Caches results based on function arguments
- **Error caching**: Also caches errors

## Common Patterns

### Caching data fetches

```js
import { cache } from 'react';

const getUser = cache(async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
});

async function UserProfile({ userId }) {
  const user = await getUser(userId);
  return <div>{user.name}</div>;
}

async function UserAvatar({ userId }) {
  const user = await getUser(userId); // Uses cached result
  return <img src={user.avatar} />;
}
```

### Caching expensive computations

```js
import { cache } from 'react';

const calculateReport = cache((data) => {
  // Expensive computation
  return processData(data);
});

function Report({ data }) {
  const report = calculateReport(data);
  return <div>{report.summary}</div>;
}
```

### Multiple cache instances

```js
// Each cache call creates a new cache
const getUser = cache(fetchUser);
const getPost = cache(fetchPost);

// These don't share cache
const getUser2 = cache(fetchUser); // Different cache
```

## When to use cache

Use `cache` when:
- Fetching data in Server Components
- Expensive computations in Server Components
- Multiple components need same data
- Want to avoid duplicate work

Don't use `cache` when:
- In Client Components (doesn't work)
- Data changes frequently
- Need request-specific data

## Best Practices

- **Server Components only**: Only use in Server Components
- **Request scope**: Cache is per-request, not global
- **Same function**: Call `cache` once per function
- **Error handling**: Handle cached errors appropriately

## Limitations

- **Server only**: Doesn't work in Client Components
- **Request scope**: Cache cleared between requests
- **No sharing**: Each `cache()` call creates separate cache
- **Error caching**: Errors are also cached

<!--
Source references:
- https://react.dev/reference/react/cache
-->
