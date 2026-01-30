---
name: develop-net
description: net module — net.fetch, net.request; HTTP from main process using Chromium stack; net.isOnline.
---

# Net (HTTP from Main Process)

The `net` module (main process and utility process) issues HTTP/HTTPS requests using Chromium’s network stack instead of Node’s. Use it when you need proxy support, consistent behavior with the browser, or to avoid mixing Node’s HTTP with Chromium. The module is available only **after** the `app` `ready` event.

## net.fetch(input[, init])

Same semantics as the global **fetch()** in the renderer: pass a URL string or Request, optional **init** (method, headers, body, etc.). Returns a **Promise\<Response\>**. Uses Chromium’s stack (proxies, auth, TLS).

```js
const { app, net } = require('electron')

app.whenReady().then(async () => {
  const response = await net.fetch('https://api.example.com/data')
  const data = await response.json()
})
```

Use for one-off or simple requests from the main process. For streaming or fine-grained control use **net.request()**.

## net.request(options)

Creates a **ClientRequest** (streaming). Options: **url**, **method**, **headers**, **body**, etc. Listen to **response**, **data**, **end** on the response; call **request.end()** to send. See the [ClientRequest](https://www.electronjs.org/docs/latest/api/client-request) API.

```js
const { net } = require('electron')
const request = net.request({ url: 'https://example.com', method: 'GET' })
request.on('response', (response) => {
  response.on('data', (chunk) => {})
  response.on('end', () => {})
})
request.end()
```

## Why use net instead of Node’s http/https

- **Proxy** — Uses system and WPAD proxy configuration automatically.
- **Consistency** — Same stack as renderer and as protocol handlers (e.g. custom protocol using **net.fetch**).
- **Auth** — Supports proxy auth (basic, digest, NTLM, etc.) and tunneling.

For **online/offline** status use **net.isOnline()** or **net.online** (see [features-online-offline](references/features-online-offline.md)).

## Key points

- Use **net.fetch()** after **app.whenReady()** for simple HTTP from the main process; use **net.request()** for streaming.
- **net** uses Chromium’s network stack (proxies, auth, TLS). Use **net.isOnline** / **net.online** for connectivity.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/api/net.md
- https://www.electronjs.org/docs/latest/api/net
-->
