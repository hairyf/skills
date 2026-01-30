---
name: develop-share-menu
description: macOS ShareMenu; share from context to apps/social; ShareMenu constructor, popup, closePopup; shareMenu role.
---

# ShareMenu (macOS)

The `ShareMenu` class (main process) creates the **macOS Share** menu (share sheet) to share content to apps, social media, and services. To show it as a submenu of another menu, use the **`shareMenu`** role on a `MenuItem`.

## Usage

```js
const { ShareMenu } = require('electron')

const item = { urls: ['https://example.com'], text: 'Check this' }
const shareMenu = new ShareMenu(item)
shareMenu.popup({ browserWindow: win, x: 100, y: 100 })
// Later: shareMenu.closePopup(win)
```

## Constructor

- **`new ShareMenu(sharingItem)`** — `sharingItem` is a `SharingItem` (e.g. `urls`, `text`, `filePaths`). See structures in the API docs.

## Instance Methods

- **`popup([options])`** — Show as context menu. Options: `browserWindow`, `x`, `y`, `positioningItem` (macOS), `callback` when closed.
- **`closePopup([browserWindow])`** — Close the popup in the given (or focused) window.

## Key Points

- macOS only; not available on Windows/Linux.
- Electron built-in classes cannot be subclassed.
- For a “Share” item inside an existing menu, use `MenuItem` with `role: 'shareMenu'` and pass the sharing item as appropriate.

<!--
Source references:
- https://www.electronjs.org/docs/latest/api/share-menu
-->
