---
name: electron-forge-auto-update
description: Auto-update with Electron Forge — update.electronjs.org, static storage (S3), custom servers (Nucleus, nuts).
---

# Auto update

Forge publishes artifacts; the app uses Electron’s auto-update APIs (or a wrapper) to download and install updates. Configuring Forge’s [publishers](references/config-publishers-overview.md) is the first step. **macOS**: Code signing (and notarization) is required for auto-update.

## Open source apps: update.electronjs.org

For open-source apps on GitHub, use the Electron team’s free service [update.electronjs.org](https://github.com/electron/update-electron-app). Set up the [GitHub publisher](https://github.com/electron-forge/electron-forge-docs/blob/main/config/publishers/github.md) and add `update-electron-app` in the main process:

```javascript
const { updateElectronApp } = require('update-electron-app');
updateElectronApp();
```

Minimal code and config; best option for public GitHub-hosted apps.

## Static storage (S3, etc.)

Publishers that upload to static storage (e.g. S3) document how to point the app at those URLs for updates. Configure the publisher in Forge, then in the app use the same update server or URL scheme that the publisher expects (e.g. S3 bucket + path). See the [S3 publisher docs](https://github.com/electron-forge/electron-forge-docs/blob/main/config/publishers/s3.md#auto-updating-from-s3) for auto-updating from S3.

## Custom update servers

For private apps or more control (e.g. staged rollouts, multiple channels), host an update server such as [Nucleus](https://github.com/atlassian/nucleus) or [nuts](https://github.com/GitbookIO/nuts). Configure the server per its docs; publish from Forge using the matching publisher:

- **Nucleus**: Use the [Nucleus publisher](https://github.com/electron-forge/electron-forge-docs/blob/main/config/publishers/nucleus.md).
- **nuts**: Use the [GitHub publisher](https://github.com/electron-forge/electron-forge-docs/blob/main/config/publishers/github.md).
- **electron-release-server**: Use the [Electron Release Server publisher](https://github.com/electron-forge/electron-forge-docs/blob/main/config/publishers/electron-release-server.md).

Electron’s [Updating Applications](https://electronjs.org/docs/tutorial/updates#deploying-an-update-server) docs list other known update servers.

<!--
Source references:
- https://github.com/electron-forge/electron-forge-docs/blob/main/advanced/auto-update.md
-->
