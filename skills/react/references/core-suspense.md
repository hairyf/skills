---
name: Suspense
description: React component for displaying fallback UI while content is loading
---

# Suspense

`<Suspense>` lets you display a fallback UI until its children have finished loading. It's used for code splitting, data fetching, and other asynchronous operations.

## Usage

```js
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Albums />
    </Suspense>
  );
}
```

### Basic structure

```js
<Suspense fallback={fallback}>
  {children}
</Suspense>
```

- `fallback`: UI to show while children are loading
- `children`: Components that may suspend

## Key Points

- **Automatic fallback**: Shows fallback when children suspend
- **Nested boundaries**: Can have multiple Suspense boundaries
- **State preservation**: React doesn't preserve state for suspended renders before first mount
- **Layout Effects**: Cleans up layout effects when hiding suspended content

## Common Patterns

### Code splitting with lazy

```js
import { lazy, Suspense } from 'react';

const Albums = lazy(() => import('./Albums'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Albums />
    </Suspense>
  );
}
```

### Data fetching

```js
function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<AlbumsGlimmer />}>
        <Albums artistId={artist.id} />
      </Suspense>
      <Suspense fallback={<BiographyGlimmer />}>
        <Biography artistId={artist.id} />
      </Suspense>
    </>
  );
}
```

### Revealing content together

```js
function ProfilePage() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <ProfileDetails />
      <Suspense fallback={<PostsGlimmer />}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}
```

### Nested Suspense boundaries

```js
function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <NavBar />
      <Suspense fallback={<SidebarGlimmer />}>
        <Sidebar />
      </Suspense>
      <Suspense fallback={<ContentGlimmer />}>
        <Content />
      </Suspense>
    </Suspense>
  );
}
```

## What causes Suspense?

Components suspend when they:
- Use `lazy()` for code splitting
- Use data fetching libraries that support Suspense
- Use `use()` hook with a Promise
- Throw a Promise during render (in data fetching libraries)

## Best Practices

- **Lightweight fallbacks**: Keep fallback components simple
- **Multiple boundaries**: Use separate boundaries for independent content
- **Revealing together**: Wrap related content in same boundary to reveal together
- **Error boundaries**: Combine with Error Boundaries for error handling

<!--
Source references:
- https://react.dev/reference/react/Suspense
-->
