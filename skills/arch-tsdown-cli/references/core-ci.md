---
name: core-ci
description: GitHub Actions CI — lint, typecheck, test matrix in arch-tsdown-cli
---

# CI (GitHub Actions)

The starter runs **lint** and **test** jobs on push/PR to `main`, and **release** on tag push.

## Lint Job

- **Trigger:** Push and pull_request to `main`.
- **Steps:** Checkout → pnpm setup → Node (LTS) with pnpm cache → install @antfu/ni → `nci` → `nr lint` → `nr typecheck`.
- **Purpose:** Ensure code passes ESLint and TypeScript without running tests.

## Test Job

- **Trigger:** Same as lint.
- **Matrix:** Node `lts/*`, OS: ubuntu-latest, windows-latest, macos-latest (fail-fast: false).
- **Steps:** Checkout → pnpm → Node (matrix) → install @antfu/ni → `nci` → `nr build` → `nr test`.
- **Purpose:** Build and run Vitest on multiple Node/OS combinations.

## Release Workflow

- **Trigger:** Push tags matching `v*`.
- **Implementation:** Reuses `sxzz/workflows/.github/workflows/release.yml@v1` with `publish: true`.
- **Permissions:** `contents: write`, `id-token: write` for npm publish (e.g. Trusted Publisher).

When using npm Trusted Publisher, the release workflow publishes to npm on tag push; no manual `pnpm publish` needed after the first-time setup.

## Template

A ready-to-use CI workflow is in **assets/ci.yml**. Copy it to `.github/workflows/ci.yml` in your CLI repo.

<!--
Source references:
- https://github.com/hairyf/starter-cli
-->
