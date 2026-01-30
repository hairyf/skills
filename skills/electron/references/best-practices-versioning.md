---
name: best-practices-versioning
description: Electron versioning — SemVer, stabilization branches, ~ vs ^, upgrade and support timelines.
---

# Electron Versioning

Electron follows [SemVer](https://semver.org/). Major versions align with breaking API changes and with Node.js/Chromium major updates; minor versions add non-breaking features; patch versions are bug and security fixes.

## Version ranges

- **`~x.y.z`** — Accept only patch updates (e.g. `~28.0.0` → `28.0.x`). Use when you want only stability and security fixes.
- **`^x.y.z`** — Accept minor and patch updates (e.g. `^28.0.0` → `28.x.x`). Use when you want non-breaking features and fixes; expect to test on new minors.
- **`electron@latest`** — Latest stable; upgrade periodically and check [breaking changes](https://www.electronjs.org/docs/latest/breaking-changes).

Locking to an exact version (e.g. `28.0.0`) is not recommended; you miss security and bug fixes. Prefer `~` or `^` and upgrade in a controlled way.

## Stabilization and support

- Each major line has a stabilization branch (e.g. `28-x-y`). Only security and stability fixes are backported.
- Supported versions and end-of-life dates are documented in [Electron Releases / Timelines](https://www.electronjs.org/docs/latest/tutorial/electron-timelines). Stay on a supported major and plan upgrades before your line goes EOL.
- New majors often track a new Chromium/Node version; upgrading one major at a time and reading the breaking-changes doc reduces risk.

## Upgrade workflow

1. Bump the range in `package.json` (e.g. `^27.0.0` → `^28.0.0`).
2. Run install and fix any breaking API or native-module issues (see [develop-native-modules](references/develop-native-modules.md) for rebuilds).
3. Run tests and manual checks; refer to the [breaking changes](https://www.electronjs.org/docs/latest/breaking-changes) doc for the new major.
4. Rebuild and re-sign your app for distribution.

## Key points

- Use **~** for patch-only updates; use **^** for minor + patch. Avoid exact version lock.
- Stay on a **supported** major; check **electron-timelines** for EOL and upgrade before EOL.
- Upgrade **one major at a time** and follow the **breaking-changes** doc; rebuild native modules and re-sign as needed.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/electron-versioning.md
- https://www.electronjs.org/docs/latest/tutorial/electron-versioning
- https://www.electronjs.org/docs/latest/tutorial/electron-timelines
- https://www.electronjs.org/docs/latest/breaking-changes
-->
