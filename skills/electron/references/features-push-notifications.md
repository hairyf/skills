---
name: features-push-notifications
description: Remote push notifications (APNS on macOS); registerForAPNSNotifications, received-apns-notification.
---

# Push Notifications (Remote)

The **pushNotifications** module (main process) registers the app with **Apple Push Notification service (APNS)** on macOS to receive remote notifications (badge, sound, alert). Not available on Windows/Linux.

## Usage

```js
const { pushNotifications, Notification } = require('electron')

pushNotifications.registerForAPNSNotifications().then((token) => {
  // Send token to your backend so it can target this device
})

pushNotifications.on('received-apns-notification', (event, userInfo) => {
  // Show a Notification using userInfo or handle in-app
  new Notification({ title: userInfo.aps?.alert?.title ?? 'Notification', body: userInfo.aps?.alert?.body }).show()
})
```

## Methods

- **registerForAPNSNotifications()** — Returns `Promise<string>` (APNS device token) or rejects on failure. Call once (e.g. after ready); send the token to your server for targeting.
- **unregisterForAPNSNotifications()** — Unregister from APNS; app can register again later.

## Events

- **received-apns-notification** — `(event, userInfo)`. Emitted when a remote notification is received while the app is running. `userInfo` is the payload (e.g. `aps`, custom keys).

## Key Points

- macOS only; guard with `process.platform === 'darwin'`.
- Requires proper entitlements and provisioning for push in the Mac app.
- For local (in-app) notifications use the **Notification** API (see [features-notifications](references/features-notifications.md)).

<!--
Source references:
- https://www.electronjs.org/docs/latest/api/push-notifications
-->
