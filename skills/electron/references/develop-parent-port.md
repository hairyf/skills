---
name: develop-parent-port
description: Utility process parentPort; receive/send messages from child to main; process.parentPort in child script.
---

# parentPort (Utility Process Child)

In a **utility process** child script, `process.parentPort` is the interface for communicating with the main process. It is an EventEmitter; not exported from `'electron'`, only available on `process` in the child.

## Usage

**Main process:** Use `utilityProcess.fork(path)` and then `child.postMessage(message)` or pass `MessagePortMain` via transfer list. Listen to `child.on('message', (data) => { ... })`.

**Child process:** Use `process.parentPort.on('message', (e) => { ... })` and `process.parentPort.postMessage(message)`.

```js
// Main
const child = utilityProcess.fork(path.join(__dirname, 'worker.js'))
child.postMessage({ message: 'hello' })
child.on('message', (data) => console.log(data)) // "hello world!"

// Child (worker.js)
process.parentPort.on('message', (e) => {
  process.parentPort.postMessage(`${e.data.message} world!`)
})
```

## Events

- **`message`** — Emitted when the child receives a message. Payload: `{ data, ports }` (ports: `MessagePortMain[]`). Messages are queued until a handler is registered.

## Methods

- **`parentPort.postMessage(message)`** — Send from child to parent. Main receives via the utility’s `message` event.

## Key Points

- Only available inside a script started with `utilityProcess.fork()`.
- For passing MessagePorts and structured clone, use the same patterns as in [develop-utility-process](develop-utility-process.md) and [features-message-ports](features-message-ports.md).

<!--
Source references:
- https://www.electronjs.org/docs/latest/api/parent-port
-->
