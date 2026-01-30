---
name: core-scripts
description: npm scripts and release workflow — build, dev, start, release, npm Trusted Publisher
---

# Scripts and Release Workflow

## Scripts (package.json)

| Script | Command | Purpose |
|--------|---------|---------|
| `build` | `tsdown` | One-off build to `dist/` (library + CLI). |
| `dev` | `tsdown --watch` | Watch mode; rebuild on file changes. |
| `start` | `tsx src/index.ts` | Run library entry with tsx (alternatively run CLI via bin). |
| `typecheck` | `tsc` | Type-check only (tsconfig has `noEmit: true`). |
| `test` | `vitest` | Run tests. |
| `lint` | `eslint` | Lint with @antfu/eslint-config. |
| `release` | `bumpp` | Bump version and (typically) create tag for CI release. |
| `prepublishOnly` | `nr build` | Build before `pnpm publish`. |

## Running the CLI Locally

- **From source (no build):** Use the dev bin, e.g. `node bin/index.dev.mjs` or `pnpm exec pkg-placeholder` (if bin name is set).
- **From build:** Run `pnpm build`, then `node bin/index.mjs` (same as what published users get).

## npm Trusted Publisher (Recommended)

The starter recommends **npm Trusted Publisher** so publishing happens in CI, not from local `pnpm publish`.

1. **First time only:** Run `pnpm publish` manually once to create the package on npm.
2. In npm: open `https://www.npmjs.com/package/<your-package-name>/access` and connect the package to your GitHub repo (Trusted Publisher).
3. **Later releases:** Run `pnpm run release` locally. Bumpp bumps version and creates a tag (e.g. `v*`); the **Release** GitHub Action runs on tag push and publishes to npm.

## Release Workflow Summary

1. Developer runs `pnpm run release` → version bump + git tag.
2. Push tag → GitHub Actions runs `sxzz/workflows` release workflow with `publish: true`.
3. CI publishes to npm; no need to run `pnpm publish` on your machine again.

<!--
Source references:
- https://github.com/hairyf/starter-cli
- https://github.com/e18e/ecosystem-issues/issues/201
-->
