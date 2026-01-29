---
name: easings-functions
description: Built-in easing functions for animation acceleration
---

# Easing Functions

Anime.js provides a comprehensive set of built-in easing functions for controlling animation acceleration.

## Basic Easings

### Linear

```javascript
ease: 'linear'  // Constant speed
```

### Quad (Quadratic)

```javascript
ease: 'inQuad'      // Slow start
ease: 'outQuad'     // Slow end
ease: 'inOutQuad'   // Slow start and end
```

### Cubic

```javascript
ease: 'inCubic'
ease: 'outCubic'
ease: 'inOutCubic'
```

### Quart (Quartic)

```javascript
ease: 'inQuart'
ease: 'outQuart'
ease: 'inOutQuart'
```

### Quint (Quintic)

```javascript
ease: 'inQuint'
ease: 'outQuint'
ease: 'inOutQuint'
```

## Elastic Easings

Bouncy elastic effects:

```javascript
ease: 'inElastic'
ease: 'outElastic'
ease: 'inOutElastic'

// With parameters
ease: 'outElastic(1, 0.5)'  // amplitude, period
```

## Bounce Easings

Bouncing effects:

```javascript
ease: 'inBounce'
ease: 'outBounce'
ease: 'inOutBounce'
```

## Sine Easings

Smooth sine curves:

```javascript
ease: 'inSine'
ease: 'outSine'
ease: 'inOutSine'
```

## Expo (Exponential)

Exponential acceleration:

```javascript
ease: 'inExpo'
ease: 'outExpo'
ease: 'inOutExpo'
```

## Circular

Circular curves:

```javascript
ease: 'inCirc'
ease: 'outCirc'
ease: 'inOutCirc'
```

## Short Syntax

Use short syntax for common patterns:

```javascript
ease: 'in(2)'      // inQuad
ease: 'out(3)'     // outCubic
ease: 'inOut(4)'   // inOutQuart
```

## Using Eases Object

Import and use easing functions directly:

```javascript
import { eases } from 'animejs';

animate('.box', {
  x: 100,
  ease: eases.outElastic(1, 0.5)
});
```

## Key Points

- Use easing names as strings: `'inQuad'`, `'outCubic'`, etc.
- `in` = slow start, `out` = slow end, `inOut` = both
- Elastic and bounce easings provide bouncy effects
- Short syntax: `'in(2)'` = `'inQuad'`
- Elastic easings accept parameters: `'outElastic(amplitude, period)'`
- Import `eases` object for programmatic access

<!--
Source references:
- https://github.com/juliangarnier/anime
- https://animejs.com/documentation
-->
