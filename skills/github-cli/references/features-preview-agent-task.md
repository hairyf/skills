---
name: features-preview-agent-task
description: GitHub CLI preview features and agent tasks (gh preview, gh agent-task).
---

# Preview & Agent Tasks

## Preview (gh preview)

List or run preview (beta) features.

```bash
# List preview features
gh preview

# Run preview script (e.g. prompter)
gh preview prompter
```

## Agent tasks (gh agent-task)

Manage agent tasks (GitHub Copilot agent workflows).

```bash
gh agent-task list
gh agent-task view 123
gh agent-task create --description "My task"
```

<!--
Source references:
- https://cli.github.com/manual/
- sources/github/skills/gh-cli/SKILL.md
-->
