---
name: arch-webext-vue-manifest
description: Dynamic manifest.json generation and MV3 structure in the Vitesse WebExtension template.
---

# Dynamic Manifest

The extension uses a **TypeScript-defined manifest** in `src/manifest.ts`. The function `getManifest()` returns a `Manifest.WebExtensionManifest`; `scripts/manifest.ts` calls it and writes `extension/manifest.json`. This allows conditional fields (e.g. Firefox vs Chrome, dev CSP) and reading `package.json` for name, version, description.

## Usage

```ts
// src/manifest.ts
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, isFirefox, port, r } from '../scripts/utils'

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    action: { default_icon: '...', default_popup: 'dist/popup/index.html' },
    options_ui: { page: 'dist/options/index.html', open_in_tab: true },
    background: isFirefox
      ? { scripts: ['dist/background/index.mjs'], type: 'module' }
      : { service_worker: 'dist/background/index.mjs' },
    content_scripts: [{ matches: ['<all_urls>'], js: ['dist/contentScripts/index.global.js'] }],
    web_accessible_resources: [{ resources: ['dist/contentScripts/style.css'], matches: ['<all_urls>'] }],
    content_security_policy: {
      extension_pages: isDev
        ? `script-src 'self' http://localhost:${port}; object-src 'self'`
        : `script-src 'self'; object-src 'self'`,
    },
    // ...
  }
  if (isFirefox) manifest.sidebar_action = { default_panel: 'dist/sidepanel/index.html' }
  else (manifest as any).side_panel = { default_path: 'dist/sidepanel/index.html' }
  return manifest
}
```

- **Writing**: `scripts/manifest.ts` runs `getManifest()` and `fs.writeJSON('extension/manifest.json', ...)`.
- **Port**: From `scripts/utils.ts` (`process.env.PORT` or default 3303); used in dev CSP so Vite can load.
- **Firefox**: `EXTENSION=firefox` sets `isFirefox`; background uses `scripts` + `type: 'module'`; side panel uses `sidebar_action` vs Chrome’s `side_panel`.

## Permissions and Paths

- Typical permissions: `tabs`, `storage`, `activeTab`, `sidePanel`; `host_permissions: ['*://*/*']` if needed.
- All built paths are under `dist/`: popup, options, sidepanel, background, content scripts; icons in `assets/`.
- Content script CSS must be listed in `web_accessible_resources` so the page can load it (e.g. for shadow DOM link).

## Key Points

- Never hand-edit `extension/manifest.json`; it is generated. Change `src/manifest.ts` and re-run prepare (or dev).
- Dev CSP allows `http://localhost:${port}` for Vite; production CSP is strict.
- Firefox vs Chromium differences are centralized in `getManifest()` via `isFirefox`.

<!--
Source references:
- https://github.com/antfu-collective/vitesse-webext (src/manifest.ts, scripts/manifest.ts, scripts/utils.ts)
-->
