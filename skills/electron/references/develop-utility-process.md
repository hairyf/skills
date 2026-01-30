---
name: develop-utility-process
description: Utility Process API — fork, postMessage, MessagePortMain, stdout/stderr; when to use instead of child_process.fork.
---

# Utility Process

The `utilityProcess` module (main process) spawns a child process with Node.js and support for MessagePorts. Prefer it over Node’s `child_process.fork` when you need a separate Node process that can communicate with renderers via MessagePorts, or when the main process should not run heavy or crash-prone code.

## Spawning

Call `utilityProcess.fork(modulePath[, args][, options])` **after** the `app` `ready` event. `modulePath` is the path to the script that runs as the child entry point. Options include `env`, `execArgv`, `cwd`, `stdio`, `serviceName` (for `app.getAppMetrics()`), and platform-specific flags (e.g. `allowLoadingUnsignedLibraries` on macOS).

```js
const { utilityProcess } = require('electron')
const path = require('node:path')

const child = utilityProcess.fork(path.join(__dirname, 'worker.js'), ['arg1'], {
  cwd: process.cwd(),
  stdio: 'pipe'
})
```

Returns a `UtilityProcess` instance (EventEmitter). Listen to `spawn`, `exit`, `stderr` (if stdio is pipe). Use `child.pid` (after `spawn`) and `child.kill()` to terminate.

## Communicating with MessagePorts

You can pass `MessagePortMain` instances to the child via `child.postMessage(message, [transfer])`. In the child, use `process.parentPort` (Node.js `worker_threads`-style) to receive messages and ports:

```js
// Main process
const { utilityProcess, MessageChannelMain } = require('electron')
const path = require('node:path')
const { port1, port2 } = new MessageChannelMain()
const child = utilityProcess.fork(path.join(__dirname, 'worker.js'))
child.postMessage({ greeting: 'hello' }, [port1])
port2.on('message', (e) => console.log(e.data))

// worker.js (child)
process.parentPort.once('message', (e) => {
  const [port] = e.ports
  port.postMessage({ reply: 'pong' })
})
```

You can then pass a port to a renderer (e.g. via `webContents.postMessage`) so the renderer and the utility process communicate directly without the main process relaying every message.

## When to use

- Run CPU-heavy or crash-prone code outside the main process.
- Run untrusted or less-trusted code in a separate process.
- Need MessagePort communication between a renderer and a child process (utility process supports it; `child_process.fork` does not expose MessagePorts to renderers).

When the `runAsNode` fuse is disabled, `child_process.fork` will not work; use the utility process instead.

## Key points

- Use **utilityProcess.fork(modulePath, args, options)** after `ready`; returns a UtilityProcess with `pid`, `kill()`, `postMessage(message, transfer)`.
- Use **postMessage** with **MessagePortMain** in the transfer list to communicate with the child; the child uses **process.parentPort** to receive.
- Prefer utility process over **child_process.fork** when you need MessagePorts to renderers or when fuses disable runAsNode.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/api/utility-process.md
- https://www.electronjs.org/docs/latest/api/utility-process
- https://github.com/electron/electron/blob/main/docs/tutorial/process-model.md
-->
