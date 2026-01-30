---
name: develop-progress-bar
description: Progress bar outside the window — setProgressBar on BrowserWindow (taskbar/dock/Unity).
---

# Progress Bar

Show progress outside the window: on Windows in the taskbar button, on macOS in the dock icon, on Linux in the Unity launcher (when supported). Use `BrowserWindow.setProgressBar(progress)`.

## API

- **`win.setProgressBar(progress)`** — `progress` is a number between `0` and `1` (e.g. `0.63` for 63%). Removes the bar when set to `-1`. On Windows, values greater than `1` show an indeterminate (pulsing) progress bar; on other platforms they may clamp to 1.
- **`win.setProgressBar(progress, options)`** — On Windows you can pass a second argument `{ mode: 'normal' | 'indeterminate' | 'error' | 'paused' }` for the taskbar button state.

```js
// 63% progress
win.setProgressBar(0.63)

// Indeterminate (Windows: pulsing; macOS/Linux: indeterminate or full)
win.setProgressBar(2)

// Remove progress bar
win.setProgressBar(-1)

// Windows: error state
win.setProgressBar(0.5, { mode: 'error' })
```

## Platform behavior

- **Windows:** Each window can have its own progress bar in its taskbar button.
- **macOS / Linux (Unity):** One progress bar per application (shared across windows).

Update the bar from the main process (e.g. in an IPC handler when the renderer reports download or task progress). Clear it with `setProgressBar(-1)` when the operation finishes.

## Key points

- Use `win.setProgressBar(progress)` with `0`–`1` for percentage, `-1` to clear, `>1` for indeterminate on Windows.
- On Windows you can set `mode` to `'error'` or `'paused'`; on macOS/Linux the bar is app-wide.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/progress-bar.md
- https://www.electronjs.org/docs/latest/tutorial/progress-bar
- https://www.electronjs.org/docs/latest/api/browser-window#winsetprogressbarprogress-options
-->
