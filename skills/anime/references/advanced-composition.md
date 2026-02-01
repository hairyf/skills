---
name: advanced-composition
description: Animation composition modes—replace, none, blend (additive)
---

# Composition

The `composition` parameter controls how multiple animations on the same target and property interact.

## Modes

| Value | Behavior |
|-------|----------|
| `'replace'` | Default. New animation replaces the previous one on the same target/property. |
| `'none'` | New animation does not replace; both can coexist (implementation-dependent). |
| `'blend'` | Additive: new animation adds to the current value. Use for layered effects (e.g. particles). |

## Usage

```javascript
import { animate } from 'animejs';

// Default: second animate replaces the first on the same property
animate('.box', { x: 100, duration: 1000 });
animate('.box', { x: 200, duration: 500 }); // replaces

// Additive: each call adds to current position (e.g. particles)
animate($el, {
  x: { to: dx, duration: 1000 },
  y: { to: dy, duration: 1000 },
  composition: 'blend'
});
```

## Key Points

- Use `composition: 'blend'` when you want multiple overlapping animations to add their values (e.g. fireflies, confetti).
- Default is `'replace'`; omit or set explicitly when one animation should override the other.
- Same target and same property are required for composition to apply.

<!--
Source references:
- sources/anime/src/core/consts.js (compositionTypes)
- sources/anime/src/animation/composition.js
- sources/anime/examples/additive-fireflies/index.js
- https://github.com/juliangarnier/anime
-->
