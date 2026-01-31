---
name: core-ci
description: GitHub Actions CI for Vitesse WebExtension — lint, typecheck, build, test, optional E2E
---

# CI for Vitesse WebExtension

Use a single **CI** workflow (e.g. `.github/workflows/ci.yml`) on push/PR to `main` to lint, typecheck, build, and test a Vue-based browser extension (Vitesse WebExt stack).

## Jobs

### 1. lint

- **Trigger:** push / pull_request to `main`
- **Steps:**
  - Checkout, pnpm setup, Node LTS (with pnpm cache)
  - **pnpm i** — install dependencies
  - **pnpm run lint** — ESLint
  - **pnpm run typecheck** — TypeScript (tsc --noEmit)

### 2. build-and-test

- **Trigger:** same as lint
- **Matrix:** `node: [lts/*]`, `os: [ubuntu-latest, windows-latest, macos-latest]`, `fail-fast: false`
- **Steps:**
  - Checkout, pnpm, Node from matrix
  - **pnpm i** — install
  - **pnpm run build** — clear → build:web → build:prepare → build:background → build:js (output to `extension/`)
  - **pnpm run test** — Vitest unit tests

### 3. test:e2e (optional)

- **Trigger:** same as lint
- **Runs on:** ubuntu-latest (Playwright needs browser)
- **Steps:**
  - Checkout, pnpm, Node LTS
  - **pnpm i** — install
  - **pnpm run build** — produce `extension/` for E2E
  - **npx playwright install --with-deps** — install browser for Playwright
  - **pnpm run test:e2e** — Playwright E2E (loads extension from `extension/`)

## Commands

| Command | Purpose |
|--------|--------|
| **pnpm i** | Install dependencies (respects lockfile). |
| **pnpm run build** | Full extension build to `extension/` (manifest + dist for popup/options/sidepanel/background/contentScripts). |
| **pnpm run lint** | ESLint with cache. |
| **pnpm run typecheck** | TypeScript check (tsc --noEmit). |
| **pnpm run test** | Vitest unit tests. |
| **pnpm run test:e2e** | Playwright E2E (requires built `extension/`). |

## Scripts to Expose

Ensure `package.json` has at least:

```json
{
  "scripts": {
    "build": "cross-env NODE_ENV=production run-s clear build:web build:prepare build:background build:js",
    "lint": "eslint --cache .",
    "typecheck": "tsc --noEmit",
    "test": "vitest test",
    "test:e2e": "playwright test"
  }
}
```

## Template

A ready-to-use workflow is in **assets/ci.yml**. Copy it to `.github/workflows/ci.yml` in your extension repo. The E2E job is commented out by default; uncomment if you use Playwright E2E tests.

<!--
Source references:
- https://github.com/antfu-collective/vitesse-webext (package.json scripts)
- arch-nuxt-lite .github/workflows, arch-nuxt-module-builder assets/ci.yml
-->
