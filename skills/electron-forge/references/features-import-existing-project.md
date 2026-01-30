---
name: electron-forge-import-existing-project
description: Import an existing Electron app into Electron Forge — import command and manual setup.
---

# Importing an existing project

You can bring an existing Electron app under Forge either with the **import** command or by configuring Forge manually.

## Using the import command

From the app directory:

```bash
npm install --save-dev @electron-forge/cli
npm exec --package=@electron-forge/cli -c "electron-forge import"
```

Forge adds config and dependencies and sets up packaging and default makers (e.g. Squirrel.Windows, ZIP, deb). If you already use other Electron tooling, it tries to migrate settings; some may need manual adjustment.

## Manual setup

1. **Install dependencies**

```bash
npm install --save-dev @electron-forge/cli @electron-forge/maker-squirrel @electron-forge/maker-deb @electron-forge/maker-zip
```

2. **Add scripts to package.json**

```json
"scripts": {
  "start": "electron-forge start",
  "package": "electron-forge package",
  "make": "electron-forge make",
  "publish": "electron-forge publish"
}
```

3. **Add Forge config** under `config.forge`: `packagerConfig`, `makers` (squirrel, zip, deb, rpm as needed). See [config-configuration](references/config-configuration.md) and [config-makers-overview](references/config-makers-overview.md).

4. **Squirrel.Windows**: If using Squirrel, install `electron-squirrel-startup` and call `if (require('electron-squirrel-startup')) app.quit();` as early as possible in the main process (before `app.ready`).

5. **Publishing (optional)**: Install a publisher (e.g. `@electron-forge/publisher-s3`) and add it to `config.forge.publishers`.

<!--
Source references:
- https://github.com/electron-forge/electron-forge-docs/blob/main/import-existing-project.md
-->
