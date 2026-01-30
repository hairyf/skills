---
name: electron-forge-configuration
description: Electron Forge config — forge.config.js, packagerConfig, makers, publishers, plugins, hooks, buildIdentifier.
---

# Configuration

Forge config is a single object. Provide it either:

- In `package.json` under `config.forge`, or
- Via a relative path in `config.forge` pointing to a JS file that exports the config, or
- As a `forge.config.js` in the project root (default if `config.forge` is not set).

Prefer a JavaScript config file so you can use conditional logic and `fromBuildIdentifier`.

## Top-level options

| Property | Purpose |
|----------|---------|
| `packagerConfig` | Passed to `@electron/packager`; do not override `dir`, `arch`, `platform`, `out`, `electronVersion` |
| `rebuildConfig` | Passed to `@electron/rebuild`; `buildPath` and `electronVersion` are set by Forge |
| `makers` | Array of maker configs (distributable formats) |
| `publishers` | Array of publisher configs (upload targets) |
| `plugins` | Array of plugin configs (lifecycle/bundling) |
| `hooks` | Object of hook names → async callbacks |
| `buildIdentifier` | String (e.g. `prod`, `beta`) for channel-specific config |
| `outDir` | Output directory (default: `out`) |

## Example (forge.config.js)

```javascript
module.exports = {
  packagerConfig: {
    name: 'My App',
    asar: true,
    osxSign: {},
    appCategoryType: 'public.app-category.developer-tools'
  },
  makers: [
    { name: '@electron-forge/maker-zip', platforms: ['darwin'] }
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: { owner: 'me', name: 'repo' },
        draft: true
      }
    }
  ],
  plugins: [{ name: '@electron-forge/plugin-webpack', config: { /* ... */ } }],
  hooks: {}
};
```

## Build identifier

Use `buildIdentifier` with `fromBuildIdentifier` to switch config by channel:

```javascript
const { utils: { fromBuildIdentifier } } = require('@electron-forge/core');

module.exports = {
  buildIdentifier: process.env.IS_BETA ? 'beta' : 'prod',
  packagerConfig: {
    appBundleId: fromBuildIdentifier({ beta: 'com.beta.app', prod: 'com.app' })
  }
};
```

## Key points

- All config properties are optional; templates ship with sensible defaults.
- Packager options: [Electron Packager API](https://electron.github.io/packager/main/interfaces/Options.html). Rebuild options: [Electron Rebuild](https://github.com/electron/electron-rebuild#how-can-i-integrate-this-into-grunt--gulp--whatever).
- Use CLI flags (e.g. `--arch`, `--platform`) to set target arch/platform for Package/Make/Publish.

<!--
Source references:
- https://github.com/electron-forge/electron-forge-docs/blob/main/config/configuration.md
-->
