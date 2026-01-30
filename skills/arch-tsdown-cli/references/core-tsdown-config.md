---
name: core-tsdown-config
description: tsdown config in arch-tsdown-cli — entry, format, dts, external
---

# tsdown Config in arch-tsdown-cli

The starter uses a single `tsdown.config.ts` with options tuned for a CLI package: multiple entries (library + CLI), ESM-only, and dependencies externalized.

## Example Config

```ts
// tsdown.config.ts
import { defineConfig } from 'tsdown'
import { dependencies } from './package.json'

export default defineConfig({
  fixedExtension: true,
  entry: ['src/**/*.ts'],
  format: ['esm'],
  clean: true,
  dts: true,
  external: Object.keys(dependencies || {}),
})
```

## Options Used

| Option | Purpose |
|--------|--------|
| `entry` | `src/**/*.ts` — builds all TS files under `src/`, preserving path (e.g. `src/index.ts` → `dist/index.mjs`, `src/cli/index.ts` → `dist/cli/index.mjs`). |
| `format` | `['esm']` — ESM-only output. |
| `dts` | Generate `.d.ts` declaration files for library and CLI. |
| `external` | All keys from `package.json` `dependencies` — do not bundle them; keep as runtime imports. |
| `clean` | Clean output directory before build. |
| `fixedExtension` | Use fixed extensions (e.g. `.mjs`) in output. |

## Output Layout

- `src/index.ts` → `dist/index.mjs` (and `dist/index.d.mts` if dts)
- `src/cli/index.ts` → `dist/cli/index.mjs` (and `dist/cli/index.d.mts`)

The bin script imports `../dist/cli/index.mjs`; the library entry is the package root (e.g. `"."` export → `dist/index.mjs`).

## Adding More Entries

Adding files under `src/` is enough — `entry: ['src/**/*.ts']` picks them up. If you switch to an explicit entry list, keep both library and CLI:

```ts
entry: [
  'src/index.ts',
  'src/cli/index.ts',
],
```

For full tsdown options (plugins, platform, etc.), refer to the **tsdown** skill or [tsdown docs](https://tsdown.dev).

<!--
Source references:
- https://github.com/hairyf/starter-cli
- https://tsdown.dev
-->
