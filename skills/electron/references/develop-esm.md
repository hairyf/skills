---
name: develop-esm
description: Using ES modules (ESM) in Electron — main process, preload (.mjs, sandbox limitations), and caveats.
---

# ES Modules (ESM) in Electron

Electron supports ESM in the main process and, with limitations, in preload scripts. The loader used depends on the process and preload environment (Node vs Chromium). ESM support was added in Electron 28.

## Main process

The main process uses Node’s ESM loader. Enable ESM by either:

- Using the `.mjs` extension for entry and any ESM files, or
- Setting `"type": "module"` in the nearest `package.json`.

Follow [Node’s ESM docs](https://nodejs.org/api/esm.html) for `import`/`export` and `import()`.

### Caveat: code before ready

ESM loading is asynchronous. Only top-level side effects from the main entry’s imports run before the `ready` event. APIs like `app.setPath()` must be called **before** `ready`. Use top-level `await` (or a synchronous bootstrap) so any setup that must run before `ready` is finished before you call `app.whenReady()` or rely on `ready`. Dynamic `import()` at the top level may resolve after `ready`, so ensure ordering explicitly (e.g. `await import('./set-up-paths.mjs')` before `app.whenReady()`).

## Preload scripts

- **Sandboxed renderers:** Preload does **not** support ESM (Chromium loader; no Node ESM in preload). Use CommonJS in preload when the renderer is sandboxed.
- **Unsandboxed + context isolated (or non–context isolated):** Preload can use Node’s ESM loader. The preload file **must** have the `.mjs` extension. Also note: on pages with no content (e.g. `about:blank`), unsandboxed ESM preload may run **after** the page loads; test behavior for your case.

Preload is specified in `webPreferences.preload` (e.g. `path.join(__dirname, 'preload.mjs')`).

## Renderer process

The renderer uses Chromium’s script loading; `<script type="module">` and dynamic `import()` work as in the browser. No Node ESM in the renderer itself unless you expose something via preload.

## Key points

- Main: use `.mjs` or `"type": "module"`; ensure any setup that must run before `ready` is awaited or run synchronously.
- Preload: ESM only when unsandboxed, and the file must be `.mjs`; sandboxed preload must use CommonJS.
- Renderer: standard web ESM (`<script type="module">`, `import()`); no Node ESM in the page.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/esm.md
- https://www.electronjs.org/docs/latest/tutorial/esm
-->
