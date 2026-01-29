---
name: features-animatable
description: Create animatable objects for custom animations and reactive values
---

# Animatable

The `createAnimatable()` function creates reactive objects that can be animated and used for custom animations.

## Basic Usage

```javascript
import { createAnimatable } from 'animejs';

const animatable = createAnimatable('.box', {
  x: 0,
  y: 0
});
```

## Creating Animatable Objects

### From DOM Element

```javascript
const animatable = createAnimatable('.box', {
  x: 0,
  y: 0,
  scale: 1
});
```

### From JavaScript Object

```javascript
const data = { count: 0, progress: 0 };
const animatable = createAnimatable(data, {
  count: 0,
  progress: 0
});
```

## Accessing Values

Read and write values:

```javascript
const animatable = createAnimatable('.box', { x: 0, y: 0 });

// Read
const x = animatable.x();  // Get current X
const y = animatable.y();  // Get current Y

// Write
animatable.x(100);  // Set X to 100
animatable.y(200);  // Set Y to 200
```

## Animating Animatable Objects

```javascript
import { animate, createAnimatable } from 'animejs';

const animatable = createAnimatable('.box', { x: 0, y: 0 });

animate(animatable, {
  x: 320,
  y: 100,
  duration: 1000
});
```

## Modifiers

Transform values with modifiers:

```javascript
import { utils } from 'animejs';

const animatable = createAnimatable('.box', {
  x: 0,
  modifier: utils.wrap(-500, 0)  // Wrap X between -500 and 0
});

// Custom modifier
const animatable = createAnimatable('.box', {
  x: 0,
  modifier: (value) => Math.max(0, Math.min(500, value))  // Clamp 0-500
});
```

## Reactive Updates

Use with timers for continuous updates:

```javascript
import { createTimer, createAnimatable } from 'animejs';

const animatable = createAnimatable('.box', { x: 0, y: 0 });
const data = { speed: 2 };

createTimer({
  onUpdate: () => {
    const currentX = animatable.x();
    animatable.x(currentX + data.speed);
  }
});
```

## With Draggable

Combine with draggable for custom interactions:

```javascript
import { createDraggable, createAnimatable } from 'animejs';

const animatable = createAnimatable('.carousel', {
  x: 0,
  modifier: utils.wrap(-1000, 0)
});

const draggable = createDraggable(data, {
  onUpdate: (self) => {
    animatable.x(animatable.x() - self.deltaX);
  }
});
```

## Multiple Properties

Create animatable with multiple properties:

```javascript
const animatable = createAnimatable('.box', {
  x: 0,
  y: 0,
  rotate: 0,
  scale: 1,
  opacity: 1
});

animate(animatable, {
  x: 100,
  y: 100,
  rotate: 45,
  scale: 1.5,
  opacity: 0.8
});
```

## Key Points

- `createAnimatable()` creates reactive value objects
- Use getter/setter pattern: `value()` to read, `value(newVal)` to write
- Can be created from DOM elements or JS objects
- Modifiers transform values automatically
- Works with `animate()` for smooth transitions
- Useful for custom animations and reactive systems
- Combine with timers for continuous updates

<!--
Source references:
- https://github.com/juliangarnier/anime
- https://animejs.com/documentation
-->
