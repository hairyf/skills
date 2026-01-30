---
name: react-native-animations
description: Animated API for creating fluid animations. Use when animating values, transitions, gestures, or creating interactive animations.
---

# Animations

React Native's `Animated` API provides declarative, performant animations. Use `useNativeDriver: true` to run animations on the native thread for better performance.

## Basic Animation

Create animated values and drive style properties.

```tsx
import { useRef, useEffect } from 'react';
import { Animated, View } from 'react-native';

const FadeInView = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true, // Required for native driver
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* Content */}
    </Animated.View>
  );
};
```

## Animated Values

### Animated.Value

Single numeric value for animations.

```tsx
const opacity = useRef(new Animated.Value(0)).current;
const scale = useRef(new Animated.Value(1)).current;

// Use in styles
<Animated.View style={{ opacity, transform: [{ scale }] }} />
```

### Animated.ValueXY

2D vector for pan gestures and 2D animations.

```tsx
const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

// Use in styles
<Animated.View style={{ transform: position.getTranslateTransform() }} />

// Or access x/y directly
<Animated.View style={{
  transform: [
    { translateX: position.x },
    { translateY: position.y }
  ]
}} />
```

## Animation Types

### timing()

Animate a value over time with easing.

```tsx
Animated.timing(value, {
  toValue: 100,
  duration: 500,
  easing: Easing.inOut(Easing.ease),
  useNativeDriver: true,
}).start();
```

**Config:**
- `toValue`: Target value
- `duration`: Milliseconds (default: 500)
- `easing`: Easing function (default: easeInOut)
- `delay`: Start delay in ms
- `useNativeDriver`: Required for native driver

### spring()

Physics-based spring animation.

```tsx
Animated.spring(value, {
  toValue: 1,
  friction: 7,        // Bounciness (default: 7)
  tension: 40,        // Speed (default: 40)
  useNativeDriver: true,
}).start();

// Or use analytical spring model
Animated.spring(value, {
  toValue: 1,
  stiffness: 100,     // Spring stiffness
  damping: 10,        // Friction damping
  mass: 1,            // Mass of object
  useNativeDriver: true,
}).start();
```

### decay()

Start with velocity and gradually slow to stop.

```tsx
Animated.decay(value, {
  velocity: 0.5,      // Initial velocity
  deceleration: 0.997, // Decay rate (default: 0.997)
  useNativeDriver: true,
}).start();
```

## Composing Animations

### sequence()

Run animations one after another.

```tsx
Animated.sequence([
  Animated.timing(fadeAnim, { toValue: 1, useNativeDriver: true }),
  Animated.timing(scaleAnim, { toValue: 1.2, useNativeDriver: true }),
]).start();
```

### parallel()

Run animations simultaneously.

```tsx
Animated.parallel([
  Animated.timing(opacity, { toValue: 1, useNativeDriver: true }),
  Animated.timing(scale, { toValue: 1, useNativeDriver: true }),
]).start();
```

### stagger()

Start animations in sequence with delays.

```tsx
Animated.stagger(100, [
  Animated.timing(value1, { toValue: 1, useNativeDriver: true }),
  Animated.timing(value2, { toValue: 1, useNativeDriver: true }),
  Animated.timing(value3, { toValue: 1, useNativeDriver: true }),
]).start();
```

### delay()

Add delay before animation.

```tsx
Animated.sequence([
  Animated.delay(500),
  Animated.timing(value, { toValue: 1, useNativeDriver: true }),
]).start();
```

### loop()

Loop animation continuously.

```tsx
Animated.loop(
  Animated.timing(value, { toValue: 1, useNativeDriver: true }),
  { iterations: 3 } // -1 for infinite
).start();
```

## Combining Values

Combine animated values with math operations.

```tsx
const a = new Animated.Value(1);
const b = new Animated.Value(2);

const sum = Animated.add(a, b);
const diff = Animated.subtract(a, b);
const product = Animated.multiply(a, b);
const quotient = Animated.divide(a, b);
const remainder = Animated.modulo(a, 2);
```

## Interpolation

Map input ranges to output ranges.

```tsx
const translateX = scrollX.interpolate({
  inputRange: [0, 100],
  outputRange: [0, 100],
  extrapolate: 'clamp', // 'extend' | 'identity' | 'clamp'
});

// Multiple ranges
const opacity = scrollY.interpolate({
  inputRange: [0, 100, 200],
  outputRange: [1, 0.5, 0],
  extrapolate: 'clamp',
});
```

## Animatable Components

Use `Animated.*` components or create custom ones.

```tsx
// Built-in animatable components
<Animated.View />
<Animated.Text />
<Animated.Image />
<Animated.ScrollView />
<Animated.FlatList />
<Animated.SectionList />

// Create custom animatable component
const AnimatedCustom = Animated.createAnimatedComponent(CustomComponent);
```

## Handling Gestures

Map gesture events to animated values.

```tsx
const scrollX = useRef(new Animated.Value(0)).current;

<Animated.ScrollView
  horizontal
  onScroll={Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false } // Scroll events can't use native driver
  )}
  scrollEventThrottle={16}
/>
```

### PanResponder Integration

```tsx
const pan = useRef(new Animated.ValueXY()).current;

const panResponder = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event(
      [null, { dx: pan.x, dy: pan.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: () => {
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
      }).start();
    },
  })
).current;

<Animated.View
  style={{ transform: pan.getTranslateTransform() }}
  {...panResponder.panHandlers}
/>
```

## Animation Control

### start()

Start animation with optional completion callback.

```tsx
animation.start(({ finished }) => {
  if (finished) {
    console.log('Animation completed');
  } else {
    console.log('Animation was cancelled');
  }
});
```

### stop()

Stop running animation.

```tsx
animation.stop();
```

### reset()

Stop and reset value to original.

```tsx
animation.reset();
```

## Native Driver

Use `useNativeDriver: true` for better performance. Animations run on the native thread, avoiding bridge overhead.

**Supported properties:**
- `transform` (translateX, translateY, scale, scaleX, scaleY, rotate, rotateX, rotateY)
- `opacity`

**Not supported:**
- Layout properties (width, height, margin, padding, etc.)
- Color properties

```tsx
// ✅ Can use native driver
Animated.timing(opacity, {
  toValue: 1,
  useNativeDriver: true, // Works!
}).start();

// ❌ Cannot use native driver
Animated.timing(width, {
  toValue: 100,
  useNativeDriver: true, // Error!
}).start();
```

## LayoutAnimation

Automatically animate layout changes (position, size) without manual Animated values.

```tsx
import { LayoutAnimation, UIManager, Platform } from 'react-native';

// Enable on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setExpanded(!expanded);
  };

  return (
    <View>
      <Button onPress={toggleExpanded} title="Toggle" />
      {expanded && <View style={styles.content} />}
    </View>
  );
};
```

### LayoutAnimation Presets

```tsx
LayoutAnimation.Presets.easeInEaseOut  // Default
LayoutAnimation.Presets.linear
LayoutAnimation.Presets.spring
```

### Custom LayoutAnimation

```tsx
LayoutAnimation.configureNext({
  duration: 300,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 0.7,
  },
  delete: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
});
```

**Use cases:**
- Animate list item additions/removals
- Animate layout changes (expand/collapse)
- Fire-and-forget animations (not interruptible)

**Limitations:**
- Not interruptible (use Animated API for interruptible animations)
- Only works for layout properties (position, size)

## Best Practices

1. **Always use `useNativeDriver: true`** when possible for better performance
2. **Use `useRef`** to persist animated values across renders
3. **Clean up animations** in useEffect cleanup if needed
4. **Use `extrapolate: 'clamp'`** to prevent values going out of bounds
5. **Throttle scroll events** with `scrollEventThrottle={16}` for 60fps
6. **Combine animations** with sequence/parallel for complex flows
7. **Use LayoutAnimation** for automatic layout changes (not interruptible)
8. **Test on device** - animations may behave differently than simulator

## Common Patterns

### Fade In

```tsx
const fadeAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: true,
  }).start();
}, []);

<Animated.View style={{ opacity: fadeAnim }} />
```

### Slide In

```tsx
const slideAnim = useRef(new Animated.Value(-100)).current;

useEffect(() => {
  Animated.spring(slideAnim, {
    toValue: 0,
    useNativeDriver: true,
  }).start();
}, []);

<Animated.View style={{
  transform: [{ translateY: slideAnim }]
}} />
```

### Scale Animation

```tsx
const scaleAnim = useRef(new Animated.Value(0)).current;

const handlePress = () => {
  Animated.spring(scaleAnim, {
    toValue: 1,
    friction: 3,
    useNativeDriver: true,
  }).start();
};

<Animated.View style={{
  transform: [{ scale: scaleAnim }]
}} />
```

<!--
Source references:
- https://reactnative.dev/docs/animated
- https://reactnative.dev/docs/animations
- https://reactnative.dev/docs/animatedvalue
- https://reactnative.dev/docs/animatedvaluexy
- https://reactnative.dev/docs/easing
-->
