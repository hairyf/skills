---
name: develop-downloads
description: Handling file downloads — session will-download, DownloadItem, setSavePath, preventDefault.
---

# Downloads

When a page or main process triggers a download, the session emits `will-download`. Use it to set a save path, show a custom dialog, or cancel the download. The callback receives an event, a [DownloadItem](https://www.electronjs.org/docs/latest/api/download-item), and the associated WebContents (if any).

## will-download

Listen on the session (e.g. `session.defaultSession`) that the page or request uses:

```js
const { session } = require('electron')
const path = require('node:path')

session.defaultSession.on('will-download', (event, item, webContents) => {
  // Optional: cancel the default save dialog and handle yourself
  // event.preventDefault()

  const savePath = path.join(app.getPath('downloads'), item.getFilename())
  item.setSavePath(savePath)

  item.on('updated', (event, state) => {
    if (state === 'progressing') {
    }
  })
  item.once('done', (event, state) => {
    if (state === 'completed') {
    } else if (state === 'interrupted') {
    }
  })
})
```

- **`event.preventDefault()`** — Cancels the default download (e.g. save dialog); you must then handle the download yourself (e.g. stream to a file) or the download will not complete.
- **`item.setSavePath(path)`** — Sets the file path where the download will be saved. Only valid inside the `will-download` callback. If you do not set it, Electron shows the system save dialog (unless you called `preventDefault()`).
- **`item.setSaveDialogOptions(options)`** — Customize the save dialog (e.g. defaultPath, title) when you do not set a save path.

## DownloadItem

- **`item.getFilename()`** — Suggested filename.
- **`item.getURL()`** — Source URL.
- **`item.getTotalBytes()`** / **`item.getReceivedBytes()`** — Total and received bytes (for progress).
- **`item.getState()`** — `'progressing' | 'completed' | 'cancelled' | 'interrupted'`.
- **`item.pause()`** / **`item.resume()`** / **`item.cancel()`** — Pause, resume, or cancel the download.
- **Events:** `updated` (state, e.g. progressing), `done` (state: completed | cancelled | interrupted).

Programmatic downloads (e.g. `ses.downloadURL(url)`) also emit `will-download`; the item may start in `interrupted` state until you call `item.resume()` after setting a save path.

## Key points

- Use **session.on('will-download', ...)** to set **item.setSavePath(path)** and avoid the save dialog, or to **event.preventDefault()** and handle the download yourself.
- Use **item** events (**updated**, **done**) for progress and completion; use **pause** / **resume** / **cancel** to control the download.
- **setSavePath** and **setSaveDialogOptions** are only valid inside the **will-download** callback.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/api/session.md#event-will-download
- https://github.com/electron/electron/blob/main/docs/api/download-item.md
- https://www.electronjs.org/docs/latest/api/download-item
- https://www.electronjs.org/docs/latest/api/session
-->
