---
name: features-projects-releases-gists
description: GitHub CLI for Projects, Releases, Gists, Codespaces, and Organizations.
---

# Projects, Releases, Gists, Codespaces & Orgs

## Projects (gh project)

```bash
gh project list --owner owner --open
gh project view 123 --format json
gh project view 123 --web
gh project create --title "My Project" --org orgname --readme "Description"
gh project edit 123 --title "New Title"
gh project delete 123
gh project close 123
gh project copy 123 --owner target-owner --title "Copy"
gh project mark-template 123

gh project field-list 123
gh project field-create 123 --title "Status" --datatype single_select
gh project field-delete 123 --id 456

gh project item-list 123
gh project item-create 123 --title "New item"
gh project item-add 123 --owner owner --repo repo --issue 456
gh project item-edit 123 --id 456 --title "Updated title"
gh project item-delete 123 --id 456
gh project item-archive 123 --id 456

gh project link 123 --id 456 --link-id 789
gh project unlink 123 --id 456 --link-id 789
```

## Releases (gh release)

```bash
gh release list
gh release view
gh release view v1.0.0 --web
gh release create v1.0.0 --notes "..." --target main --draft --prerelease --title "Version 1.0.0"
gh release create v1.0.0 --notes-file notes.md
gh release upload v1.0.0 ./file.tar.gz ./file2.tar.gz
gh release upload v1.0.0 ./file.tar.gz --casing
gh release download v1.0.0 --pattern "*.tar.gz" --dir ./downloads
gh release download v1.0.0 --archive zip
gh release delete v1.0.0 --yes
gh release delete-asset v1.0.0 file.tar.gz
gh release edit v1.0.0 --notes "Updated"
gh release verify v1.0.0
gh release verify-asset v1.0.0 file.tar.gz
```

## Gists (gh gist)

```bash
gh gist list --limit 20 --public
gh gist view abc123 --files
gh gist create script.py --desc "My script" --public
gh gist create file1.py file2.py
echo "print('hello')" | gh gist create
gh gist edit abc123
gh gist rename abc123 --filename old.py new.py
gh gist delete abc123
gh gist clone abc123
gh gist clone abc123 my-directory
```

## Codespaces (gh codespace)

```bash
gh codespace list
gh codespace create --repo owner/repo --branch develop --machine premiumLinux
gh codespace view
gh codespace ssh
gh codespace ssh --command "cd /workspaces && ls"
gh codespace code
gh codespace code --codec
gh codespace code --path /workspaces/repo
gh codespace stop
gh codespace delete
gh codespace logs --tail 100
gh codespace ports
gh codespace cp 8080:8080
gh codespace cp file.txt :/workspaces/file.txt
gh codespace rebuild
gh codespace edit --machine standardLinux
gh codespace jupyter
```

## Organizations (gh org)

```bash
gh org list
gh org list --user username
gh org view orgname
gh org view orgname --json members --jq '.members[] | .login'
```

<!--
Source references:
- https://cli.github.com/manual/
- sources/github/skills/gh-cli/SKILL.md
-->
