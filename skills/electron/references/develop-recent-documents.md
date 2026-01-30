---
name: develop-recent-documents
description: Recent documents — app.addRecentDocument, app.clearRecentDocuments (Windows JumpList, macOS Dock).
---

# Recent Documents

Windows (JumpList) and macOS (Dock menu) can show a list of recently used documents for your app. Use the `app` module to add and clear entries.

## Adding a document

**`app.addRecentDocument(path)`** — Adds a file path to the recent documents list. The path must be absolute and point to a file that exists (or that the OS can resolve). On Windows the file appears in the JumpList; on macOS it appears in the Dock context menu for the app. On Linux this may be a no-op depending on the desktop.

```js
const { app } = require('electron')
const path = require('node:path')

app.addRecentDocument(path.join(__dirname, 'document.pdf'))
```

Call this when the user opens or saves a document so it appears in the OS recent list.

## Clearing the list

**`app.clearRecentDocuments()`** — Removes all recent documents for the app. Use when the user logs out or when you want to reset the list (e.g. on quit or from a “Clear recent” menu item).

```js
app.on('window-all-closed', () => {
  app.clearRecentDocuments()
  if (process.platform !== 'darwin') app.quit()
})
```

## Handling opening a recent file

When the user clicks a recent document, the OS may launch your app or bring it to front and pass the file path. On macOS listen for **`app.on('open-file', (event, path) => { ... })`** and call `event.preventDefault()` if you handle it; register the listener early (before `ready` if the app was launched to open the file). On Windows, parse **`process.argv`** in the main process for the file path (e.g. after a second-instance or at startup).

## Key points

- Use **app.addRecentDocument(path)** when the user opens/saves a document; use **app.clearRecentDocuments()** to clear the list.
- On **macOS** handle **open-file**; on **Windows** parse **process.argv** (and optionally **second-instance**) for the opened file path.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/recent-documents.md
- https://www.electronjs.org/docs/latest/tutorial/recent-documents
- https://www.electronjs.org/docs/latest/api/app#appaddrecentdocumentpath-macos-windows
-->
