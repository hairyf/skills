---
name: core-ci
description: GitHub Actions CI for unplugin packages — lint, typecheck, build, test
---

# CI for Unplugin Packages

Use a single **CI** workflow (e.g. `.github/workflows/ci.yml`) on push/PR to `main` to lint, typecheck, build, and test an unplugin-based package (unplugin-starter).

## Jobs

### 1. lint

- **Trigger:** push / pull_request to `main`
- **Steps:**
  - Checkout, pnpm setup (no install), Node LTS
  - **nci** — install deps (via @antfu/ni)
  - **nr lint** — ESLint
  - **nr typecheck** — TypeScript (`tsc --noEmit`), optional if script exists

### 2. test

- **Trigger:** same as lint
- **Matrix:** `node: [lts/*]`, `os: [ubuntu-latest, windows-latest, macos-latest]`, `fail-fast: false`
- **Steps:**
  - Checkout, pnpm, Node from matrix
  - **nci** — install
  - **nr build** — tsdown build (required before tests that consume dist)
  - **nr test** — Vitest

## Commands

| Command | Purpose |
|--------|--------|
| **nci** | Install dependencies (via @antfu/ni; respects lockfile). |
| **nr** | Run package scripts (e.g. `nr lint`, `nr build`). |
| **tsdown** | Build package to `dist/` (run in CI before tests that consume dist). |

## Scripts to Expose

Ensure `package.json` has at least:

```json
{
  "scripts": {
    "build": "tsdown",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  }
}
```

Add `typecheck` if you want CI to enforce types; omit the step from the workflow if the project has no typecheck script.

## Optional Checks

- **test:knip** — Knip for dead code / unused exports
- **test:attw** — attw for published types
- **test:publint** — publint

## Template

A ready-to-use workflow is in **assets/ci.yml**. Copy it to `.github/workflows/ci.yml` in your unplugin repo.

<!--
Source references:
- https://github.com/unplugin/unplugin-starter (.github/workflows/ci.yml, package.json)
- sources/arch-unplugin
-->
