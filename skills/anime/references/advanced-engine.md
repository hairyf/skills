---
name: advanced-engine
description: Global animation engine—pause, resume, speed, timeUnit, precision
---

# Engine

The global **engine** drives all timers, animations, and timelines. Use it to pause/resume everything, change global speed, time unit, or precision.

## Usage

```javascript
import { engine } from 'animejs';

// Pause all animations
engine.pause();

// Resume all
engine.resume();

// Global playback speed (default 1)
engine.speed = 2;

// Time unit: 'ms' (default) or 's'
engine.timeUnit = 's';

// Numeric precision for rendered values
engine.precision = 4;

// Pause when document is hidden (default true)
engine.pauseOnDocumentHidden = false;
```

## Properties and methods

| Member | Description |
|--------|-------------|
| **`pause()`** | Stops the engine tick; all animations pause. |
| **`resume()`** | Restarts the engine; resets child start times and runs. |
| **`speed`** | Get/set global playback rate (multiplies child speeds). |
| **`timeUnit`** | `'ms'` or `'s'`; affects default duration scale. |
| **`precision`** | Decimal places for computed values. |
| **`pauseOnDocumentHidden`** | If true, engine pauses on `visibilitychange` (document hidden). |
| **`wake()`** | Internal: starts the requestAnimationFrame loop when there are children. |

## Key points

- One engine instance; timers/animations/timelines register with it when playing.
- Use `engine.pause()` / `engine.resume()` to freeze or unfreeze all animations.
- Changing `timeUnit` to `'s'` scales default durations (e.g. 1 = 1 second).

<!--
Source references:
- sources/anime/src/engine/engine.js
- https://github.com/juliangarnier/anime
-->
