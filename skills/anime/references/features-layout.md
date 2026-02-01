---
name: features-layout
description: AutoLayout (createLayout) for FLIP-style layout animations—accordion, list reorder, enter/leave
---

# Layout (AutoLayout)

`createLayout` builds FLIP-style layout animations: it records DOM state before/after changes and animates position, size, and optional properties (opacity, colors, etc.). Use for accordions, reorderable lists, and enter/leave transitions.

## Usage

```javascript
import { createLayout } from 'animejs';

const layout = createLayout('.container', {
  children: '*',           // selector for children (default '*')
  properties: ['backgroundColor'],
  duration: 350,
  delay: 0,
  ease: 'inOut(3.5)',
  swapAt: { opacity: 0, ease: 'inOut(1.75)' },  // state during swap
  enterFrom: { opacity: 0 },
  leaveTo: { opacity: 0 }
});

// After DOM change, call update(callback) then animate runs
layout.update(() => {
  document.querySelector('.item').remove();
});
// Or: layout.record(); then mutate DOM; then layout.animate();
```

## Options

| Option | Description |
|--------|-------------|
| `children` | Selector or array of child elements to track (default `'*'`) |
| `properties` | Extra CSS properties to animate (opacity, color, etc.) |
| `duration`, `delay`, `ease` | Default timing; can be overridden in `animate(params)` |
| `swapAt` | State applied mid-transition (e.g. `{ opacity: 0 }`) |
| `enterFrom` | Initial state for entering nodes |
| `leaveTo` | Final state for leaving nodes |

## Methods

- **`layout.record()`** — Record current DOM as “old” state. Call before mutating DOM.
- **`layout.animate(params?)`** — Record new state, diff, and run layout animation. Returns a Timeline.
- **`layout.update(callback, params?)`** — Same as `record()` then `callback(layout)` then `animate(params)`.
- **`layout.revert()`** — Cancel and clear layout state.

## Key Points

- Root element is the first match of the selector passed to `createLayout(root, params)`.
- Enter/leave/position animations are driven by layout; transforms use WAAPI when needed.
- Use `layout.update(() => { /* mutate DOM */ })` for typical “DOM change → animate” flow.

<!--
Source references:
- sources/anime/src/layout/layout.js
- sources/anime/examples/auto-layout/
- https://github.com/juliangarnier/anime
-->
