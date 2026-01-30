---
name: features-web-embeds
description: Embedding web content — iframe, WebContentsView, webview tag; when to use each and security considerations.
---

# Web Embeds

You can embed (third-party or app) web content in an Electron window in three ways: `<iframe>`, `<webview>`, and `WebContentsView`. Each has different control and security implications.

## iframe

`<iframe>` behaves like in a browser. It can load external pages if their CSP allows it. Use the [sandbox](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox) attribute to limit capabilities (scripts, forms, same-origin, etc.). No Electron-specific APIs; good for trusted or tightly sandboxed content.

## WebContentsView

`WebContentsView` is created and controlled from the **main process**. It is not a DOM element; you add it to a `BaseWindow` (or use it alongside other views), set its bounds, and load a URL. It has full `webContents` API (IPC, events, DevTools, etc.) and is the recommended way to embed a separate web context when you need full control from main. Use when you need multiple layered pages in one window or tight integration with main-process logic.

```js
const { BaseWindow, WebContentsView } = require('electron')
const win = new BaseWindow()
const view = new WebContentsView()
win.contentView.addChildView(view)
view.setBounds({ x: 0, y: 0, width: 400, height: 300 })
view.webContents.loadURL('https://example.com')
```

Positioning and sizing are done in main (or coordinated with the renderer via IPC).

## webview tag

The `<webview>` tag is a custom element that works only inside Electron. It runs in a separate process and communicates with the page via IPC. Electron does **not** recommend using it: the tag is under architectural change and may affect stability. Prefer **iframe** (with sandbox) or **WebContentsView** instead.

If you must use it: set `webPreferences.webviewTag: true` on the `BrowserWindow` that hosts the page containing `<webview>`. Control loading and security via `webview` attributes and the `will-attach-webview` event in main (validate URL and webPreferences; see [best-practices-security](references/best-practices-security.md)). Do not enable `allowpopups` unless necessary.

## Key points

- **iframe:** Standard, sandboxable; use for trusted or tightly restricted content.
- **WebContentsView:** Main-process–driven, full `webContents` control; use for multiple embedded pages or deep main-process integration.
- **webview:** Legacy; prefer iframe or WebContentsView. If used, validate in `will-attach-webview` and keep security options strict.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/web-embeds.md
- https://www.electronjs.org/docs/latest/tutorial/web-embeds
- https://www.electronjs.org/docs/latest/api/web-contents-view
- https://www.electronjs.org/docs/latest/api/webview-tag
-->
