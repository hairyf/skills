---
name: core-tsdown-build
description: tsdown config for VSCode extension — CJS, external vscode, build:prepare hook
---

# tsdown Build Config

The extension is built with **tsdown**: single CJS bundle, **vscode** external, and a **build:prepare** hook that runs `pnpm update` so generated meta exists before compile.

## Example Config

```ts
// tsdown.config.ts
import { execSync } from 'node:child_process'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  shims: false,
  dts: false,
  external: ['vscode'],
  hooks(hooks) {
    hooks.hookOnce('build:prepare', () => {
      execSync('nr update')
    })
  },
})
```

## Options Used

| Option | Purpose |
|--------|--------|
| `entry` | Single entry `src/index.ts` — the extension host loads one CJS file. |
| `format` | `['cjs']` — VSCode extension runtime expects CommonJS (`main` in package.json, e.g. `./dist/index.cjs`). |
| `external` | `['vscode']` — Do not bundle the `vscode` module; the extension host provides it at runtime. |
| `dts` | `false` — No need to ship `.d.ts` for the extension entry; types are for development only. |
| `shims` | `false` — No extra shims for CJS. |
| `hooks.hookOnce('build:prepare', ...)` | Run `nr update` once before build so `src/generated/meta.ts` exists and config/utils types resolve. |

## Output

- `src/index.ts` → `dist/index.cjs` (and any other entry you add would go to `dist/<name>.cjs`).

## Adding More Entries

If you add another entry (e.g. a separate worker or webview script), add it to `entry` and ensure `package.json` points to the correct main entry. For the standard extension host entry, one entry is enough.

<!--
Source references:
- https://github.com/antfu/starter-vscode
- https://tsdown.dev
-->
