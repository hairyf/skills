---
name: lazy
description: React API for code splitting and lazy loading components
---

# lazy

`lazy` lets you defer loading a component's code until it's rendered for the first time. Use it with `Suspense` for code splitting.

## Usage

```js
import { lazy, Suspense } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <MarkdownPreview />
    </Suspense>
  );
}
```

### Basic structure

```js
const LazyComponent = lazy(load);
```

- `load`: Function that returns a Promise resolving to a component
- Component must be exported as `default` export

## Key Points

- **Code splitting**: Reduces initial bundle size
- **Suspense required**: Must wrap lazy components in `<Suspense>`
- **Default export**: Lazy-loaded component must be default export
- **Caching**: React caches the loaded component

## Common Patterns

### Basic lazy loading

```js
const Albums = lazy(() => import('./Albums'));
const Biography = lazy(() => import('./Biography'));

function ArtistPage({ artist }) {
  return (
    <>
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

### Conditional lazy loading

```js
const MarkdownPreview = lazy(() => import('./MarkdownPreview'));

function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowPreview(!showPreview)}>
        Toggle Preview
      </button>
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <MarkdownPreview />
        </Suspense>
      )}
    </>
  );
}
```

### Named exports workaround

```js
// If component is named export
const MarkdownPreview = lazy(() => 
  import('./MarkdownPreview').then(module => ({
    default: module.MarkdownPreview
  }))
);
```

### With error boundaries

```js
function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

## Best Practices

- **Route-based splitting**: Lazy load route components
- **Heavy components**: Lazy load components with large dependencies
- **User-triggered**: Lazy load features triggered by user actions
- **Error handling**: Combine with Error Boundaries

## Limitations

- **Default export required**: Component must be default export (or use workaround)
- **Suspense required**: Must wrap in `<Suspense>` boundary
- **No SSR**: Lazy components don't work with server-side rendering

<!--
Source references:
- https://react.dev/reference/react/lazy
-->
