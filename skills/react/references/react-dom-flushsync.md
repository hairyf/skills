---
name: flushSync
description: React DOM API for forcing synchronous updates
---

# flushSync

`flushSync` lets you force React to flush any updates inside the provided callback synchronously. Use sparingly as it can hurt performance.

## Usage

```js
import { flushSync } from 'react-dom';

function Component() {
  function handleClick() {
    flushSync(() => {
      setCount(c => c + 1);
    });
    // DOM is updated synchronously here
    console.log(document.getElementById('count').textContent);
  }
  
  return <button onClick={handleClick}>Increment</button>;
}
```

### Basic structure

```js
flushSync(callback);
```

- `callback`: Function containing state updates
- Forces synchronous DOM updates

## Key Points

- **Synchronous**: Updates DOM immediately
- **Performance impact**: Can significantly hurt performance
- **Last resort**: Use only when necessary
- **Third-party integration**: Useful for browser API integration

## Common Patterns

### Browser API integration

```js
function PrintComponent() {
  const [isPrinting, setIsPrinting] = useState(false);
  
  useEffect(() => {
    function handleBeforePrint() {
      flushSync(() => {
        setIsPrinting(true);
      });
      // DOM updated before print dialog opens
    }
    
    window.addEventListener('beforeprint', handleBeforePrint);
    return () => window.removeEventListener('beforeprint', handleBeforePrint);
  }, []);
  
  return <div>{isPrinting ? 'Printing...' : 'Ready'}</div>;
}
```

### Third-party library integration

```js
function Component() {
  const chartRef = useRef(null);
  
  function updateChart(data) {
    flushSync(() => {
      setChartData(data);
    });
    // Chart library can now read updated DOM
    chartRef.current.update();
  }
}
```

## When to use flushSync

Use `flushSync` when:
- Integrating with browser APIs that need synchronous updates
- Third-party libraries require immediate DOM updates
- Print handlers need updated DOM before dialog opens

Avoid `flushSync` when:
- Regular React updates work fine
- Performance is a concern
- No third-party integration needed

## Performance Considerations

- **Blocks rendering**: Forces synchronous rendering
- **Disables batching**: Prevents React from batching updates
- **Use sparingly**: Can make app feel slow
- **Measure impact**: Profile before and after using

## Best Practices

- **Last resort**: Only use when absolutely necessary
- **Measure performance**: Profile impact on app performance
- **Minimize usage**: Use in smallest scope possible
- **Document why**: Comment why `flushSync` is needed

<!--
Source references:
- https://react.dev/reference/react-dom/flushSync
-->
