---
name: features-draggable-config
description: Advanced draggable configuration options including friction, velocity, and modifiers
---

# Draggable Configuration

Advanced configuration options for draggable elements including friction, velocity control, and value modifiers.

## Container Friction

Add friction at container edges:

```javascript
createDraggable('.box', {
  container: '.container',
  containerFriction: 0.5  // 0-1, higher = more friction
});
```

## Velocity Control

Control velocity behavior:

```javascript
createDraggable('.box', {
  velocityMultiplier: 2,    // Multiply velocity on release
  minVelocity: 0.1,        // Minimum velocity threshold
  maxVelocity: 100         // Maximum velocity cap
});
```

## Drag Speed

Control drag sensitivity:

```javascript
createDraggable('.box', {
  dragSpeed: 0.5  // 0-1, lower = less sensitive
});
```

## Value Modifiers

Transform values during dragging:

```javascript
import { utils } from 'animejs';

createDraggable('.box', {
  x: {
    modifier: (value) => value * 2  // Double the X value
  }
});

// Wrap values (for infinite scrolling)
createDraggable('.carousel', {
  x: {
    modifier: utils.wrap(-500, 0)  // Wrap between -500 and 0
  }
});
```

## Map to Other Properties

Map drag position to different properties:

```javascript
createDraggable('.carousel', {
  x: { mapTo: 'rotateY' },  // Map X drag to rotateY
  y: false
});
```

## Snap Configuration

Advanced snap options:

```javascript
createDraggable('.box', {
  x: {
    snap: 100,
    modifier: utils.snap(100)  // Snap to nearest 100
  }
});
```

## Scroll Threshold

Enable scrolling when near container edges:

```javascript
createDraggable('.box', {
  container: '.scrollable-container',
  scrollThreshold: 10  // Start scrolling 10px from edge
});
```

## Dynamic Configuration

Update configuration dynamically:

```javascript
const draggable = createDraggable('.box', {
  container: '.container'
});

// Update container bounds
draggable.container = [0, 800, 600, 0];
draggable.refresh();  // Recalculate bounds

// Update snap points
draggable.snap = [0, 200, 400, 600];
draggable.refresh();
```

## Per-Axis Configuration

Configure X and Y independently:

```javascript
createDraggable('.box', {
  x: {
    snap: 100,
    container: [0, 500, 0, 0]
  },
  y: {
    snap: 50,
    container: [0, 0, 300, 0],
    modifier: (value) => Math.max(0, value)  // Prevent negative Y
  }
});
```

## Release Easing

Custom easing for release animation:

```javascript
import { createSpring } from 'animejs';

createDraggable('.box', {
  releaseEase: createSpring({
    mass: 1,
    stiffness: 400,
    damping: 30
  })
});
```

## Key Points

- `containerFriction` adds resistance at edges
- `velocityMultiplier` amplifies release velocity
- `dragSpeed` controls drag sensitivity
- Modifiers transform values during drag
- `mapTo` maps drag to different properties
- `scrollThreshold` enables edge scrolling
- Use `refresh()` after changing configuration
- Per-axis config allows independent control

<!--
Source references:
- https://github.com/juliangarnier/anime
- https://animejs.com/documentation
-->
