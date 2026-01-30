---
name: develop-shell
description: Shell API — openExternal, openPath, showItemInFolder, trashItem; security (untrusted URLs).
---

# Shell

The `shell` module opens URLs and files with the system’s default applications. Available in the main process and in the renderer only when not sandboxed; prefer calling from main and exposing a safe API via preload (e.g. open external links only for allowlisted URLs).

## Methods

- **`shell.openExternal(url[, options])`** — Opens a URL in the default browser (e.g. `https://`), mail client (`mailto:`), or other app. Returns a Promise. Options: `activate` (macOS), `workingDirectory` (Windows), `logUsage` (Windows). **Do not use with untrusted or user-controlled input** — it can be abused to run local protocols or files. Validate or allowlist URLs before calling.
- **`shell.openPath(path)`** — Opens a file with the default app for that file type. Returns a Promise that resolves to an empty string on success or an error message on failure.
- **`shell.showItemInFolder(fullPath)`** — Reveals the file in the file manager and selects it if possible.
- **`shell.trashItem(path)`** — Moves the file/folder to trash. Returns a Promise that resolves when done or rejects with an error.
- **`shell.beep()`** — Plays the system beep sound (no-op on some systems).

```js
const { shell } = require('electron')

shell.openExternal('https://github.com')
shell.openPath('/path/to/file.pdf')
shell.showItemInFolder('/path/to/file.txt')
shell.trashItem('/path/to/delete').then(() => {}).catch(err => {})
```

## Security

**Do not pass user-controlled or untrusted data to `shell.openExternal()`.** Attackers can use `file://`, `javascript:`, or other schemes to run code or open local resources. Validate the URL (e.g. allowlist `https://` origins) or use a fixed set of URLs. When handling `window.open()` or link clicks, prefer `setWindowOpenHandler` and open allowlisted URLs with `shell.openExternal` and return `{ action: 'deny' }` for in-app windows. See [best-practices-security](references/best-practices-security.md).

## Key points

- Use **openExternal** for external URLs (browser, mail); **openPath** for opening files; **showItemInFolder** to reveal in file manager; **trashItem** to move to trash.
- **Never** use **openExternal** with untrusted or user-controlled URLs; validate or allowlist.
- Prefer calling **shell** from the **main process** and exposing a limited API via preload (e.g. “open link” only for approved URLs).

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/api/shell.md
- https://www.electronjs.org/docs/latest/api/shell
- https://github.com/electron/electron/blob/main/docs/tutorial/security.md
-->
