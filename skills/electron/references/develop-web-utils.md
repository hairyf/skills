---
name: develop-web-utils
description: Renderer webUtils; getPathForFile(File) for file input path; expose via preload.
---

# webUtils (Renderer)

The **webUtils** module (renderer process) provides utilities for Web API objects. The main method agents need is **getPathForFile(file)** — it returns the file system path for a web [File](https://developer.mozilla.org/en-US/docs/Web/API/File) object (e.g. from `<input type="file">`). With context isolation, call it in the preload and expose a wrapper via `contextBridge`; do not expose raw paths to untrusted web content when avoidable.

## Usage

```js
// Preload
const { contextBridge, webUtils } = require('electron')

contextBridge.exposeInWorld('electronApi', {
  getPathForFile (file) {
    return webUtils.getPathForFile(file)
  }
})

// Renderer (or via exposed API)
const file = document.querySelector('input[type=file]').files[0]
const path = window.electronApi.getPathForFile(file)
// Send path to main via IPC if needed; avoid exposing to untrusted content
```

## getPathForFile(file)

- **file** — A web `File` object (e.g. from `input.files[0]`).
- **Returns** `string` — The file system path, or empty string if the File was constructed in JS and is not backed by a file on disk. Throws if the argument is not a File.

The old `File.path` property is deprecated; use `webUtils.getPathForFile(file)` instead.

## Key Points

- Renderer-only; with context isolation use from preload and expose a minimal API.
- Prefer not to expose full file paths to renderer content; have preload send the path to main via IPC and keep logic in main when possible.

<!--
Source references:
- https://www.electronjs.org/docs/latest/api/web-utils
-->
