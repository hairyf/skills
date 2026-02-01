---
name: core-timer
description: createTimer and Timer for time-based callbacks, frame loops, and animation control
---

# Timer

`createTimer(parameters)` creates a Timer instance (same base as animations and timelines). Use it for periodic callbacks (`onUpdate` + `frameRate`), delayed/one-shot callbacks, or scroll-linked animation via `autoplay: scrollObserver`.

## Usage

```javascript
import { createTimer } from 'animejs';

// Periodic callback (e.g. 4 FPS)
const timer = createTimer({
  frameRate: 4,
  onUpdate: (self) => {
    console.log(self.currentTime, self.progress);
  }
});

// One-shot or finite duration
createTimer({
  duration: 2000,
  onComplete: (self) => console.log('Done')
});

// With loop and delay
createTimer({
  delay: 500,
  duration: 1000,
  loop: 3,
  loopDelay: 200,
  onLoop: (self) => console.log(self.loopCount)
});
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `duration` | Length in ms (omit or use function for infinite). |
| `delay` | Delay before start (ms). |
| `loop` | `true`, number, or omit for no loop. |
| `loopDelay` | Delay between iterations (ms). |
| `frameRate` | Cap update rate (FPS); use with `onUpdate` for periodic work. |
| `autoplay` | `true` (default) or `false`; or a ScrollObserver for scroll-linked playback. |
| `onUpdate` | Called each frame (or at `frameRate`). |
| `onComplete`, `onLoop`, `onPause`, `onBegin`, `onBeforeUpdate` | Lifecycle callbacks. |
| `playbackRate`, `reversed`, `alternate` | Playback options. |

## Methods and properties

- **`play()` / `pause()` / `resume()`** — Start or pause.
- **`seek(time, muteCallbacks?)`** — Jump to time (ms).
- **`restart()`** — Reset and play.
- **`complete(muteCallbacks?)`** — Seek to end and cancel.
- **`cancel()`** — Stop and remove from engine.
- **`revert()`** — Seek to 0 and cancel; unlink scroll if set.
- **`then(callback)`** — Promise that resolves when timer completes.
- **`progress`**, **`currentTime`**, **`duration`**, **`paused`**, **`completed`** — Read state.

Call `createTimer(params)` to get an initialized timer; it auto-plays unless `autoplay: false`.

## Key points

- Timer is the base for animations and timelines; same playback API (play, pause, seek, etc.).
- Use `frameRate` with `onUpdate` for throttled updates (e.g. particle systems).
- Use `autoplay: scrollObserver` to drive playback from scroll (e.g. `onScroll({ ... }).link(timeline)`).

<!--
Source references:
- sources/anime/src/timer/timer.js
- https://github.com/juliangarnier/anime
-->
