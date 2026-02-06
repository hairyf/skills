# Spec: GitHub Workflow (Task link → Environment setup → Fix → PR)

> This file is the original spec. The skill implementation generalizes task source to any data source and adds global config persistence and find-skills discovery; see [SKILL.md](../SKILL.md).

## Overview

**Goal**: Define the standard flow from "task link" to "create PR (no merge)" for the agent or a human to run in order.

**Output**: Branch created, `TODO.md` written, and PR link targeting `dev` (origin only).

---

## Decisions

| Decision | Choice | Notes |
|----------|--------|-------|
| Task source | Any data source (see skill Step 1) | First read `~/.bonfire/source.json`; if missing or no match, analyze description and use find-skills to find query method, save to global after confirmation, skip find-skills next time. |
| Branch naming | `fix/<short-desc-kebab-case>` or `feature/<...>` | From task type or title. Create from `dev`. |
| TODO location and name | `TODO.md` | Matches branch. |
| PR remote | **Origin only** | Do not add or rely on other remotes. |
| PR creation | `gh pr create` (GitHub skill from awesome-copilot/gh-cli) | Use `gh` CLI; do not merge. See SKILL.md Prerequisites. |

---

## Implementation Steps

See [SKILL.md](../SKILL.md) Steps 1–4.

---

## Edge Cases

See [SKILL.md](../SKILL.md) edge cases table.

---

## Reference

- Task data source: user skills dir, e.g. `~/.bonfire/skills/clickup/SKILL.md` (example), find-skills (`npx skills find <keyword>`)
- PR tool: GitHub / `gh` CLI skill from **awesome-copilot/gh-cli** (e.g. `npx skills add awesome-copilot/gh-cli`); after install typically at user skills dir e.g. `~/.bonfire/skills/github/SKILL.md`. See [SKILL.md](../SKILL.md) Prerequisites.
