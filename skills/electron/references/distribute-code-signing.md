---
name: distribute-code-signing
description: Code signing and notarization for Electron apps — macOS (sign + notarize), Windows (Authenticode), and tooling.
---

# Code Signing

Signing (and on macOS notarizing) ensures the OS and users trust your app. Unsigned apps trigger warnings or blocks; signing is required for a smooth install and for auto-updates.

## macOS: Sign and notarize

1. **Sign** the app with your Apple Developer certificate so the binary is trusted.
2. **Notarize** by uploading the signed app to Apple; their automated checks must pass. Users on recent macOS expect notarized apps.

Requirements: Apple Developer Program, Xcode, and a Mac for building. Configure signing in your pipeline (e.g. `@electron/osx-sign`) and notarization (e.g. `@electron/notarize` with Apple ID and credentials).

### With Electron Forge

Configure in Forge so macOS builds are signed and notarized. See [Signing macOS Apps](https://www.electronforge.io/guides/code-signing/code-signing-macos) in the Forge docs.

### With Electron Packager

Pass `osxSign` and `osxNotarize` options (e.g. `appleId`, `appleIdPassword` or keychain-based auth). See `@electron/osx-sign` and `@electron/notarize` for options.

## Windows: Authenticode

Sign the installer and/or executable with an Authenticode certificate so Windows SmartScreen and users trust the app. Use a certificate from a trusted CA or an EV certificate for fewer SmartScreen prompts.

Tooling: Forge’s Windows makers can integrate signing; or use `rcedit` / `signtool` (Windows SDK) in your build script. Sign the final `.exe` and installers (e.g. NSIS, MSI).

## Linux

No single OS-wide code-signing model. Distribution is typically via package managers (deb, rpm, Snap, Flatpak) or AppImage; follow each format’s signing or verification practices if applicable.

## Key points

- **macOS:** Sign with an Apple Developer certificate and notarize with Apple. Use Forge or Packager with `osxSign` and `osxNotarize`.
- **Windows:** Sign with Authenticode (e.g. `signtool`); use a trusted CA or EV cert to reduce SmartScreen warnings.
- Sign the same build artifact that you distribute; keep certificates and secrets in CI/secrets, not in repo.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/code-signing.md
- https://www.electronjs.org/docs/latest/tutorial/code-signing
-->
