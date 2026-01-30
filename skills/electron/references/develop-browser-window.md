---
name: develop-browser-window
description: Creating and controlling BrowserWindow — loading content, ready-to-show, parent/child, webPreferences, and webContents.
---

# BrowserWindow

Create and control app windows from the main process. `BrowserWindow` is only available after the `app` module emits `ready`.

## Basic usage

```js
const { BrowserWindow } = require('electron')
const win = new BrowserWindow({ width: 800, height: 600 })
win.loadURL('https://github.com')
// or
win.loadFile('index.html')
```

## Showing without flash

- **Option 1:** Create the window with `show: false`, then call `win.show()` in the `ready-to-show` event so the first paint is complete before display.
- **Option 2:** Show immediately and set `backgroundColor` to match your app background so loading feels smoother.

```js
const win = new BrowserWindow({ show: false })
win.once('ready-to-show', () => win.show())
```

## Parent, child, and modal

- **Child window:** Pass `parent: parentWindow`. Child stays on top of parent.
- **Modal:** Set both `parent` and `modal: true`. Modal blocks the parent.

```js
const child = new BrowserWindow({ parent: top, modal: true, show: false })
child.loadURL('https://github.com')
child.once('ready-to-show', () => child.show())
```

## webPreferences (security-sensitive)

- **preload:** Path to preload script (use `path.join(__dirname, 'preload.js')`).
- **contextIsolation:** Default `true`; keep it on.
- **nodeIntegration:** Default `false`; keep it off for pages that load remote content.
- **sandbox:** Default `true` for renderers in Electron 20+; keep it on when possible.

Avoid: `webSecurity: false`, `allowRunningInsecureContent`, `experimentalFeatures`, `enableBlinkFeatures`.

## webContents

Each `BrowserWindow` has a `webContents` instance. Use it to:

- **Send IPC to this renderer:** `win.webContents.send(channel, ...args)`
- **Listen for navigation/load:** `will-navigate`, `did-finish-load`, etc.
- **Set window open handler:** `win.webContents.setWindowOpenHandler(({ url }) => { ... return { action: 'deny' } })`

## Key points

- Load URLs or local files with `loadURL` / `loadFile`. Use `ready-to-show` or `backgroundColor` to avoid a visible flash.
- Use `parent` and `modal` for child and modal windows. Configure `webPreferences` (preload, contextIsolation, sandbox) and avoid disabling security options.
- Use `webContents` for IPC to that window and for navigation/window-open handling.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/api/browser-window.md
- https://www.electronjs.org/docs/latest/api/browser-window
- https://github.com/electron/electron/blob/main/docs/tutorial/process-model.md
-->
