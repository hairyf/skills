---
name: features-message-ports
description: MessagePort and MessageChannel in Electron — renderer-to-renderer and main-renderer messaging; MessagePortMain.
---

# MessagePorts in Electron

`MessagePort` / `MessageChannel` allow direct messaging between contexts. Electron extends this so the main process can use `MessagePortMain` and `MessageChannelMain` and transfer ports via IPC. Only `ipcRenderer.postMessage` and `WebContents.postMessage` can transfer `MessagePort`s; `send` and `invoke` cannot.

## Renderer: create and send a port

In the renderer, create a channel and send one port to the main process (or another frame) via `postMessage` with the port in the transfer list:

```js
const channel = new MessageChannel()
const port1 = channel.port1
const port2 = channel.port2
port2.postMessage({ answer: 42 })
ipcRenderer.postMessage('port', null, [port1])
```

## Main: receive and use MessagePortMain

In the main process, the received port is a `MessagePortMain` and uses Node-style events (`.on('message', ...)`). Call `.start()` before messages are delivered.

```js
const { ipcMain } = require('electron')
ipcMain.on('port', (event) => {
  const port = event.ports[0]
  port.on('message', (e) => {
    console.log(e.data) // { answer: 42 }
  })
  port.start()
})
```

## Connecting two renderers

Main can create a `MessageChannelMain`, get the two ports, and send one port to each renderer via `webContents.postMessage(..., [port])`. The two renderers then communicate directly without going through main for each message.

```js
const { MessageChannelMain } = require('electron')
const { port1, port2 } = new MessageChannelMain()
winA.webContents.postMessage('port', null, [port1])
winB.webContents.postMessage('port', null, [port2])
```

Each renderer receives the port in an IPC listener and uses `port.onmessage` or `port.addEventListener('message', ...)` and `port.postMessage(data)`.

## Close event

Electron adds a `close` event on ports when the other end is closed (or GC’d). In the renderer use `port.onclose` or `port.addEventListener('close', ...)`; in main use `port.on('close', ...)`.

## Key points

- Use `postMessage` with a transfer list to pass `MessagePort`s; `send`/`invoke` do not support transfer.
- In main, use `MessagePortMain` / `MessageChannelMain` and call `port.start()` after attaching listeners.
- MessagePorts are useful for renderer-to-renderer communication without main as a broker for every message.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/message-ports.md
- https://www.electronjs.org/docs/latest/tutorial/message-ports
-->
