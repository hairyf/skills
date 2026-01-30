---
name: arch-webext-vue-dev-workflow
description: Development commands, loading the extension, Firefox vs Chrome, and stub HTML in the Vitesse WebExtension template.
---

# Dev Workflow

Development uses **pnpm dev** (or **pnpm dev-firefox** for Firefox). Scripts clear output, run prepare (manifest + stub HTML), then build background and content script in watch mode and start the main Vite dev server. Load the **extension/** folder in the browser to run the extension with HMR for popup, options, and sidepanel.

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Clear → prepare → watch background + content → Vite dev server. Load `extension/` in Chrome (or Chromium-based). |
| `pnpm dev-firefox` | Same with `EXTENSION=firefox`; use with `web-ext run --source-dir ./extension` for auto-reload on file change. |

- **prepare** (`scripts/prepare.ts`): Writes `extension/manifest.json` from `getManifest()` and, in dev, stubs `extension/dist/{options,popup,sidepanel}/index.html` to load scripts from `http://localhost:${port}/{view}/main.ts`. Chokidar watches HTML and manifest so stubs and manifest are updated on change.
- **Port**: Default 3303 (`scripts/utils.ts`); override with `PORT=3333 pnpm dev`.

## Loading the Extension

1. Run `pnpm dev`.
2. Open browser: Chrome → Extensions → “Load unpacked” → select the **extension/** directory (repo root’s `extension/`).
3. Popup/options/sidepanel load from Vite via the stub HTML; background and content script are built to `extension/dist/` and loaded by the browser.

For Firefox, `pnpm dev-firefox` sets `EXTENSION=firefox`; then run `web-ext run --source-dir ./extension` so the extension reloads when `extension/` changes. Vite HMR still applies to the web entries; content script may be cached per page (Extensions Reloader or similar can help for full reload).

## Stub HTML (Dev Only)

In dev, `extension/dist/{popup,options,sidepanel}/index.html` are **stubs**: they replace the script src with `http://localhost:${port}/{view}/main.ts` so the browser loads the app from Vite. The real `src/{view}/index.html` is only used by Vite’s build; the extension never serves it directly. Do not edit the stubs by hand; re-run prepare or rely on chokidar in prepare.

## Key Points

- Always load **extension/** (not repo root). Manifest and built assets live there.
- For clean hard reload of the extension (e.g. after manifest or background change), use the browser’s “Reload” on the extension or an extension like Extensions Reloader.
- Firefox: use `dev-firefox` + `web-ext run` for a smooth reload loop; Chromium uses the same `extension/` folder.

<!--
Source references:
- https://github.com/antfu-collective/vitesse-webext (README.md, package.json, scripts/prepare.ts, scripts/utils.ts)
-->
