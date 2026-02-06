---
name: best-practices-workflows
description: Common GitHub CLI workflows and best practices for agents.
---

# Best Practices & Common Workflows

## Environment Setup

```bash
# Shell completion (add to ~/.bashrc or ~/.zshrc)
eval "$(gh completion -s bash)"
eval "$(gh completion -s zsh)"

# Or write to file
gh completion -s bash > ~/.gh-complete.bash
gh completion -s fish > ~/.gh-complete.fish
gh completion -s powershell > ~/.gh-complete.ps1

# Useful aliases
alias gs='gh status'
alias gpr='gh pr view --web'
alias gir='gh issue view --web'
alias gco='gh pr checkout'

# Git credential helper (use gh for git auth)
gh auth setup-git
git config --global credential.helper 'gh !gh auth setup-git'
```

## Agent Best Practices

1. **Use `GH_TOKEN` for automation** — avoid interactive login in scripts.
2. **Set default repo** when operating in one repo: `gh repo set-default owner/repo`.
3. **Use `--json` and `--jq`** for reliable parsing in scripts.
4. **Use `--paginate`** for large lists: `gh issue list --state all --paginate`.
5. **Use `--yes`** to skip confirmations in non-interactive runs.

## Create PR from Issue

```bash
gh issue develop 123 --branch feature/issue-123
# make changes, commit, push
gh pr create --title "Fix #123" --body "Closes #123"
```

## Bulk Operations

```bash
# Close stale issues
gh issue list --search "label:stale" --json number --jq '.[].number' | xargs -I {} gh issue close {} --comment "Closing as stale"

# Add label to PRs
gh pr list --search "review:required" --json number --jq '.[].number' | xargs -I {} gh pr edit {} --add-label needs-review
```

## Repo Setup

```bash
gh repo create my-project --public --description "..." --clone --gitignore node --license mit
cd my-project
gh label create bug --color "d73a4a" --description "Bug report"
```

## CI/CD

```bash
RUN_ID=$(gh workflow run ci.yml --ref main --jq '.databaseId')
gh run watch "$RUN_ID"
gh run download "$RUN_ID" --dir ./artifacts
```

## Fork Sync

```bash
gh repo fork original/repo --clone
cd repo && git remote add upstream https://github.com/original/repo.git
gh repo sync
```

## Help

```bash
gh --help
gh pr --help
gh issue create --help
gh help formatting
gh help exit-codes
```

<!--
Source references:
- https://cli.github.com/manual/
- https://docs.github.com/en/github-cli
- sources/github/skills/gh-cli/SKILL.md
-->
