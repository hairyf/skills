---
name: electron-forge-plugin-webpack
description: Webpack plugin for Electron Forge — main/renderer config, entry points, magic globals, HMR, native modules.
---

# Webpack plugin

`@electron-forge/plugin-webpack` bundles main and renderer code with webpack and provides HMR in development. Install: `npm install --save-dev @electron-forge/plugin-webpack`.

## Plugin config

Provide `mainConfig` (path to main process webpack config) and `renderer.config` plus `renderer.entryPoints`:

```javascript
plugins: [
  {
    name: '@electron-forge/plugin-webpack',
    config: {
      mainConfig: './webpack.main.config.js',
      renderer: {
        config: './webpack.renderer.config.js',
        entryPoints: [{
          name: 'main_window',
          html: './src/renderer/index.html',
          js: './src/renderer/index.js',
          preload: { js: './src/preload.js' }
        }]
      }
    }
  }
]
```

## Project setup

1. **package.json**: Set `"main": "./.webpack/main"`.
2. **Main process**: Use the magic globals for loadURL and preload. For entry name `main_window` you get `MAIN_WINDOW_WEBPACK_ENTRY` and `MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY`:

```javascript
mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
// preload:
mainWindow = new BrowserWindow({
  webPreferences: { preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY }
});
```

To use the preload path in a renderer (e.g. for `<webview>`), expose it via IPC (sync) from main. TypeScript: declare the globals, e.g. `declare const MAIN_WINDOW_WEBPACK_ENTRY: string;`.

## Advanced

- **devServer**: Customize webpack-dev-server options in plugin config.
- **devContentSecurityPolicy**: Set CSP in dev; for source maps you may need `script-src 'unsafe-eval'` (dev only).
- **Native modules**: Add `node-loader` and `@vercel/webpack-asset-relocator-loader` (version pinned by Forge) to main config; use the `native_modules` test and asset relocator rule as in the template. Fallback: webpack `externals`.
- **Node integration**: Set `renderer.nodeIntegration` (and match in BrowserWindow). When true, target is `electron-renderer`; when false, `web`. Can override per entry in `entryPoints`.
- **HMR**: Renderers get HMR via dev server. Preload: no HMR; reload renderer after preload changes. Main: type `rs` in the Forge terminal to restart.
- **Virtual routing**: Use a router that doesn’t rely on browser history (e.g. MemoryRouter in React) because production loads from the filesystem.
- **Hot reload caching**: With Webpack 5 cache, call `relocateLoader.initAssetCache(compilation, outputAssetBase)` in the build.

<!--
Source references:
- https://github.com/electron-forge/electron-forge-docs/blob/main/config/plugins/webpack.md
-->
