---
name: core-repo-extras
description: Repository autolinks, deploy keys, gitignore/license templates, rename, archive.
---

# Repository Extras (gh repo)

## Create options (additional flags)

```bash
gh repo create my-repo --homepage https://example.com
gh repo create my-repo --template
gh repo create org/my-repo
gh repo create my-repo --source=.
gh repo create my-repo --disable-issues --disable-wiki
gh repo clone owner/repo my-dir --branch develop
```

## Edit, rename, archive

```bash
gh repo edit --default-branch main
gh repo rename new-name
gh repo archive
gh repo unarchive
```

## Autolinks

```bash
gh repo autolink list
gh repo autolink add --key-prefix JIRA- --url-template "https://jira.example.com/browse/<num>"
gh repo autolink delete 12345
```

## Deploy keys

```bash
gh repo deploy-key list
gh repo deploy-key add ~/.ssh/id_rsa.pub --title "Production server" --read-only
gh repo deploy-key delete 12345
```

## Gitignore & license templates

```bash
gh repo gitignore
gh repo license mit
gh repo license mit --fullname "John Doe"
```

## List options

```bash
gh repo list owner --public --source --limit 50
gh repo view owner/repo --web
```

<!--
Source references:
- https://cli.github.com/manual/
- sources/github/skills/gh-cli/SKILL.md
-->
