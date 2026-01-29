---
name: features-svg-draw
description: Animate SVG path drawing with stroke-dasharray
---

# SVG Drawing

Anime.js provides utilities for animating SVG path drawing using the `draw` property.

## createDrawable

Create drawable SVG elements:

```javascript
import { animate, svg } from 'animejs';

// Create drawable from selector
const drawable = svg.createDrawable('path');

// Create drawable from multiple elements
const drawable = svg.createDrawable('.path');
```

## Basic Drawing

Animate path drawing:

```javascript
import { animate, svg } from 'animejs';

animate(svg.createDrawable('path'), {
  draw: '0 1',  // From 0% to 100%
  duration: 1000
});
```

## Draw Values

### Percentage Range

```javascript
// Draw from start to end
draw: '0 1'  // 0% to 100%

// Draw from middle
draw: '0.5 1'  // 50% to 100%

// Draw specific range
draw: '0.2 0.8'  // 20% to 80%
```

### Array Keyframes

```javascript
animate(svg.createDrawable('path'), {
  draw: [
    '0 0',      // Start at 0%
    '0 1',      // Draw to 100%
    '1 1',      // Stay at 100%
    '0 0'       // Erase back to 0%
  ],
  duration: 2000
});
```

## Function Values

Use functions for dynamic drawing:

```javascript
animate(svg.createDrawable('path'), {
  draw: () => {
    const start = Math.random();
    return `${start} ${start + 0.5}`;
  }
});
```

## Multiple Paths

Animate multiple paths with stagger:

```javascript
import { animate, svg, stagger } from 'animejs';

animate(svg.createDrawable('.path'), {
  draw: '0 1',
  delay: stagger(100)
});
```

## With Timeline

Combine drawing with timeline:

```javascript
import { createTimeline, svg, stagger } from 'animejs';

const tl = createTimeline();

tl.add(svg.createDrawable('.line'), {
  draw: '0 1',
  stroke: '#ff0000',
  duration: 1000
}, stagger(100));
```

## Stroke Properties

Combine with stroke properties:

```javascript
animate(svg.createDrawable('path'), {
  draw: '0 1',
  stroke: '#ff0000',
  strokeWidth: 2,
  duration: 1000
});
```

## Key Points

- Use `svg.createDrawable()` to prepare elements for drawing
- `draw` property uses 'start end' format (0-1 range)
- Array values create keyframe animations
- Functions allow dynamic drawing patterns
- Works with multiple elements and stagger
- Combines with other SVG properties

<!--
Source references:
- https://github.com/juliangarnier/anime
- https://animejs.com/documentation
-->
