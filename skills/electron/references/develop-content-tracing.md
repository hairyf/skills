---
name: develop-content-tracing
description: Chromium contentTracing; startRecording, stopRecording, getCategories, getTraceBufferUsage; chrome://tracing.
---

# contentTracing

The `contentTracing` module (main process) collects Chromium tracing data to find performance bottlenecks. Use it after the `app` `ready` event. Recorded traces are viewed in Chrome’s trace viewer (`chrome://tracing`), not in Electron.

## Usage

```js
const { app, contentTracing } = require('electron')

app.whenReady().then(async () => {
  const categories = await contentTracing.getCategories()
  await contentTracing.startRecording({ included_categories: ['*'] })
  // ... run workload ...
  await new Promise(r => setTimeout(r, 5000))
  const path = await contentTracing.stopRecording()
  console.log('Trace written to', path)
})
```

## Methods

- **`getCategories()`** — Returns `Promise<string[]>`; category groups (can change as code paths run). Built-in categories are in Chromium; Electron adds `"electron"`.
- **`startRecording(options)`** — Options: `TraceConfig` or `TraceCategoriesAndOptions` (e.g. `included_categories: ['*']`). Returns `Promise<void>`. Only one recording at a time; if already running, resolves immediately.
- **`stopRecording([resultFilePath])`)`** — Returns `Promise<string>` (path to trace file). If path omitted, uses a temp file. Flushes trace data from all processes.
- **`getTraceBufferUsage()`** — Returns `Promise<{ value, percentage }>`; max trace buffer usage across processes.

## Key Points

- Do not call before `app` `ready`.
- Open the output file in Chrome at `chrome://tracing` to inspect.
- Use category `"electron"` for Electron-specific events.

<!--
Source references:
- https://www.electronjs.org/docs/latest/api/content-tracing
-->
