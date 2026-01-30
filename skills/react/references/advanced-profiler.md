---
name: Profiler
description: React component for measuring rendering performance programmatically
---

# Profiler

`<Profiler>` lets you measure rendering performance of a React tree programmatically. Use it to gather performance metrics in production.

## Usage

```js
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  console.log('Component:', id);
  console.log('Phase:', phase);
  console.log('Actual duration:', actualDuration);
  console.log('Base duration:', baseDuration);
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <App />
    </Profiler>
  );
}
```

### Basic structure

```js
<Profiler id="string" onRender={onRenderCallback}>
  {children}
</Profiler>
```

- `id`: String identifying the profiled tree
- `onRender`: Callback called after each render

## Key Points

- **Production builds**: Disabled by default, requires special build
- **Performance overhead**: Adds some overhead to rendering
- **Programmatic**: For programmatic performance measurement
- **Multiple profilers**: Can use multiple profilers in one app

## Common Patterns

### Measuring component performance

```js
function onRender(id, phase, actualDuration, baseDuration) {
  console.log(`${id} (${phase}):`, {
    actual: actualDuration,
    base: baseDuration,
    difference: actualDuration - baseDuration
  });
}

function App() {
  return (
    <Profiler id="App" onRender={onRender}>
      <Header />
      <Profiler id="Sidebar" onRender={onRender}>
        <Sidebar />
      </Profiler>
      <MainContent />
    </Profiler>
  );
}
```

### Sending metrics to analytics

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  analytics.track('render_performance', {
    component: id,
    phase,
    duration: actualDuration,
    baseDuration,
    timestamp: commitTime
  });
}
```

### Conditional profiling

```js
function App() {
  const shouldProfile = process.env.NODE_ENV === 'development';
  
  if (shouldProfile) {
    return (
      <Profiler id="App" onRender={onRender}>
        <AppContent />
      </Profiler>
    );
  }
  
  return <AppContent />;
}
```

## onRender Callback Parameters

- `id`: The `id` prop of the Profiler
- `phase`: `"mount"`, `"update"`, or `"nested-update"`
- `actualDuration`: Time spent rendering (ms)
- `baseDuration`: Estimated time without optimizations (ms)
- `startTime`: When React began rendering
- `commitTime`: When React committed the update

## When to use Profiler

Use `<Profiler>` when:
- Measuring performance programmatically
- Sending metrics to analytics
- Debugging performance in production
- Comparing before/after optimizations

Use React DevTools Profiler when:
- Interactive profiling during development
- Visual performance analysis
- Component-level performance debugging

## Best Practices

- **Production builds**: Enable profiling builds only when needed
- **Minimal overhead**: Use sparingly to avoid performance impact
- **Aggregate data**: Collect and analyze metrics over time
- **Compare metrics**: Compare `actualDuration` vs `baseDuration`

<!--
Source references:
- https://react.dev/reference/react/Profiler
-->
