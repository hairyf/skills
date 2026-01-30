---
name: electron-forge-code-signing
description: Code signing with Electron Forge — macOS and Windows; why sign, where to configure.
---

# Code signing

Code signing certifies that an app was created by you and reduces OS security warnings. Forge does not sign by default; you configure signing in `packagerConfig` (and platform-specific options) and, for macOS, notarization. Signing is strongly recommended for public distribution.

## Why sign

- **macOS**: Unsigned apps trigger Gatekeeper; notarization is required for distribution outside the Mac App Store.
- **Windows**: Unsigned installers can trigger SmartScreen and reduce user trust.

## Where to configure

- **packagerConfig**: Common options (e.g. `osxSign`, `osxNotarize`, Windows signing) are passed through to [Electron Packager](https://electron.github.io/packager/main/interfaces/Options.html) / underlying tools.
- **macOS**: Use `osxSign` (and optionally `osxNotarize`) in packager config; you need an Apple Developer account and certificates. See the Forge docs for [code-signing-macos](https://github.com/electron-forge/electron-forge-docs/blob/main/guides/code-signing/code-signing-macos.md).
- **Windows**: Configure signing for the maker you use (e.g. Squirrel, WiX); typically certificate path and password (often via env vars). See [code-signing-windows](https://github.com/electron-forge/electron-forge-docs/blob/main/guides/code-signing/code-signing-windows.md).

Signing is a prerequisite for [auto-update](references/advanced-auto-update.md) on macOS.

<!--
Source references:
- https://github.com/electron-forge/electron-forge-docs/blob/main/guides/code-signing/README.md
-->
