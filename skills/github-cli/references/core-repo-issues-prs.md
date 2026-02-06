---
name: core-repo-issues-prs
description: GitHub CLI commands for repositories, issues, and pull requests.
---

# Repositories, Issues & Pull Requests

## Repositories (gh repo)

```bash
# Create
gh repo create my-repo --public --description "..." --clone
gh repo create my-repo --private --gitignore node --license mit

# Clone / list / view
gh repo clone owner/repo
gh repo list --limit 50 --json name,visibility
gh repo view --json name,defaultBranchRef

# Edit / delete / fork / sync
gh repo edit --description "..." --visibility private
gh repo delete owner/repo --yes
gh repo fork owner/repo --clone
gh repo sync
gh repo set-default owner/repo
```

## Issues (gh issue)

```bash
gh issue create --title "..." --body "..." --labels bug --assignee @me
gh issue list --state all --assignee @me --json number,title
gh issue view 123 --comments
gh issue edit 123 --title "..." --add-label bug
gh issue close 123 --comment "Fixed in PR #456"
gh issue comment 123 --body "..."
gh issue develop 123 --branch fix/issue-123
```

## Pull Requests (gh pr)

```bash
gh pr create --title "..." --body "..." --base main --draft
gh pr list --state open --author @me --json number,title
gh pr view 123 --comments
gh pr checkout 123
gh pr diff 123
gh pr merge 123 --squash --delete-branch
gh pr edit 123 --add-reviewer user1
gh pr review 123 --approve --body "LGTM"
gh pr checks 123 --watch
gh pr update-branch 123
gh pr revert 123
```

Use `--repo owner/repo` when not in a git repo or to target another repo.

<!--
Source references:
- https://cli.github.com/manual/
- sources/github/skills/gh-cli/SKILL.md
-->
