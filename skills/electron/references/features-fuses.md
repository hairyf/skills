---
name: features-fuses
description: Electron fuses — package-time toggles for runAsNode, nodeCliInspect, cookieEncryption, asar integrity; @electron/fuses.
---

# Electron Fuses

Fuses are package-time flags in the Electron binary that enable or disable certain features. They are set **before** code signing, so the OS can enforce that the shipped app has the intended restrictions. Use them to harden your app without forking Electron.

Flip fuses when packaging your app (e.g. with Electron Forge or electron-builder). The [@electron/fuses](https://www.npmjs.com/package/@electron/fuses) package provides a programmatic API to read and set fuses.

## Common fuses

- **`runAsNode`** — When **disabled**, the `ELECTRON_RUN_AS_NODE` environment variable is ignored. This blocks a class of “living off the land” attacks that rely on spawning Node via the Electron binary. Disabling it also means `child_process.fork` in the main process will not work as expected; use [Utility Process](https://www.electronjs.org/docs/latest/api/utility-process) instead for separate Node processes.
- **`nodeCliInspect`** — When **disabled**, `--inspect`, `--inspect-brk`, and similar flags are ignored, and `SIGUSR1` does not start the main-process inspector. Disable in production so users cannot attach a debugger.
- **`nodeOptions`** — When **disabled**, `NODE_OPTIONS` and `NODE_EXTRA_CA_CERTS` are ignored. Most apps can disable this in production.
- **`cookieEncryption`** — When **enabled**, the cookie store is encrypted with OS-level keys (Chrome-like). One-way: enabling encrypts existing cookies; disabling later can corrupt the store. Most apps can enable it.
- **`embeddedAsarIntegrityValidation`** — When **enabled**, the app validates the contents of `app.asar` when loaded (macOS/Windows). Slight performance cost; improves integrity.
- **`onlyLoadAppFromAsar`** — When **enabled**, Electron loads app code only from `app.asar` (not from an unpacked `app` folder or `default_app.asar`). Combined with asar integrity, this strengthens code integrity.

## How to flip fuses

Use `@electron/fuses` in your build/packaging step. Example (see the package README for full API):

```js
const { flipFuses, FuseVersion, FuseV1Options } = require('@electron/fuses')
const path = require('path')

flipFuses(
  path.join(__dirname, 'dist/Electron.app'), // or path to your packaged app
  {
    version: FuseVersion.V1,
    [FuseV1Options.RunAsNode]: false,
    [FuseV1Options.EnableNodeCliInspectArguments]: false
  }
)
```

Run this **after** packaging but **before** code signing. Electron Forge and other tooling can integrate fuse flipping into the pipeline.

## Key points

- Fuses are set at package time and enforced by the signed binary; use them to disable dangerous or unused features (e.g. runAsNode, inspect, NODE_OPTIONS).
- Use `@electron/fuses` to read and set fuses; run after packaging, before signing.
- Disable `runAsNode` and `nodeCliInspect` in production when possible; use Utility Process instead of `child_process.fork` if you need a separate Node process.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/fuses.md
- https://www.electronjs.org/docs/latest/tutorial/fuses
- https://www.npmjs.com/package/@electron/fuses
-->
