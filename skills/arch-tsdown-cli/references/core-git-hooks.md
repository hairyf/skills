---
name: core-git-hooks
description: simple-git-hooks and lint-staged in arch-tsdown-cli
---

# Git Hooks (simple-git-hooks, lint-staged)

The starter uses **simple-git-hooks** and **lint-staged** to run checks before commit.

## Configuration

```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpm i --frozen-lockfile --ignore-scripts --offline && npx lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
}
```

- **pre-commit:** Ensures install is up to date (frozen, offline), then runs lint-staged.
- **lint-staged:** Runs `eslint --fix` on all staged files.

## Setup

Hooks are installed when you run `pnpm install` (or `prepare` script that runs `simple-git-hooks`). After cloning, run `pnpm i` so `.git/hooks/pre-commit` is installed.

## Skipping Hooks

To commit without running hooks (use sparingly): `git commit --no-verify`.

<!--
Source references:
- https://github.com/hairyf/starter-cli
-->
