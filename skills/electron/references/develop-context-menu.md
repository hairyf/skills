---
name: develop-context-menu
description: Context menu (right-click) in Electron — webContents context-menu event, Menu.popup, and renderer-side trigger via IPC.
---

# Context Menu

Context menus appear on right-click (or platform shortcut, e.g. Shift+F10 on Windows). Electron does not show one by default; you build a `Menu` and call `menu.popup()` when the user triggers the context menu.

## Main process: webContents `context-menu` event

Listen for the `context-menu` event on a `webContents` instance. It fires when the user right-clicks in that window; the callback receives `(event, params)`. Use `params` to decide what menu to show (e.g. link vs editable vs selection). Then call `Menu.popup(options)` with the target window and optional position.

```js
const { BrowserWindow, Menu } = require('electron')

const win = new BrowserWindow()
const menu = Menu.buildFromTemplate([
  { label: 'Copy', role: 'copy' },
  { type: 'separator' },
  { label: 'Inspect', click: () => win.webContents.inspectElement(params.x, params.y) }
])

win.webContents.on('context-menu', (_event, params) => {
  if (params.isEditable) {
    Menu.buildFromTemplate([
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ]).popup({ window: win, x: params.x, y: params.y })
  } else {
    menu.popup({ window: win, x: params.x, y: params.y })
  }
})
```

Useful `params` fields: `x`, `y`, `linkURL`, `linkText`, `selectionText`, `isEditable`, `editFlags`, `mediaType`, `srcURL`. On macOS, pass `params.frame` to `popup({ frame: params.frame })` if you want Writing Tools / Services in the menu.

## Renderer process: DOM `contextmenu` event

Alternatively, listen for the DOM `contextmenu` event in the renderer and send a message to the main process (e.g. via IPC) with coordinates and context; main then builds the menu and calls `menu.popup()`. This gives the renderer control over when to show a context menu (e.g. only on certain elements).

```js
// renderer
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  window.electronAPI.showContextMenu(e.clientX, e.clientY, { ... })
})
```

Main receives the IPC, builds the menu, and calls `menu.popup({ window: mainWindow, x, y })`.

## Key points

- Use `webContents.on('context-menu', (event, params) => { ... })` in main to show a menu at `params.x`, `params.y`; build the menu from `params` (link, editable, selection, etc.).
- Or use the DOM `contextmenu` event in the renderer and IPC to main to pop up the menu.
- Use `Menu.buildFromTemplate()` and `role` where possible (e.g. `copy`, `paste`, `editMenu`). On macOS, pass `frame: params.frame` for Writing Tools / Services.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/context-menu.md
- https://www.electronjs.org/docs/latest/tutorial/context-menu
- https://www.electronjs.org/docs/latest/api/web-contents#event-context-menu
-->
