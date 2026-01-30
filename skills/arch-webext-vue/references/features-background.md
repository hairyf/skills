---
name: arch-webext-vue-background
description: Background script entry, webext-bridge, side panel, and content script HMR in the Vitesse WebExtension template.
---

# Background Script

The background entry is `src/background/main.ts`, built as IIFE to `extension/dist/background/index.mjs`. It runs as a service worker (Chrome MV3) or background script (Firefox with `type: 'module'`). Use it for extension lifecycle, cross-context messaging, and optional content script HMR.

## Entry Setup

```ts
// src/background/main.ts
import { onMessage, sendMessage } from 'webext-bridge/background'
import type { Tabs } from 'webextension-polyfill'

if (import.meta.hot) {
  import('/@vite/client')   // Vite HMR
  import('./contentScriptHMR') // optional: re-inject content script on nav
}
```

- **webext-bridge/background**: Use `onMessage` and `sendMessage` from this context; content script and popup/options use their own bridge imports.
- **browser** (webextension-polyfill): Available globally via AutoImport; use for `browser.tabs`, `browser.runtime`, etc.

## Side Panel

To open the side panel when the action button is clicked (Chromium):

```ts
browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error)
```

Manifest already points `side_panel.default_path` (Chrome) or `sidebar_action.default_panel` (Firefox) to `dist/sidepanel/index.html`.

## Messaging Example

Background can send to content script by tab:

```ts
let previousTabId = 0
browser.tabs.onActivated.addListener(async ({ tabId }) => {
  // ...
  sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
})
onMessage('get-current-tab', async () => {
  const tab = await browser.tabs.get(previousTabId)
  return { title: tab?.title }
})
```

Content script (or popup) listens with `onMessage('tab-prev', ({ data }) => ...)` and can call `sendMessage('get-current-tab', ...)` to request data from background.

## Content Script HMR (Optional)

`contentScriptHMR.ts` uses `browser.webNavigation.onCommitted` to re-inject the content script on navigation so dev changes are picked up. It skips forbidden URLs (chrome-extension://, etc.) and uses `browser.tabs.executeScript` with the built content script path. In the template this path is commented out in manifest (FIXME: not work in MV3) because MV3 restricts script injection; keep the pattern in mind for dev-only or MV2 setups.

## Key Points

- Import bridge from `webext-bridge/background`; other contexts use `webext-bridge/content-script` or `webext-bridge/popup` etc.
- Side panel UI is built from `src/sidepanel/`; background only configures behavior (e.g. open on action click).
- Use `browser` for tabs, storage, runtime; use webext-bridge for typed message passing between background, content script, and popup/options.

<!--
Source references:
- https://github.com/antfu-collective/vitesse-webext (src/background/main.ts, src/background/contentScriptHMR.ts, src/manifest.ts)
-->
