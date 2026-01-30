---
name: develop-keyboard-shortcuts
description: Keyboard shortcuts in Electron — accelerators, local (MenuItem), global (globalShortcut), and before-input-event.
---

# Keyboard Shortcuts

## Accelerators

Accelerators are strings that represent key combinations: modifiers and one key code, joined by `+`. Examples: `CommandOrControl+C`, `Alt+Shift+F4`. Use `CommandOrControl` (or `CmdOrCtrl`) for cross-platform shortcuts (⌘ on macOS, Ctrl on Windows/Linux). On Windows/Linux, `Command` has no effect; use `CommandOrControl` instead. Accelerators are case-insensitive.

Common modifiers: `Command`/`Cmd`, `Control`/`Ctrl`, `CommandOrControl`/`CmdOrCtrl`, `Alt`, `Option`, `Shift`, `Super`/`Meta`. Key codes: `A`–`Z`, `0`–`9`, `F1`–`F24`, `Space`, `Tab`, `Return`/`Enter`, `Backspace`, `Delete`, `Up`/`Down`/`Left`/`Right`, `Escape`/`Esc`, etc.

## Local shortcuts (menu)

Local shortcuts work only when the app is focused and are tied to the application menu. Set the `accelerator` property on a `MenuItem`; the menu item’s `click` handler runs when the user presses that key.

```js
const { Menu } = require('electron')
Menu.setApplicationMenu(Menu.buildFromTemplate([
  {
    label: 'Open Dialog',
    accelerator: 'CommandOrControl+Alt+R',
    click: () => { /* ... */ }
  }
]))
```

You can hide the menu item but still have the accelerator work (on macOS you can set `acceleratorWorksWhenHidden: false` to disable that). Use `role` for standard actions (e.g. `copy`, `paste`, `quit`) so the OS provides the correct accelerator.

## Global shortcuts

Global shortcuts work when the app is in the background. Register them with `globalShortcut.register(accelerator, callback)` (main process). Unregister with `globalShortcut.unregister(accelerator)` or `globalShortcut.unregisterAll()` when the app no longer needs them (e.g. before quit).

```js
const { globalShortcut } = require('electron')
globalShortcut.register('CommandOrControl+Alt+R', () => {
  // show window or perform action
})
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
```

On macOS there is a known issue: global shortcuts may not work with non-QWERTY keyboard layouts.

## Shortcuts in the renderer

- **DOM events:** Use `keydown` / `keyup` in the renderer with `addEventListener(..., true)` to capture before other handlers.
- **Main process interception:** Use `webContents.on('before-input-event', (event, input) => { ... })` to handle key events before they reach the page. Call `event.preventDefault()` to suppress the event. Useful for shortcuts that should not appear in the menu (e.g. dev-only or custom bindings).

```js
win.webContents.on('before-input-event', (event, input) => {
  if (input.control && input.key.toLowerCase() === 'i') {
    event.preventDefault()
    // handle Ctrl+I
  }
})
```

## Key points

- Use **accelerator** strings with `CommandOrControl` for cross-platform menu shortcuts; attach them to `MenuItem` for local shortcuts.
- Use **globalShortcut.register** for shortcuts when the app is not focused; unregister on quit.
- Use **before-input-event** in main to intercept or block key events before the renderer; use DOM **keydown**/**keyup** in the renderer for in-page shortcuts.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/keyboard-shortcuts.md
- https://www.electronjs.org/docs/latest/tutorial/keyboard-shortcuts
- https://www.electronjs.org/docs/latest/api/global-shortcut
- https://www.electronjs.org/docs/latest/api/web-contents#event-before-input-event
-->
