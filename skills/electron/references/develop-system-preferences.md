---
name: develop-system-preferences
description: systemPreferences — getEffectiveAppearance, getColor, getAccentColor, getMediaAccessStatus; macOS notifications.
---

# System Preferences

The `systemPreferences` module (main process; also utility process for some APIs) reads system UI preferences: appearance, colors, and media access (camera, microphone, screen). Use it to match the OS theme, check permissions before using media APIs, or read accent colors.

## Appearance and colors

- **systemPreferences.getEffectiveAppearance()** — Returns `'dark'` or `'light'` (macOS 10.14+). Use when you need the effective theme outside the renderer (e.g. before a window loads). For renderer styling use **nativeTheme** and **prefers-color-scheme** (see [features-dark-mode](references/features-dark-mode.md)).
- **systemPreferences.getColor(color)** (Windows, macOS) — Returns the system color for a named key (e.g. `'window'`, `'menu'`, `'button-face'`). Returns a hex color string. See the [API docs](https://www.electronjs.org/docs/latest/api/system-preferences#systempreferencesgetcolorcolor-windows-macos) for the list of color keys.
- **systemPreferences.getAccentColor()** (macOS 10.14+, Windows) — Returns the system accent color as RGBA hex (e.g. `"aabbccdd"`).

## Media access (permissions)

- **systemPreferences.getMediaAccessStatus(mediaType)** — Returns `'not-determined' | 'granted' | 'denied' | 'restricted' | 'unknown'`. **mediaType** can be `'microphone'`, `'camera'`, or `'screen'` (macOS 10.15+ for screen). Use before calling **getDisplayMedia** or **getUserMedia** to avoid unnecessary prompts or to show your own UI when access is denied.

```js
const { systemPreferences } = require('electron')
const screenStatus = systemPreferences.getMediaAccessStatus('screen')
if (screenStatus !== 'granted') {
  // Show in-app message or open system preferences
}
```

## macOS notifications

- **systemPreferences.subscribeNotification(event, callback)** — Subscribe to macOS `NSDistributedNotificationCenter` (e.g. `AppleInterfaceThemeChangedNotification`). Returns a subscription ID; use **unsubscribeNotification(id)** to remove.
- **systemPreferences.postNotification(event, userInfo)** — Post a native notification. See the [API](https://www.electronjs.org/docs/latest/api/system-preferences) for **subscribeLocalNotification** / **subscribeWorkspaceNotification** and **postLocalNotification** / **postWorkspaceNotification**.

## Other (macOS)

- **getUserDefault(key, type)** / **setUserDefault(key, type, value)** / **removeUserDefault(key)** — Read/write `NSUserDefaults`.
- **registerDefaults(defaults)** — Add defaults to your app’s user defaults.

## Key points

- Use **getEffectiveAppearance()** for dark/light; use **getColor** / **getAccentColor()** for system colors. Use **getMediaAccessStatus('screen'|'camera'|'microphone')** before media APIs.
- On **macOS** use **subscribeNotification** / **postNotification** for system notification center; use **getUserDefault** / **setUserDefault** for user defaults.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/api/system-preferences.md
- https://www.electronjs.org/docs/latest/api/system-preferences
-->
