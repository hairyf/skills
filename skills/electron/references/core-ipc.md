---
name: core-ipc
description: IPC patterns in Electron — renderer-to-main (one-way and two-way), main-to-renderer, and object serialization.
---

# Inter-Process Communication (IPC)

IPC is how the main and renderer processes talk. Use `ipcMain` in main and `ipcRenderer` in the preload (then expose wrapped APIs via `contextBridge`). Channels are arbitrary names and bidirectional.

## Renderer → Main (one-way)

- **Main:** `ipcMain.on(channel, (event, ...args) => { ... })`
- **Preload:** expose a function that calls `ipcRenderer.send(channel, ...args)`; do not expose `ipcRenderer.send` itself.

```js
// main
ipcMain.on('set-title', (event, title) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) win.setTitle(title)
})

// preload
contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('set-title', title)
})
```

## Renderer → Main (two-way, preferred)

- **Main:** `ipcMain.handle(channel, async (event, ...args) => { return result })`
- **Preload:** expose a function that returns `ipcRenderer.invoke(channel, ...args)` (a Promise).

```js
// main
ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({})
  return canceled ? undefined : filePaths[0]
})

// preload
contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile')
})
```

Errors thrown in `handle` are serialized; only the error `message` is passed to the renderer.

## Main → Renderer

- Use `webContents.send(channel, ...args)`. The renderer receives via a listener exposed through the preload (wrap `ipcRenderer.on` so the callback only receives data, not `event`, to avoid leaking `ipcRenderer`).

```js
// main
mainWindow.webContents.send('update-counter', 1)

// preload — wrap so callback gets only value
contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateCounter: (callback) =>
    ipcRenderer.on('update-counter', (_event, value) => callback(value))
})
```

## Renderer to renderer

- No direct IPC. Either: (1) main as broker (renderer A → main → renderer B), or (2) pass a `MessagePort` from main to both renderers for direct messaging.

## Object serialization

IPC uses the **Structured Clone Algorithm**. DOM objects, Node streams, and Electron objects (e.g. `WebContents`, `BrowserWindow`) are not serializable. Pass plain data only.

## Key points

- Prefer `invoke`/`handle` for two-way; avoid `sendSync` (blocks the renderer).
- Never expose raw `ipcRenderer` or pass the IPC event/callback directly to the renderer; always expose one method per action and wrap listeners so only safe arguments are passed.
- Validate `event.sender` / `event.senderFrame` in main when handling sensitive IPC.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/ipc.md
- https://www.electronjs.org/docs/latest/tutorial/ipc
-->
