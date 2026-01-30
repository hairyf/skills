---
name: develop-net-log
description: Session network logging with netLog; startLogging, stopLogging, captureMode, maxFileSize.
---

# netLog (Network Logging)

The `netLog` module (main process) records network events for the session to a file. Use it for debugging requests, TLS, or proxy behavior. All methods require the `app` `ready` event to have fired.

## Usage

```js
const { app, netLog } = require('electron')

app.whenReady().then(async () => {
  await netLog.startLogging('/path/to/net-log', {
    captureMode: 'default', // or 'includeSensitive', 'everything'
    maxFileSize: 10 * 1024 * 1024 // optional, bytes; default unlimited
  })
  // ... trigger network activity ...
  const path = await netLog.stopLogging()
  console.log('Net-logs written to', path)
})
```

## Methods

- **`startLogging(path[, options])`** — Returns `Promise<void>`. Starts recording to `path`.
  - **`captureMode`**: `default` (metadata only), `includeSensitive` (cookies/auth), `everything` (all bytes).
  - **`maxFileSize`**: Stop when log exceeds this (bytes); default unlimited.
- **`stopLogging()`** — Returns `Promise<void>`; flushes and stops. If not called, logging ends on app quit.

## Properties

- **`netLog.currentlyLogging`** (readonly) — `true` while recording.

## Key Points

- For app-lifecycle-wide net logging (before/after ready), use the **`--log-net-log=path`** command-line switch (see [develop-command-line](develop-command-line.md)).

<!--
Source references:
- https://www.electronjs.org/docs/latest/api/net-log
-->
