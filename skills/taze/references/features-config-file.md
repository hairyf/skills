---
name: taze-features-config-file
description: Using taze.config.js/ts and defineConfig to configure dependency upgrade behavior.
---

# Configuring taze with taze.config.(js|ts)

In addition to CLI flags, `taze` can be configured via a config file, typically `taze.config.js` or `taze.config.ts`.

```ts
import { defineConfig } from 'taze'

export default defineConfig({
  exclude: ['webpack'],
  force: true,
  write: true,
  install: true,
  ignorePaths: [
    '**/node_modules/**',
    '**/test/**',
  ],
  ignoreOtherWorkspaces: true,
  packageMode: {
    typescript: 'major',
    unocss: 'ignore',
    '/vue/': 'latest',
  },
  depFields: {
    overrides: false,
  },
})
```

## Key Options

- **`exclude: string[]`**  
  Packages that should never be bumped (e.g. fragile build chain deps).

- **`force: boolean`**  
  Fetch the latest package info without using registry cache.

- **`write: boolean`**  
  When `true`, actually write changes into `package.json`.  
  When `false`, dry-run behavior (inspect only).

- **`install: boolean`**  
  When `true`, run the package manager install (`npm install`, `pnpm install`, etc.) right after bumping.

- **`ignorePaths: string[]`**  
  Glob patterns of paths to ignore when scanning for `package.json` (useful in monorepos).

- **`ignoreOtherWorkspaces: boolean`**  
  Avoid touching `package.json` files that belong to other workspaces (with their own `.git`, `pnpm-workspace.yaml`, etc.).

- **`packageMode: Record<string, 'major' | 'minor' | 'patch' | 'ignore' | 'latest'>`**  
  Per-package override of bumping strategy:
  - `major`: always allow major bumps for that package.
  - `minor` / `patch`: constrain to smaller changes.
  - `ignore`: never upgrade this package.
  - `latest`: always go to the absolute latest version, ignoring range limits.

- **`depFields`**  
  Toggle which dependency fields are checked. For example:

  ```ts
  depFields: {
    overrides: false, // do not try to upgrade packages in "overrides"
  }
  ```

## Agent Usage Patterns

When using `taze` via an agent:

- Prefer keeping **policy** in `taze.config.(js|ts)` and **commands** simple.
- Use `packageMode` to encode known risk profiles:
  - e.g. allow `major` for linters and internal libs, but `minor` for framework/runtime.
- Turn `write` off when exploring or in CI dry-runs; turn it on only in controlled flows.

<!--
Source references:
- https://github.com/antfu-collective/taze#config-file
-->

