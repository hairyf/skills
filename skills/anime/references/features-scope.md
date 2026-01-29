---
name: features-scope
description: Scroll-based animations and viewport detection
---

# Scope

Scope provides scroll-based animations and viewport detection for triggering animations when elements enter or leave the viewport.

## Basic Usage

```javascript
import { scope } from 'animejs';

scope('.box', {
  onEnter: () => console.log('Entered viewport'),
  onLeave: () => console.log('Left viewport')
});
```

## Viewport Detection

### onEnter

Triggered when element enters viewport:

```javascript
scope('.box', {
  onEnter: (self) => {
    console.log('Element entered viewport');
    animate(self.$target, {
      opacity: 1,
      translateY: 0
    });
  }
});
```

### onLeave

Triggered when element leaves viewport:

```javascript
scope('.box', {
  onLeave: (self) => {
    console.log('Element left viewport');
  }
});
```

## Progress Tracking

Track scroll progress through viewport:

```javascript
scope('.box', {
  onProgress: (self) => {
    const progress = self.progress;  // 0 to 1
    console.log('Progress:', progress);
    
    // Animate based on progress
    animate(self.$target, {
      opacity: progress,
      scale: 0.5 + (progress * 0.5)
    });
  }
});
```

## Threshold

Set viewport entry threshold:

```javascript
scope('.box', {
  threshold: 0.5,  // Trigger when 50% visible
  onEnter: () => console.log('50% visible')
});
```

## Multiple Elements

Scope works with multiple elements:

```javascript
scope('.item', {
  onEnter: (self, index) => {
    animate(self.$target, {
      opacity: 1,
      translateY: 0,
      delay: index * 100
    });
  }
});
```

## Scroll Direction

Detect scroll direction:

```javascript
scope('.box', {
  onEnter: (self) => {
    if (self.direction === 'down') {
      // Scrolling down
    } else if (self.direction === 'up') {
      // Scrolling up
    }
  }
});
```

## Key Points

- Use `scope()` for scroll-based animations
- `onEnter` triggers when element enters viewport
- `onLeave` triggers when element leaves viewport
- `onProgress` provides continuous progress tracking
- `threshold` controls when triggers fire
- Works with multiple elements automatically
- Progress ranges from 0 to 1

<!--
Source references:
- https://github.com/juliangarnier/anime
- https://animejs.com/documentation
-->
