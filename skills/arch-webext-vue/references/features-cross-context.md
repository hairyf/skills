---
name: arch-webext-vue-cross-context
description: webext-bridge usage for messaging between background, content script, and popup/options in the Vitesse WebExtension template.
---

# Cross-Context Messaging (webext-bridge)

**webext-bridge** provides typed message passing between extension contexts: background, content script, popup, options, and sidepanel. Each context imports from a different subpath and uses `onMessage` / `sendMessage` with the same message names and payload types.

## Import by Context

| Context | Import |
|--------|--------|
| Background | `webext-bridge/background` → `onMessage`, `sendMessage` |
| Content script | `webext-bridge/content-script` → `onMessage`, `sendMessage` |
| Popup / Options / Sidepanel | `webext-bridge/popup` (or appropriate context) → `onMessage`, `sendMessage` |

Use the correct entry so the bridge knows the current context; do not mix (e.g. don’t use `webext-bridge/background` in a content script).

## Sending Messages

```ts
// Background → content script (to a specific tab)
sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })

// Popup/Content script → background (no tab)
const result = await sendMessage('get-current-tab', undefined, { context: 'background' })
```

- **First argument**: Message name (string); must match the name used in `onMessage` on the receiving side.
- **Second argument**: Payload (serializable).
- **Third argument**: Options, e.g. `{ context: 'content-script', tabId }` to target a tab, or `{ context: 'background' }` for background.

## Receiving Messages

```ts
// Content script
onMessage('tab-prev', ({ data }) => {
  console.log('Previous tab title:', data.title)
})

// Background
onMessage('get-current-tab', async () => {
  const tab = await browser.tabs.get(previousTabId)
  return { title: tab?.title }
})
```

- **onMessage(name, handler)**: Handler receives `{ data }` (incoming payload). If the handler returns a value, the sender can await it (e.g. `sendMessage('get-current-tab', ...)` returns the handler’s return value).
- Keep handlers async when doing async work; return type is inferred for callers.

## Type Safety

Use shared types for payloads and return values so background, content script, and popup stay in sync. Declare message names as const and reuse them on both sides.

## Key Points

- Always use the context-specific import (`/background`, `/content-script`, `/popup`, etc.).
- For content script, specify `tabId` when sending from background; for broadcast to all tabs you’d need to iterate or use a different pattern.
- Message names are strings; agree on a naming convention (e.g. `tab-prev`, `get-current-tab`) and document them in one place.

<!--
Source references:
- https://github.com/antfu-collective/vitesse-webext (src/background/main.ts, src/contentScripts/index.ts)
- https://github.com/antfu/webext-bridge
-->
