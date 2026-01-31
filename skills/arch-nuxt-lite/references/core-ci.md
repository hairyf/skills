---
name: core-ci
description: GitHub Actions CI — build, test, lint, typecheck matrix
---

# CI Workflow

The starter uses a single **CI** workflow (`.github/workflows/test.yml`) on push/PR to `main`.

## Job: build

- **Trigger:** push / pull_request to `main`
- **Matrix:** `node_version: [lts/*]`, `os: [ubuntu-latest, windows-latest]`, `fail-fast: false`
- **Timeout:** 10 minutes
- **Steps:**
  - Checkout, pnpm setup, Node from matrix (with pnpm cache)
  - **pnpm i** — install dependencies
  - **pnpm run build** — Vite production build
  - **pnpm run test** — Vitest
  - **pnpm run lint** — ESLint
  - **pnpm run typecheck** — Vue TSC

## Commands Used

| Command | Purpose |
|--------|--------|
| **pnpm i** | Install dependencies (respects lockfile). |
| **pnpm run build** | Vite build to `dist/`. |
| **pnpm run test** | Run Vitest. |
| **pnpm run lint** | Run ESLint. |
| **pnpm run typecheck** | Run Vue TSC. |

## Template

A copyable workflow file is in **assets/ci.yml**. Place it at `.github/workflows/ci.yml` (or `test.yml`) in the project root.

<!--
Source references:
- https://github.com/antfu-collective/vitesse-lite
- .github/workflows/test.yml
-->
