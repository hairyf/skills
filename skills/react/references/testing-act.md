---
name: act
description: React test helper for applying pending updates before assertions
---

# act

`act` is a test helper to apply pending React updates before making assertions. Wrap rendering and updates in `act()` to ensure updates are processed.

## Usage

```js
import { act } from 'react';
import { createRoot } from 'react-dom/client';

it('renders with button disabled', async () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  
  await act(async () => {
    root.render(<TestComponent />);
  });
  
  expect(container.querySelector('button')).toBeDisabled();
});
```

### Basic structure

```js
await act(async actFn);
```

- `actFn`: Async function wrapping renders or interactions
- Ensures all updates are processed before assertions

## Key Points

- **Test helper**: For testing React components
- **Async recommended**: Use `await act(async ...)` pattern
- **Updates processed**: Ensures all state updates are applied
- **Library wrappers**: Testing libraries often wrap this automatically

## Common Patterns

### Rendering components

```js
it('renders component', async () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  
  await act(async () => {
    root.render(<Counter />);
  });
  
  expect(container.textContent).toBe('Count: 0');
});
```

### Testing user interactions

```js
it('increments counter on click', async () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  
  await act(async () => {
    root.render(<Counter />);
  });
  
  const button = container.querySelector('button');
  
  await act(async () => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  
  expect(container.textContent).toBe('Count: 1');
});
```

### Testing async updates

```js
it('handles async state updates', async () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  
  await act(async () => {
    root.render(<AsyncComponent />);
    await waitFor(() => {
      expect(container.textContent).toContain('Loaded');
    });
  });
});
```

## When to use act

Use `act` when:
- Writing component tests
- Testing user interactions
- Testing async updates
- Using React Testing Library (automatically wrapped)

Don't use `act` when:
- Using React Testing Library (already wrapped)
- Testing non-React code
- Updates are synchronous and simple

## Best Practices

- **Always use async**: Prefer `await act(async ...)`
- **Wrap interactions**: Wrap all user interactions
- **Use testing libraries**: Prefer React Testing Library
- **One act per test**: Usually one `act` call per test

## Testing Library Integration

Most testing libraries wrap `act` automatically:

```js
// React Testing Library - act is automatic
import { render, fireEvent } from '@testing-library/react';

it('increments counter', () => {
  const { getByText } = render(<Counter />);
  fireEvent.click(getByText('Increment'));
  expect(getByText('Count: 1')).toBeInTheDocument();
});
```

<!--
Source references:
- https://react.dev/reference/react/act
-->
