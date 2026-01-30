---
name: develop-native-modules
description: Using native Node addons with Electron — ABI mismatch, @electron/rebuild, and manual build with node-gyp.
---

# Native Node Modules

Electron uses a different ABI than the Node.js binary (e.g. Chromium’s BoringSSL). Native modules built for Node will not load in Electron until they are rebuilt for Electron’s runtime.

## Symptom

```
Error: The module '...' was compiled against a different Node.js version using
NODE_MODULE_VERSION $XYZ. This version of Node.js requires NODE_MODULE_VERSION $ABC.
```

## Recommended: @electron/rebuild

Install and run `@electron/rebuild` so native deps are built for the Electron version in your project (detected from `node_modules/electron`).

```sh
npm install --save-dev @electron/rebuild
# After npm install:
./node_modules/.bin/electron-rebuild
# Windows:
.\node_modules\.bin\electron-rebuild.cmd
```

Electron Forge runs this automatically in dev and when making distributables.

## Using npm with Electron env

Set env so `npm install` targets Electron:

```sh
export npm_config_target=<electron version e.g. 28.0.0>
export npm_config_arch=x64
export npm_config_disturl=https://electronjs.org/headers
export npm_config_runtime=electron
export npm_config_build_from_source=true
HOME=~/.electron-gyp npm install
```

## Manual build with node-gyp

For developing or testing a native addon against Electron:

```sh
cd /path-to-module/
HOME=~/.electron-gyp node-gyp rebuild \
  --target=<electron version> \
  --arch=x64 \
  --dist-url=https://electronjs.org/headers
```

## N-API (node-api)

Modules that use N-API are often ABI-stable across Node and Electron; they may still need a rebuild for the correct Electron version. Prefer N-API addons when choosing or writing native modules.

## Key points

- Native modules must be built for Electron’s ABI, not the system Node. Use `@electron/rebuild` after `npm install` or equivalent env when installing.
- Electron Forge integrates rebuild. For manual workflows use the env vars above or `node-gyp` with `--target` and `--dist-url=https://electronjs.org/headers`.
- Prefer N-API-based addons for better compatibility.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/using-native-node-modules.md
- https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules
-->
