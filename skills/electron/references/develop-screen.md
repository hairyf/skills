---
name: develop-screen
description: Screen API — getPrimaryDisplay, getAllDisplays, workAreaSize, bounds, display-added/removed.
---

# Screen

The `screen` module (main process) provides display information: size, work area (excluding taskbar/dock), position, and DPI. Use it to position or size windows, or to react to display changes. Cannot be used before the `app` `ready` event.

> In the renderer, `window.screen` is the DOM property; do not use `const { screen } = require('electron')` in the renderer. Use the screen API from the main process and pass data via IPC if the renderer needs it.

## Primary display and all displays

- **`screen.getPrimaryDisplay()`** — Returns the primary [Display](https://www.electronjs.org/docs/latest/api/structures/display) object.
- **`screen.getAllDisplays()`** — Returns an array of all displays.

Display properties include:
- **bounds** — `{ x, y, width, height }` (physical pixels).
- **workArea** — Same structure; excludes OS UI (taskbar, dock, menu bar).
- **workAreaSize** — `{ width, height }` of the work area.
- **scaleFactor** — Device pixel ratio (physical / DIP).
- **id**, **rotation**, **touchSupport**, **internal** — See the [Display](https://www.electronjs.org/docs/latest/api/structures/display) docs.

## Positioning a window

Use `bounds` or `workArea` to place a window on a specific display:

```js
const { screen, BrowserWindow } = require('electron')

const primary = screen.getPrimaryDisplay()
const { width, height } = primary.workAreaSize
const win = new BrowserWindow({ width, height })

// Or on an external display
const displays = screen.getAllDisplays()
const external = displays.find(d => d.bounds.x !== 0 || d.bounds.y !== 0)
if (external) {
  const win = new BrowserWindow({
    x: external.bounds.x + 50,
    y: external.bounds.y + 50,
    width: 800,
    height: 600
  })
}
```

## Display events

- **`display-added`** — A new display was connected; `event.newDisplay`.
- **`display-removed`** — A display was disconnected; `event.oldDisplay`.
- **`display-metrics-changed`** — A display’s bounds, work area, or scale factor changed.

Use these to reposition or resize windows when the user connects a monitor or changes resolution.

## Key points

- Use **getPrimaryDisplay()** and **getAllDisplays()** for bounds and **workArea** / **workAreaSize**; coordinates are in physical pixels (see **scaleFactor** for DIP).
- Use **display-added** / **display-removed** / **display-metrics-changed** to react to multi-monitor or resolution changes.
- Use the screen API only in the **main process**; expose data to the renderer via IPC if needed.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/api/screen.md
- https://www.electronjs.org/docs/latest/api/screen
- https://www.electronjs.org/docs/latest/api/structures/display
-->
