---
name: utils-helpers
description: Utility functions for DOM manipulation, value helpers, and math functions
---

# Utils

Anime.js provides utility functions for DOM manipulation, value transformation, and mathematical operations.

## DOM Utilities

### Query Selectors

```javascript
import { utils } from 'animejs';

// Query single element
const [el] = utils.$('.box');

// Query multiple elements
const elements = utils.$('.item');
```

### Get/Set Values

```javascript
// Get value
const x = utils.get('.box', 'x');
const opacity = utils.get('.box', 'opacity');

// Set value
utils.set('.box', { x: 100, y: 200 });
utils.set('.box', { opacity: 0.5 });

// Set multiple elements
utils.set('.item', { x: 100 });
```

### Get/Set with Revert

```javascript
const styles = utils.set('.box', {
  x: 100,
  y: 200
});

// Later, revert
styles.revert();
```

## Math Utilities

### Round

```javascript
// Round to integer
utils.round(3.7, 0)  // 4

// Round to decimals
utils.round(3.14159, 2)  // 3.14
```

### Random

```javascript
// Random number
utils.random(0, 100)        // 0 to 100
utils.random(0, 100, 2)      // With 2 decimals

// Random integer
Math.floor(utils.random(0, 10))
```

### Clamp

```javascript
// Clamp value between min and max
utils.clamp(value, 0, 100)
```

### Wrap

```javascript
// Wrap value within range
utils.wrap(-500, 0)(value)  // Wrap between -500 and 0
```

### Snap

```javascript
// Snap to nearest value
utils.snap(100)(value)  // Snap to nearest 100
```

### Lerp

```javascript
// Linear interpolation
utils.lerp(start, end, t)  // t is 0-1
```

### Damp

```javascript
// Frame-rate independent damped lerp (e.g. smooth follow)
utils.damp(start, end, deltaTimeMs, factor)
```

### Map Range

```javascript
// Map value from one range to another
utils.mapRange(value, inMin, inMax, outMin, outMax)
```

### Format / Angles

```javascript
utils.roundPad(v, decimals)   // toFixed string
utils.padStart(v, length, pad)
utils.padEnd(v, length, pad)
utils.degToRad(degrees)
utils.radToDeg(radians)
```

## Time

### sync

Run a callback on the next frame (1ms timer):

```javascript
utils.sync(() => console.log('next frame'));
```

### keepTime

Wrap a constructor so animation state (e.g. iteration, progress) is preserved when re-running:

```javascript
const cleanup = utils.keepTime(() => animate('.box', { x: 100 }))();
```

## Random (extras)

```javascript
utils.createSeededRandom(seed, min, max, decimals)  // seeded RNG
utils.randomPick([a, b, c])   // pick one
utils.shuffle([a, b, c])      // shuffle copy
```

## Remove targets

Remove targets from an animation/timeline:

```javascript
utils.remove(targets, renderable, propertyName);
```

## Value Helpers

### Chainable

Chain utility operations:

```javascript
import { utils } from 'animejs';

const rounded = utils.round(0).clamp(0, 100)(value);
```

## Time Utilities

### Now

Get current time:

```javascript
import { utils } from 'animejs';

const currentTime = utils.now();
```

## Target Utilities

### Clean Inline Styles

Remove inline styles applied by an animation or timeline:

```javascript
const anim = animate('.box', { x: 100 });
utils.cleanInlineStyles(anim);  // or anim.cleanInlineStyles()
```

## Key Points

- `utils.$()` is alias for `registerTargets`; `utils.get()` / `utils.set()` for DOM values
- `utils.set()` returns object with `.revert()` to restore inline styles
- Math: `round`, `random`, `clamp`, `wrap`, `snap`, `lerp`, `damp`, `mapRange`, `roundPad`, `padStart`, `padEnd`, `degToRad`, `radToDeg`
- Time: `sync(callback)` (next frame), `keepTime(constructor)` (preserve animation state)
- Random: `createSeededRandom`, `randomPick`, `shuffle`
- `utils.remove(targets, renderable, propertyName)` removes targets from a renderable
- Chainable form: e.g. `utils.round(0).clamp(0, 100)(value)`

<!--
Source references:
- https://github.com/juliangarnier/anime
- https://animejs.com/documentation
-->
