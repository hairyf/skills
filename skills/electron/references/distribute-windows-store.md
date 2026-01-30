---
name: distribute-windows-store
description: Windows Store / MSIX — AppX packaging, electron-windows-store, MSIX; process.windowsStore.
---

# Windows Store Guide

Electron apps can be packaged for the Windows Store as **MSIX** (or the older AppX) packages. The app runs in a virtualized filesystem and registry; **process.windowsStore** is `true` when running as an MSIX/AppX package.

## Background

- Windows 10+ can run win32 `.exe` binaries inside an MSIX container with a virtualized filesystem and registry. Installation and uninstall are tracked for clean remove.
- The app can use many UWP APIs; an optional background task can be used for push notifications or background work.
- Tooling: **[electron-windows-store](https://github.com/catalystcode/electron-windows-store)** (CLI) or **electron-builder** / **Electron Forge** with Windows Store / MSIX targets.

## Requirements

- Windows 10 with Anniversary Update or later.
- Windows 10 SDK ([download](https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/)).
- Package the Electron app first (e.g. with **@electron/packager** or electron-builder); then convert the output to AppX/MSIX.

## Packaging flow

1. **Package** the app (e.g. `electron-packager` or `electron-builder`) so you have a folder with the `.exe`, `resources/app.asar`, and dependencies.
2. **Convert** to AppX/MSIX using **electron-windows-store** or your builder’s MSIX target. The tool runs the app in a Windows Container to capture filesystem and registry changes for the package.
3. **Sign** the MSIX package for store submission (or sideloading). Use a certificate trusted for Windows Store or enterprise distribution.

See the official [Windows Store Guide](https://www.electronjs.org/docs/latest/tutorial/windows-store-guide) for step-by-step use of electron-windows-store and store submission.

## Detecting store runtime

In code, **process.windowsStore** is `true` when the app is running as an MSIX/AppX package. Use it to disable or adapt features that are not allowed or that behave differently in the store (e.g. auto-updater, certain file paths).

## Key points

- Use **electron-windows-store** or **electron-builder** / **Forge** MSIX target to produce an AppX/MSIX package from a packaged Electron app.
- **process.windowsStore** is **true** when running inside the store package; use it for runtime checks.
- Sign the MSIX for store or sideloading; follow Windows Store submission requirements for publishing.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/windows-store-guide.md
- https://www.electronjs.org/docs/latest/tutorial/windows-store-guide
- https://www.electronjs.org/docs/latest/api/process#processwindowsstore-readonly
-->
