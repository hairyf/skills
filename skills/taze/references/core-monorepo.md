---
name: taze-core-monorepo
description: Using taze in monorepos with recursive scanning and local package handling.
---

# Monorepo Support with taze

`taze` has first-class support for monorepos.

Using the `-r` (or `--recursive`) flag, it will:

- Scan subdirectories for `package.json` files.
- Treat them as part of a single upgrade session.
- Handle local/private packages automatically.

## Basic Monorepo Command

From the monorepo root:

```bash
npx taze -r
```

This will:

- Traverse subdirectories (respecting ignore patterns).
- Apply upgrades to each `package.json`.
- Keep local workspace packages aligned when versions are updated.

You can combine `-r` with upgrade modes:

```bash
# Allow major upgrades across the whole monorepo
npx taze major -r

# Conservative minor-only upgrades
npx taze minor -r
```

## Ignoring Paths

When using a config file, you can fine-tune which paths are scanned:

```ts
import { defineConfig } from 'taze'

export default defineConfig({
  ignorePaths: [
    '**/node_modules/**',
    '**/test/**',
  ],
  ignoreOtherWorkspaces: true,
})
```

- **`ignorePaths`**: glob patterns for paths that should not be scanned.
- **`ignoreOtherWorkspaces`**: skip `package.json` files that belong to other workspaces (e.g. nested repos with their own `.git` or `pnpm-workspace.yaml`).

## Agent Patterns in Monorepos

When acting in a monorepo, an agent should:

1. **Run from the true root** (where the main lockfile and workspace config live).
2. **Use `-r`** to keep packages consistent across apps/packages.
3. **Respect workspace boundaries**:
   - Configure `ignoreOtherWorkspaces` to avoid touching nested foreign workspaces.
4. **Run checks at appropriate scopes**:
   - At least run tests and typechecks for **affected packages** (see best-practices module).

<!--
Source references:
- https://github.com/antfu-collective/taze#monorepo
-->

