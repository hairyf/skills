---
name: develop-offscreen-rendering
description: Offscreen window; paint event, NativeImage; GPU vs software; setFrameRate, useSharedTexture.
---

# Offscreen Rendering

**Offscreen rendering** draws a `BrowserWindow`’s content to a bitmap or GPU texture instead of the screen, so you can capture frames (e.g. screenshots, video) or feed them into another pipeline (e.g. 3D). The window is created as **frameless** and never shown.

## Enabling

Set **webPreferences.offscreen: true** when creating the `BrowserWindow`. Listen to **webContents** `paint` to receive frames.

```js
const win = new BrowserWindow({
  width: 800,
  height: 600,
  webPreferences: { offscreen: true }
})
win.loadURL('https://github.com')
win.webContents.on('paint', (event, dirty, image) => {
  // image is NativeImage (CPU bitmap mode) or use shared texture
  fs.writeFileSync('frame.png', image.toPNG())
})
win.webContents.setFrameRate(60)
```

## Rendering Modes

1. **CPU bitmap (default)** — `webPreferences.offscreen.useSharedTexture` is false. `paint` receives a **NativeImage** (e.g. `toPNG()`). GPU is used for composition (WebGL, 3D CSS work); frame is copied to CPU. Max frame rate 240; higher values have no benefit.
2. **GPU shared texture** — Set `webPreferences.offscreen.useSharedTexture: true`. Frames are written to a GPU texture; no CPU copy. Requires native code to consume the texture (see [OSR README](https://github.com/electron/electron/blob/main/shell/browser/osr/README.md)).
3. **Software output** — Disable GPU acceleration with **app.disableHardwareAcceleration()**. Rendering is done on CPU; frame generation can be faster than GPU+bitmap copy, but no WebGL/GPU features.

## Control

- **setFrameRate(fps)** — Throttle frame rate.
- Only the **dirty** region is passed to `paint` for efficiency.
- When the page is idle, no frames are generated.
- You can pause/resume rendering via webContents APIs where available.

## Key Points

- Use **offscreen: true** only when you need to capture or redirect output; it has cost.
- For simple screenshots, consider **webContents.capturePage()** instead of a full offscreen window.
- Shared texture mode is advanced and requires native integration.

<!--
Source references:
- https://www.electronjs.org/docs/latest/tutorial/offscreen-rendering
- https://www.electronjs.org/docs/latest/api/web-contents (paint, setFrameRate)
-->
