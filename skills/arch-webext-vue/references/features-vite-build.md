---
name: arch-webext-vue-vite-build
description: Vite multi-config setup for popup/options/sidepanel, background, and content script in the Vitesse WebExtension template.
---

# Vite Build Configuration

The template uses **three Vite configs**: one shared base for UI + two derived configs for background and content script. Build output goes under `extension/dist/` with fixed entry filenames so the manifest can reference them.

## Shared Config (`vite.config.mts`)

- **root**: `src/` so that `~/` alias and entry paths are under `src/`.
- **define**: `__DEV__`, `__NAME__` (from package.json name).
- **base**: In dev, `http://localhost:${port}/`; for build, `/dist/`.
- **plugins**: Vue, AutoImport (vue + `webextension-polyfill` as `browser`), Components (dirs: `src/components`), Icons, UnoCSS, and a post-build `assets-rewrite` that rewrites `/assets/` to relative paths in built HTML.
- **build.rollupOptions.input**: Multi-entry by HTML: `options`, `popup`, `sidepanel` → `src/options/index.html`, etc.
- **build.outDir**: `extension/dist`; `emptyOutDir: false` so background/content builds don’t wipe each other.
- **build.watch**: Enabled when `isDev` for continuous build during `pnpm dev`.

## Background Config (`vite.config.background.mts`)

- Extends `sharedConfig`.
- **build.lib**: entry `src/background/main.ts`, format `iife`, name from package.
- **build.outDir**: `extension/dist/background`.
- **rollupOptions.output.entryFileNames**: `index.mjs` (manifest expects this).

## Content Script Config (`vite.config.content.mts`)

- Extends `sharedConfig`.
- **build.lib**: entry `src/contentScripts/index.ts`, format `iife`.
- **build.outDir**: `extension/dist/contentScripts`.
- **rollupOptions.output.entryFileNames**: `index.global.js` (manifest expects this).
- **define**: Includes `process.env.NODE_ENV` for compatibility.

## Dev Stub (scripts/prepare.ts)

In dev, `prepare.ts` writes stub HTML files under `extension/dist/{options,popup,sidepanel}/index.html` that load scripts from `http://localhost:${port}/{view}/main.ts`. This lets the browser load the extension while Vite serves the real app; chokidar watches HTML and manifest to re-run stubs and manifest write on change.

## Scripts

- **dev**: `clear` then `run-p dev:prepare dev:background dev:web dev:js`. Prepare runs first; then background and content build in watch; main Vite runs dev server.
- **build**: `clear` → `build:web` → `build:prepare` → `build:background` → `build:js`. Order matters: web produces dist, prepare writes manifest and (in dev) stubs; background and content add their outputs.

## Key Points

- Do not change output entry filenames (`index.mjs`, `index.global.js`) without updating `src/manifest.ts`.
- Shared config applies to all three; only build options (lib vs multi-entry, outDir, entryFileNames) differ.
- AutoImport exposes `browser` from `webextension-polyfill` globally so extension code can use `browser.*` without importing.

<!--
Source references:
- https://github.com/antfu-collective/vitesse-webext (vite.config.mts, vite.config.background.mts, vite.config.content.mts, scripts/prepare.ts, package.json)
-->
