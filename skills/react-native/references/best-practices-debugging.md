---
name: react-native-debugging
description: Debugging tools and techniques for React Native apps. Use when troubleshooting issues, inspecting components, or profiling performance.
---

# Debugging

React Native provides comprehensive debugging tools including Dev Menu, LogBox, React Native DevTools, and performance monitoring.

## Dev Menu

Access developer menu for debugging features.

**Opening Dev Menu:**
- **iOS Simulator**: `Ctrl + Cmd + Z` (or Device > Shake)
- **Android Emulator**: `Cmd + M` (macOS) or `Ctrl + M` (Windows/Linux)
- **Android Device**: `adb shell input keyevent 82`

**Dev Menu Options:**
- Reload - Reload JavaScript bundle
- Debug - Open debugger
- Show Perf Monitor - Toggle performance overlay
- Inspect Element - Inspect component hierarchy
- Enable Fast Refresh - Toggle Fast Refresh

## React Native DevTools

Built-in debugger for inspecting JavaScript execution.

**Opening DevTools:**
- Select "Open DevTools" in Dev Menu
- Press `j` from CLI

**Features:**
- Console - View logs and interact with runtime
- Components Inspector - Inspect React component tree
- Profiler - Profile component renders
- Network Inspector - Monitor network requests

## LogBox

In-app tool displaying warnings and errors.

### Fatal Errors

Unrecoverable errors (syntax errors) open LogBox automatically. Not dismissable until fixed.

### Console Errors and Warnings

- **Errors**: Red badge with notification count
- **Warnings**: Yellow banner prompting DevTools

### Ignoring Logs

```tsx
import { LogBox } from 'react-native';

// Ignore all logs
LogBox.ignoreAllLogs();

// Ignore specific logs
LogBox.ignoreLogs([
  'Warning: componentWillReceiveProps has been renamed',
  /GraphQL error: .*/,
]);
```

## Performance Monitor

In-app performance overlay showing JS and UI frame rates.

**Enable**: Dev Menu → "Show Perf Monitor"

**Displays:**
- JS FPS - JavaScript thread frame rate
- UI FPS - Main thread frame rate

**Note**: Use native tooling (Android Studio/Xcode) for accurate measurements.

## Console Logging

```tsx
console.log('Info message');
console.warn('Warning message');
console.error('Error message');
console.debug('Debug message');
```

**Best Practice**: Remove console statements in production builds.

## Debugging Techniques

### Breakpoints

Use React Native DevTools or Chrome DevTools for breakpoints.

### Inspecting Components

```tsx
// Use React DevTools Components Inspector
// Or add temporary logging
console.log('Component props:', props);
console.log('Component state:', state);
```

### Network Debugging

Use React Native DevTools Network Inspector or Flipper.

### Performance Profiling

1. Enable Performance Monitor
2. Use React DevTools Profiler
3. Use Flipper for detailed profiling

## Common Debugging Scenarios

### Component Not Updating

```tsx
// Check if props/state changed
useEffect(() => {
  console.log('Props changed:', props);
  console.log('State changed:', state);
}, [props, state]);

// Check render count
const renderCount = useRef(0);
renderCount.current++;
console.log('Render count:', renderCount.current);
```

### Styling Issues

```tsx
// Log computed styles
const onLayout = (event) => {
  const { width, height, x, y } = event.nativeEvent.layout;
  console.log('Layout:', { width, height, x, y });
};

<View onLayout={onLayout} />
```

### Network Issues

```tsx
// Log network requests
const fetchData = async () => {
  console.log('Fetching:', url);
  try {
    const response = await fetch(url);
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('Network error:', error);
    throw error;
  }
};
```

### Animation Issues

```tsx
// Log animation values
const animatedValue = useRef(new Animated.Value(0)).current;

animatedValue.addListener(({ value }) => {
  console.log('Animation value:', value);
});
```

## Best Practices

1. **Use DevTools** - Comprehensive debugging capabilities
2. **Enable Performance Monitor** - Monitor frame rates during development
3. **Remove console.log** - Strip in production builds
4. **Use LogBox.ignoreLogs** - Suppress noisy third-party warnings
5. **Test in release mode** - Some issues only appear in production builds
6. **Use breakpoints** - Step through code execution
7. **Inspect components** - Use Components Inspector for React debugging
8. **Profile performance** - Use Profiler to identify bottlenecks
9. **Monitor network** - Use Network Inspector for API debugging
10. **Test on real devices** - Simulator behavior differs

## Debugging Tools

### React Native DevTools
- Built-in debugger
- Component inspection
- Performance profiling

### Flipper
- Advanced debugging platform
- Network inspector
- Layout inspector
- React DevTools integration

### Chrome DevTools
- Remote debugging
- Breakpoints
- Console access

### VS Code Debugger
- Integrated debugging
- Breakpoints
- Variable inspection

## Common Patterns

### Debug Wrapper

```tsx
const debugLog = (message, data) => {
  if (__DEV__) {
    console.log(`[DEBUG] ${message}`, data);
  }
};

// Usage
debugLog('User data', userData);
```

### Error Boundary

```tsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error);
    console.error('Error info:', errorInfo);
    // Log to error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### Performance Debugging

```tsx
const usePerformanceMonitor = () => {
  useEffect(() => {
    if (__DEV__) {
      const interval = setInterval(() => {
        // Monitor performance metrics
        console.log('Performance check');
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, []);
};
```

<!--
Source references:
- https://reactnative.dev/docs/debugging
- https://reactnative.dev/docs/react-native-devtools
- https://reactnative.dev/docs/profiling
-->
