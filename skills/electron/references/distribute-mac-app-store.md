---
name: distribute-mac-app-store
description: Mac App Store submission — MAS build, Apple Distribution signing, sandbox, limitations.
---

# Mac App Store Submission

To distribute an Electron app on the Mac App Store (MAS), you must use the **MAS build** of Electron, sign with **Apple Distribution**, and comply with App Sandbox. Normal (non-MAS) builds and Developer ID signing are for distribution **outside** the store.

## Requirements

- **Xcode** 11+ and **@electron/osx-sign** (or Electron Forge/Packager with MAS config).
- **Apple Developer Program** account; create **Apple Distribution** and **Apple Development** certificates (Xcode → Accounts → Manage Certificates). Use Apple Distribution for store builds; Apple Development for local testing.
- **Provisioning profile** for Mac App Store distribution; configure in Xcode or via export options.

## MAS build of Electron

The MAS build of Electron is compiled for App Sandbox and store requirements. Use **electron-builder** or **Electron Forge** with `mac.target: 'mas'` (or equivalent) so the packaged app uses the MAS Electron binary. Do not use the default (non-MAS) Electron build for store submission.

## Signing and notarization

- Sign the app with the **Apple Distribution** certificate. Use **@electron/osx-sign** (or Forge/Packager) with the correct identity and provisioning profile.
- **Notarization** is required for distribution; submit the signed app to Apple and staple the notarization ticket. Store builds are notarized as part of submission; for TestFlight or external installers, run notarization yourself.
- **Hardened Runtime** and **App Sandbox** entitlements are required; the MAS build and tooling set these when targeting the store.

## Sandbox and limitations

- MAS apps run under **App Sandbox**. File access is limited to app container, user-selected files, and entitlements (e.g. network, camera). Many Node/Electron APIs are restricted or unavailable; use only MAS-supported APIs and entitlements.
- **process.mas** is `true` in a MAS build; use it to disable features that are not allowed in the store (e.g. certain native modules, or auto-updater that downloads outside the store).
- No custom auto-updater for store apps; updates go through the Mac App Store. No **ELECTRON_RUN_AS_NODE** or unsandboxed child processes in the way a normal app might use them.

See the official [Mac App Store Submission Guide](https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide) for step-by-step signing, provisioning, and submission.

## Key points

- Use the **MAS build** of Electron and **Apple Distribution** signing; use **Apple Development** only for local testing.
- **App Sandbox** and **Hardened Runtime** are required; respect **process.mas** and avoid unsupported APIs.
- Updates for store apps are delivered via the Mac App Store; do not ship a custom auto-updater for the store build.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/mac-app-store-submission-guide.md
- https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide
- https://www.electronjs.org/docs/latest/tutorial/code-signing
-->
