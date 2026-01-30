---
name: electron-forge-plugin-vite
description: Vite plugin for Electron Forge — build/renderer entries, main path, HMR globals, native modules.
---

# Vite plugin

`@electron-forge/plugin-vite` bundles main, preload, and renderer with Vite. As of Forge v7.5.0, Vite support is **experimental**; minor releases may introduce breaking changes with migration notes. Install: `npm install --save-dev @electron-forge/plugin-vite`.

## Plugin config

Provide `build` (main/preload/worker entries) and `renderer` (renderer apps). Each build entry: `entry`, `config` (path to Vite config). Each renderer: `name`, `config`.

```javascript
plugins: [
  {
    name: '@electron-forge/plugin-vite',
    config: {
      build: [
        { entry: 'src/main.js', config: 'vite.main.config.mjs' },
        { entry: 'src/preload.js', config: 'vite.preload.config.mjs' }
      ],
      renderer: [
        { name: 'main_window', config: 'vite.renderer.config.mjs' }
      ]
    }
  }
]
```

## Project setup

Set `"main": ".vite/build/main.js"` in package.json (Vite template usually sets this). In main process, use the plugin’s globals for loadURL: for `main_window` you get `MAIN_WINDOW_VITE_DEV_SERVER_URL` (dev) and `MAIN_WINDOW_VITE_NAME` (production):

```javascript
if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
  mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
} else {
  mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
}
```

TypeScript: `declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string; declare const MAIN_WINDOW_VITE_NAME: string;`

## Advanced

- **concurrent** (Forge v7.9.0+): Set to `false` or an integer to limit parallel Vite builds and reduce memory use.
- **Native modules**: Mark them as external in the main Vite config (e.g. `build.rollupOptions.external: ['serialport','sqlite3']`) so they are loaded at runtime and not bundled.
- **HMR**: Use the dev server URL and VITE_NAME globals as above so dev and production loads work.

<!--
Source references:
- https://github.com/electron-forge/electron-forge-docs/blob/main/config/plugins/vite.md
-->
