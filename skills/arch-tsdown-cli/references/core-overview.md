---
name: core-overview
description: arch-tsdown-cli (starter-cli) project purpose, structure, and when to use it
---

# arch-tsdown-cli Overview

arch-tsdown-cli is a TypeScript **CLI package** starter (based on [hairyf/starter-cli](https://github.com/hairyf/starter-cli)) that uses **tsdown** for building. Use this skill when scaffolding or maintaining an npm-installable CLI with a library surface, ESM output, and minimal config.

## What It Is

- A **starter** for publishing **CLI + library** packages to npm
- **Bin entry:** `bin/` scripts point at built CLI (`dist/cli/index.mjs`) or dev CLI via tsx (`src/cli/index.ts`)
- Build pipeline: **tsdown** for bundling and `.d.ts` generation
- Tooling: ESLint (@antfu/eslint-config), Vitest, TypeScript (noEmit), pnpm

## Project Structure

```
.
├── bin/
│   ├── index.mjs       # Production: runs dist/cli/index.mjs
│   └── index.dev.mjs   # Development: runs src/cli/index.ts via tsx
├── src/
│   ├── index.ts        # Library entry (exports for programmatic use)
│   └── cli/
│       └── index.ts    # CLI entry (e.g. console.log, arg parsing)
├── dist/               # Build output (gitignored)
├── test/               # Vitest tests
├── tsdown.config.ts    # tsdown build config (entry: src/**/*.ts)
├── package.json        # bin + exports point to bin + dist
└── ...
```

## When to Use

- Starting a new **CLI** that will be published to npm and run via `npx <name>` or global install
- You want a **dual surface:** executable bin + importable library (e.g. `import { one, two } from 'pkg'`)
- You want **ESM-only** output, `.d.ts` generation, and tsdown’s defaults

## Key Conventions

- **Library entry:** `src/index.ts` (exported as package root)
- **CLI entry:** `src/cli/index.ts` (built to `dist/cli/index.mjs`, run via `bin/index.mjs`)
- **Dev CLI:** `bin/index.dev.mjs` uses tsx to run `src/cli/index.ts` without building
- **Output:** `dist/` (e.g. `dist/index.mjs`, `dist/cli/index.mjs`) and `bin/` are published

<!--
Source references:
- https://github.com/hairyf/starter-cli
-->
