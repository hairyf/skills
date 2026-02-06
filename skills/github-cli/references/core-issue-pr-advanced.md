---
name: core-issue-pr-advanced
description: Advanced issue and PR operations — status, pin, lock, transfer, delete, review types, merge options.
---

# Issues & PRs — Advanced

## Issue status, pin, lock, transfer, delete

```bash
gh issue status
gh issue status --repo owner/repo

gh issue pin 123
gh issue unpin 123

gh issue lock 123
gh issue lock 123 --reason off-topic
gh issue unlock 123

gh issue transfer 123 --repo owner/new-repo
gh issue delete 123 --yes
```

## Issue comment edit/delete

```bash
gh issue comment 123 --edit 456789 --body "Updated comment"
gh issue comment 123 --delete 456789
```

## Issue create/list options

```bash
gh issue create --body-file issue.md --web
gh issue list --milestone "v1.0" --search "is:open is:issue label:bug" --sort created --order desc
gh issue edit 123 --milestone "v1.0"
```

## PR status, ready, close, reopen

```bash
gh pr status
gh pr ready 123
gh pr close 123 --comment "Closing due to..."
gh pr reopen 123
```

## PR merge options

```bash
gh pr merge 123 --merge
gh pr merge 123 --rebase
gh pr merge 123 --subject "Merge PR #123" --body "Merging feature"
gh pr merge 123 --delete-branch
gh pr merge 123 --admin
```

## PR checks, diff options

```bash
gh pr checks 123 --watch --interval 5
gh pr diff 123 --color always
gh pr diff 123 --name-only
gh pr diff 123 > pr-123.patch
```

## PR comment (line, edit, delete)

```bash
gh pr comment 123 --body "Fix this" --head-owner owner --head-branch feature
gh pr comment 123 --edit 456789 --body "Updated"
gh pr comment 123 --delete 456789
```

## PR review (request changes, comment, dismiss)

```bash
gh pr review 123 --request-changes --body "Please fix these issues"
gh pr review 123 --comment --body "Some thoughts..."
gh pr review 123 --dismiss
```

## PR update-branch, lock/unlock, revert

```bash
gh pr update-branch 123 --force
gh pr update-branch 123 --merge
gh pr lock 123 --reason off-topic
gh pr unlock 123
gh pr revert 123 --branch revert-pr-123
```

## PR create/view/list options

```bash
gh pr create --body-file .github/PULL_REQUEST_TEMPLATE.md --issue 123 --web
gh pr view 123 --json files --jq '.files[].path'
gh pr list --state merged --head feature-branch --base main --sort created --order desc
gh pr list --json number,title,statusCheckRollup --jq '.[] | [.number, .title, .statusCheckRollup[]?.status]'
```

<!--
Source references:
- https://cli.github.com/manual/
- sources/github/skills/gh-cli/SKILL.md
-->
