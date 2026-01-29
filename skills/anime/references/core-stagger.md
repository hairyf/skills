---
name: core-stagger
description: Create staggered animations for multiple targets
---

# Stagger

The `stagger()` function creates time delays between animations for multiple targets, creating wave or sequential effects.

## Basic Usage

```javascript
import { animate, stagger } from 'animejs';

animate('.item', {
  translateY: 100,
  opacity: 0.5,
  delay: stagger(100)  // 100ms delay between each item
});
```

## Stagger Value

The first parameter is the delay amount:

```javascript
// 50ms delay between items
delay: stagger(50)

// 200ms delay between items
delay: stagger(200)
```

## Stagger Options

### From Position

Control which element starts first:

```javascript
delay: stagger(100, { from: 'first' })   // Start from first element
delay: stagger(100, { from: 'last' })     // Start from last element
delay: stagger(100, { from: 'center' })   // Start from center
delay: stagger(100, { from: 2 })          // Start from index 2
```

### Easing

Apply easing to the stagger delay:

```javascript
delay: stagger(100, { ease: 'inOutQuad' })
```

### Grid Layout

For grid layouts, specify grid dimensions:

```javascript
delay: stagger(100, { grid: [5, 5] })  // 5x5 grid
delay: stagger(100, { grid: 'auto' })   // Auto-detect grid
```

### Start Offset

Add an initial delay:

```javascript
delay: stagger(100, { start: 500 })  // Start after 500ms
```

### Reversed

Reverse the stagger order:

```javascript
delay: stagger(100, { reversed: true })
```

## Array Stagger Values

Use arrays for different delays per element:

```javascript
delay: stagger([0, 100, 200, 100, 0])  // Custom delays per element
```

## With Timeline

Stagger works with timelines:

```javascript
import { createTimeline, stagger } from 'animejs';

const tl = createTimeline();

tl.add('.item', {
  translateY: 100,
  delay: stagger(100, { from: 'center' })
});
```

## Advanced Patterns

### Staggered Properties

Different properties can have different stagger patterns:

```javascript
animate('.item', {
  translateY: 100,
  opacity: 0.5,
  delay: stagger(100, { from: 'first' }),
  // Or use function for custom per-element delay
  delay: (el, i) => i * 100
});
```

### Combined with Other Delays

```javascript
animate('.item', {
  translateY: 100,
  delay: stagger(100, { start: 200 })  // 200ms initial + stagger
});
```

## Key Points

- `stagger(delay)` creates delays between multiple targets
- Use `from` option to control starting position
- Apply easing to stagger for smooth transitions
- Use arrays for custom per-element delays
- Works with both `animate()` and timeline `.add()`
- Combine with other delay values for complex timing

<!--
Source references:
- https://github.com/juliangarnier/anime
- https://animejs.com/documentation
-->
