---
name: features-service-workers
description: Session service workers; getAllRunning, console-message, registration-completed; main↔SW IPC (IpcMainServiceWorker).
---

# Service Workers (Session)

Electron exposes **session**-scoped **service workers** (SW) registered by web pages via `navigator.serviceWorker.register()`. From the main process you can list running workers, observe console/registration events, and communicate with a specific worker via **IpcMainServiceWorker** (main↔SW IPC).

## Session API: serviceWorkers

Access via `session.defaultSession.serviceWorkers` (or any `Session`).

- **getAllRunning()** — Returns `Record<versionId, ServiceWorkerInfo>` (scope, scriptURL, etc.).
- **getInfoFromVersionID(versionId)** — Returns `ServiceWorkerInfo` for a version.
- **Events:** `console-message` (message, versionId, source, level, sourceUrl, lineNumber), `registration-completed` (scope), `running-status-changed` (versionId, runningStatus: starting|running|stopping|stopped).

```js
const { session } = require('electron')
session.defaultSession.serviceWorkers.getAllRunning()
session.defaultSession.serviceWorkers.on('console-message', (e, details) => {
  console.log(details.message, details.versionId)
})
```

## ServiceWorkerMain (per-worker)

Obtain a **ServiceWorkerMain** instance from the session (e.g. from info or events). It represents one running service worker version.

- **send(channel, ...args)** — Send to the SW; SW listens with `ipcRenderer.on(channel, (event, ...args) => {})`.
- **startTask()** — Returns `{ end }`; call `end()` when the task is done so the SW can terminate when idle.
- **ipc** — `IpcMainServiceWorker` for this worker (see below).
- **scope**, **scriptURL**, **versionId** (readonly).

## Main ↔ Service Worker IPC

Use **IpcMainServiceWorker** (e.g. `serviceWorker.ipc`) to communicate with that service worker. API mirrors **IpcMain**: `on`, `once`, `removeListener`, `removeAllListeners`, `handle`, `handleOnce`, `removeHandler`. The SW uses `ipcRenderer.send` / `ipcRenderer.invoke` as usual; handlers registered on `ipcMainServiceWorker` receive those messages. Do not use `ipcMain` for SW targets—use the SW-scoped `ipcMainServiceWorker`.

## Key Points

- Service workers are registered by web content; main process can observe and talk to them.
- Use `serviceWorker.ipc` (IpcMainServiceWorker) for main↔SW channels; use `serviceWorker.send(channel, ...args)` for one-way main→SW.
- Many ServiceWorker APIs are _Experimental_.

<!--
Source references:
- https://www.electronjs.org/docs/latest/api/service-workers
- https://www.electronjs.org/docs/latest/api/service-worker-main
- https://www.electronjs.org/docs/latest/api/ipc-main-service-worker
-->
