---
name: develop-menus-tray
description: Native menus (application, context, tray, dock) and Tray icon — Menu, MenuItem, Tray API usage.
---

# Menus and Tray

Electron’s `Menu` and `Tray` APIs provide native OS menus and a system tray icon. All menu types use the same `Menu` / `MenuItem` model.

## Menu types

- **Application menu:** Top-level menu; one per app. Set with `Menu.setApplicationMenu(menu)`.
- **Context menu:** Shown on right-click. Use `window.webContents.on('context-menu', (e, params) => { menu.popup() })` or equivalent.
- **Tray menu:** Right-click on the tray icon; set with `tray.setContextMenu(menu)`.
- **Dock menu (macOS):** Right-click app icon in Dock; set with `app.dock.setMenu(menu)`.

## Building a menu

Use `Menu.buildFromTemplate(template)` for a template of options, or build with `new Menu()` and `menu.append(new MenuItem({ ... }))`.

```js
const { Menu, app } = require('electron')
const menu = Menu.buildFromTemplate([
  { label: 'App', submenu: [
    { label: 'Hello' },
    { type: 'separator' },
    { label: 'Electron', type: 'checkbox', checked: true },
    { role: 'quit' }
  ]}
])
Menu.setApplicationMenu(menu)
```

Common `MenuItem` options: `label`, `accelerator`, `click`, `type` (`normal`, `separator`, `checkbox`, `radio`), `submenu`, `role` (e.g. `quit`, `copy`, `paste`). Use `role` for standard behavior when possible.

## Tray

Create a tray icon with `new Tray(image)` where `image` is a `NativeImage` or path to an icon file. Platform-specific formats apply (e.g. ICO on Windows, PNG/Template on macOS).

```js
const { Tray, Menu } = require('electron')
const tray = new Tray(path.join(__dirname, 'icon.png'))
tray.setContextMenu(Menu.buildFromTemplate([
  { label: 'Show', click: () => mainWindow.show() },
  { label: 'Quit', click: () => app.quit() }
]))
tray.setToolTip('My App')
```

To keep the app running when all windows are closed (e.g. “minimize to tray”), do not quit in `window-all-closed`:

```js
app.on('window-all-closed', () => {
  // Omit app.quit() to keep running; hide window instead if desired
})
```

## Key points

- Use `Menu.buildFromTemplate()` and `MenuItem` options (including `role`) for standard menus. Set application menu with `Menu.setApplicationMenu(menu)`.
- Tray: `new Tray(image)`, `setContextMenu(menu)`, `setToolTip()`. Omit quitting on `window-all-closed` if the app should stay running with only the tray.
- Menus run in the main process; use `webContents.send()` or IPC to trigger renderer updates from menu clicks.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/menus.md
- https://github.com/electron/electron/blob/main/docs/tutorial/tray.md
- https://www.electronjs.org/docs/latest/api/menu
- https://www.electronjs.org/docs/latest/api/tray
-->
