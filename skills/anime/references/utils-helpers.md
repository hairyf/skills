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

### Map Range

```javascript
// Map value from one range to another
utils.mapRange(value, inMin, inMax, outMin, outMax)
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

```javascript
utils.cleanInlineStyles('.box');
```

## Key Points

- `utils.$()` queries DOM elements
- `utils.get()` and `utils.set()` manipulate values
- `utils.set()` returns revertable styles object
- Math utilities: `round`, `random`, `clamp`, `wrap`, `snap`, `lerp`, `mapRange`
- Chainable utilities for complex transformations
- Use for value modifiers in animations

<!--
Source references:
- https://github.com/juliangarnier/anime
- https://animejs.com/documentation
-->
