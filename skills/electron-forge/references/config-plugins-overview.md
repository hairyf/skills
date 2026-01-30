---
name: electron-forge-plugins-overview
description: Electron Forge plugins — bundler (Webpack, Vite) and utility plugins; plugin API.
---

# Plugins overview

Plugins extend Forge by running logic at [hooks](references/config-hooks.md) and/or overriding the `start` command. Without plugins, Forge packages vanilla JS; plugins add bundling, security checks, native handling, etc.

## Bundler plugins

- **Webpack** (`@electron-forge/plugin-webpack`): Bundle main and renderer with webpack; HMR in dev. See [config-plugins-webpack](references/config-plugins-webpack.md).
- **Vite** (`@electron-forge/plugin-vite`): Bundle with Vite (experimental as of v7.5.0). See [config-plugins-vite](references/config-plugins-vite.md).

## Utility plugins

- **Auto Unpack Natives** (`@electron-forge/plugin-auto-unpack-natives`): Unpack native Node modules from the app ASAR so they load correctly.
- **Local Electron** (`@electron-forge/plugin-local-electron`): Use a local Electron build instead of a published version.
- **Fuses** (`@electron-forge/plugin-fuses`): Toggle Electron Fuses at package time.
- **Electronegativity** (`@electron-forge/plugin-electronegativity`): Run Electronegativity to detect misconfigurations and security anti-patterns.

## Config pattern

Add plugins to the `plugins` array in Forge config. Each entry has `name` and optional `config`:

```javascript
plugins: [
  { name: '@electron-forge/plugin-webpack', config: { mainConfig: '...', renderer: { ... } } },
  { name: '@electron-forge/plugin-electronegativity', config: {} }
]
```

To implement a custom plugin, extend the base from `@electron-forge/plugin-base` and implement `getHooks()` and/or `startLogic()`. See [advanced-extending-plugins](references/advanced-extending-plugins.md).

<!--
Source references:
- https://github.com/electron-forge/electron-forge-docs/blob/main/config/plugins/README.md
-->
