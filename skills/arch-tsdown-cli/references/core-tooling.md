---
name: core-tooling
description: ESLint, TypeScript, and Vitest setup in arch-tsdown-cli
---

# Tooling (ESLint, TypeScript, Vitest)

The CLI starter uses the same tooling stack as arch-tsdown: ESLint (@antfu/eslint-config), TypeScript (noEmit), and Vitest.

## ESLint

- **Config:** `eslint.config.js` (flat config), typically with `@antfu/eslint-config` and type-aware rules.
- **Script:** `pnpm run lint` (or `nr lint`) runs `eslint`.
- **Pre-commit:** lint-staged runs `eslint --fix` on staged files (see [core-git-hooks](core-git-hooks.md)).

Use when: enforcing style and catching common issues in both library and CLI code.

## TypeScript

- **Config:** `tsconfig.json` with `noEmit: true` — type-checking only; tsdown handles emit.
- **Script:** `pnpm run typecheck` runs `tsc`.
- **CI:** Lint job runs `nr typecheck` after install.

Use when: ensuring types are valid across `src/` (library and CLI) without emitting files.

## Vitest

- **Config:** `vitest.config.ts` (e.g. server.deps.inline for vitest-package-exports if you test dist).
- **Script:** `pnpm run test` runs `vitest`.
- **CI:** Test job runs `nr build` then `nr test` (so dist exists if tests import from dist).

Use when: unit testing library code and, if needed, testing the built CLI or exports (e.g. vitest-package-exports).

<!--
Source references:
- https://github.com/hairyf/starter-cli
-->
