---
name: develop-devtools-extension
description: Loading Chrome DevTools extensions — ses.loadExtension, removeExtension, and tooling (electron-devtools-installer).
---

# DevTools Extensions

Electron can load [Chrome DevTools extensions](https://developer.chrome.com/docs/extensions/mv3/devtools/) to extend the built-in DevTools (e.g. React/Redux/Vue devtools). Load them per **session**; they are not persisted across app launches.

## Loading an extension

1. **Get the extension path** — Install the extension in Chrome, then find its path on disk (e.g. Chrome’s extensions directory: on macOS `~/Library/Application Support/Google/Chrome/Default/Extensions/<id>/<version>`, on Windows `%LOCALAPPDATA%\Google\Chrome\User Data\Default\Extensions\<id>\<version>`, on Linux `~/.config/google-chrome/Default/Extensions/...`). The extension ID is on `chrome://extensions`.
2. **Load it in your session** — Call `ses.loadExtension(path)` on the session your windows use (e.g. `session.defaultSession`). Must be called **after** `app` `ready` and on a **persistent** session (not in-memory). **Await** the returned Promise before loading pages so the extension is active.

```js
const { app, session } = require('electron')
const path = require('node:path')

const reactDevToolsPath = path.join(
  process.env.HOME || process.env.USERPROFILE,
  'Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.9.0_0'
)

app.whenReady().then(async () => {
  await session.defaultSession.loadExtension(reactDevToolsPath)
  // Now create windows and load pages
})
```

## Removing an extension

Call `ses.removeExtension(extensionId)`. The ID is returned from `loadExtension` (or from Chrome’s `chrome://extensions`). Loaded extensions are not persisted; you must call `loadExtension` again on each app launch if you want them.

## Tooling

Packages like [electron-devtools-installer](https://www.npmjs.com/package/electron-devtools-installer) can download and load known extensions by ID so you don’t manage paths manually. Check their docs for compatibility and usage.

## Support

Electron supports only a [limited set of Chrome extension APIs](https://www.electronjs.org/docs/latest/api/extensions); extensions that rely on unsupported APIs may not work. React Developer Tools, Redux DevTools, and some others are known to work.

## Key points

- Use **ses.loadExtension(path)** after **ready** on a persistent session; **await** it before loading pages.
- Extensions are **not** persisted; load them on every app start if needed. Use **ses.removeExtension(id)** to unload.
- Use **electron-devtools-installer** or similar to automate download/path for popular extensions.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/devtools-extension.md
- https://www.electronjs.org/docs/latest/tutorial/devtools-extension
- https://www.electronjs.org/docs/latest/api/session#sesloadextensionpath
-->
