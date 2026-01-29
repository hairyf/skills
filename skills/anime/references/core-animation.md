---
name: core-animation
description: Basic animation function for animating CSS properties, DOM attributes, and JavaScript objects
---

# Animation

The `animate()` function is the core of Anime.js. It animates CSS properties, SVG attributes, DOM attributes, and JavaScript object properties.

## Basic Usage

```javascript
import { animate } from 'animejs';

// Animate a single element
animate('.box', {
  translateX: 320,
  rotate: 180,
  duration: 1000,
  ease: 'inOutQuad'
});
```

## Target Selection

Targets can be:
- CSS selector string: `'.box'`, `'#element'`, `'div.item'`
- DOM element: `document.querySelector('.box')`
- Array of elements: `[el1, el2, el3]`
- NodeList: `document.querySelectorAll('.item')`
- JavaScript object: `{ x: 0, y: 0 }`

```javascript
// Multiple targets
animate('.item', {
  translateY: 100,
  opacity: 0.5
});

// JavaScript object
const data = { count: 0 };
animate(data, {
  count: 100,
  duration: 2000
});
```

## Property Animation

### CSS Properties

Use camelCase or kebab-case for CSS properties:

```javascript
animate('.box', {
  translateX: 320,        // transform: translateX(320px)
  translateY: 100,        // transform: translateY(100px)
  rotate: '45deg',        // transform: rotate(45deg)
  scale: 1.5,             // transform: scale(1.5)
  opacity: 0.5,           // opacity: 0.5
  backgroundColor: '#ff0000', // background-color: #ff0000
  width: '200px',         // width: 200px
  borderRadius: '10px'   // border-radius: 10px
});
```

### Transform Properties

Transform properties can be combined:

```javascript
animate('.box', {
  translateX: 320,
  translateY: 100,
  rotate: 180,
  scale: 1.5,
  skewX: 10
});
```

### SVG Attributes

```javascript
import { svg } from 'animejs';

animate('circle', {
  cx: 100,
  cy: 100,
  r: 50,
  fill: '#ff0000'
});
```

### DOM Attributes

```javascript
animate('.input', {
  value: 100,
  innerHTML: 'Updated'
});
```

## Value Types

### From/To Values

```javascript
animate('.box', {
  translateX: { from: 0, to: 320 },
  opacity: { from: 1, to: 0 }
});
```

### Array Keyframes

```javascript
animate('.box', {
  translateX: [0, 100, 200, 320],
  scale: [1, 1.5, 1.2, 1]
});
```

### Function Values

```javascript
animate('.box', {
  translateX: () => Math.random() * 320,
  rotate: (el, i) => i * 45
});
```

## Key Points

- Targets can be selectors, elements, arrays, or objects
- CSS properties use camelCase or kebab-case
- Transform properties are automatically combined
- Values can be numbers, strings, arrays, or functions
- Use `from`/`to` objects for explicit start/end values
- Array values create keyframe animations

<!--
Source references:
- https://github.com/juliangarnier/anime
- https://animejs.com/documentation
-->
