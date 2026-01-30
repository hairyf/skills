---
name: electron-forge-templates
description: Electron Forge built-in templates — webpack, webpack-typescript, vite, vite-typescript; create-electron-app.
---

# Built-in templates

When creating a new app with `create-electron-app` or `electron-forge init`, you can pass `--template=<name>` to get a preconfigured project. Templates include a bundler plugin and scripts so you can run, package, and make immediately.

## create-electron-app

Recommended entry point; wraps Forge’s init command:

```bash
npx create-electron-app@latest my-app
npx create-electron-app@latest my-app --template=webpack
```

Use `NODE_INSTALLER=npm` (or `yarn`/`pnpm`) to force a package manager. By default, Forge uses yarn if available.

## Template names

| Template | Description |
|----------|-------------|
| `webpack` | Webpack for main + renderer; single JS entry |
| `webpack-typescript` | Webpack + TypeScript |
| `vite` | Vite for main + renderer (experimental) |
| `vite-typescript` | Vite + TypeScript |

All include a dev server and HMR where applicable. Prefer these templates to get modern tooling (bundling, TypeScript) without manual plugin setup. Non-builtin templates must be installed globally before running init.

<!--
Source references:
- https://github.com/electron-forge/electron-forge-docs/blob/main/README.md
- https://github.com/electron-forge/electron-forge-docs/blob/main/cli.md
-->
