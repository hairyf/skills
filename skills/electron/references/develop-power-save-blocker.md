---
name: develop-power-save-blocker
description: Prevent system sleep (display or app suspension) with powerSaveBlocker; start/stop by id, precedence.
---

# Power Save Blocker

The `powerSaveBlocker` module (main process) blocks the system from entering low-power mode. Use it when the app must keep running (e.g. downloads, media playback) or keep the display on (e.g. video).

## Usage

Call `powerSaveBlocker.start(type)` to begin blocking; it returns an integer **id**. Call `powerSaveBlocker.stop(id)` when done. Check status with `powerSaveBlocker.isStarted(id)`.

```js
const { powerSaveBlocker } = require('electron')

const id = powerSaveBlocker.start('prevent-display-sleep')
console.log(powerSaveBlocker.isStarted(id)) // true

// Later, e.g. when video ends
powerSaveBlocker.stop(id)
```

## Types

- **`prevent-app-suspension`** — Prevents the app from being suspended. System can stay active while the screen is off. Use for downloads or audio playback.
- **`prevent-display-sleep`** — Prevents the display from sleeping. Use for video or presentations.

**Precedence:** `prevent-display-sleep` overrides `prevent-app-suspension`. If multiple callers use different types, only the highest precedence (display sleep) is active until that blocker is stopped.

## Key Points

- Main process only; call from main or expose via IPC.
- One blocker per `start()`; track ids if you start multiple (e.g. per window).
- Stop blockers when no longer needed to avoid draining battery.

<!--
Source references:
- https://www.electronjs.org/docs/latest/api/power-save-blocker
-->
