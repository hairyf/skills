---
name: features-updates
description: Auto-updating Electron apps — autoUpdater, Squirrel (macOS/Windows), and publishing release metadata.
---

# Updating Applications

Electron’s built-in update flow uses the Squirrel framework and the `autoUpdater` module. The app points at a URL that serves platform-specific release metadata; when a new version is available, the module can download and install it.

## Platform support

- **macOS:** Squirrel.Mac. Requires code signing and typically notarization for distribution.
- **Windows:** Squirrel.Windows. Serves RELEASES and `.nupkg` files.
- **Linux:** No built-in autoUpdater; use distro packages or a custom solution (e.g. AppImage + custom logic).

## Serverless / static metadata

Point `autoUpdater.setFeedURL()` (or equivalent) at a URL that serves metadata. Publish this metadata next to your release artifacts when you release a new version.

- **macOS:** Squirrel.Mac reads a `releases.json` (or similar) with `currentRelease` and a list of releases (version, url, notes, pub_date, etc.).
- **Windows:** Squirrel.Windows expects a RELEASES file and `.nupkg` files in the same folder.

Electron Forge can publish to S3 (or other backends) and set `macUpdateManifestBaseUrl` / `remoteReleases` so the built app knows where to check. See Forge’s “Auto updating from S3” (or equivalent) guide.

## Basic flow in app

1. Configure the feed URL (and options like `allowPrerelease`) before calling `autoUpdater.checkForUpdates()`.
2. Listen for `update-available`, `update-downloaded`, and `error` (and optionally `checking-for-update`, `update-not-available`).
3. On `update-downloaded`, call `autoUpdater.quitAndInstall()` when the user is ready (e.g. after saving work).

```js
const { autoUpdater } = require('electron')
autoUpdater.setFeedURL({ url: 'https://my-server.com/releases', ... })
autoUpdater.on('update-downloaded', () => {
  // Notify user, then:
  autoUpdater.quitAndInstall()
})
autoUpdater.checkForUpdates()
```

## Code signing

macOS and Windows updates must be signed. Use the same identity/certificate as the initial install so the OS trusts the update. With Electron Forge, configure signing (e.g. `@electron/notarize` for macOS) in the Forge config so published builds are signed and notarized.

## Key points

- Use `autoUpdater` with a feed URL that serves Squirrel.Mac (macOS) or Squirrel.Windows (Windows) metadata.
- Publish metadata and installers together; Forge can automate publishing and set the feed URL in the app.
- Sign (and on macOS notarize) builds so updates are trusted; handle `update-downloaded` and `quitAndInstall()` in the app.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/updates.md
- https://www.electronjs.org/docs/latest/tutorial/updates
- https://www.electronjs.org/docs/latest/api/auto-updater
-->
