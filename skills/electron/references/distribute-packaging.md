---
name: distribute-packaging
description: Packaging and distributing Electron apps — tooling (Forge), manual layout, asar, and rebranding.
---

# Application Packaging and Distribution

To ship an Electron app you package your code with the Electron runtime and optionally rebrand the binary. Prefer tooling (e.g. Electron Forge) over manual packaging.

## With tooling: Electron Forge

Electron Forge is the recommended way to package and distribute. It wires up `@electron/packager`, makers (e.g. ZIP, DMG, NSIS), and publishers. Use the [Forge docs](https://www.electronforge.io) and the tutorial’s [Packaging and Distribution](https://www.electronjs.org/docs/latest/tutorial/tutorial-5-packaging) section.

## Manual packaging

1. Download [Electron prebuilt binaries](https://github.com/electron/electron/releases) for the target platform/arch.
2. Put your app in the resources folder:
   - **macOS:** `Electron.app/Contents/Resources/app/` (or `app.asar`).
   - **Windows / Linux:** `resources/app/` (or `resources/app.asar`).
3. Structure under `app`: `package.json` (with `main`), main script, preload, and front-end assets. Electron will run the `main` entry.

## Asar archive

Instead of shipping loose files, pack the app folder into a single `app.asar` with [`@electron/asar`](https://github.com/electron/asar) and place it in the same Resources path. Electron loads `app.asar` automatically. Improves read performance on Windows and keeps a single file. Unpack specific files if native modules or resources must stay on disk (see asar docs).

## Rebranding

- **Windows:** Rename `electron.exe`, change icon and metadata (e.g. with [rcedit](https://github.com/electron/rcedit)).
- **Linux:** Rename the `electron` binary.
- **macOS:** Rename `Electron.app`, update `Info.plist` (`CFBundleDisplayName`, `CFBundleIdentifier`, `CFBundleName`) in the app and helper apps; optionally rename the helper app and its executable.

## Key points

- Prefer Electron Forge for packaging, signing, and publishing. Use manual packaging only when necessary.
- Manual layout: app (or `app.asar`) under `Resources/app` (macOS) or `resources/app` (Windows/Linux).
- Use asar for a single app archive; rebrand the binary and metadata before distribution.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/application-distribution.md
- https://www.electronjs.org/docs/latest/tutorial/application-distribution
- https://github.com/electron/electron/blob/main/docs/tutorial/asar-archives.md
-->
