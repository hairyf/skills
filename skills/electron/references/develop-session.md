---
name: develop-session
description: Session API — partition, defaultSession, cookies, permissionRequestHandler, clearStorageData, protocol per session.
---

# Session

The `session` module (main process) manages browser sessions: cookies, cache, proxy, permissions, and protocol handlers. Each `WebContents` has a `session`; you can create or get sessions with `session.fromPartition(partition)` or `session.fromPath(path)`.

## Partitions

- **`session.defaultSession`** — The app’s default session; available after `app.whenReady()`. Use for most windows unless you need isolation.
- **`session.fromPartition(partition)`** — If `partition` starts with `persist:`, the session is persistent and shared by all pages using that partition. Without `persist:`, the session is in-memory and lost when the app quits. Use a custom partition for isolated storage (e.g. a secondary login or guest mode).

```js
const { session } = require('electron')
const ses = session.fromPartition('persist:myapp')
const win = new BrowserWindow({ webPreferences: { partition: 'persist:myapp' } })
```

Custom protocols (e.g. `protocol.handle`) are registered per session; register on the same session as the windows that load the scheme.

## Permission requests

Use `ses.setPermissionRequestHandler((webContents, permission, callback) => { ... })` to allow or deny permission requests (e.g. `notifications`, `media`, `geolocation`) from pages. Parse the request URL and call `callback(true)` or `callback(false)`. See [best-practices-security](references/best-practices-security.md).

```js
const { URL } = require('node:url')
session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
  const parsed = new URL(webContents.getURL())
  if (parsed.origin === 'https://example.com' && permission === 'notifications') {
    callback(true)
  } else {
    callback(false)
  }
})
```

## Cookies and storage

- **Cookies:** `ses.cookies` (get, set, remove, flush). See the [session API](https://www.electronjs.org/docs/latest/api/session#instance-methods).
- **Clear storage:** `ses.clearStorageData({ storages: ['cookies', 'localstorage', ...] })` to clear cookies, localStorage, etc. for the session.
- **Spellchecker:** `ses.setSpellCheckerLanguages()`, `ses.addWordToSpellCheckerDictionary()`, `ses.setSpellCheckerDictionaryDownloadURL()` — see [features-spellchecker](references/features-spellchecker.md).

## Downloads

Listen to `ses.on('will-download', (event, item, webContents) => { ... })` to intercept downloads (e.g. save to a custom path or cancel with `event.preventDefault()`). Use `item.setSavePath(path)` or handle the save dialog yourself.

## Key points

- Use **defaultSession** for normal windows; use **fromPartition('persist:name')** for isolated or persistent sessions.
- Set **setPermissionRequestHandler** on sessions that load remote content; validate URL and permission.
- Register custom **protocol** and use **cookies** / **clearStorageData** on the same session instance as the windows.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/api/session.md
- https://www.electronjs.org/docs/latest/api/session
- https://github.com/electron/electron/blob/main/docs/tutorial/security.md
-->
