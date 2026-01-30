---
name: electron-forge-build-lifecycle
description: Electron Forge build flow — Package, Make, Publish; cascading steps and lifecycle hooks.
---

# Build Lifecycle

Electron Forge’s build flow has three steps, each exposed as a CLI command (and usually as npm scripts): **Package** → **Make** → **Publish**. Later steps run earlier ones by default (e.g. `publish` runs `package` then `make`).

## Step 1: Package

- Uses [Electron Packager](https://github.com/electron/packager) to produce an executable bundle for the target OS (e.g. `.app` on macOS, `.exe` on Windows).
- Also handles: macOS code signing/notarization, rebuilding native Node addons, app icons on Windows/macOS.
- Default: packages only for the current platform and architecture.
- Output: packaged app in `/out/`.
- Forge does **not** bundle app code (e.g. webpack/Vite) in this step unless you add a plugin; use lifecycle hooks or a bundler plugin for that.

## Step 2: Make

- Takes the packaged app from Package and produces **distributables** (installers or archives: `.dmg`, `.msi`, `.zip`, etc.).
- Configure which formats to build via [makers](references/config-makers-overview.md) in Forge config.
- Default: only makers for the current platform/arch.
- Output: artifacts in `/out/make/`.

## Step 3: Publish

- Uploads Make artifacts to a distribution target (e.g. GitHub Releases, S3). Optional; artifacts from Make are already usable.
- Configure via [publishers](references/config-publishers-overview.md) in Forge config.

## Lifecycle hooks

Hooks let you run custom logic at specific points (e.g. `prePackage`, `packageAfterCopy`, `preMake`, `postMake`). See [config-hooks](references/config-hooks.md). Shared hook sequences can be packaged as **plugins** (e.g. the Webpack plugin).

## Cross-platform builds

Forge only builds for the current OS by default. To target other OSes (e.g. Windows from macOS), use CI (e.g. GitHub Actions, CircleCI) with multiple runners; see Electron Fiddle’s CI for an example.

<!--
Source references:
- https://github.com/electron-forge/electron-forge-docs/blob/main/core-concepts/build-lifecycle.md
-->
