---
name: advanced-waapi
description: Web Animations API wrapper—waapi.animate for native WAAPI animations
---

# WAAPI

**waapi** is the Web Animations API wrapper. `waapi.animate(targets, params)` creates an animation that uses the browser’s native WAAPI instead of the JS ticker. Same property/timing API as `animate()`; useful when layout or other code needs native animations (e.g. for syncing or performance).

## Usage

```javascript
import { waapi } from 'animejs';

// Same shape as animate() but runs via WAAPI
const anim = waapi.animate('.box', {
  translateX: 320,
  opacity: 0.5,
  duration: 1000,
  ease: 'inOutQuad',
  autoplay: false
});

anim.play();
anim.pause();
anim.seek(500);
anim.complete();
```

## Parameters

Same as **animate()**: targets (selector, element, array), property keyframes (number, array, `{ from, to }`, function), `duration`, `delay`, `ease`, `loop`, `alternate`, `reversed`, `autoplay`, `playbackRate`, `composition`, `onComplete`, etc. Easing strings and spring are mapped to WAAPI-compatible timing.

## Methods and properties

- **`play()` / `pause()` / `resume()`** — Standard playback.
- **`seek(time, muteCallbacks?)`** — Seek to time (ms).
- **`complete()`** — Seek to end.
- **`reverse()` / `alternate()`** — Direction.
- **`currentTime`**, **`duration`**, **`paused`**, **`completed`** — Read state.
- **`persist`** — If true, animation stays in DOM after finish (e.g. for timeline sync).
- **`sync(timeline, position)`** — Timeline can sync with this WAAPI animation via `timeline.sync(anim, position)`.

## Key points

- Use when you need native WAAPI (e.g. layout uses it for transforms, or for syncing with `timeline.sync()`).
- Same API surface as JS `animate()`; easing and spring are converted to WAAPI timing.
- Exported as **waapi**; call **waapi.animate(targets, params)**.

<!--
Source references:
- sources/anime/src/waapi/waapi.js
- https://github.com/juliangarnier/anime
-->
