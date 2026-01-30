---
name: develop-protocol
description: Custom protocol and protocol interception — protocol.handle, registerSchemesAsPrivileged, serving local content securely.
---

# Custom Protocol

Register a custom URL scheme (e.g. `myapp://`) and serve content from the main process. Prefer custom protocols over `file://` for app pages to control what is loadable and avoid full filesystem exposure on XSS (see [best-practices-security](references/best-practices-security.md)).

All protocol methods (except `registerSchemesAsPrivileged`) can only be used after the `app` module’s `ready` event.

## protocol.handle(scheme, handler)

Register a handler for a scheme. The handler receives a `request` and can return a `Response` (e.g. from `net.fetch`) or a Promise of one. Use `net.fetch` with `pathToFileURL` to serve local files:

```js
const { app, protocol, net } = require('electron')
const path = require('node:path')
const { pathToFileURL } = require('node:url')

app.whenReady().then(() => {
  protocol.handle('myapp', (request) => {
    const pathname = new URL(request.url).pathname
    const filePath = path.join(__dirname, 'app', pathname)
    return net.fetch(pathToFileURL(filePath).toString())
  })
})
```

Then load `myapp://./index.html` (or your chosen path convention) in a BrowserWindow. Validate and sanitize paths to avoid directory traversal.

## Custom session / partition

Protocols are registered per [session](https://www.electronjs.org/docs/latest/api/session). If a window uses a custom `partition` or `session`, register the protocol on that session:

```js
const ses = session.fromPartition('persist:myapp')
ses.protocol.handle('myapp', (request) => { ... })
const win = new BrowserWindow({ webPreferences: { partition: 'persist:myapp' } })
```

## registerSchemesAsPrivileged(customSchemes)

Call **before** `ready` (and only once) to declare a scheme as standard, secure, or to grant privileges (e.g. bypass CSP, allow Service Workers, fetch API). Required if you want the scheme to behave like `https` (e.g. resolve relative URLs, use web storage):

```js
const { protocol } = require('electron')
protocol.registerSchemesAsPrivileged([
  { scheme: 'myapp', privileges: { standard: true, secure: true } }
])
```

Options in `privileges`: `standard`, `secure`, `bypassCSP`, `supportFetchAPI`, `corsEnabled`, `stream`, etc. See the [structures/custom-scheme](https://www.electronjs.org/docs/latest/api/structures/custom-scheme) docs.

## Key points

- Use `protocol.handle(scheme, handler)` after `ready` to serve content for a custom scheme; return a `Response` (e.g. from `net.fetch`).
- For `https`-like behavior (relative URLs, storage), call `registerSchemesAsPrivileged` before `ready` with `standard: true` and `secure: true`.
- Register the protocol on the same session/partition as the windows that will load it; validate paths when serving files.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/api/protocol.md
- https://www.electronjs.org/docs/latest/api/protocol
- https://github.com/electron/electron/blob/main/docs/tutorial/security.md
-->
