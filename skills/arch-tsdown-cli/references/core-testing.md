---
name: core-testing
description: Vitest setup and testing patterns in arch-tsdown-cli
---

# Testing (Vitest)

The CLI starter uses **Vitest** for unit tests. Tests live in `test/` and run with `pnpm run test`.

## Config

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    server: {
      deps: {
        inline: ['vitest-package-exports'],
      },
    },
  },
})
```

- **vitest-package-exports:** Inlined so you can write tests that assert package exports (e.g. importing from `dist/` or the package name). Optional; remove if you only test source files.

## What to Test

- **Library API:** Import from `src/index.ts` (or the package name if testing published surface) and assert exports and behavior.
- **CLI:** Use Vitest to spawn the bin (e.g. `tinyexec` or `execa`) and assert stdout/stderr and exit code; or test functions used by the CLI in isolation.

## CI

CI runs `nr build` then `nr test`, so `dist/` exists when tests run. Use this if you have tests that depend on built output (e.g. vitest-package-exports).

<!--
Source references:
- https://github.com/hairyf/starter-cli
-->
