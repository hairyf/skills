---
name: taze-core-overview
description: Overview of taze, its CLI modes, and safe-by-default dependency upgrades.
---

# Taze Overview & CLI Modes

`taze` is a CLI tool for upgrading dependencies in JavaScript/TypeScript projects.

- **Install-free**: can be run via `npx taze` (or `pnpx taze`, `bunx taze`, etc.).
- **Safe by default**: upgrades stay within the existing semver range in `package.json`, similar to `npm install`.
- **Explicit upgrade modes**: you choose how far to bump (patch / minor / major).

## Basic Usage

The default command inspects dependencies and bumps versions **within the existing version range**:

```bash
npx taze
```

For example, if `package.json` has:

```json
{
  "dependencies": {
    "react": "^18.2.0"
  }
}
```

Running `taze` (no extra mode) will:

- Check the registry for the latest compatible version within `^18.2.0`.
- Update `package.json` if a newer compatible version exists.

## Upgrade Modes

Taze lets you control the maximum allowed change via a **mode** argument:

- **`taze major`**: allow bumping to the latest stable version, including breaking major versions.
- **`taze minor`**: allow bumping up to the latest minor version within the same major.
- **`taze patch`**: only bump patch versions (safest mode).

Examples:

```bash
# Allow breaking changes
npx taze major

# Only minor upgrades
npx taze minor

# Patch-level maintenance
npx taze patch
```

These modes can be combined with other flags (filters, monorepo, peer deps, etc.) described in other references.

## Typical Agent Workflow

For an agent maintaining a project:

1. **Inspect**: Decide which scope to upgrade (all deps, only devDeps, only a subset).
2. **Select mode**:
   - Start with **`major`** by policy (see best-practices module) but verify preconditions.
   - If `major` is too risky, fall back to `minor` or `patch`.
3. **Run taze**:
   - Use `npx taze major` (or `minor`/`patch`) with proper filters and monorepo flags.
4. **Review changes**:
   - Look at `package.json` diffs or lockfile changes.
5. **Run checks**:
   - Execute tests, lint, typecheck, and e2e where required.

<!--
Source references:
- https://github.com/antfu-collective/taze
- https://github.com/antfu-collective/taze#taze
-->

