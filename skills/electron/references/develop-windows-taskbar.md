---
name: develop-windows-taskbar
description: Windows taskbar; JumpList (app.setUserTasks), thumbnail toolbar (setThumbarButtons), overlay (setOverlayIcon), flashFrame.
---

# Windows Taskbar Customization

Electron exposes Windows taskbar features: **JumpList** (right-click tasks), **thumbnail toolbar** (buttons on window thumbnail), **icon overlay**, and **flash frame**. Recent documents and progress bar are cross-platform (see [develop-recent-documents](develop-recent-documents.md), [develop-progress-bar](develop-progress-bar.md)).

## JumpList (User Tasks)

**`app.setUserTasks(tasks)`** — Set the custom **Tasks** in the taskbar right-click menu. Each task: `program`, `arguments`, `iconPath`, `iconIndex`, `title`, `description`. Tasks should be static and context-free; they run the app with the given args (e.g. `--new-window`). Use **`app.setUserTasks([])`** to clear. Icon and path should remain valid after app close.

```js
const { app } = require('electron')
app.setUserTasks([
  {
    program: process.execPath,
    arguments: '--new-window',
    iconPath: process.execPath,
    iconIndex: 0,
    title: 'New Window',
    description: 'Create a new window'
  }
])
```

## Thumbnail Toolbar

**`BrowserWindow.setThumbarButtons(buttons)`** — Up to 7 buttons on the taskbar thumbnail. Each button: `tooltip`, `icon` (NativeImage), `flags` (e.g. `enabled`, `dismissonclick`), `click()`. Use **`setThumbarButtons([])`** to clear.

```js
win.setThumbarButtons([
  { tooltip: 'Play', icon: playIcon, click() { /* ... */ } },
  { tooltip: 'Pause', icon: pauseIcon, flags: ['enabled', 'dismissonclick'], click() { /* ... */ } }
])
```

## Icon Overlay

**`BrowserWindow.setOverlayIcon(overlay, description)`** — Small overlay on the taskbar icon for status (e.g. new mail). Use sparingly; not for animations.

```js
win.setOverlayIcon(nativeImage.createFromPath('path/to/overlay.png'), 'Description for overlay')
```

## Flash Frame

**`BrowserWindow.flashFrame(flag)`** — When `true`, flashes the taskbar button to draw attention (similar to dock bounce on macOS). Turn off when the window gets focus or after a timeout: **`win.flashFrame(false)`**.

```js
win.once('focus', () => win.flashFrame(false))
win.flashFrame(true)
```

## Key Points

- All of the above are **Windows-only**; guard with `process.platform === 'win32'`.
- JumpList tasks run the app with arguments; handle them in main (e.g. single-instance lock + argv parsing).

<!--
Source references:
- https://www.electronjs.org/docs/latest/tutorial/windows-taskbar
- https://www.electronjs.org/docs/latest/api/app#appsetusertaskstasks-windows
- https://www.electronjs.org/docs/latest/api/browser-window#winsetthumbarbuttonsbuttons-windows
- https://www.electronjs.org/docs/latest/api/browser-window#winsetoverlayiconoverlay-description-windows
- https://www.electronjs.org/docs/latest/api/browser-window#winflashframeflag
-->
