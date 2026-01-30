---
name: develop-debugger
description: webContents.debugger (Chrome DevTools Protocol); attach, detach, sendCommand, message/detach events.
---

# Debugger (Chrome DevTools Protocol)

The **debugger** (main process) is an alternate transport for [Chrome's Remote Debugging Protocol](https://chromedevtools.github.io/devtools-protocol/). Access via **webContents.debugger**. Use it to automate or instrument a page (e.g. Network, DOM, profiling) without opening DevTools UI. If DevTools is opened for the same webContents, the debugger detaches.

## Usage

```js
const { BrowserWindow } = require('electron')

const win = new BrowserWindow()

try {
  win.webContents.debugger.attach('1.1') // optional protocol version
} catch (err) {
  console.log('Attach failed', err)
}

win.webContents.debugger.on('detach', (event, reason) => {
  console.log('Detached', reason)
})

win.webContents.debugger.on('message', (event, method, params, sessionId) => {
  if (method === 'Network.requestWillBeSent') {
    console.log(params.request.url)
  }
})

await win.webContents.debugger.sendCommand('Network.enable')
// Later: win.webContents.debugger.detach()
```

## Methods

- **attach([protocolVersion])** — Attach to this webContents. Throws if already attached or invalid.
- **detach()** — Detach the debugger.
- **isAttached()** — Returns boolean.
- **sendCommand(method[, commandParams, sessionId])** — Returns `Promise<any>`. Sends a command from the [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/); resolve/reject matches the protocol response. Use `sessionId` when targeting a specific session (e.g. from `Target.attachToTarget`).

## Events

- **detach** — `(event, reason)`. Emitted when the session ends (e.g. webContents closed or DevTools opened).
- **message** — `(event, method, params, sessionId)`. Emitted when the target sends an instrumentation event.

## Key Points

- Main process only; one debugger per webContents. Do not mix with opening DevTools for the same webContents.
- Use for automation (e.g. E2E), network interception, or profiling; see the protocol domains (Network, Page, DOM, etc.) for available methods and events.

<!--
Source references:
- https://www.electronjs.org/docs/latest/api/debugger
-->
