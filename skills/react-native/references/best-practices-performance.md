---
name: react-native-performance
description: Performance optimization techniques for React Native apps. Use when optimizing rendering, animations, lists, or troubleshooting performance issues.
---

# Performance Optimization

React Native aims for 60fps by default, but manual optimization is sometimes needed. Understanding frame timing and common bottlenecks helps achieve smooth performance.

## Frame Timing

React Native targets 60fps, giving you **16.67ms per frame** to complete all work.

- **JS Thread**: Runs React, API calls, touch events, business logic
- **UI Thread**: Handles native view rendering and animations

If work exceeds 16.67ms, frames are dropped and UI appears janky.

## Common Performance Issues

### Development Mode

**Problem**: Dev mode is significantly slower due to warnings and error handling.

**Solution**: Always test performance in release builds.

```bash
# Android
./gradlew assembleRelease

# iOS
# Build Release scheme in Xcode
```

### console.log Statements

**Problem**: `console.log` calls create bottlenecks in JS thread.

**Solution**: Remove or strip console statements in production.

```json
// .babelrc
{
  "env": {
    "production": {
      "plugins": ["transform-remove-console"]
    }
  }
}
```

### FlatList Performance

**Problem**: Slow rendering or scroll performance for large lists.

**Solution**: Implement `getItemLayout` for fixed-height items.

```tsx
<FlatList
  data={items}
  renderItem={renderItem}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  // Other optimizations
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={10}
  removeClippedSubviews={true}
/>
```

### Heavy JS Thread Work

**Problem**: Slow navigator transitions or UI freezes during heavy work.

**Solution**: Use `InteractionManager` to defer work until animations complete.

```tsx
import { InteractionManager } from 'react-native';

const handleNavigation = () => {
  // Start navigation animation
  navigate('Screen');
  
  // Defer heavy work until animation completes
  InteractionManager.runAfterInteractions(() => {
    loadData();
    processHeavyComputation();
  });
};
```

### UI Thread FPS Drops

**Problem**: Scrolling or animating views drops UI thread FPS.

**Solution**: Enable hardware acceleration for complex views.

```tsx
<View renderToHardwareTextureAndroid={true}>
  {/* Complex view with transparency */}
</View>
```

**Note**: Use sparingly - increases memory usage.

### Image Size Animation

**Problem**: Animating image width/height is expensive (re-cropping on iOS).

**Solution**: Use `transform: [{ scale }]` instead.

```tsx
// ❌ Slow - re-crops image
<Animated.Image
  style={{
    width: animatedWidth,
    height: animatedHeight,
  }}
/>

// ✅ Fast - uses transform
<Animated.Image
  style={{
    transform: [{ scale: animatedScale }],
  }}
/>
```

### Touchable Responsiveness

**Problem**: TouchableOpacity doesn't respond immediately.

**Solution**: Wrap heavy work in `requestAnimationFrame`.

```tsx
const handlePress = () => {
  requestAnimationFrame(() => {
    // Heavy work that might drop frames
    doExpensiveAction();
  });
};
```

## Optimization Techniques

### Memoization

Use `React.memo` to prevent unnecessary re-renders.

```tsx
const ExpensiveComponent = React.memo(({ data }) => {
  // Expensive rendering
  return <ComplexView data={data} />;
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.data.id === nextProps.data.id;
});
```

### useMemo and useCallback

Memoize expensive computations and callbacks.

```tsx
const ExpensiveComponent = ({ items }) => {
  const filteredItems = useMemo(() => {
    return items.filter(item => item.active);
  }, [items]);

  const handlePress = useCallback(() => {
    // Handler logic
  }, [dependencies]);

  return <List items={filteredItems} onPress={handlePress} />;
};
```

### Native Driver for Animations

Always use `useNativeDriver: true` when possible (transform, opacity).

```tsx
// ✅ Fast - runs on native thread
Animated.timing(value, {
  toValue: 1,
  useNativeDriver: true, // Transform/opacity only
}).start();

// ❌ Slow - runs on JS thread
Animated.timing(value, {
  toValue: 1,
  useNativeDriver: false, // Required for layout props
}).start();
```

### LayoutAnimation

Use for fire-and-forget layout animations (unaffected by JS thread).

```tsx
import { LayoutAnimation, UIManager, Platform } from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const handleLayoutChange = () => {
  LayoutAnimation.configureNext({
    duration: 300,
    create: { type: 'linear', property: 'opacity' },
    update: { type: 'spring', springDamping: 0.7 },
    delete: { type: 'linear', property: 'opacity' },
  });
  
  setExpanded(!expanded);
};
```

### Image Optimization

- **Resize images** before displaying
- **Use appropriate formats** (WebP on Android, HEIC on iOS)
- **Cache images** with proper cache headers
- **Lazy load** images outside viewport

```tsx
<Image
  source={{ uri: imageUrl }}
  resizeMode="cover"
  // Preload for better UX
  defaultSource={require('./placeholder.png')}
/>
```

### List Optimization

```tsx
<FlatList
  // Fixed item heights
  getItemLayout={getItemLayout}
  
  // Render optimization
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={10}
  
  // Memory optimization
  removeClippedSubviews={true}
  
  // Update optimization
  updateCellsBatchingPeriod={50}
  
  // Key optimization
  keyExtractor={item => item.id}
/>
```

## Profiling

### Performance Monitor

Enable in Dev Menu → "Show Perf Monitor" to see:
- JS FPS (JavaScript thread frame rate)
- UI FPS (Main thread frame rate)

### React DevTools Profiler

Use React DevTools Profiler to identify slow components.

### Flipper

Use Flipper for detailed performance profiling:
- Network inspector
- Layout inspector
- React DevTools integration

## Best Practices

1. **Test in release mode** - Dev mode is much slower
2. **Remove console.log** - Use babel plugin to strip in production
3. **Use getItemLayout** - For FlatList with fixed item heights
4. **Enable native driver** - For transform/opacity animations
5. **Memoize expensive components** - Use React.memo, useMemo, useCallback
6. **Defer heavy work** - Use InteractionManager for post-animation work
7. **Optimize images** - Resize, cache, lazy load
8. **Profile regularly** - Use Performance Monitor and DevTools
9. **Test on real devices** - Simulator performance differs
10. **Monitor frame rates** - Target 60fps, investigate drops

## Common Patterns

### Deferred Data Loading

```tsx
useEffect(() => {
  const task = InteractionManager.runAfterInteractions(() => {
    loadHeavyData();
  });

  return () => task.cancel();
}, []);
```

### Optimized List Item

```tsx
const ListItem = React.memo(({ item }) => {
  return (
    <View>
      <Text>{item.title}</Text>
    </View>
  );
}, (prev, next) => prev.item.id === next.item.id);
```

### Animation Performance

```tsx
// Always use native driver when possible
const fadeAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true, // ✅ Fast
  }).start();
}, []);
```

<!--
Source references:
- https://reactnative.dev/docs/performance
- https://reactnative.dev/docs/profiling
- https://reactnative.dev/docs/interactionmanager
- https://reactnative.dev/docs/layoutanimation
-->
