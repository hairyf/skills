---
name: develop-represented-file
description: Represented file on macOS — setRepresentedFilename, setDocumentEdited (title bar icon and edited state).
---

# Represented File (macOS)

On macOS you can associate a file with a window so the file’s icon appears in the title bar and the user can Command-Click or Control-Click to see the file path. You can also mark the window as “edited” so the title bar shows an unsaved indicator.

## API

- **`win.setRepresentedFilename(filePath)`** — Sets the represented file for the window. Use an absolute path to a file (or directory). The file icon appears in the title bar; Command-Click or Control-Click shows a path popup.
- **`win.setDocumentEdited(edited)`** — Pass `true` to indicate the document has unsaved changes; pass `false` when it is saved. The title bar can show a dot or similar to indicate edited state.

```js
const { BrowserWindow } = require('electron')
const path = require('node:path')

const win = new BrowserWindow({ width: 800, height: 600 })
win.setRepresentedFilename(path.join(__dirname, 'document.txt'))
win.setDocumentEdited(true)  // show unsaved state
```

Use when your app is document-based (e.g. editor, viewer). Update `setRepresentedFilename` when the user opens another file and `setDocumentEdited` when content changes or is saved.

## Key points

- **setRepresentedFilename(path)** — Associate a file with the window; title bar shows its icon and path on Command-Click.
- **setDocumentEdited(bool)** — Mark the window as having unsaved changes for the title bar indicator.
- macOS only; no effect on Windows or Linux.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/represented-file.md
- https://www.electronjs.org/docs/latest/tutorial/represented-file
- https://www.electronjs.org/docs/latest/api/browser-window#winsetrepresentedfilenamefilename-macos
-->
