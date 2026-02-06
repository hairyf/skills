---
name: features-actions-secrets
description: GitHub CLI for Actions runs, workflows, caches, secrets, and variables.
---

# GitHub Actions (gh run, workflow, cache, secret, variable)

## Workflow Runs (gh run)

```bash
gh run list --workflow "ci.yml" --branch main --limit 20 --json databaseId,status,conclusion,headBranch
gh run view 123456789
gh run view 123456789 --log --web
gh run view 123456789 --job 987654321
gh run watch 123456789 --interval 5
gh run rerun 123456789
gh run rerun 123456789 --job 987654321
gh run cancel 123456789
gh run delete 123456789
gh run download 123456789 --name build --dir ./artifacts
```

## Workflows (gh workflow)

```bash
gh workflow list
gh workflow view ci.yml --yaml --web
gh workflow enable ci.yml
gh workflow disable ci.yml
gh workflow run ci.yml --ref develop
gh workflow run ci.yml --raw-field version="1.0.0" --raw-field environment="production"
```

## Caches (gh cache)

```bash
gh cache list --branch main --limit 50
gh cache delete 123456789
gh cache delete --all
```

## Secrets & Variables (gh secret, gh variable)

```bash
gh secret list
gh secret set MY_SECRET
echo "$MY_SECRET" | gh secret set MY_SECRET
gh secret set MY_SECRET --env production --org orgname
gh secret delete MY_SECRET --env production

gh variable list
gh variable set MY_VAR "some-value" --env production --org orgname
gh variable get MY_VAR
gh variable delete MY_VAR --env production
```

<!--
Source references:
- https://cli.github.com/manual/
- sources/github/skills/gh-cli/SKILL.md
-->
