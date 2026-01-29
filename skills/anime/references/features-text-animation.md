---
name: features-text-animation
description: Animate text content and properties
---

# Text Animation

Animate text content, innerHTML, and text-related properties.

## Text Content

Animate text content directly:

```javascript
import { animate } from 'animejs';

animate('.text', {
  textContent: {
    to: (el) => [0, 100],  // Animate from 0 to 100
    modifier: (value) => Math.round(value)  // Round to integer
  }
});
```

## innerHTML Animation

Animate innerHTML with custom modifier:

```javascript
import { animate, utils } from 'animejs';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

animate('.text', {
  innerHTML: {
    to: (el) => [0, chars.length - 1],
    modifier: (value) => {
      const index = utils.round(value, 0);
      return chars[index] || ' ';
    }
  }
});
```

## Number Counting

Animate number values:

```javascript
import { animate, utils } from 'animejs';

animate('.counter', {
  innerHTML: {
    to: [0, 100],
    modifier: utils.round(0)  // Round to integer
  }
});
```

## With Split Text

Combine with split text for character animation:

```javascript
import { animate, splitText, stagger } from 'animejs';

const split = splitText('.text', {
  chars: true
});

animate(split.chars, {
  textContent: {
    to: (el) => {
      const original = el.textContent;
      return [0, original.charCodeAt(0)];
    },
    modifier: (value) => String.fromCharCode(Math.round(value))
  },
  delay: stagger(50)
});
```

## Text Properties

Animate text-related CSS properties:

```javascript
animate('.text', {
  fontSize: '24px',
  letterSpacing: '2px',
  wordSpacing: '4px',
  lineHeight: 1.5
});
```

## Color Animation

Animate text color:

```javascript
animate('.text', {
  color: '#ff0000',
  duration: 1000
});
```

## Key Points

- Use `textContent` or `innerHTML` with `to` and `modifier` for text animation
- Modifier function transforms numeric values to text
- Combine with `splitText()` for character-level animation
- Use `utils.round()` for number formatting
- Animate text-related CSS properties like fontSize, letterSpacing
- Works with stagger for sequential text effects

<!--
Source references:
- https://github.com/juliangarnier/anime
- https://animejs.com/documentation
-->
