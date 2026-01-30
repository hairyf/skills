---
name: arch-webext-vue-views
description: Popup, options, and sidepanel Vue apps—entry HTML, main.ts, and shared setup in the Vitesse WebExtension template.
---

# Popup, Options, and Sidepanel Views

Three UI surfaces are built as separate Vite HTML entries: **popup**, **options**, and **sidepanel**. Each has an `index.html`, a `main.ts` that creates the Vue app and calls `setupApp`, and a root Vue component. They share components, composables, and styles.

## Structure Per View

| View | Path | Root component |
|------|------|----------------|
| Popup | `src/popup/index.html`, `main.ts`, `Popup.vue` | Popup.vue |
| Options | `src/options/index.html`, `main.ts`, `Options.vue` | Options.vue |
| Sidepanel | `src/sidepanel/index.html`, `main.ts`, `Sidepanel.vue` | Sidepanel.vue |

## Entry Pattern

```ts
// src/popup/main.ts (same pattern for options, sidepanel)
import { createApp } from 'vue'
import App from './Popup.vue'
import { setupApp } from '~/logic/common-setup'
import '../styles'

const app = createApp(App)
setupApp(app)
app.mount('#app')
```

- **setupApp(app)**: Registers global properties, provides, and plugins (e.g. i18n) used across all views and content script. Defined in `~/logic/common-setup`.
- **styles**: Import shared CSS (e.g. `src/styles/index.ts` or `main.css`) so all views get the same base styles and UnoCSS.

## HTML

Each view has a minimal `index.html` with a script to `./main.ts` and a `<div id="app"></div>`. In dev, `scripts/prepare.ts` rewrites the script src to `http://localhost:${port}/{view}/main.ts` and writes the file to `extension/dist/{view}/index.html` so the browser loads the app from Vite.

## Using Extension APIs

Views run in extension pages, so `browser` (webextension-polyfill) is available. Example: open options from popup:

```ts
function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
```

Use `webext-bridge` from the correct context (e.g. `webext-bridge/popup`) to send/receive messages from background or content script.

## Key Points

- Every view must call `setupApp(app)` before `app.mount()` for shared plugins and globals.
- Shared UI lives in `src/components/` (auto-imported) and `src/styles/`; import styles once in each view’s main.ts.
- Popup and sidepanel are small windows; options usually opens in a tab (`open_in_tab: true` in manifest).

<!--
Source references:
- https://github.com/antfu-collective/vitesse-webext (src/popup/, src/options/, src/sidepanel/, src/logic/common-setup.ts)
-->
