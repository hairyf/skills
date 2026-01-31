---
name: core-ci
description: GitHub Actions CI for Nuxt modules — lint, typecheck, build, test
---

# CI for Nuxt Modules

Use a single **CI** workflow (e.g. `.github/workflows/ci.yml`) on push/PR to `main` to lint, typecheck, build, and test a Nuxt module built with @nuxt/module-builder.

## Jobs

### 1. lint

- **Trigger:** push / pull_request to `main`
- **Steps:**
  - Checkout, pnpm setup (no install), Node LTS
  - **nci** — install deps (via @antfu/ni)
  - **nr dev:prepare** — stub build + Nuxt prepare (or skip if no playground)
  - **nr lint** — ESLint
  - **nr typecheck** — TypeScript / vue-tsc

### 2. test

- **Trigger:** same as lint
- **Matrix:** `node: [lts/*]`, `os: [ubuntu-latest, windows-latest, macos-latest]`, `fail-fast: false`
- **Steps:**
  - Checkout, pnpm, Node from matrix
  - **nci** — install
  - **nr build** — `nuxt-module-build build` (required before testing built output)
  - **nr test** — Vitest
  - *(Optional)* **nr example:build** — build the example/playground if present

## Commands

| Command | Purpose |
|--------|--------|
| **nci** | Install dependencies (via @antfu/ni; respects lockfile). |
| **nr** | Run package scripts (e.g. `nr lint`, `nr build`). |
| **nuxt-module-build build** | Build module to `dist/` (run in CI before tests that consume dist). |

## Scripts to Expose

Ensure `package.json` has at least:

```json
{
  "scripts": {
    "build": "nuxt-module-build build",
    "dev:prepare": "nuxt-module-build build --stub && nuxt-module-build prepare",
    "lint": "eslint .",
    "typecheck": "vue-tsc --noEmit",
    "test": "vitest run"
  }
}
```

If you have an `example/` or playground, add `example:build` (e.g. `nuxt-module-build build ./example`) and run it in CI after the main build.

## Optional Checks

- **test:knip** — Knip for dead code / unused exports
- **test:attw** — attw for published types
- **test:publint** — publint in example or root
- **test:engines** — installed-check for engine compliance

## Template

A ready-to-use workflow is in **assets/ci.yml**. Copy it to `.github/workflows/ci.yml` in your module repo.

<!--
Source references:
- https://github.com/nuxt/module-builder (ci.yml, package.json scripts)
- arch-tsdown-cli .github/workflows/ci.yml
-->
