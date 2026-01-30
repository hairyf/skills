---
name: core-scripts
description: package.json scripts — build, dev, update, release, ext:package, ext:publish
---

# Scripts and Release

Standard scripts for building, developing, updating metadata, and publishing the extension.

## Scripts

| Script | Purpose |
|--------|--------|
| `build` | `tsdown src/index.ts --external vscode` — single CJS bundle to `dist/`. tsdown config may run `update` in `build:prepare`. |
| `dev` | `nr build --watch --sourcemap` — watch build with sourcemaps for debugging. |
| `update` | `vscode-ext-gen --output src/generated/meta.ts` — regenerate meta from `package.json` contributes (commands, config, etc.). |
| `prepare` | `nr update` — run before install/publish so generated meta exists. |
| `lint` | `eslint .` — lint with @antfu/eslint-config. |
| `test` | `vitest` — run tests. |
| `typecheck` | `tsc --noEmit` — type-check only. |
| `vscode:prepublish` | `nr build` — run by vsce before packaging. |
| `release` | `bumpp` — bump version (interactive or CLI args). |
| `ext:package` | `vsce package --no-dependencies` — produce `.vsix` for VSCode Marketplace. |
| `ext:publish` | `vsxpub --no-dependencies` — publish to Open VSX. |

## Workflow

1. **Develop:** `pnpm dev` (watch build), then run "Extension" from launch.json to open a new Extension Development Host.
2. **Change contributes:** Edit `package.json` (commands, configuration, etc.), then `pnpm update` so `src/generated/meta.ts` and types are updated.
3. **Release:** Bump with `pnpm release`, then `pnpm ext:package` for `.vsix` and/or `pnpm ext:publish` for Open VSX. For the official Marketplace use `vsce publish` (or your CI).

## Key Points

- **update** — Must run whenever you change `contributes` so generated meta and TypeScript types stay in sync.
- **ext:package** — Builds and packages without bundling node_modules (`--no-dependencies`); dependencies are declared in `package.json` and installed by the user's environment.
- **ext:publish** — vsxpub publishes to Open VSX; for Microsoft Marketplace use `vsce publish` (may require token/CI).

<!--
Source references:
- https://github.com/antfu/starter-vscode
-->
