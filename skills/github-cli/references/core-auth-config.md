---
name: core-auth-config
description: GitHub CLI authentication, configuration, environment variables, browse, and output formatting.
---

# Authentication, Config & Output

## Authentication (gh auth)

```bash
gh auth login
gh auth login --web --clipboard --git-protocol ssh
gh auth login --hostname enterprise.internal
gh auth login --with-token < mytoken.txt
gh auth login --insecure-storage

gh auth status
gh auth status --active --hostname github.com
gh auth status --show-token
gh auth status --json hosts --jq '.hosts | add'

gh auth switch
gh auth switch --hostname github.com --user monalisa
gh auth logout --hostname github.com --user username

gh auth token
gh auth token --hostname github.com --user monalisa

gh auth refresh --scopes write:org,read:public_key
gh auth refresh --remove-scopes delete_repo --reset-scopes --clipboard

gh auth setup-git
gh auth setup-git --hostname enterprise.internal --force
```

## Configuration

```bash
gh config list
gh config get editor
gh config set editor vim
gh config set git_protocol ssh
gh config set prompt disabled
gh config set pager "less -R"
gh config clear-cache
```

## Environment Variables

- `GH_TOKEN` — token for automation
- `GH_HOST` — hostname (default github.com)
- `GH_PROMPT_DISABLED=true` — non-interactive
- `GH_EDITOR`, `GH_PAGER`, `GH_TIMEOUT`
- `GH_REPO=owner/repo` — default repo
- `GH_ENTERPRISE_HOSTNAME` — enterprise hostname

## Browse

```bash
gh browse
gh browse script/
gh browse main.go:312
gh browse 123
gh browse 77507cd94ccafcf568f8560cfecde965fcfa63
gh browse main.go --branch bug-fix
gh browse --repo owner/repo
gh browse --actions --projects --releases --settings --wiki
gh browse --no-browser
```

## Global Flags

| Flag | Description |
|------|-------------|
| `--repo [HOST/]OWNER/REPO` | Select repository |
| `--hostname HOST` | GitHub hostname |
| `--jq EXPRESSION` | Filter JSON |
| `--json FIELDS` | JSON output |
| `--template STRING` | Go template format |
| `--web` | Open in browser |
| `--paginate` | Paginate API |
| `--verbose`, `--debug` | Verbosity |
| `--timeout SECONDS` | API request timeout |
| `--cache CACHE` | Cache control (default, force, bypass) |

## JSON & Template Output

```bash
gh repo view --json name,description
gh pr list --json number,title --jq '.[] | select(.number > 100)'
gh repo view --template '{{.name}}: {{.description}}'
```

<!--
Source references:
- https://cli.github.com/manual/
- sources/github/skills/gh-cli/SKILL.md
-->
