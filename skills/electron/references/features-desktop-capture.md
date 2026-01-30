---
name: features-desktop-capture
description: Desktop/screen capture — desktopCapturer.getSources, setDisplayMediaRequestHandler, getDisplayMedia.
---

# Desktop Capture

Electron supports capturing the screen or individual windows for screen sharing or recording. The renderer uses `navigator.mediaDevices.getDisplayMedia()`; the main process provides sources via `session.setDisplayMediaRequestHandler` and optionally uses `desktopCapturer.getSources()` to list screens/windows.

## Flow

1. **Main process:** Call `session.defaultSession.setDisplayMediaRequestHandler((request, callback) => { ... }, options)` after `app.whenReady()`. In the handler, grant access by calling `callback({ video: source, audio: 'loopback' | source | false })`. Use `desktopCapturer.getSources({ types: ['screen', 'window'], thumbnailSize })` to get a list of sources (each has `id`, `name`, `thumbnail`, `display_id`, `appIcon`). Pass one source as `video`; for system audio use `audio: 'loopback'`.
2. **Renderer:** Call `navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })` (or with constraints). The request is handled by the main process handler; the returned stream can be attached to a `<video>` or sent over WebRTC.

```js
// main
const { desktopCapturer, session } = require('electron')

app.whenReady().then(() => {
  session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
    desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
      callback({ video: sources[0], audio: 'loopback' })
    })
  }, { useSystemPicker: true })  // if true, system picker may be used instead
})
```

```js
// renderer
const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
videoElement.srcObject = stream
```

## desktopCapturer.getSources(options)

- **types:** `['screen']` and/or `['window']` — which sources to list.
- **thumbnailSize:** `{ width, height }` for thumbnails; set 0 to skip (faster).
- **fetchWindowIcons:** boolean — include app icons for window sources.

Returns a Promise of `DesktopCapturerSource[]` with `id`, `name`, `thumbnail` (NativeImage), `display_id`, `appIcon` (if requested).

## macOS

On macOS 10.15+ screen capture requires user consent (Screen Recording permission). Use `systemPreferences.getMediaAccessStatus('screen')` to check; the system will prompt when `getDisplayMedia` is first used.

## Key points

- Use **setDisplayMediaRequestHandler** on the session to grant **getDisplayMedia** requests; use **desktopCapturer.getSources** to list screens/windows and pass a source to the callback.
- **video** can be a DesktopCapturerSource; **audio** can be `'loopback'`, a source, or `false`. Use **useSystemPicker** to allow the OS picker when available.
- On **macOS** ensure Screen Recording permission is granted; check with **getMediaAccessStatus('screen')**.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/api/desktop-capturer.md
- https://www.electronjs.org/docs/latest/api/desktop-capturer
- https://www.electronjs.org/docs/latest/api/session#sessionsetdisplaymediarequesthandlerhandler-options
-->
