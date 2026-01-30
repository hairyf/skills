---
name: develop-power-monitor
description: powerMonitor — suspend, resume, battery/AC, thermal-state-change, shutdown, lock-screen.
---

# Power Monitor

The `powerMonitor` module (main process) emits events when the system’s power state changes. Use it to pause heavy work on suspend or battery, react to thermal throttling, or delay shutdown for a clean exit.

## Events

- **`suspend`** — System is suspending (sleep).
- **`resume`** — System is resuming from suspend.
- **`on-ac`** (macOS, Windows) — System switched to AC power.
- **`on-battery`** (macOS, Windows) — System switched to battery.
- **`thermal-state-change`** (macOS) — `details.state`: `'unknown' | 'nominal' | 'fair' | 'serious' | 'critical'`. React by reducing CPU-heavy work or notifying the user.
- **`speed-limit-change`** (macOS, Windows) — `details.limit` is the OS-advertised CPU speed limit (percent). Below 100 indicates thermal throttling.
- **`shutdown`** (Linux, macOS) — System is about to reboot or shut down. Call `event.preventDefault()` to delay shutdown so the app can exit cleanly (e.g. save state, then `app.quit()`).
- **`lock-screen`** (macOS, Windows) — System is about to lock the screen.
- **`unlock-screen`** (macOS, Windows) — Screen was unlocked.
- **`user-did-become-active`** / **`user-did-resign-active`** (macOS) — Login session activated/deactivated.

```js
const { powerMonitor } = require('electron')

powerMonitor.on('suspend', () => {
  // Pause background work, stop timers, etc.
})

powerMonitor.on('resume', () => {
  // Resume work
})

powerMonitor.on('thermal-state-change', (event, state) => {
  if (state === 'critical') {
    // Reduce encoding, heavy computation, or notify user
  }
})

powerMonitor.on('shutdown', (event) => {
  event.preventDefault()
  saveState().then(() => app.quit())
})
```

## Key points

- Use **suspend** / **resume** to pause/resume background work. Use **on-battery** / **on-ac** to adjust behavior (e.g. reduce updates on battery).
- Use **thermal-state-change** and **speed-limit-change** to reduce CPU load when the system is throttling.
- Use **shutdown** with **preventDefault()** to delay reboot/shutdown and exit cleanly; call **app.quit()** as soon as possible.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/api/power-monitor.md
- https://www.electronjs.org/docs/latest/api/power-monitor
-->
