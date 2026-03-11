# Spec: GitHub Workflow (Task link → Environment setup → Fix → PR)

> This file is the original spec. The skill implementation generalizes task source to any data source and adds global config persistence and find-skills discovery; see [SKILL.md](../SKILL.md).

## Overview

**Goal**: Define the standard flow from "task link" to "create PR (no merge)" for the agent or a human to run in order.

**Output**: Branch created, `TODO.md` written, and PR link targeting the base branch (default `dev`, else main; origin only).

---

## Decisions

| Decision | Choice | Notes |
|----------|--------|-------|
| Task source | Any data source (see skill Step 1) | First read `~/.bonfire/source.json`; if missing or no match, analyze description and use find-skills to find query method, save to global after confirmation, skip find-skills next time. |
| Branch naming | `fix/<short-desc-kebab-case>` or `feature/<...>` | From task type or title. Create from base branch: default `dev`, if missing use main/default. |
| TODO location and name | `TODO.md` | Matches branch. |
| PR remote | **Origin only** | Do not add or rely on other remotes. |
| PR creation | `gh pr create` (GitHub skill from awesome-copilot/gh-cli) | Use `gh` CLI; base = same as branch base (default `dev`, else main). Do not merge. See SKILL.md Prerequisites. |
| Fix step (Step 3) | Delegate to SubAgent (TODO.md) | Task spec = TODO.md; when SubAgent completes or user says "fix done", **user must confirm** before agent commits; then agent deletes TODO.md and runs Step 4. |

---

## Implementation Steps

See [SKILL.md](../SKILL.md) Steps 1–4.

---

## Edge Cases

See [SKILL.md](../SKILL.md) edge cases table.

---

## Reference

- Task data source: user skills dir, e.g. `~/.bonfire/skills/clickup/SKILL.md` (example), find-skills (`npx skills find <keyword>`)
- PR tool: GitHub / `gh` CLI skill (install: see [SKILL.md](../SKILL.md) Prerequisites);
