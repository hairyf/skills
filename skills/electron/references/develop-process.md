---
name: develop-process
description: process object — process.type, process.versions, process.platform, process.contextIsolated, process.sandboxed.
---

# Process Object

Electron extends Node’s **process** object with extra properties and methods. Use them to detect the current process type, Electron/Chrome versions, sandbox and context-isolation state, and app paths.

## Process type

- **process.type** — `'browser'` (main process), `'renderer'`, `'utility'`, `'worker'`, or `'service-worker'`. Use to branch code that runs in multiple process types (e.g. in shared code required from main and preload).

```js
if (process.type === 'browser') {
  // main process only
} else if (process.type === 'renderer') {
  // renderer (or preload, which runs in renderer context)
}
```

## Versions

- **process.versions.electron** — Electron version string (e.g. `"28.0.0"`).
- **process.versions.chrome** — Chromium version string.
- **process.version** — Node.js version (from Node’s process).

Use for diagnostics, conditional behavior, or logging.

## Platform and store

- **process.platform** — `'darwin'`, `'win32'`, or `'linux'`.
- **process.mas** — `true` when the app is a Mac App Store build; otherwise `undefined`.
- **process.windowsStore** — `true` when the app is running as an MSIX/AppX package (Windows Store); otherwise `undefined`.

Use **process.mas** / **process.windowsStore** to enable or disable features that are not allowed in store builds (e.g. certain native modules or auto-updaters).

## Sandbox and context isolation

- **process.sandboxed** — `true` when the renderer is sandboxed; `undefined` in main.
- **process.contextIsolated** — `true` when context isolation is enabled in the current renderer; `undefined` in main.

Use in preload or renderer to adapt to sandbox/context-isolation (e.g. only expose APIs when contextIsolated).

## Paths and resources

- **process.resourcesPath** — Path to the resources directory (e.g. where `app.asar` or the app folder lives in a packaged app).
- **process.defaultApp** — `true` in main when the app was started as the default Electron executable (e.g. `electron .`). Useful for slicing **process.argv**.

## Utility process

- **process.parentPort** — In a utility process, the port for communicating with the parent (main process); otherwise `null`. Use for **postMessage** / **on('message')** in the child script.

## Other

- **process.noAsar** — Set to `true` to disable ASAR support in Node built-in modules in that process.
- **process.crash()** — Crashes the process (for testing crash reporter).
- **process.getHeapStatistics()**, **process.getProcessMemoryInfo()**, **process.getCPUUsage()** — Memory and CPU stats (see [process API](https://www.electronjs.org/docs/latest/api/process)).

In **sandboxed** renderers, only a subset of **process** is available (e.g. **type**, **versions**, **platform**, **sandboxed**, **contextIsolated**); see the [process API](https://www.electronjs.org/docs/latest/api/process).

## Key points

- Use **process.type** to branch between main/renderer/utility. Use **process.versions.electron** and **process.platform** for version and platform checks.
- Use **process.mas** and **process.windowsStore** to detect store builds. Use **process.sandboxed** and **process.contextIsolated** in renderer/preload.
- Use **process.resourcesPath** for paths to app resources; use **process.parentPort** in utility process scripts.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/api/process.md
- https://www.electronjs.org/docs/latest/api/process
-->
