---
name: features-scroll
description: onScroll and ScrollObserver for scroll-linked animations and scroll progress
---

# Scroll (onScroll / ScrollObserver)

`onScroll(parameters)` creates a **ScrollObserver** that tracks scroll position (in a container or window) and exposes progress, enter/leave thresholds, and optional sync with an animation or timeline. Use for scroll-driven animations (parallax, reveal, scrub).

## Usage

```javascript
import { onScroll, animate, createTimeline } from 'animejs';

// Observe scroll on default container (window), target = element to track
const observer = onScroll({
  target: '.section',
  container: document.querySelector('.scroll-container'), // optional
  axis: 'y',           // 'x' | 'y'
  enter: 'end start',  // when "enter" is considered (e.g. end of element at start of viewport)
  leave: 'start end',
  repeat: true,
  onUpdate: (self) => {
    console.log(self.progress);  // 0–1 over scroll range
  },
  onEnter: (self) => console.log('entered'),
  onLeave: (self) => console.log('left')
});

// Link animation/timeline so it’s driven by scroll (scrub)
const tl = createTimeline({ autoplay: false });
tl.add('.box', { x: 300, duration: 1 });
observer.link(tl);  // tl.play()/pause()/seek follow scroll
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `target` | Element (or selector) whose position defines the scroll range. |
| `container` | Scroll container element; default is window. |
| `axis` | `'x'` or `'y'`. |
| `enter` / `leave` | Threshold strings (e.g. `'end start'`, `'start end'`) for when enter/leave fire. |
| `repeat` | Whether to recompute when scrolling back. |
| `sync` | Easing or `'play pause'` etc. for linked animation sync. |
| `onEnter`, `onLeave`, `onUpdate`, `onResize` | Callbacks. |

## ScrollObserver API

- **`link(animation | timeline)`** — Drive the given animation/timeline with scroll (scrub).
- **`refresh()`** — Recompute bounds (e.g. after layout change).
- **`revert()`** — Reset and stop observing.
- **`progress`** — 0–1 over the scroll range for the target.
- **`scroll`**, **`velocity`**, **`backward`** — Current scroll state.

## Key points

- **Scope** is viewport enter/leave for triggering logic; **onScroll** is scroll position and progress for scrubbing or continuous updates.
- Use `link(timeline)` with `autoplay: false` for scroll-scrubbed timelines.
- Use `scrollContainers` (exported) only if you need direct container access.

<!--
Source references:
- sources/anime/src/events/scroll.js
- https://github.com/juliangarnier/anime
-->
