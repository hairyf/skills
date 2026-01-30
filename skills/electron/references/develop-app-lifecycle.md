---
name: develop-app-lifecycle
description: App module lifecycle — whenReady, window-all-closed, quit, single instance lock, and platform events.
---

# App Lifecycle

The `app` module (main process only) controls startup, shutdown, and app-level behavior. Use `app.whenReady()` or the `ready` event before creating windows or using most Electron APIs.

## Ready

Electron emits `ready` once when initialization is done. Prefer `app.whenReady()` (returns a Promise) so you can await before creating windows:

```js
const { app, BrowserWindow } = require('electron')

app.whenReady().then(() => {
  const win = new BrowserWindow({ width: 800, height: 600 })
  win.loadFile('index.html')
})
```

You can also use `app.isReady()` to check if `ready` has already fired. Do not call BrowserWindow or other UI APIs before `ready`.

## Window lifecycle and quit

- **`window-all-closed`** — Emitted when all windows have been closed. If you do **not** listen, the app quits when the last window closes. If you **do** listen, you decide whether to quit (e.g. keep running for a tray-only app).
- **`before-quit`** / **`will-quit`** / **`quit`** — Emitted during shutdown. Call `event.preventDefault()` in `before-quit` or `will-quit` to cancel quit (use sparingly).

Typical pattern: quit on Windows/Linux when all windows are closed; on macOS keep the app running until the user quits (e.g. Cmd+Q or menu):

```js
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
```

## Single instance lock

To allow only one instance of the app (e.g. focus existing window when user launches again), use `app.requestSingleInstanceLock()`. If it returns `false`, a second instance already has the lock; quit this process. If it returns `true`, listen for `second-instance` to bring the first instance to the front or open a new window:

```js
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (_event, argv, cwd) => {
    // Focus or show the existing window; optionally open a file from argv
    mainWindow?.show()
  })
}
```

Release the lock with `app.releaseSingleInstanceLock()` if you need to allow multiple instances again.

## Platform-specific events

- **macOS:** `open-file` (open file with app), `open-url` (open URL scheme), `activate` (dock click / re-launch), `new-window-for-tab` (native new tab button when using `tabbingIdentifier`).
- Listen to `open-file` / `open-url` early (before `ready` if the app was launched to handle a file/URL).

## Key points

- Use `app.whenReady()` before creating windows or using UI APIs.
- Use `window-all-closed` to decide whether to quit when all windows close; on macOS often keep the app running.
- Use `requestSingleInstanceLock()` and `second-instance` for single-instance behavior; release with `releaseSingleInstanceLock()` if needed.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/api/app.md
- https://www.electronjs.org/docs/latest/api/app
- https://github.com/electron/electron/blob/main/docs/tutorial/launch-app-from-url-in-another-app.md
-->
