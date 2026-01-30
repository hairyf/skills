---
name: features-notifications
description: Native notifications in Electron — main process (Notification module) and renderer (Web Notifications API).
---

# Notifications

Each OS has its own notification UI. Electron supports cross-platform notifications from both the main process and the renderer; use IPC if you need to trigger or handle them across processes.

## Main process

Use the `Notification` module (main process only). Create an instance and call `show()`; the notification does not appear until `show()` is called.

```js
const { Notification } = require('electron')
new Notification({
  title: 'Title',
  body: 'Body text'
}).show()
```

Options include `title`, `body`, `icon` (NativeImage or path), `silent`, `timeoutType`, `urgency`, `actions`, `closeButtonLabel` (platform-specific). Listen to `click`, `close`, `show`, `failed` on the instance. On macOS, ensure the app is allowed to show notifications (user permission).

## Renderer process

Use the [Web Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API). Request permission with `Notification.requestPermission()` (returns a Promise); then create and show notifications. Behavior and permissions are the same as in a browser.

```js
// In renderer
const n = new Notification('Title', { body: 'Body' })
n.onclick = () => console.log('clicked')
```

If the renderer cannot access the Notification constructor (e.g. due to context), expose a method from the preload that sends an IPC to the main process; main then creates a `Notification` and shows it.

## Key points

- Main: `new Notification({ title, body }).show()`; listen to `click`, `close`, etc.
- Renderer: Web Notifications API (`Notification.requestPermission()`, `new Notification(...)`); or IPC to main to show from main.
- Respect user permission and OS notification settings.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/notifications.md
- https://www.electronjs.org/docs/latest/tutorial/notifications
- https://www.electronjs.org/docs/latest/api/notification
-->
