---
name: dsh-plugin-creator
description: Create DeepSeek Harness (DSH) plugins end to end from dsh-tauri/starter-plugin. Use when the user asks to create a DSH/dsh-tauri plugin, turn an idea into a Harness extension, or 创建 DSH 插件、从模板建仓、实现插件并推送等待 CI. Covers GitHub repository creation, host/client implementation, local validation, commit/push, and waiting for CI on the exact delivered commit. Do not stop at scaffolding or pushing; distinguish successful CI from npm publication.
compatibility: Requires git, authenticated GitHub CLI (gh), Node.js and the template's pnpm version; network access to GitHub and the package registry.
metadata:
  author: Hairy
  version: "2026.10.12"
  source: https://github.com/dsh-tauri/starter-plugin
---

# DSH Plugin Creator

Deliver the requested plugin, not a renamed starter. Use the upstream template and native `git` / `gh` commands; no custom scaffolder or CI service is needed.

## Completion contract

Before editing, turn the user's idea into observable acceptance criteria and track this checklist:

- [ ] Resolve feature, repository identity and destination.
- [ ] Create a repository from `dsh-tauri/starter-plugin` and inspect its contracts.
- [ ] Implement the feature across the actual host/client data flow.
- [ ] Pass local checks and inspect the complete diff.
- [ ] Commit and push to the intended repository.
- [ ] Wait for all applicable CI workflows on the delivered commit to succeed.
- [ ] Return repository, commit, CI links and verification/installation status.

A successful push, an empty run list, an older green run or a skipped job is not completion. If authentication, policy, environment or CI prevents completion, report the exact blocker and resume point instead of claiming success. Honor explicit local-only, no-push or no-publish instructions.

## 1. Resolve inputs and preflight

- Extract the plugin behavior, UI/agent entry point, settings/storage requirements and acceptance criteria. Ask only for missing information that changes behavior or authority; do not invent an unspecified feature.
- Use the supplied GitHub owner/repository and local directory. Otherwise use the authenticated account, derive a descriptive kebab-case repository name such as `dsh-plugin-session-notes`, and choose a new sibling directory rather than editing the current unrelated project. Default visibility to **private**, announce it, and honor explicit public/private choices. Use the repository basename as the package name unless the user supplies a valid scoped/unscoped package name.
- Validate owner/repository and package names as data, quote arguments, reject path traversal and resolve the destination before writing. Check for an existing remote repository and local directory. A failed lookup can mean lack of access, not nonexistence. Never overwrite, delete or reuse an existing repository without checking its identity and user intent.
- Verify `pwd`, `git --version`, `gh --version`, `gh auth status`, Node.js and pnpm. Use `gh api user --jq .login` for the default owner. Confirm org creation rights when an org is requested.
- If login is missing, use `gh auth login` through the supported interactive/secure flow, then recheck. Never request tokens in chat or print credentials. On an unavailable login flow, stop before remote writes.
- Read current template metadata/default branch and record its source SHA; do not assume cached examples match upstream.

```text
gh repo view dsh-tauri/starter-plugin --json nameWithOwner,defaultBranchRef,url
gh api repos/dsh-tauri/starter-plugin/commits/HEAD --jq .sha
gh repo create OWNER/REPO --template dsh-tauri/starter-plugin --private --description "PLUGIN_DESCRIPTION"
gh repo clone OWNER/REPO "ABSOLUTE_DESTINATION"
```

These are command templates: substitute validated values and the chosen visibility; run each separately and check its exit code. Run creation outside an unrelated repository. If creation succeeds but cloning fails, recover by cloning that same repository, not by creating another one.

## 2. Inspect and adapt the starter

In the new checkout, verify `git remote -v`, GitHub identity and branch, then read `AGENTS.md`, `package.json`, `pnpm-workspace.yaml`, `cordis.patch.yml`, `tsdown.config.ts`, both source entries, tests and `.github/workflows/*`. Read any nested instructions before editing. Follow the checked-out contracts if upstream has changed.

The inspected starter uses:

| Contract | Preserve/adapt |
| --- | --- |
| Host entry `src/index.ts` | Cordis `apply`; host capabilities, tools, routes and context belong here. |
| Client entry `src/client/index.ts` | `apply(ctx: ClientContext)` for UI behavior. |
| Package exports | `.` → `dist/index.js`, `./client` → `dist/client.js`, types → `dist/index.d.ts`. |
| `dsh.client.inject` / `platform` | Required client services and `web`; extend only for services actually used. |
| `dsh.bundle.patch` | Points to `cordis.patch.yml`; its plugin name resolves the package and its ID must be unique. |
| Client build | Classic script wrapped in `window.__ModuleLoader__.load`, CJS factory; not a standalone ESM/browser app. |
| Host build | ESM + declarations; keep React and `@deepseek-ai/*` external as configured. |

Replace `pkg-placeholder` and `_description_` in authored package metadata, patch, docs, badges and relevant test expectations. Set repository/homepage/bugs URLs to the new owner/repository, preserve license attribution, and remove misleading inherited badges. Search tracked files for leftover placeholders and starter owner URLs; inspect matches rather than blindly replacing lockfiles, licenses or generated output. Rebuild tracked `dist` rather than hand-editing it. The client module ID is derived from the package name; patch and package identity must agree.

Install with the package manager/version declared by the template and its catalog/lockfile. Do not silently downgrade it to the workspace's version. Investigate install/hook failures rather than disabling safeguards to obtain a green check.

## 3. Implement the requested plugin

- Read the installed DSH packages' `.d.ts` and relevant examples before using an API, Slot, service, tool registration or HTTP route. Do not fabricate an SDK call. Use public APIs first; if unavailable, explain the limitation before choosing a guarded DOM fallback based on stable roles/aria labels, not hashed CSS classes.
- Trace input → state → validation → payload → host/API → storage → response/UI for each acceptance criterion. Keep filesystem, Git, processes and secrets in the host half; validate request methods, origin, permissions and external data at trust boundaries. Pure client features need no dummy host route.
- Preserve template conventions: strict TypeScript, ESM host, relative imports, shared types/constants in their designated files when used across files, catalog-managed dependencies and existing UI primitives. Add DOM/JSX compiler support only when the feature needs it.
- Manage styles, subscriptions, observers, timers and pending async work through `ctx.effect()` with complete disposers. Use plugin-scoped styles and stable Slot IDs, provide graceful error/empty/loading states and accessible controls. Reload/disposal must not duplicate UI or retain listeners.
- Reuse existing services, components and dependencies. Add only the minimum runnable feature check; API snapshots alone do not demonstrate behavior. For new exports/package renames, inspect snapshot diffs and regenerate intentional expectations, not failures caused by a broken implementation.
- Update the new repository's README with actual behavior, configuration and honest installation instructions. Build-only or local validation is not proof that the installed DSH UI works. Do not modify the Harness checkout or install the plugin into the user's app unless requested.

For optional live verification, use the existing DSH URL. Verify both the plugin watcher and the same checkout's `pnpm run dev:web` watcher before promising HMR; otherwise rebuild affected artifacts and refresh. A standalone Vite server lacks the DSH boot context and is not a substitute for testing the running GUI.

## 4. Validate, commit and push

Use the checked-out scripts/instructions. At the inspected starter revision:

```text
pnpm install --frozen-lockfile
pnpm run lint --fix
pnpm run typecheck
pnpm run test -- --run
pnpm run build
git diff --check
git status --short
```

Check each result; after any fix rerun the affected checks. Inspect source, tests, lockfile and generated output changes, then stage only intended files. Check the staged diff for credentials, unrelated files, stale artifacts and test weakening before committing. Do not use `git add .` in a dirty/reused checkout.

Read CI triggers before choosing the push branch. The inspected template runs unit CI on pushes to `main` and PRs targeting `main`. If the created default branch differs, align that trigger to the real default branch without removing checks. For an existing protected repository use a feature branch + PR instead of force-pushing or changing branch protection.

```text
git commit -m "feat: implement PLUGIN_FEATURE"
git push -u origin BRANCH
git rev-parse HEAD
```

Verify origin is the requested new repository, not the starter or inherited upstream. Record the pushed SHA and confirm the remote branch points to it. If push fails, resolve authentication/branch divergence without overwriting user work; no force push. Do not tag, run the release script or publish npm by default.

## 5. Wait for CI and hand off

Read [CI completion and recovery](references/core-ci.md) before monitoring. Bind every run to the delivered SHA, branch/event and applicable workflow; watch it with `gh run watch --exit-status`, inspect final job conclusions, fix genuine failures, and repeat for any new commit. Keep waiting until every applicable workflow succeeds or a concrete blocker is established. Use managed background jobs/persisted goals when the harness supports them; do not detach an untracked wait process and claim completion.

The template's `Release` workflow is tag-triggered npm publication, **not ordinary branch CI**. CI success does not mean the package is published. If the user explicitly asks for release, read the current release workflow and README, confirm version/tag and npm authorization/Trusted Publisher prerequisites, then verify the release run and published package separately. Do not create an npm package or configure credentials without that authority.

Report concisely:

- Implemented behavior and acceptance checks (including any unverified runtime behavior).
- Repository URL, local checkout, branch and final commit SHA/link.
- Local commands/results and links/conclusions for all applicable CI runs on that SHA.
- How to use/install the actual artifact; npm publication or live installation status only if verified.
- On blockage: failing step/run/job, diagnostic evidence, and the exact next action needed.

<!--
Source references:
- https://github.com/dsh-tauri/starter-plugin
- https://cli.github.com/manual/gh_repo_create
- https://cli.github.com/manual/gh_run_watch
- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
-->
