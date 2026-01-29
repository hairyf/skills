---
name: features-draggable
description: Create draggable elements with physics, constraints, and interactions
---

# Draggable

The `createDraggable()` function creates draggable elements with physics-based interactions, constraints, and snap points.

## Basic Usage

```javascript
import { createDraggable } from 'animejs';

const draggable = createDraggable('.box', {
  container: document.body
});
```

## Container Constraints

Limit dragging to a container area:

```javascript
// CSS selector
createDraggable('.box', {
  container: '.container'
});

// DOM element
createDraggable('.box', {
  container: document.querySelector('.container')
});

// Array bounds [left, right, bottom, top]
createDraggable('.box', {
  container: [0, 500, 500, 0]
});

// Function returning bounds
createDraggable('.box', {
  container: () => [0, window.innerWidth, window.innerHeight, 0]
});
```

## Axis Control

Restrict dragging to specific axes:

```javascript
// Only horizontal
createDraggable('.box', {
  x: true,
  y: false
});

// Only vertical
createDraggable('.box', {
  x: false,
  y: true
});
```

## Snap Points

Snap to specific positions:

```javascript
// Single snap value
createDraggable('.box', {
  snap: 100
});

// Array of snap positions
createDraggable('.box', {
  snap: [0, 100, 200, 300]
});

// Per-axis snap
createDraggable('.box', {
  x: { snap: 100 },
  y: { snap: 50 }
});
```

## Physics

Control release physics:

```javascript
createDraggable('.box', {
  releaseStiffness: 200,    // Spring stiffness
  releaseDamping: 8,        // Spring damping
  velocityMultiplier: 4      // Velocity amplification
});
```

## Callbacks

### onGrab

Called when dragging starts:

```javascript
createDraggable('.box', {
  onGrab: (self) => {
    console.log('Grabbed at', self.x, self.y);
  }
});
```

### onDrag

Called during dragging:

```javascript
createDraggable('.box', {
  onDrag: (self) => {
    console.log('Dragging:', self.x, self.y);
    console.log('Velocity:', self.velocity);
  }
});
```

### onRelease

Called when dragging ends:

```javascript
createDraggable('.box', {
  onRelease: (self) => {
    console.log('Released at', self.x, self.y);
  }
});
```

### onSnap

Called when element snaps:

```javascript
createDraggable('.box', {
  snap: 100,
  onSnap: (self) => {
    console.log('Snapped to', self.x, self.y);
  }
});
```

## Properties

Access draggable properties:

```javascript
const draggable = createDraggable('.box');

// Position
draggable.x;  // Current X position
draggable.y;  // Current Y position

// Progress (0-1 within container)
draggable.progressX;
draggable.progressY;

// Velocity
draggable.velocity;  // Overall velocity
draggable.velocityX;
draggable.velocityY;

// Delta (change from last frame)
draggable.deltaX;
draggable.deltaY;
```

## Animating Draggables

Animate draggable properties:

```javascript
import { animate, createDraggable } from 'animejs';

const draggable = createDraggable('.box');

// Animate position
animate(draggable, {
  x: 200,
  y: 100,
  duration: 500
});

// Animate progress
animate(draggable, {
  progressX: 0.5,  // Move to 50% of container width
  duration: 1000
});
```

## Advanced Features

### Trigger Element

Use a different element to trigger dragging:

```javascript
createDraggable('.box', {
  trigger: '.handle'  // Drag from handle, move box
});
```

### Container Padding

Add padding inside container bounds:

```javascript
createDraggable('.box', {
  container: '.container',
  containerPadding: 10  // 10px padding on all sides
});

// Per-side padding
createDraggable('.box', {
  containerPadding: [10, 20, 10, 20]  // [top, right, bottom, left]
});
```

### Cursor Styles

Customize cursor:

```javascript
createDraggable('.box', {
  cursor: { onHover: 'grab', onGrab: 'grabbing' }
});

// Disable cursor change
createDraggable('.box', {
  cursor: false
});
```

## Key Points

- Use `createDraggable()` to make elements draggable
- Container constrains dragging area
- Snap points provide alignment
- Physics control release behavior
- Callbacks provide interaction hooks
- Animate draggable properties for programmatic control
- Use `trigger` to separate drag handle from target

<!--
Source references:
- https://github.com/juliangarnier/anime
- https://animejs.com/documentation
-->
