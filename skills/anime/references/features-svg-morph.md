---
name: features-svg-morph
description: Morph SVG paths and shapes between different states
---

# SVG Morphing

Anime.js provides utilities for morphing SVG paths and shapes between different states.

## Basic Morphing

```javascript
import { animate, svg } from 'animejs';

// Morph path to another path
animate('path', {
  d: svg.morphTo('#target-path', 0)
});
```

## morphTo Function

The `svg.morphTo()` function creates a morph value:

```javascript
import { svg } from 'animejs';

// Morph to target element
svg.morphTo('#target-path', 0)

// Morph with precision (number of points)
svg.morphTo('#target-path', 10)  // 10 points for smoother morph
```

## Morphing in Animations

```javascript
import { animate, svg } from 'animejs';

animate('path', {
  d: svg.morphTo('#target-path', 0),
  duration: 1000,
  ease: 'inOutQuad'
});
```

## Multiple Morph States

Morph through multiple states:

```javascript
import { createTimeline, svg } from 'animejs';

const tl = createTimeline();

tl.add('path', {
  d: [
    svg.morphTo('#state1', 0),
    svg.morphTo('#state2', 0),
    svg.morphTo('#state3', 0)
  ],
  duration: 3000
});
```

## Points Morphing

Morph polygon/polyline points:

```javascript
import { animate, svg } from 'animejs';

animate('polygon', {
  points: svg.morphTo('#target-polygon', 0),
  duration: 1000
});
```

## With Timeline

Combine morphing with timeline:

```javascript
import { createTimeline, svg } from 'animejs';

const tl = createTimeline();

tl.add('#line', {
  d: [
    { to: svg.morphTo('#line-1', 0), duration: 100 },
    { to: svg.morphTo('#line-2', 0), duration: 100 },
    { to: svg.morphTo('#line-3', 0), duration: 100 }
  ]
});
```

## Key Points

- Use `svg.morphTo(target, precision)` to create morph values
- Target can be selector string or element
- Precision controls number of points (0 = auto)
- Works with `d` attribute for paths
- Works with `points` attribute for polygons/polylines
- Can morph through multiple states in arrays

<!--
Source references:
- https://github.com/juliangarnier/anime
- https://animejs.com/documentation
-->
