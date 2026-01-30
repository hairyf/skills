---
name: develop-web-request
description: webRequest — onBeforeRequest, onBeforeSendHeaders, onHeadersReceived; filter by URL; set CSP.
---

# Web Request

The `WebRequest` API (main process) lets you intercept and modify requests at various stages. Access it via **session.webRequest** (e.g. `session.defaultSession.webRequest`). Use it to add headers, redirect, cancel requests, or inject CSP via **onHeadersReceived**.

Only the **last** attached listener is used per event; pass **null** as the listener to unsubscribe.

## Filter

All methods accept an optional **filter** object with a **urls** property: an array of URL patterns that requests must match. If omitted, all requests are matched. Examples:

- `['*://*.github.com/*']` — All URLs on github.com subdomains.
- `['<all_urls>']` — All URLs.
- `['*://example.com/foo/*']` — example.com/foo/ and below.

See the [WebRequest filter](https://www.electronjs.org/docs/latest/api/structures/web-request-filter) and Chrome’s [match patterns](https://developer.chrome.com/docs/extensions/mv3/match_patterns/) for syntax.

## Common events

- **onBeforeRequest(filter, listener)** — Fired before the request is sent. **listener(details, callback)**; call **callback({ cancel: true })** to cancel or **callback({ redirectURL: url })** to redirect.
- **onBeforeSendHeaders(filter, listener)** — Fired before headers are sent. **listener(details, callback)**; call **callback({ requestHeaders: details.requestHeaders })** with modified headers (e.g. set `User-Agent`).
- **onHeadersReceived(filter, listener)** — Fired when response headers are available. **listener(details, callback)**; call **callback({ responseHeaders: { ... }, statusLine })** or **callback({ cancel: true })**. Use this to **set or override Content-Security-Policy** (see [best-practices-security](references/best-practices-security.md)).

```js
const { session } = require('electron')

// Add User-Agent
session.defaultSession.webRequest.onBeforeSendHeaders(
  { urls: ['*://*.github.com/*'] },
  (details, callback) => {
    details.requestHeaders['User-Agent'] = 'MyApp/1.0'
    callback({ requestHeaders: details.requestHeaders })
  }
)

// Inject CSP via response headers
session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': ["default-src 'self'"]
    }
  })
})
```

## Key points

- Use **session.webRequest** with **onBeforeRequest**, **onBeforeSendHeaders**, **onHeadersReceived**; pass a **filter** with **urls** to limit scope.
- Only the **last** listener per event is used; pass **null** to remove. Call the **callback** with the appropriate response object.
- Use **onHeadersReceived** to set **Content-Security-Policy** or other response headers.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/api/web-request.md
- https://www.electronjs.org/docs/latest/api/web-request
- https://github.com/electron/electron/blob/main/docs/tutorial/security.md
-->
