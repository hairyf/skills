---
name: develop-dialog
description: Native system dialogs — showOpenDialog, showSaveDialog, showMessageBox; main process only, expose via IPC.
---

# Dialog

The `dialog` module (main process only) shows native open/save file dialogs and message boxes. Call it from the main process and expose results to the renderer via IPC (e.g. `ipcMain.handle` + preload).

## Open dialog

- **`dialog.showOpenDialog([window,] options)`** — Returns a Promise `{ canceled, filePaths }` (and `bookmarks` on macOS when using security-scoped bookmarks).
- **`dialog.showOpenDialogSync([window,] options)`** — Synchronous; returns `string[] | undefined` (paths or undefined if canceled).

Options include: `title`, `defaultPath`, `buttonLabel`, `filters` (e.g. `{ name: 'Images', extensions: ['jpg', 'png'] }`), `properties` (`openFile`, `openDirectory`, `multiSelections`, `showHiddenFiles`, etc.). Pass a `BrowserWindow` as the first argument to make the dialog modal to that window.

```js
const { dialog } = require('electron')
const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
  properties: ['openFile', 'multiSelections'],
  filters: [{ name: 'Images', extensions: ['jpg', 'png'] }]
})
if (!canceled) {
  // use filePaths
}
```

## Save dialog

- **`dialog.showSaveDialog([window,] options)`** — Returns a Promise `{ canceled, filePath }` (and `bookmark` on macOS when applicable).
- **`dialog.showSaveDialogSync([window,] options)`** — Synchronous; returns `string | undefined`.

Options: `title`, `defaultPath`, `buttonLabel`, `filters`, `nameFieldLabel`, `showsTagField`, etc.

## Message box

- **`dialog.showMessageBox([window,] options)`** — Returns a Promise with `response` (index of clicked button) and `checkboxChecked` if a checkbox was used.
- **`dialog.showMessageBoxSync([window,] options)`** — Synchronous; returns the response index.

Options: `type` (`none` | `info` | `error` | `question` | `warning`), `title`, `message`, `detail`, `buttons`, `defaultId`, `cancelId`, `checkboxLabel`, `checkboxChecked`, `noLink`, etc.

```js
const { response } = await dialog.showMessageBox(mainWindow, {
  type: 'question',
  buttons: ['Cancel', 'Overwrite'],
  defaultId: 1,
  message: 'File already exists. Overwrite?'
})
if (response === 1) {
  // overwrite
}
```

## Exposing to the renderer

Do not require `dialog` in the renderer. In the main process, register handlers (e.g. `ipcMain.handle('dialog:openFile', async () => { ... })`) and in the preload expose a small API (e.g. `openFile: () => ipcRenderer.invoke('dialog:openFile')`). See [core-ipc](references/core-ipc.md).

## Key points

- All `dialog` methods run in the main process. Use IPC (invoke/handle) to trigger them from the renderer and return results.
- Use async methods in main to avoid blocking; use sync only when necessary (e.g. in a synchronous IPC handler is still not ideal—prefer async).
- `filters` extensions: use `['jpg','png']` not `['*.jpg']`; use `['*']` for "All files".

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/api/dialog.md
- https://www.electronjs.org/docs/latest/api/dialog
- https://github.com/electron/electron/blob/main/docs/tutorial/ipc.md
-->
