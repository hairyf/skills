---
name: core-cli-structure
description: Full GitHub CLI (gh) command tree for discovery and navigation.
---

# CLI Structure

Complete `gh` command hierarchy. Use for finding the right subcommand.

```
gh
├── auth          login, logout, refresh, setup-git, status, switch, token
├── browse        Open repo/path/issue/PR/commit in browser
├── codespace     code, cp, create, delete, edit, jupyter, list, logs, ports, rebuild, ssh, stop, view
├── gist          clone, create, delete, edit, list, rename, view
├── issue         create, list, status, close, comment, delete, develop, edit, lock, pin, reopen, transfer, unlock, view
├── org           list
├── pr            create, list, status, checkout, checks, close, comment, diff, edit, lock, merge, ready, reopen, revert, review, unlock, update-branch, view
├── project       close, copy, create, delete, edit, field-create, field-delete, field-list, item-add, item-archive, item-create, item-delete, item-edit, item-list, link, list, mark-template, unlink, view
├── release       create, list, delete, delete-asset, download, edit, upload, verify, verify-asset, view
├── repo          create, list, archive, autolink, clone, delete, deploy-key, edit, fork, gitignore, license, rename, set-default, sync, unarchive, view
├── cache         delete, list
├── run           cancel, delete, download, list, rerun, view, watch
├── workflow      disable, enable, list, run, view
├── agent-task    (agent tasks)
├── alias         delete, import, list, set
├── api           Raw GitHub API/GraphQL
├── attestation   download, trusted-root, verify
├── completion    Shell completion
├── config        clear-cache, get, list, set
├── extension     browse, create, exec, install, list, remove, search, upgrade
├── gpg-key       add, delete, list
├── label         clone, create, delete, edit, list
├── preview       Preview features
├── ruleset       check, list, view
├── search        code, commits, issues, prs, repos
├── secret        delete, list, set
├── ssh-key       add, delete, list
├── status        Overview
└── variable      delete, get, list, set
```

Use `gh <command> --help` or `gh help <topic>` for details.

<!--
Source references:
- https://cli.github.com/manual/
- sources/github/skills/gh-cli/SKILL.md
-->
