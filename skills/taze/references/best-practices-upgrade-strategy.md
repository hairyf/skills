---
name: taze-best-practices-upgrade-strategy
description: Safe dependency upgrade workflow with tests, lint/typecheck, and a major-by-default policy for taze.
---

# Best Practices: Safe Upgrade Strategy with taze

This reference encodes **opinionated policies** for using `taze` in automated or semi-automated flows, with a focus on:

- When to allow an upgrade.
- Which checks must pass.
- How to handle failures and downgrade from `major` to `minor`.

> Policy is written so that an agent can **refuse** dangerous upgrades instead of blindly bumping versions.

## 1. Preconditions for Upgrading Dependencies

Before running `taze`, the agent MUST verify whether the project meets upgrade conditions.

### 1.1 Test Coverage & Test Strategy

**Hard requirement for major upgrades (`taze major`):**

- The project MUST have at least:
  - A reliable **unit test** suite (e.g. Vitest/Jest) covering critical paths, and
  - A way to run them in CI or locally.
- For critical production systems or user-facing apps, there SHOULD also be:
  - **E2E tests** (Playwright/Cypress, etc.) for main user journeys.

If these conditions are **not** met:

- The agent MUST either:
  - **Refuse** a major upgrade and warn about potential impact, or
  - Explicitly propose adding tests first before proceeding.

Suggested warning message (for agents):

> This project lacks sufficient automated tests for a safe major dependency upgrade.  
> Upgrading core dependencies without tests can introduce production-breaking regressions.  
> I recommend adding unit/E2E coverage for critical flows before running `taze major`.  
> I will not perform the major upgrade automatically under current conditions.

For **minor/patch** upgrades (`taze minor` / `taze patch`):

- More lenient, but still recommended to have at least a basic unit test suite.

### 1.2 When E2E is Required

An agent SHOULD consider **E2E tests mandatory** for major upgrades when:

- The dependency affects:
  - Routing (e.g. React Router, Vue Router, Next.js, Nuxt).
  - Rendering framework (React, Vue, Svelte, etc.).
  - Build pipeline (Vite, Webpack, Rollup) for complex apps.
  - Authentication / authorization / payments.

If E2E tests do not exist for such systems, the agent should **refuse** major upgrades and surface the risk explicitly.

## 2. Post-Upgrade Checks: Lint and Typecheck

After running `taze` and applying changes, the agent must decide which checks to run.

### 2.1 When to Run Lint

The agent SHOULD run lint (e.g. `pnpm lint`, `npm run lint`) when:

- Upgrading tooling or libraries that affect code quality rules:
  - ESLint, TypeScript ESLint, Prettier plugins.
- Upgrading framework/tooling that might change recommended patterns.

For core app/library dependencies where lint rules are stable, lint is still recommended but can be grouped with other checks.

### 2.2 When to Run Typecheck

The agent SHOULD run typecheck (e.g. `pnpm typecheck`, `tsc --noEmit`) when:

- Upgrading **TypeScript** itself.
- Upgrading libraries with TypeScript types that are heavily used in the codebase.
- Upgrading frameworks (`react`, `vue`, `next`, `nuxt`, etc.) or core runtime packages that ship complex type definitions.

If the project has a dedicated `typecheck` script, prefer that over raw `tsc` commands.

### 2.3 Minimum Recommended Post-Upgrade Suite

For any non-trivial project, the agent SHOULD, after `taze`:

1. Run **unit tests**.
2. Run **typecheck** (if TS).
3. Run **lint** (especially when upgrading lint-related deps).
4. Optionally run **E2E tests** when critical flows are touched.

If any of these fail, see the failure handling section below.

## 3. Default Major Mode with Fallback Strategy

By policy, this skill assumes:

- **Default upgrade mode**: `major`.

That means, when asked to “upgrade dependencies with taze”, an agent SHOULD:

```bash
npx taze major
```

or in monorepos:

```bash
npx taze major -r
```

…**only after** the preconditions in section 1 are satisfied.

### 3.1 Handling Problems After a Major Upgrade

If, after running `taze major`, any of the following occur:

- Tests fail.
- Typecheck breaks.
- Lint starts failing due to new rules or breaking changes.
- E2E tests reveal regressions.

The agent MUST NOT silently keep the major upgrade. Instead, it should:

1. **Surface the problem** with a concise summary of failing areas.
2. **Ask the user** which path to take:
   - **Option A**: Downgrade the strategy to **`minor`** (or even `patch`) and re-run `taze`.
   - **Option B**: Keep `major` and attempt to **fix the breaking changes** (possibly in multiple steps).

Example question for the user:

> After running `taze major`, some checks failed (tests/typecheck/lint/e2e).  
> Do you prefer:
> - A) Fall back to `taze minor` for a safer, incremental upgrade, or  
> - B) Keep the major upgrade and let me fix the failing issues?

Until the user chooses, the agent should avoid committing or finalizing the major upgrade.

### 3.2 Downgrading to Minor

If the user chooses to **downgrade to `minor`**:

1. Reset or revert the major changes (e.g. via git reset/checkout as appropriate).
2. Run:

   ```bash
   npx taze minor
   # or in a monorepo:
   npx taze minor -r
   ```

3. Re-run the post-upgrade checks from section 2.

Minor upgrades should rarely cause large breakage, but if they still do, consider `patch` or per-package `packageMode` overrides.

### 3.3 Fixing Issues Under Major

If the user chooses to **fix issues under major**:

- The agent can:
  - Update code to comply with new APIs/type changes.
  - Adjust lint configs or disable specific new rules (only when justified).
  - Update tests/E2E specs to reflect expected behavior.
- Each fix should be followed by rerunning the relevant subset of checks.

## 4. Refusal Rules Summary

An agent following this skill MUST refuse to:

- Run `taze major` in projects without:
  - At least a basic test suite, and
  - Appropriate E2E coverage for high-risk systems (routing/framework/build/auth/etc.).
- Apply large upgrades without running:
  - Tests, and
  - Typecheck (for TypeScript), and
  - Lint when lint-related tooling is upgraded.

Instead, it should:

- Explain why the upgrade is unsafe.
- Propose a safer alternative (e.g. `minor` / `patch` or adding tests first).

<!--
Source references:
- https://github.com/antfu-collective/taze
- https://github.com/antfu-collective/taze#usage
-->

