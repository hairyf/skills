---
name: core-context-isolation
description: Context isolation and contextBridge — exposing safe APIs from preload to renderer without leaking privileged APIs.
---

# Context Isolation

Context isolation keeps preload and Electron internals in a separate JavaScript context from the loaded page. The page’s `window` is not the same object as the preload’s. This prevents the page from touching Node/Electron APIs or anything you attach in preload unless you explicitly expose it.

Context isolation has been default since Electron 12 and should stay enabled for all apps.

## Exposing APIs: contextBridge

You cannot assign to `window` in preload and have the page see it when isolation is on. Use `contextBridge.exposeInMainWorld(key, api)` to define a read-only API the page can use.

```js
// preload.js
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
  loadPreferences: () => ipcRenderer.invoke('load-prefs'),
  doAThing: () => {}
})
```

```js
// renderer
window.myAPI.loadPreferences()
```

Limitations: you cannot pass custom prototypes or symbols over the bridge; only serializable data and functions.

## Security: one method per action

Do not expose raw IPC or powerful APIs. Prefer one method per action with fixed semantics:

```js
// Bad — allows arbitrary IPC from renderer
contextBridge.exposeInMainWorld('myAPI', { send: ipcRenderer.send })

// Good — only allows one specific action
contextBridge.exposeInMainWorld('myAPI', {
  loadPreferences: () => ipcRenderer.invoke('load-prefs')
})
```

When exposing main-to-renderer listeners, wrap the callback so the renderer only receives data, not the IPC event (which would expose `sender`):

```js
// Good
onUpdateCounter: (callback) =>
  ipcRenderer.on('update-counter', (_event, value) => callback(value))
```

## TypeScript

Extend the global `Window` interface so the renderer has types for your exposed API:

```ts
// e.g. preload.d.ts or global.d.ts
export interface IElectronAPI {
  loadPreferences: () => Promise<void>
}
declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
```

## Key points

- Context isolation is on by default; keep it on. Use `contextBridge` to expose a minimal, purpose-built API.
- Expose one method per IPC action; never expose `ipcRenderer` or the event object to the renderer.
- Use TypeScript declaration merging to type the exposed API on `window`.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/context-isolation.md
- https://www.electronjs.org/docs/latest/tutorial/context-isolation
-->
