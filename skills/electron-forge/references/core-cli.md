---
name: electron-forge-cli
description: Electron Forge CLI — init, import, package, make, publish, start; flags and programmatic API.
---

# CLI

The Forge CLI (`@electron-forge/cli`) is the main way to run Forge. Configuration comes from [Forge config](references/config-configuration.md). For programmatic use, use `@electron-forge/core` API.

**Note:** Multiple values for a single flag are comma-separated; in some terminals they must be quoted.

## Bootstrap commands

### Init

Initializes a new Forge app in the given directory (default: current). Prefer `create-electron-app` over calling init directly.

```bash
npx electron-forge init --template=webpack
```

Options: `--template` (template name), `--copy-ci-files` (optional). Non-builtin templates must be installed globally before init.

### Import

Converts an existing Electron app to a Forge-compatible setup (adds config and dependencies).

```bash
npx electron-forge import
```

## Build commands

Commands are cascading: `publish` runs `package` then `make`.

### Package

Creates a platform-specific executable bundle (no distributable yet). Output in `/out/`.

```bash
npm run package -- --arch=ia32
npx electron-forge package --platform=mas --arch=x64
```

Options: `--arch` (e.g. `x64`, `ia32`), `--platform` (e.g. `win32`, `darwin`, `mas`). Packaging requires `node_modules` on disk (no PnP/symlinks).

### Make

Builds distributables from the packaged app. Use `--skip-package` to reuse an existing package.

```bash
npm run make -- --arch=ia32,x64
npm run make -- --targets=@electron-forge/maker-zip,@electron-forge/maker-dmg
```

Options: `--arch`, `--platform`, `--targets` (comma-separated maker names, e.g. `@electron-forge/maker-deb`), `--skip-package`.

### Publish

Packages, makes, then uploads to configured publishers.

```bash
npm run publish -- --dry-run
npm run publish -- --from-dry-run
```

Options: `--target` (comma-separated publisher names), `--dry-run` (no upload), `--from-dry-run` (publish from a previous dry run).

## Dev command: Start

Runs the app in dev mode. Typing `rs` + Enter restarts it. Plugins can override start (e.g. Webpack runs dev server + HMR).

```bash
npm start -- --enable-logging --inspect-electron
```

Options: `--app-path`, `--enable-logging`, `--run-as-node`, `--inspect-electron` (main process debug on port 5858), `--` (extra args to Electron). Use `--inspect-brk-electron` to break on first line.

## Programmatic usage

```javascript
const { api } = require('@electron-forge/core');

await api.package({ arch: 'x64' });
await api.make({ skipPackage: true });
```

See [Forge API docs](https://js.electronforge.io/classes/_electron_forge_core.ForgeAPI.html).

<!--
Source references:
- https://github.com/electron-forge/electron-forge-docs/blob/main/cli.md
-->
