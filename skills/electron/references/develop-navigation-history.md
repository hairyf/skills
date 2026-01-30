---
name: develop-navigation-history
description: Navigation history — webContents.navigationHistory, goBack, goForward, getEntryAtIndex, getAllEntries.
---

# Navigation History

Each `WebContents` has a **navigationHistory** object that represents the back/forward list for that page. Use it to implement back/forward buttons or to inspect or jump to specific entries.

## Accessing history

```js
const { BrowserWindow } = require('electron')
const win = new BrowserWindow()
const { navigationHistory } = win.webContents
```

## Navigating

- **`navigationHistory.canGoBack()`** / **`navigationHistory.canGoForward()`** — Return booleans; use before calling goBack/goForward.
- **`navigationHistory.goBack()`** — Navigates to the previous entry (if any).
- **`navigationHistory.goForward()`** — Navigates to the next entry (if any).
- **`navigationHistory.getEntryAtIndex(index)`** — Returns the entry at the given index (0 = earliest, N = most recent). Use to jump to a specific entry or to show a history list.
- **`navigationHistory.getAllEntries()`** — Returns an array of all entries (e.g. `{ url, title }` or similar; see the [NavigationHistory API](https://www.electronjs.org/docs/latest/api/navigation-history)).

```js
if (navigationHistory.canGoBack()) {
  navigationHistory.goBack()
}
if (navigationHistory.canGoForward()) {
  navigationHistory.goForward()
}

const entries = navigationHistory.getAllEntries()
entries.forEach((entry, i) => {
  console.log(`${i}: ${entry.title} - ${entry.url}`)
})
```

Use these in the main process (e.g. in IPC handlers or menu click handlers) to drive back/forward from native UI. You can also expose `canGoBack`, `canGoForward`, `goBack`, `goForward` via preload so the renderer can drive its own back/forward buttons.

## Key points

- Use **webContents.navigationHistory** for back/forward state and navigation.
- Use **canGoBack** / **canGoForward** before **goBack** / **goForward**; use **getAllEntries** or **getEntryAtIndex** to list or jump to entries.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/navigation-history.md
- https://www.electronjs.org/docs/latest/tutorial/navigation-history
- https://www.electronjs.org/docs/latest/api/navigation-history
- https://www.electronjs.org/docs/latest/api/web-contents#contentsnavigationhistory-readonly
-->
