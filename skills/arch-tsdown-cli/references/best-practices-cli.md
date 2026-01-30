---
name: best-practices-cli
description: CLI package best practices with arch-tsdown-cli and tsdown
---

# Best Practices for CLI Packages

When scaffolding or maintaining a CLI with arch-tsdown-cli and tsdown, keep these in mind.

## Bin and Build

- **Dev bin:** Keep `bin` pointing at `bin/index.dev.mjs` (tsx) so local runs don’t require a build.
- **Publish bin:** Use `publishConfig.bin` to point at `bin/index.mjs` so published users run the built CLI.
- **prepublishOnly:** Run `nr build` before publish so `dist/` and bin are up to date.

## Library + CLI Surface

- **Single entry for CLI:** Use one CLI entry (e.g. `src/cli/index.ts`) and keep argument parsing and orchestration there; call shared logic from `src/index.ts` so both the CLI and programmatic users use the same code.
- **Exports:** Publish both the default export (library) and the bin; keep `exports` and `files` in sync with tsdown output.

## ESM and Types

- **ESM-only:** Stick to `format: ['esm']` and `.mjs` output for consistency.
- **dts:** Enable `dts: true` in tsdown so the library (and optionally CLI) have types; consumers get type checking and editor support.

## Dependencies

- **external:** In tsdown, set `external: Object.keys(dependencies || {})` so dependencies are not bundled; the CLI runs in Node with `node_modules` installed.
- **Optional:** Use a dedicated CLI framework (e.g. yargs, commander) only in `dependencies` if the CLI needs it at runtime; keep dev-only tools in devDependencies.

## Release

- Prefer **npm Trusted Publisher** and tag-based release so publishing happens in CI.
- Run **publint** (or tsdown with publint) before publish to catch export/type issues.

<!--
Source references:
- https://github.com/hairyf/starter-cli
- https://tsdown.dev
-->
