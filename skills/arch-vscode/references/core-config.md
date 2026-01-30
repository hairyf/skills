---
name: core-config
description: defineConfig and generated scoped config in arch-vscode
---

# Config (defineConfig)

Extension configuration is defined with **reactive-vscode**'s `defineConfig`, wired to **generated meta** so config keys and types stay in sync with `package.json` contributes.

## Usage

```ts
// src/config.ts
import { defineConfig } from 'reactive-vscode'
import * as Meta from './generated/meta'

export const config = defineConfig<Meta.ScopedConfigKeyTypeMap>(Meta.scopedConfigs.scope)
```

## Key Points

- **defineConfig&lt;T&gt;(scope)** — Creates a reactive config object. `T` is the type map for config keys (from generated meta). `scope` is the contribution scope (e.g. from `Meta.scopedConfigs.scope`).
- **Generated meta** — `src/generated/meta.ts` is produced by `vscode-ext-gen --output src/generated/meta.ts` (script: `pnpm update`). It reads `package.json` `contributes.configuration` and exposes:
  - `scopedConfigs.scope` — used as the `defineConfig` scope
  - `ScopedConfigKeyTypeMap` — TypeScript type for config keys and value types
- **Reactive** — Config values are reactive; use them in reactive-vscode composables or watch them like Vue refs.
- **Workspace settings** — The configuration defined in `contributes.configuration` appears under the extension's title in VSCode Settings; users can set values per user or per workspace.

## Adding Configuration

1. Add properties under `contributes.configuration.properties` in `package.json`.
2. Run `pnpm update` to regenerate `src/generated/meta.ts`.
3. Use `config` in your code, e.g. `config.get('yourKey')` or reactive access as provided by reactive-vscode.

<!--
Source references:
- https://github.com/antfu/starter-vscode
- https://kermanx.com/reactive-vscode/
-->
