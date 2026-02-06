---
name: features-search-api-misc
description: GitHub CLI search, labels, SSH/GPG keys, API, aliases, extensions, rulesets.
---

# Search, Labels, Keys, API & Misc

## Search (gh search)

```bash
gh search code "TODO" --repo owner/repo --extension py
gh search commits "fix bug"
gh search issues "label:bug state:open"
gh search prs "is:open is:pr review:required" --web
gh search repos "stars:>1000 language:python" --limit 50 --json name,description,stargazers --order desc --sort stars
```

## Labels (gh label)

```bash
gh label list
gh label create bug --color "d73a4a" --description "Something isn't working"
gh label edit bug --name "bug-report"
gh label clone owner/repo --repo target/repo
```

## SSH & GPG Keys (gh ssh-key, gh gpg-key)

```bash
gh ssh-key list
gh ssh-key add ~/.ssh/id_ed25519.pub --title "My laptop" --type "authentication"
gh ssh-key delete 12345
gh ssh-key delete --title "My laptop"

gh gpg-key list
gh gpg-key add ~/.ssh/public.asc
gh gpg-key delete 12345
gh gpg-key delete ABCD1234
```

## API (gh api)

```bash
gh api /user
gh api /user --raw --include --silent
gh api --method POST /repos/owner/repo/issues --field title="..." --field body="..."
gh api --input request.json
gh api /user/repos --paginate
gh api /user --jq '.login'
gh api /repos/owner/repo --jq '.stargazers_count'
gh api --hostname enterprise.internal /user
gh api graphql -f query='{ viewer { login repositories(first: 5) { nodes { name } } } }'
gh api /user --cache force
```

## Aliases & Extensions (gh alias, gh extension)

```bash
gh alias list
gh alias set prview 'pr view --web'
gh alias set co 'pr checkout' --shell
gh alias delete prview
gh alias import ./aliases.sh

gh extension list
gh extension search github
gh extension install owner/extension-repo --branch develop
gh extension upgrade extension-name
gh extension remove extension-name
gh extension browse
gh extension create my-extension
gh extension exec my-extension --arg value
```

## Rulesets & Attestation (gh ruleset, gh attestation)

```bash
gh ruleset list
gh ruleset view 123
gh ruleset check --branch feature --repo owner/repo

gh attestation download owner/repo --artifact-id 123456
gh attestation verify owner/repo
gh attestation trusted-root
```

## Completion & Status

```bash
gh completion -s zsh
gh status
```

<!--
Source references:
- https://cli.github.com/manual/
- sources/github/skills/gh-cli/SKILL.md
-->
