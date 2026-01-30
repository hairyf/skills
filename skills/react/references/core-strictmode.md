---
name: StrictMode
description: React component for enabling additional development checks
---

# StrictMode

`<StrictMode>` enables additional development-only checks and warnings for your components. It helps find bugs early during development.

## Usage

```js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### Basic structure

```js
<StrictMode>
  {children}
</StrictMode>
```

No props accepted. Wraps component tree to enable strict checks.

## Key Points

- **Development only**: Checks only run in development
- **No production impact**: Doesn't affect production builds
- **Double rendering**: Components render twice to detect impurities
- **Effect cleanup**: Effects run twice to find missing cleanup

## What StrictMode Checks

### Double rendering

Components render twice to detect impure rendering:

```js
let renderCount = 0;

function Component() {
  renderCount++; // Will be 2 in StrictMode
  return <div>Rendered {renderCount} times</div>;
}
```

### Effect cleanup

Effects run twice to ensure cleanup is implemented:

```js
useEffect(() => {
  const connection = createConnection();
  // StrictMode calls this twice
  // Must return cleanup function
  return () => connection.disconnect();
}, []);
```

### Ref callbacks

Ref callbacks run twice to ensure cleanup:

```js
<div ref={(node) => {
  // Called twice in StrictMode
  if (node) {
    // Setup
  } else {
    // Cleanup
  }
}} />
```

### Deprecated APIs

Warns about usage of deprecated APIs.

## Common Patterns

### Wrapping entire app

```js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### Wrapping part of app

```js
function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <DebugPanel />
      </StrictMode>
      <Footer />
    </>
  );
}
```

## Best Practices

- **Enable for new apps**: Always use StrictMode in new projects
- **Fix warnings**: Address all StrictMode warnings
- **Pure components**: Ensure components are pure (idempotent)
- **Cleanup effects**: Always return cleanup functions from Effects

## What StrictMode Doesn't Do

- **No production checks**: Only runs in development
- **No performance impact**: Doesn't affect production performance
- **No guarantees**: Doesn't guarantee code correctness

<!--
Source references:
- https://react.dev/reference/react/StrictMode
-->
