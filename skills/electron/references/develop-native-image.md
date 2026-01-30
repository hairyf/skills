---
name: develop-native-image
description: NativeImage — createFromPath, createFromBuffer, template image; tray, window icon, clipboard.
---

# NativeImage

The `nativeImage` module provides a unified API for system images (icons, tray, dock, window icon, clipboard, drag image). APIs that accept images (e.g. `Tray`, `BrowserWindow` icon, `clipboard.writeImage`) accept either a file path string or a `NativeImage` instance. Use from main process; from renderer use preload and contextBridge if needed.

## Creating images

- **nativeImage.createFromPath(path)** — Load from file. Supports PNG, JPEG; on Windows also ICO. Path can be relative to the current working directory or absolute.
- **nativeImage.createFromBuffer(buffer[, options])** — Create from a Buffer (e.g. PNG/JPEG bytes). Options: `width`, `height`, `scaleFactor` for raw bitmap data.
- **nativeImage.createFromDataURL(dataURL)** — Create from a data URL string.
- **nativeImage.createEmpty()** — Create an empty transparent image.

```js
const { nativeImage, Tray, BrowserWindow } = require('electron')
const path = require('node:path')

const icon = nativeImage.createFromPath(path.join(__dirname, 'icon.png'))
const tray = new Tray(icon)
const win = new BrowserWindow({ icon })
```

## High-DPI / multiple scales

Append `@2x`, `@3x` to the base filename for high-DPI assets (e.g. `icon@2x.png`). Electron picks the right scale for the display. You can also put `icon.png`, `icon@2x.png`, `icon@3x.png` in the same folder and pass the path without the suffix; Electron selects the appropriate file.

## Template images (macOS)

On macOS, template images are monochrome and tinted by the system (e.g. for menu bar icons). Set **template image** by naming the file with `Template` in the name (e.g. `iconTemplate.png`) or by calling **image.setTemplateImage(true)** on a NativeImage. Use for tray and menu bar icons so they adapt to light/dark and accent.

## Windows ICO

On Windows, ICO files can contain multiple sizes. For best quality include at least 16x16, 24x24, 32x32, 48x48, 256x256 and common DPI scales. See the [Windows icon guidance](https://learn.microsoft.com/en-us/windows/apps/design/style/iconography/app-icon-construction).

## Instance methods

- **image.toPNG()** / **image.toJPEG(quality)** — Encode to Buffer.
- **image.getSize()** — `{ width, height }` (in pixels).
- **image.isEmpty()** — Whether the image is empty.
- **image.setTemplateImage(option)** (macOS) — Mark as template for system tinting.
- **image.resize(options)** — Resize; returns a new NativeImage.
- **image.crop(rect)** — Crop; returns a new NativeImage.

## Key points

- Use **createFromPath** or **createFromBuffer** for tray, window icon, clipboard, drag image. Use **@2x** / **@3x** filenames or multiple files for high-DPI.
- On **macOS** use **template** images (filename or **setTemplateImage**) for tray/menu bar so the system can tint them.
- On **Windows** use **ICO** with multiple sizes for window/taskbar icons.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/api/native-image.md
- https://www.electronjs.org/docs/latest/api/native-image
-->
