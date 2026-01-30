---
name: develop-dock
description: macOS Dock API; bounce, badge, icon, menu, hide/show; app.dock.
---

# Dock (macOS)

The Dock API (main process) controls the app’s presence in the **macOS Dock**. Access via `app.dock`. Not exported from `'electron'`; use the return value of other APIs (e.g. `app.dock`). Not available on Windows/Linux.

## Usage

```js
const { app } = require('electron')

app.dock.setBadge('3')
app.dock.bounce('informational')
const id = app.dock.bounce('critical')
app.dock.cancelBounce(id)
app.dock.setIcon('/path/to/icon.png')
```

## Methods

- **`bounce([type])`** — `informational` (default) or `critical`. Returns request id. Only bounces when app is not focused; returns -1 when focused.
- **`cancelBounce(id)`** — Cancel bounce by id.
- **`downloadFinished(filePath)`** — Bounce the Downloads stack if `filePath` is in the Downloads folder.
- **`setBadge(text)`** / **`getBadge()`** — Badge text; notification permission may be required for badge.
- **`hide()`** / **`show()`** / **`isVisible()`** — Hide or show dock icon.
- **`setMenu(menu)`** / **`getMenu()`** — Set or get the dock (right-click) menu (Electron `Menu`).
- **`setIcon(image)`** — Set dock icon (NativeImage or path).

## Key Points

- macOS only; check `process.platform === 'darwin'` before use.
- For dock menu content and UX, see [macOS Dock menu tutorial](https://www.electronjs.org/docs/latest/tutorial/macos-dock).

<!--
Source references:
- https://www.electronjs.org/docs/latest/api/dock
- https://www.electronjs.org/docs/latest/tutorial/macos-dock
-->
