---
name: core-process-model
description: Electron's main, renderer, preload, and utility processes; when to use each and how they communicate.
---

# Process Model

Electron uses Chromium's multi-process architecture: one main process, one renderer per `BrowserWindow` (or web embed), optional preload scripts, and optional utility processes.

## Main process

- Single entry point; runs in Node.js (can `require` and use Node APIs).
- Creates and manages windows via `BrowserWindow`; interacts with web content via each window's `webContents`.
- Controls app lifecycle via the `app` module (quit, dock, etc.).
- Exposes native desktop APIs (menus, dialogs, tray).

```js
const { BrowserWindow, app } = require('electron')
const win = new BrowserWindow({ width: 800, height: 600 })
win.loadURL('https://github.com')
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
```

## Renderer process

- One per open `BrowserWindow` (or web embed). Responsible for rendering web content.
- Runs in a web-like environment: HTML/CSS/JS; no direct `require` or Node APIs unless you expose them.
- For Node in renderer, use a bundler (e.g. webpack) or expose APIs via preload; do not enable `nodeIntegration` for security.

## Preload scripts

- Run in the renderer before the page loads; have access to Node and a shared `window` with the renderer.
- With **context isolation** (default since Electron 12), preload and page use different `window` objects. Use `contextBridge.exposeInMainWorld()` to expose a safe API to the page.
- Attach via `webPreferences.preload` in `BrowserWindow`.

```js
const win = new BrowserWindow({
  webPreferences: {
    preload: path.join(__dirname, 'preload.js')
  }
})
```

```js
// preload.js
const { contextBridge } = require('electron')
contextBridge.exposeInMainWorld('myAPI', { desktop: true })
```

## Utility process

- Spawned from main via the `UtilityProcess` API; runs in Node.js.
- Use for untrusted services, CPU-heavy work, or crash-prone code. Can establish a `MessagePort` channel with a renderer (unlike `child_process.fork`).

## TypeScript process aliases

- `electron/main` – types for main-process modules.
- `electron/renderer` – types for renderer modules.
- `electron/common` – types usable in both.

```js
const { shell } = require('electron/common')
const { app } = require('electron/main')
```

## Key points

- Main owns windows and lifecycle; renderers are isolated per window.
- Preload is the bridge: expose minimal, purpose-built APIs via `contextBridge`, not raw `ipcRenderer` or Node.
- Context isolation is default; do not disable it for remote content.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/process-model.md
- https://www.electronjs.org/docs/latest/tutorial/process-model
-->
