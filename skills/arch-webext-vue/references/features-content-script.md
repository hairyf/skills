---
name: arch-webext-vue-content-script
description: Content script entry, Vue app mount in shadow DOM, and style loading in the Vitesse WebExtension template.
---

# Content Script

The content script entry is `src/contentScripts/index.ts`, built as IIFE to `extension/dist/contentScripts/index.global.js`. It runs in the page context and mounts a Vue app (e.g. into a shadow DOM) so the UI is isolated from the host page. Styles are loaded from the extension via `web_accessible_resources`.

## Entry Pattern

```ts
// src/contentScripts/index.ts
import { onMessage } from 'webext-bridge/content-script'
import { createApp } from 'vue'
import App from './views/App.vue'
import { setupApp } from '~/logic/common-setup'

;(() => {
  onMessage('tab-prev', ({ data }) => { /* ... */ })

  const container = document.createElement('div')
  container.id = __NAME__
  const root = document.createElement('div')
  const styleEl = document.createElement('link')
  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  document.body.appendChild(container)
  const app = createApp(App)
  setupApp(app)
  app.mount(root)
})()
```

- **IIFE**: Wrapping in `(() => { ... })()` keeps scope local; some environments expect a primitive return.
- **Shadow DOM**: Prefer `attachShadow` so page CSS/JS don’t leak in; use `mode: 'open'` in dev for debugging.
- **Styles**: Content script CSS is built by the same Vite config (sharedConfig) and emitted to `extension/dist/contentScripts/`. The manifest must list it in `web_accessible_resources` so `browser.runtime.getURL('dist/contentScripts/style.css')` is loadable. Link tag is added inside the shadow root.
- **setupApp**: Same as popup/options/sidepanel for consistent plugins and globals.

## Manifest Requirements

- `content_scripts[].js`: `['dist/contentScripts/index.global.js']`.
- `web_accessible_resources`: `{ resources: ['dist/contentScripts/style.css'], matches: ['<all_urls>'] }` (or appropriate matches).

## Vue and Auto-imports

Content script uses the same Vite shared config, so Vue, Components, AutoImport (e.g. `browser`), and UnoCSS apply. Use `~/` for shared components and logic. Ensure `uno.css` (or your style entry) is imported in the root Vue component or in the content entry if needed.

## Key Points

- Always load content script CSS via a link to the extension resource; do not rely on inline styles only if you want full UnoCSS/Vite CSS.
- Use `webext-bridge/content-script` for messaging; message names must match background/popup.
- Reuse `setupApp` and shared components so popup, options, sidepanel, and content script behave consistently.

<!--
Source references:
- https://github.com/antfu-collective/vitesse-webext (src/contentScripts/index.ts, src/contentScripts/views/App.vue, src/manifest.ts)
-->
