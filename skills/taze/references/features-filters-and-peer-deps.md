---
name: taze-features-filters-and-peer-deps
description: Using include/exclude filters, handling locked versions, and managing peer dependencies in taze.
---

# Filters, Locked Versions & Peer Dependencies

`taze` provides several options to control **which** packages are considered for upgrades and how special cases are handled.

## Include / Exclude Filters

You can narrow which dependencies are checked via `--include` and `--exclude`.  
They accept:

- Plain strings for exact/substring matches.
- Regular expressions (starting and ending with `/`).
- Multiple entries separated by commas.

Examples:

```bash
# Only check lodash and webpack
taze --include lodash,webpack

# Include all react-related packages but exclude react-dom
taze --include /react/ --exclude react-dom
```

Typical agent patterns:

- Limit scope to **low-risk** libraries first (e.g. `eslint`, `vitest`, internal packages).
- Exclude critical infra packages when doing exploratory upgrades.

## Locked Versions

By default, taze **skips locked dependencies** — those pinned without `^` or `~`.

To include them:

```bash
taze --include-locked
taze -l          # shorthand
```

Agents should be conservative when touching locked deps:

- Only include locked deps when there is a clear reason (security fix, bug fix).
- Prefer `patch` or `minor` mode for locked dependencies unless policy says otherwise.

## Peer Dependencies

Upgrading `peerDependencies` is **not enabled by default**.

To include them:

```bash
taze --peer
```

Guidelines for agents:

- Only use `--peer` when you understand the peer relationship (e.g. React + React DOM, Vue + Vue plugins).
- When upgrading a framework, also validate major peer packages:
  - For example, if bumping React major, check `react-dom`, `@testing-library/react`, etc.

## Dependency Fields

You can also configure which dependency fields are considered via `depFields` in `taze.config.(js|ts)` (see config reference).

For example, to disable `overrides`:

```ts
depFields: {
  overrides: false,
}
```

<!--
Source references:
- https://github.com/antfu-collective/taze#filters
- https://github.com/antfu-collective/taze#locked-versions
- https://github.com/antfu-collective/taze#peer-dependencies
-->

