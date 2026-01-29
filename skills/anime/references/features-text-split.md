---
name: features-text-split
description: Split text into words, lines, and characters for animation
---

# Text Splitting

The `splitText()` function splits text content into words, lines, and characters for granular animation control.

## Basic Usage

```javascript
import { splitText } from 'animejs';

const split = splitText('p', {
  lines: true,
  words: true,
  chars: true
});
```

## Split Options

### Lines

Split into lines:

```javascript
const split = splitText('p', {
  lines: true
});

// Access lines
split.lines  // Array of line elements
```

### Words

Split into words:

```javascript
const split = splitText('p', {
  words: true
});

// Access words
split.words  // Array of word elements
```

### Characters

Split into characters:

```javascript
const split = splitText('p', {
  chars: true
});

// Access characters
split.chars  // Array of character elements
```

## Combined Splitting

Split into multiple levels:

```javascript
const split = splitText('p', {
  lines: true,
  words: true,
  chars: true
});

// Access all levels
split.lines   // Line elements
split.words   // Word elements
split.chars   // Character elements
```

## Configuration Options

### Include Spaces

```javascript
const split = splitText('p', {
  words: true,
  includeSpaces: true  // Include spaces in word elements
});
```

### Wrap Elements

Custom wrap elements:

```javascript
const split = splitText('p', {
  words: {
    wrap: 'span',  // Wrap words in <span>
    clone: false   // Don't clone original
  }
});
```

### Accessible

Maintain accessibility:

```javascript
const split = splitText('p', {
  words: true,
  accessible: true  // Preserve screen reader compatibility
});
```

### Debug Mode

Visualize split structure:

```javascript
const split = splitText('p', {
  words: true,
  debug: true  // Add visual debugging
});
```

## Animating Split Text

```javascript
import { animate, splitText, stagger } from 'animejs';

const split = splitText('p', {
  words: true
});

animate(split.words, {
  opacity: [0, 1],
  translateY: [20, 0],
  delay: stagger(50)
});
```

## Effects

Add effects to split text:

```javascript
import { createTimeline, splitText, stagger } from 'animejs';

const split = splitText('p', {
  words: true
});

split.addEffect((split) => {
  return createTimeline()
    .add(split.words, {
      opacity: [0, 1],
      translateY: [20, 0],
      delay: stagger(50)
    })
    .init();
});
```

## Reverting

Restore original text:

```javascript
const split = splitText('p', {
  words: true
});

// Later...
split.revert();  // Restore original text
```

## Refresh

Update split after content changes:

```javascript
const split = splitText('p', {
  words: true
});

// After content change
split.refresh();  // Recalculate split
```

## Key Points

- Use `splitText()` to split text into lines, words, or chars
- Access split elements via `split.lines`, `split.words`, `split.chars`
- Combine multiple split levels for complex animations
- Use `addEffect()` to add animations to split text
- `revert()` restores original text
- `refresh()` updates split after content changes
- `accessible` option maintains screen reader compatibility

<!--
Source references:
- https://github.com/juliangarnier/anime
- https://animejs.com/documentation
-->
