---
name: develop-cookies
description: session.cookies; get, set, remove, flushStore; changed event; filter and details.
---

# Cookies (Session)

The **Cookies** API (main process) is accessed via **session.cookies** (e.g. `session.defaultSession.cookies`). Use it to query, set, and remove cookies for that session. All methods are async and return Promises.

## Usage

```js
const { session } = require('electron')

// Get all cookies, or filter by url / name / domain / path / secure / session / httpOnly
const list = await session.defaultSession.cookies.get({})
const forUrl = await session.defaultSession.cookies.get({ url: 'https://example.com' })

// Set a cookie
await session.defaultSession.cookies.set({
  url: 'https://example.com',
  name: 'name',
  value: 'value',
  domain: '.example.com',
  path: '/',
  secure: true,
  httpOnly: false,
  expirationDate: Math.floor(Date.now() / 1000) + 3600,
  sameSite: 'lax'
})

// Remove and flush
await session.defaultSession.cookies.remove('https://example.com', 'name')
await session.defaultSession.cookies.flushStore()
```

## Methods

- **get(filter)** — Returns `Promise<Cookie[]>`. Filter: `url`, `name`, `domain`, `path`, `secure`, `session`, `httpOnly`. Empty filter returns all cookies.
- **set(details)** — Returns `Promise<void>`. Details: `url` (required), `name`, `value`, `domain`, `path`, `secure`, `httpOnly`, `expirationDate`, `sameSite` (`unspecified`|`no_restriction`|`lax`|`strict`). May overwrite existing cookies.
- **remove(url, name)** — Returns `Promise<void>`.
- **flushStore()** — Returns `Promise<void>`. Writes pending cookies to disk (otherwise written every ~30s or 512 ops).

## Events

- **changed** — `(event, cookie, cause, removed)`. Cause: `explicit`, `overwrite`, `expired`, `evicted`, `expired-overwrite`. `removed` is true if the cookie was removed.

## Key Points

- Use the same session as the windows whose cookies you are managing (e.g. `defaultSession` or the partition used by the BrowserWindow).
- Cookie structure: see [Cookie](https://www.electronjs.org/docs/latest/api/structures/cookie) in the API docs (name, value, domain, path, etc.).

<!--
Source references:
- https://www.electronjs.org/docs/latest/api/cookies
-->
