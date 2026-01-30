---
name: arch-webext-vue-setup-patterns
description: Shared Vue app setup (setupApp, common-setup) and consistent patterns across popup, options, sidepanel, and content script in the Vitesse WebExtension template.
---

# Setup Patterns

The template keeps popup, options, sidepanel, and content script consistent by using a single **setupApp** function from `~/logic/common-setup`. Use it to register global properties, provide/inject values, and install Vue plugins so all surfaces behave the same.

## common-setup

```ts
// src/logic/common-setup.ts
import type { App } from 'vue'

export function setupApp(app: App) {
  app.config.globalProperties.$app = { context: '' }
  app.provide('app', app.config.globalProperties.$app)
  // Optional: app.use(i18n), etc.
  // Optional: if (context !== 'content-script') app.use(somePlugin)
}
```

- **globalProperties**: Use for template-only globals (e.g. `$app`). Prefer provide/inject in `<script setup>`.
- **provide**: Same key (`'app'`) in every entry so any child can `inject('app')`.
- **Plugins**: Add Vue plugins (i18n, router if needed) here so popup, options, sidepanel, and content script all get them. Skip or branch for content script if a plugin doesn’t support it.

## Where to Call setupApp

| Entry | File | When |
|-------|------|------|
| Popup | `src/popup/main.ts` | After `createApp(App)`, before `app.mount('#app')` |
| Options | `src/options/main.ts` | Same |
| Sidepanel | `src/sidepanel/main.ts` | Same |
| Content script | `src/contentScripts/index.ts` | After `createApp(App)`, before `app.mount(root)` |

Always call it once per app instance; do not call it inside components.

## Shared Components and Styles

- **Components**: Place in `src/components/`; unplugin-vue-components auto-imports them in all Vite-built code (popup, options, sidepanel, content script). Use the same component names so templates are portable.
- **Styles**: Import shared CSS (e.g. `src/styles/index.ts` or `main.css`) in each view’s `main.ts` and in the content script root component if needed. UnoCSS and global styles then apply everywhere.

## Logic and Composables

- **logic/**: Put app-wide state and helpers in `~/logic/` (e.g. `common-setup.ts`, `storage.ts`, `index.ts`). Import in views and content script.
- **composables/**: Use for reusable Vue composition (e.g. `useWebExtensionStorage`). Import where needed; they work in any context that runs Vue.

## Key Points

- One `setupApp` implementation; no per-view duplication of plugin or global setup.
- Use provide/inject for values that differ by context (e.g. `context: 'popup'` vs `'content-script'`) if you need to branch inside components.
- Keep shared dependencies (webext-bridge, storage keys, message names) in a few modules so adding a new view or content script stays simple.

<!--
Source references:
- https://github.com/antfu-collective/vitesse-webext (src/logic/common-setup.ts, src/popup/main.ts, src/contentScripts/index.ts)
-->
