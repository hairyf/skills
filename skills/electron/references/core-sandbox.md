---
name: core-sandbox
description: Process sandboxing in Electron — default behavior, preload polyfill, and when the sandbox is disabled.
---

# Process Sandboxing

Electron uses Chromium’s sandbox to limit what renderer processes can do (e.g. no direct filesystem or shell access). Sandboxed renderers delegate privileged work to the main process via IPC.

Since Electron 20, the sandbox is enabled for renderers by default. Enabling Node integration (`nodeIntegration: true`) for a renderer disables the sandbox for that process; disabling context isolation also disables sandboxing for that process.

## Sandboxed renderer behavior

- Behaves like a normal Chrome renderer: no Node.js environment in the page.
- Privileged tasks (fs, shell, etc.) must go through the main process (e.g. `ipcMain.handle`).

## Preload in sandboxed renderers

Preload scripts still run and get a **limited** Node-like environment so they can bridge to main:

- A restricted `require` that can only load: `electron` (renderer-safe modules: `contextBridge`, `crashReporter`, `ipcRenderer`, `nativeImage`, `webFrame`, `webUtils`), and Node built-ins `events`, `timers`, `url` (and `node:events`, etc.).
- Globals: `Buffer`, `process`, `clearImmediate`, `setImmediate`.

You cannot use CommonJS to split the preload into multiple files; use a bundler (e.g. webpack, Parcel) if needed. Do not leak this privileged preload API to the page — use `contextBridge` to expose a minimal API.

## Disabling the sandbox (single window)

Only if you have a strong reason (e.g. legacy code that needs Node in renderer):

```js
const win = new BrowserWindow({
  webPreferences: {
    sandbox: false
  }
})
```

Prefer keeping the sandbox on and moving privileged logic to the main process or a utility process.

## Key points

- Sandbox is on by default for renderers (Electron 20+). Keep it on for security.
- `nodeIntegration: true` or disabling context isolation turns off the sandbox for that renderer.
- Preload in sandboxed renderers has a limited `require` and specific globals; expose only what the page needs via `contextBridge`.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/sandbox.md
- https://www.electronjs.org/docs/latest/tutorial/sandbox
-->
