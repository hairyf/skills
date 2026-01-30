---
name: develop-webcontents-navigation
description: webContents navigation and new-window control — will-navigate, setWindowOpenHandler, and load events.
---

# webContents: Navigation and New Windows

Each `BrowserWindow` (and `WebContentsView`) has a `webContents` instance. Use it to control navigation and how new windows (e.g. from `window.open()`) are created. Restricting navigation and window creation is important for security; see [best-practices-security](references/best-practices-security.md).

## Limiting navigation: will-navigate

Listen to `webContents.on('will-navigate', (event, url) => { ... })` to allow or block main-frame navigation. Call `event.preventDefault()` to block. Parse the URL (e.g. with `new URL(url)`) and allow only origins or paths you trust; avoid naive string checks (e.g. `startsWith('https://example.com')` can be bypassed).

```js
const { app } = require('electron')
const { URL } = require('node:url')

app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsed = new URL(navigationUrl)
    if (parsed.origin !== 'https://example.com') {
      event.preventDefault()
    }
  })
})
```

For subframes (iframes), use `will-frame-navigate` instead; `will-navigate` fires only for the main frame.

## Limiting new windows: setWindowOpenHandler

When the page calls `window.open()`, Electron calls your handler. Return `{ action: 'deny' }` to block, or `{ action: 'allow', ... }` to allow and optionally customize the new window. To open the URL in the OS default browser instead, use `shell.openExternal(url)` and return `{ action: 'deny' }`.

```js
const { shell } = require('electron')

mainWindow.webContents.setWindowOpenHandler(({ url }) => {
  if (isSafeForExternalOpen(url)) {
    setImmediate(() => shell.openExternal(url))
  }
  return { action: 'deny' }
})
```

If you allow, you can return `outlineTarget` and other options; see the [WindowOpenHandlerResponse](https://www.electronjs.org/docs/latest/api/structures/window-open-handler-response) and [setWindowOpenHandler](https://www.electronjs.org/docs/latest/api/web-contents#contentssetwindowopenhandlerhandler) docs.

## Navigation and load events

- **did-start-navigation** — Any frame starts navigating (url, isInPlace, isMainFrame).
- **will-navigate** — Main frame is about to navigate; call `preventDefault()` to block.
- **did-navigate** — Main frame finished navigating (url, httpResponseCode, etc.).
- **did-frame-navigate** / **will-frame-navigate** — Same for any frame (including iframes).
- **did-finish-load** — Page load finished (DOM ready, etc.).
- **did-fail-load** — Load failed (errorCode, errorDescription, validatedURL, etc.).

Use these to update UI (e.g. address bar, back/forward), enforce navigation policy, or detect load errors.

## Key points

- Use **will-navigate** (and **will-frame-navigate** for iframes) to restrict navigation; parse URL and call `event.preventDefault()` when not allowed.
- Use **setWindowOpenHandler** to deny or allow `window.open()`; prefer opening external URLs with `shell.openExternal` and returning `{ action: 'deny' }`.
- Use **did-finish-load** / **did-fail-load** for load completion and error handling.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/api/web-contents.md
- https://www.electronjs.org/docs/latest/api/web-contents
- https://github.com/electron/electron/blob/main/docs/tutorial/security.md
-->
