---
name: electron-forge-why
description: Why use Electron Forge; motivation, value proposition, and comparison with Electron Builder.
---

# Why Electron Forge

Electron Forge is an all-in-one tool for packaging and distributing Electron applications. It unifies single-purpose packages (electron-packager, code signing, installers, native rebuild, etc.) into one build pipeline.

## Value proposition

- **Unified pipeline**: Create a build from development to distribution with minimal configuration.
- **First-party alignment**: New Electron features (e.g. ASAR integrity, universal macOS builds) land in Forge as soon as they are supported in Electron tooling.
- **Extensible**: Add custom logic via plugins, makers, and publishers; multi-package architecture makes the codebase easier to follow and extend.

## Forge vs. Builder

Electron Forge is an alternative to [Electron Builder](https://electron.build/). Differences:

- **Forge**: Composes existing first-party tools (electron-packager, @electron/osx-sign, electron-winstaller, etc.) into one pipeline.
- **Builder**: Implements much of the build logic in-house.

Use Forge when you want to stay close to official Electron tooling and prefer a modular, hook-based build system.

## Key points

- Packaging and distribution have always been outside core Electron; Forge fills that gap with one toolchain.
- Prerequisites: Node.js ≥ v16.4.0, Git, npm/Yarn/pnpm (pnpm requires `node-linker=hoisted` in `.npmrc`; Yarn ≥2 requires `nodeLinker: node-modules`).
- Packaging requires `node_modules` on disk; Forge does not support symlinked deps or Yarn PnP.

<!--
Source references:
- https://github.com/electron-forge/electron-forge-docs/blob/main/README.md
- https://github.com/electron-forge/electron-forge-docs/blob/main/core-concepts/why-electron-forge.md
-->
