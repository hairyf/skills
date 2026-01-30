---
name: core-overview
description: arch-vscode (starter-vscode) project purpose, structure, and when to use it
---

# arch-vscode Overview

arch-vscode is a **VSCode extension** starter (based on [antfu/starter-vscode](https://github.com/antfu/starter-vscode)) that uses **reactive-vscode** and **tsdown**. Use this skill when scaffolding or maintaining a VSCode extension with reactive APIs, CJS output, and minimal config.

## What It Is

- A **starter** for publishing **VSCode extensions** to the Marketplace (vsce) or Open VSX (vsxpub)
- **Entry:** `src/index.ts` uses `defineExtension` from reactive-vscode; exports `activate` and `deactivate`
- **Build:** tsdown (CJS, external `vscode`); `vscode-ext-gen` generates `src/generated/meta.ts` from `package.json` contributes
- **Tooling:** ESLint (@antfu/eslint-config), Vitest, TypeScript, pnpm

## Project Structure

```
.
├── src/
│   ├── index.ts          # Extension entry (defineExtension, activate/deactivate)
│   ├── config.ts         # defineConfig + generated scoped config
│   ├── utils.ts          # defineLogger + generated displayName
│   └── generated/
│       └── meta.ts       # Auto-generated from package.json (vscode-ext-gen)
├── res/                  # Icon assets (icon.png, icon.svg)
├── dist/                 # Build output (gitignored)
├── test/                 # Vitest tests
├── .vscode/              # launch.json, tasks.json, extensions.json, settings.json
├── tsdown.config.ts      # CJS build, external vscode, build:prepare → update
├── package.json          # main, engines, activationEvents, contributes
└── ...
```

## When to Use

- Starting a new **VSCode extension** to be published to the Marketplace or Open VSX
- You want **reactive-vscode** (Vue reactivity, composables, auto disposables) instead of raw VSCode API
- You want **tsdown** for a single CJS bundle and **vscode-ext-gen** for type-safe contributes metadata

## Key Conventions

- **Extension entry:** `src/index.ts` — `defineExtension(() => { ... })` and export `{ activate, deactivate }`
- **Config:** `src/config.ts` — `defineConfig<Meta.ScopedConfigKeyTypeMap>(Meta.scopedConfigs.scope)`
- **Logger:** `src/utils.ts` — `defineLogger(displayName)` from generated meta
- **Generated meta:** Run `pnpm update` (or `vscode-ext-gen --output src/generated/meta.ts`) so commands/configs stay in sync with `package.json`

<!--
Source references:
- https://github.com/antfu/starter-vscode
- https://kermanx.com/reactive-vscode/
-->
