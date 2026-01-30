---
name: arch-webext-vue-type-safe-messaging
description: Type-safe webext-bridge protocols via ProtocolMap in shim.d.ts for the Vitesse WebExtension template.
---

# Type-Safe Messaging (webext-bridge)

**webext-bridge** supports typed message names and payload/return types via a **ProtocolMap** interface. The template declares it in **shim.d.ts** so `sendMessage` and `onMessage` are type-checked and autocomplete works across background, content script, and popup.

## Declaring the Protocol

In **shim.d.ts** at repo root:

```ts
import type { ProtocolWithReturn } from 'webext-bridge'

declare module 'webext-bridge' {
  export interface ProtocolMap {
    // one-way message: payload type only
    'tab-prev': { title: string | undefined }
    // request/response: use ProtocolWithReturn<RequestPayload, ResponsePayload>
    'get-current-tab': ProtocolWithReturn<{ tabId: number }, { title?: string }>
  }
}
```

- **Message name** (key): String literal type; must match exactly what you pass to `sendMessage` and `onMessage`.
- **One-way**: Value is the payload type, e.g. `{ title: string | undefined }`. Receiving side gets `data` with this shape; sender does not await a return value.
- **Request/response**: Value is `ProtocolWithReturn<Req, Res>`. Sender can `await sendMessage('get-current-tab', { tabId })` and get `Res`; handler must return `Res`.

## Usage

```ts
// Background: send one-way
sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })

// Background: handle request/response
onMessage('get-current-tab', async () => {
  const tab = await browser.tabs.get(previousTabId)
  return { title: tab?.title }  // must match ProtocolMap return type
})

// Content script: receive one-way
onMessage('tab-prev', ({ data }) => {
  console.log(data.title)  // data is { title: string | undefined }
})
```

Adding a new message: add an entry to **ProtocolMap** in shim.d.ts, then use that name and payload type in both sender and receiver. Renaming or changing types in one place will surface type errors everywhere the message is used.

## Key Points

- Keep all message names and payload/return types in a single **ProtocolMap** in shim.d.ts so the whole codebase stays in sync.
- Use **ProtocolWithReturn** only for messages that have a return value; use a plain payload type for one-way messages.
- Ensure shim.d.ts is included in tsconfig (no export/import that makes it a module unless you need it; the template uses `export {}` in modules.d.ts to make it a module, but shim.d.ts is typically ambient).

<!--
Source references:
- https://github.com/antfu-collective/vitesse-webext (shim.d.ts)
- https://github.com/antfu/webext-bridge#type-safe-protocols
-->
