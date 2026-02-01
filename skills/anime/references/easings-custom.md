---
name: easings-custom
description: Create custom easing functions with cubic bezier, spring, steps, and linear
---

# Custom Easings

Create custom easing functions using cubic bezier, spring physics, steps, and linear interpolation.

## Cubic Bezier

Create custom cubic bezier curves:

```javascript
import { cubicBezier } from 'animejs';

const customEase = cubicBezier(0.25, 0.1, 0.25, 1);

animate('.box', {
  x: 100,
  ease: customEase
});
```

### Bezier Parameters

```javascript
// cubicBezier(x1, y1, x2, y2)
cubicBezier(0.25, 0.1, 0.25, 1)  // Standard ease
cubicBezier(0.68, -0.55, 0.265, 1.55)  // Bounce-like
```

## Spring

Create spring physics easings:

```javascript
import { createSpring } from 'animejs';

const spring = createSpring({
  mass: 1,        // Mass of spring
  stiffness: 400, // Spring stiffness
  damping: 30     // Damping factor
});

animate('.box', {
  x: 100,
  ease: spring
});
```

### Spring Parameters

```javascript
createSpring({
  mass: 1,        // Higher = slower
  stiffness: 400, // Higher = bouncier
  damping: 30     // Higher = less bouncy
});
```

## Steps

Create stepped animations:

```javascript
import { steps } from 'animejs';

animate('.box', {
  x: 100,
  ease: steps(10)  // 10 steps
});
```

### Step Options

```javascript
// steps(count, direction)
steps(10)              // 10 steps, start
steps(10, 'end')       // 10 steps, end
steps(10, 'both')      // 10 steps, both ends
```

## Linear

Linear interpolation:

```javascript
import { linear } from 'animejs';

animate('.box', {
  x: 100,
  ease: linear
});
```

## Irregular

Random stepped easing (variable step lengths):

```javascript
import { irregular } from 'animejs';

// irregular(length, randomness) — length steps, randomness 0–1
animate('.box', {
  x: 100,
  ease: irregular(10, 1)
});
```

## Function Easing

Custom easing function:

```javascript
animate('.box', {
  x: 100,
  ease: (t) => {
    // t is progress from 0 to 1
    return t * t;  // Quadratic ease-in
  }
});
```

## Combining Easings

Use different easings for different properties:

```javascript
animate('.box', {
  x: { to: 100, ease: 'outQuad' },
  y: { to: 100, ease: 'outElastic(1, 0.5)' },
  opacity: { to: 0.5, ease: 'linear' }
});
```

## Key Points

- Use `cubicBezier()` for custom curves; `spring()` / `createSpring()` for physics-based easing
- Use `steps()` for uniform steps; `irregular(length, randomness)` for random step lengths
- Use `linear` for no easing; custom functions accept progress (0-1) and return eased value
- Different properties can use different easings
- Spring parameters control bounce and damping

<!--
Source references:
- https://github.com/juliangarnier/anime
- https://animejs.com/documentation
-->
