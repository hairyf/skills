---
name: develop-drag-drop
description: Native file drag and drop out of the window — webContents.startDrag, ondragstart IPC pattern.
---

# Native File Drag and Drop

Dragging files into the window uses standard web drag-and-drop. To **drag files out** of the window (e.g. from your app to the desktop or another app), use `webContents.startDrag(item)` from the main process in response to a drag that started in the renderer.

## Flow

1. **Renderer:** Mark an element as `draggable`, handle `ondragstart`; call a preload API (e.g. `window.electron.startDrag(fileName)`) that sends an IPC to main (e.g. `ipcRenderer.send('ondragstart', fileName)`).
2. **Main:** Listen for the IPC (e.g. `ipcMain.on('ondragstart', (event, fileName) => { ... })`). Resolve the file path(s) and optional icon path, then call `event.sender.startDrag(options)`.

## startDrag(options)

`webContents.startDrag(options)` takes an object:

- `file` — Path to the file (or multiple files) to drag. On Windows you can pass a single path or an array of paths; on macOS only the first path is used for the drag.
- `icon` — Path to an image to show as the drag image (e.g. file icon). Optional.

```js
// main
ipcMain.on('ondragstart', (event, fileName) => {
  const path = require('path')
  const filePath = path.join(__dirname, fileName)
  const iconPath = path.join(__dirname, 'icon.png')
  event.sender.startDrag({
    file: filePath,
    icon: iconPath
  })
})
```

```js
// preload
contextBridge.exposeInMainWorld('electron', {
  startDrag: (fileName) => ipcRenderer.send('ondragstart', fileName)
})
```

```js
// renderer
document.getElementById('drag').ondragstart = (e) => {
  e.preventDefault()
  window.electron.startDrag('example.txt')
}
```

## Key points

- Dragging **out** requires main process: renderer sends path (or identifier) via IPC; main calls `webContents.startDrag({ file, icon })`.
- Use a single file path (or array on Windows); provide an `icon` path for a custom drag image.
- Dragging **in** uses the standard HTML5 drag-and-drop API and `dataTransfer.files` in the renderer.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/native-file-drag-drop.md
- https://www.electronjs.org/docs/latest/tutorial/native-file-drag-drop
- https://www.electronjs.org/docs/latest/api/web-contents#contentsstartdragitem
-->
