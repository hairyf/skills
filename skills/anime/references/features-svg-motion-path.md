---
name: features-svg-motion-path
description: Animate elements along an SVG path using svg.createMotionPath
---

# SVG Motion Path

`svg.createMotionPath(path, offset)` returns property descriptors that animate an element along an SVG path: position (translateX, translateY) and rotation (rotate) are driven by path length. Use with `animate()` by spreading the result.

## Usage

```javascript
import { animate, svg } from 'animejs';

// path: selector string or SVG path/line/polyline element
animate('.element', {
  duration: 3000,
  loop: true,
  ease: 'linear',
  ...svg.createMotionPath('#myPath')
});

// offset 0–1: start position along path (default 0)
animate('.element', {
  duration: 2000,
  ...svg.createMotionPath('#myPath', 0.25)
});
```

## Return Value

`createMotionPath(path, offset)` returns an object:

- **`translateX`** — function-based value: 0 → path length, modifier maps to x.
- **`translateY`** — same, maps to y.
- **`rotate`** — same, maps to angle (degrees) from path tangent.

Spread into `animate(targets, { ...motionPath, duration, ease, loop })`. Animation runs from 0 to path length; use `duration` and `ease` to control speed and curve.

## Key Points

- `path` must resolve to an SVG geometry element (`path`, `line`, `polyline`, etc.) via selector or element.
- Rotation follows path direction; works in SVG and non-SVG targets (coordinates transformed when not in SVG).
- Returns `undefined` if `path` does not resolve to a valid element.

<!--
Source references:
- sources/anime/src/svg/motionpath.js
- sources/anime/tests/playground/svg-motion-path/
- https://github.com/juliangarnier/anime
-->
