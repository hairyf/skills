---
name: develop-multithreading
description: Multithreading in Electron — Web Workers, nodeIntegrationInWorker; no Electron APIs in workers.
---

# Multithreading (Web Workers)

Electron renderers can use [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) to run script on background threads. Workers run in a separate context; they do not have access to the DOM or to Electron’s built-in modules.

## Node.js in Workers

To use Node.js APIs (e.g. `require`, `Buffer`, `fs`) inside a Web Worker, set `webPreferences.nodeIntegrationInWorker: true` for the `BrowserWindow` that creates the worker. This is independent of `nodeIntegration` for the main renderer. The **sandbox must not be enabled** (`sandbox: false`) for `nodeIntegrationInWorker` to be available.

```js
const win = new BrowserWindow({
  webPreferences: {
    nodeIntegrationInWorker: true,
    sandbox: false
  }
})
```

Not supported in SharedWorker or Service Worker due to sandboxing.

## Available APIs in Workers

- **Node.js:** All Node built-in modules are available when `nodeIntegrationInWorker` is true. `asar` archives can be read with Node APIs.
- **Electron:** None of Electron’s built-in modules (e.g. `ipcRenderer`, `contextBridge`) are available in workers. Do not require or import Electron in worker code.

To communicate with the main process or the renderer, pass a [MessagePort](references/features-message-ports.md) from the main process to both the renderer and a worker (or use the main process as a broker via IPC from the renderer, with the renderer posting messages to the worker).

## Native Node modules in Workers

Loading native Node modules in workers is **not** recommended. Many native addons assume a single-threaded environment; using them in workers can cause crashes or memory corruption. `process.dlopen` is not thread-safe. If you must ensure no native modules are loaded after workers start, you can override `process.dlopen` in the main thread before creating workers (e.g. throw in `dlopen` after workers are started). Prefer running native or heavy work in the main process or in a [Utility Process](https://www.electronjs.org/docs/latest/api/utility-process) instead of in a worker.

## Key points

- Use Web Workers for CPU-heavy or background work in the renderer; set `nodeIntegrationInWorker: true` (and `sandbox: false`) to use Node APIs in workers.
- Electron APIs are not available in workers; use MessagePorts or IPC via the renderer to talk to main.
- Avoid loading native Node modules in workers; use the main process or Utility Process for native or thread-unsafe code.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/multithreading.md
- https://www.electronjs.org/docs/latest/tutorial/multithreading
-->
