---
name: develop-base-window
description: BaseWindow and View; contentView, addChildView, setBounds; parent/modal; when to use vs BrowserWindow.
---

# BaseWindow and View

**BaseWindow** (main process) is a window without a built-in web view. You add **View** instances (e.g. **WebContentsView**) to **win.contentView** and lay them out with **setBounds**. Use it when you need multiple web views in one window or custom layout. For a single full-size web view, **BrowserWindow** is simpler.

## BaseWindow

- Create with `new BaseWindow(options)` (e.g. `width`, `height`). Options include **parent** and **modal: true** for child/modal windows. On macOS, modal windows are sheets; on Linux, modal type becomes `dialog`.
- **contentView** — The root View; add children with **contentView.addChildView(view[, index])**.
- **parent** / **modal** — Child windows stay on top of parent; modal disables the parent. On macOS, child position is relative to parent; on Windows/Linux, child does not move with parent.
- Most window methods (setBounds, show, hide, close, etc.) are on BaseWindow; see [BaseWindow API](https://www.electronjs.org/docs/latest/api/base-window).

## View

- **View** is the base for layout: **setBounds(bounds)**, **getBounds()**, **setBackgroundColor(color)**, **addChildView(view[, index])**, **removeChildView(view)**. **bounds-changed** event when layout changes.
- **WebContentsView** is a View that has **webContents**; add it to `contentView` and set bounds, then **view.webContents.loadURL(...)**.

## Example

```js
const { BaseWindow, WebContentsView } = require('electron')

const win = new BaseWindow({ width: 800, height: 600 })

const left = new WebContentsView()
left.webContents.loadURL('https://electronjs.org')
win.contentView.addChildView(left)
left.setBounds({ x: 0, y: 0, width: 400, height: 600 })

const right = new WebContentsView()
right.webContents.loadURL('https://github.com/electron/electron')
win.contentView.addChildView(right)
right.setBounds({ x: 400, y: 0, width: 400, height: 600 })
```

## Resource management

When a BaseWindow is closed, **webContents** of its WebContentsViews are **not** destroyed automatically. Close or destroy them when the window closes (e.g. in the window’s `closed` handler) to avoid leaks.

## Key Points

- Use **BaseWindow** + **WebContentsView** for multi-view or custom layout; use **BrowserWindow** for a single full-page web view.
- Child/modal: set **parent** and optionally **modal: true**. Manage webContents lifecycle when the window closes.

<!--
Source references:
- https://www.electronjs.org/docs/latest/api/base-window
- https://www.electronjs.org/docs/latest/api/view
- https://www.electronjs.org/docs/latest/api/web-contents-view
-->
