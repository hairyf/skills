---
name: core-ci
description: GitHub Actions CI for VSCode extensions — lint, typecheck, build, test
---

# CI for VSCode Extensions

Use a single **CI** workflow (e.g. `.github/workflows/ci.yml`) on push/PR to `main` to lint, typecheck, build, and test a VSCode extension built with tsdown + reactive-vscode.

## Jobs

### 1. lint

- **Trigger:** push / pull_request to `main`
- **Steps:**
  - Checkout, pnpm setup (no install), Node LTS
  - **nci** — install deps (via @antfu/ni)
  - **nr build** — run tsdown build (triggers `build:prepare` hook which runs `nr update` for generated meta)
  - **nr lint** — ESLint
  - **nr typecheck** — TypeScript tsc --noEmit

### 2. test

- **Trigger:** same as lint
- **Matrix:** `node: [lts/*]`, `os: [ubuntu-latest, windows-latest, macos-latest]`, `fail-fast: false`
- **Steps:**
  - Checkout, pnpm, Node from matrix
  - **nci** — install
  - **nr build** — tsdown build (required before tests that may consume dist)
  - **nr test** — Vitest

## Commands

| Command | Purpose |
|--------|--------|
| **nci** | Install dependencies (via @antfu/ni; respects lockfile). |
| **nr** | Run package scripts (e.g. `nr lint`, `nr build`). |
| **nr build** | Run tsdown build, which triggers `build:prepare` hook to run `nr update` for generated meta. |

## Scripts to Expose

Ensure `package.json` has at least:

```json
{
  "scripts": {
    "build": "tsdown",
    "dev": "nr build --watch --sourcemap",
    "update": "vscode-ext-gen --output src/generated/meta.ts",
    "prepare": "nr update",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  }
}
```

## Optional: Package in CI

To produce a `.vsix` artifact in CI for manual installation or release:

```yaml
  package:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          run_install: false
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: pnpm

      - run: pnpm i -g @antfu/ni
      - run: nci
      - run: nr ext:package
      - uses: actions/upload-artifact@v4
        with:
          name: vsix
          path: "*.vsix"
```

## Template

A ready-to-use workflow is in **assets/ci.yml**. Copy it to `.github/workflows/ci.yml` in your extension repo.

<!--
Source references:
- https://github.com/antfu/starter-vscode
- arch-nuxt-module-builder CI template
-->
