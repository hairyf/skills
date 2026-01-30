---
name: develop-window-customization
description: Window customization — frameless, transparent, custom title bar, and platform considerations.
---

# Window Customization

`BrowserWindow` (and `BaseWindow`) options control chrome, transparency, and shape. Use them for frameless or custom-title-bar UIs.

## Frameless window

Set `frame: false` to remove the OS window frame (title bar and borders). You are responsible for draggable regions, close/minimize/maximize, and resizing. On macOS you may still want a traffic-light-style area; use `titleBarStyle: 'hiddenInset'` or `'hidden'` with a draggable region in your HTML/CSS.

```js
const win = new BrowserWindow({
  frame: false,
  width: 800,
  height: 600
})
```

Use CSS `-webkit-app-region: drag` on a top bar element to make it draggable; use `no-drag` on buttons so they remain clickable. On Windows, respect system menu and maximize behavior (e.g. double-click title bar) if you implement a custom title bar.

## Transparent window

Set `transparent: true` for a transparent background. The web content’s background can be transparent so the desktop or other windows show through. Limitations: you cannot click through transparent areas; transparent windows are often not resizable; CSS `blur()` applies to the window content only, not to what is behind the window; opening DevTools can remove transparency. On Windows, transparent windows typically cannot be maximized via the system menu or double-click on the title bar.

```js
const win = new BrowserWindow({
  transparent: true,
  frame: false
})
```

## Custom title bar

For a custom title bar (e.g. traffic lights on macOS, min/max/close on Windows): use a frameless window and draw the title bar in HTML/CSS. Use `-webkit-app-region: drag` on the title bar and handle close/minimize/maximize via IPC to the main process (e.g. `window.close()`, or main-process calls to `win.minimize()`, `win.maximize()`, `win.unmaximize()`, `win.close()`). On macOS, `titleBarStyle: 'hiddenInset'` or `'hidden'` can hide the default title bar while leaving a drag region; see the [custom title bar](https://www.electronjs.org/docs/latest/tutorial/custom-title-bar) and [window customization](https://www.electronjs.org/docs/latest/tutorial/window-customization) docs.

## Other options

- **`backgroundColor`** — Background color before or behind the page (e.g. `#2e2c29`). Helps avoid a flash of wrong color while loading.
- **`fullscreen`**, **`fullscreenable`** — Control fullscreen behavior.
- **`resizable`** — Set to `false` to disable resizing (note: with `transparent: true`, resizing can be problematic on some platforms).

## Key points

- Use `frame: false` for frameless windows; implement drag region with `-webkit-app-region: drag` and handle window controls via main process.
- Use `transparent: true` for see-through windows; be aware of click-through, resize, and DevTools limitations.
- For custom title bars, combine frameless + in-window UI + IPC for minimize/maximize/close; use `titleBarStyle` on macOS as needed.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/window-customization.md
- https://github.com/electron/electron/blob/main/docs/tutorial/custom-window-styles.md
- https://github.com/electron/electron/blob/main/docs/tutorial/custom-title-bar.md
- https://www.electronjs.org/docs/latest/tutorial/window-customization
- https://www.electronjs.org/docs/latest/api/browser-window
-->
