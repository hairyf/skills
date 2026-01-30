---
name: develop-clipboard
description: Clipboard API — readText/writeText, readHTML/writeHTML, image; use from preload, expose via contextBridge.
---

# Clipboard

The `clipboard` module reads and writes the system clipboard (plain text, HTML, images, etc.). Using it from the renderer is deprecated; call it from the **main process** or from the **preload** and expose a minimal API to the renderer via `contextBridge`.

## Text

- **`clipboard.readText([type])`** — Returns clipboard text. On Linux, `type` can be `'clipboard'` or `'selection'`.
- **`clipboard.writeText(text[, type])`** — Writes plain text to the clipboard.

## HTML

- **`clipboard.readHTML([type])`** — Returns clipboard HTML (markup string).
- **`clipboard.writeHTML(markup[, type])`** — Writes HTML to the clipboard.

## Image

- **`clipboard.readImage()`** — Returns a [NativeImage](https://www.electronjs.org/docs/latest/api/native-image).
- **`clipboard.writeImage(image)`** — Writes a NativeImage to the clipboard.

## Other

- **`clipboard.readBuffer(format)`** / **`clipboard.writeBuffer(format, buffer)`** — Read/write raw buffer for a MIME type.
- **`clipboard.clear([type])`** — Clears the clipboard.
- **`clipboard.availableFormats([type])`** — Returns an array of supported formats.

See the [clipboard API](https://www.electronjs.org/docs/latest/api/clipboard) for full list.

## Exposing to the renderer

Do not require `clipboard` in the renderer. In the preload, call `clipboard` and expose only the operations you need:

```js
const { contextBridge, clipboard } = require('electron')
contextBridge.exposeInMainWorld('electronAPI', {
  copyText: (text) => clipboard.writeText(text),
  pasteText: () => clipboard.readText()
})
```

## Linux selection clipboard

On Linux there is a separate “selection” clipboard (middle-click paste). Pass `'selection'` as the second argument to read/write/clear when you need it.

## Key points

- Use **clipboard** in the **main process** or **preload**; expose a minimal API (e.g. copyText, pasteText) via **contextBridge**. Do not use clipboard from the renderer directly.
- Use **readText** / **writeText** for plain text; **readHTML** / **writeHTML** for rich text; **readImage** / **writeImage** for images.
- On **Linux**, use **type** `'selection'` for the selection clipboard when needed.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/api/clipboard.md
- https://www.electronjs.org/docs/latest/api/clipboard
- https://github.com/electron/electron/blob/main/docs/tutorial/context-isolation.md
-->
