---
name: dsh-plugin-ci
description: Identify and wait for GitHub Actions runs on the exact delivered plugin commit, recover failures, and distinguish CI from release.
---

# CI Completion and Recovery

## Identify the expected runs

Read the repository workflows first, including called reusable workflows when their checks or permissions matter. At starter commit `0639209665efa85abd76c02b9565caaf46591809`:

- `ci.yml` (`Unit Test`) runs on `main` pushes and PRs targeting `main`, calling `sxzz/workflows/.github/workflows/unit-test.yml@main`. The inspected reusable workflow checks lint/typecheck and a build/test OS/Node matrix. Read its current version when diagnosing failures; `@main` is mutable.
- `release.yml` (`Release`) runs only on `v*` tag pushes, calls the reusable release workflow with `publish: true`, and grants `contents: write` / `id-token: write`. No release run is expected for an ordinary branch push.

Determine the set of applicable workflows from the actual event, branch and changed-path filters. Do not demand tag-only release jobs for a branch push, and do not mistake a missing expected unit workflow for success.

```text
gh workflow list --repo OWNER/REPO --all
gh run list --repo OWNER/REPO --commit SHA --branch BRANCH --event push --limit 100 --json databaseId,workflowDatabaseId,workflowName,headSha,headBranch,event,status,conclusion,url,attempt
```

For every expected workflow, verify `headSha == SHA`, the intended branch/event and workflow identity. Use the current attempt of the matching run; when duplicate runs exist, identify the latest relevant one, not the first green result. If more than the fetched limit could match, query each workflow or paginate the Actions API rather than assuming the list is complete.

Creation may produce runs for the starter's initial commit. Ignore those when delivering the implementation commit. For PR-only validation, use `gh pr checks PR --repo OWNER/REPO --watch` and inspect each linked run. A `pull_request` run can use a synthetic merge SHA: verify PR number, source head SHA and the tested merge's association through GitHub's run/PR metadata instead of searching only for a push run of the source SHA. If branch or merge changes during verification, revalidate the delivered state.

## Discover, wait, verify

1. Poll for the expected runs at roughly 10-second intervals, up to 5 minutes for **discovery** to tolerate GitHub's queue delay. These bounds limit missing-trigger API polling, not a valid long-running CI job. Empty JSON is neither a pass nor proof that CI is disabled.
2. If no run appears, inspect branch/path filters, Actions enabled/disabled state, workflow syntax, org policy, permissions and any approval request. Investigate before dispatching: the inspected CI has no `workflow_dispatch` trigger. Do not modify permissions, enable Actions or bypass approval automatically when policy prevents it. Report the blocker if authorization is required.
3. Watch **each** applicable run, not just the newest run in the repository:

```text
gh run watch RUN_ID --repo OWNER/REPO --interval 10 --exit-status
gh run view RUN_ID --repo OWNER/REPO --json headSha,event,status,conclusion,jobs,url,attempt
```

4. Require `status: completed`, `conclusion: success`, and success for every required lint/typecheck/build/test job. A skipped optional job may be expected from its condition; a skipped required job needs investigation. Treat failure, cancellation, timeout, action-required, neutral, stale, skipped or pending required checks as not complete.
5. Re-list applicable workflows after watching, verify none are missing or still queued, and check the final delivered remote SHA. Do not rely solely on `gh run watch`'s exit code; inspect the final run/job state even for an already-completed run.

A harness timeout or interrupted watcher does not mean CI failed or succeeded. Save repository, branch, SHA, expected workflows, run IDs/attempts and URLs in the task progress, then resume viewing/watching those same runs. If `gh run watch` rejects a fine-grained PAT (Checks read is not supported there), poll `gh run view` / Actions API with existing authorized access instead; do not request a broader token in chat. Network/API failures are unknown state, never green CI.

## Recover failures

```text
gh run view RUN_ID --repo OWNER/REPO --log-failed
```

- Diagnose the failing job and reproduce the narrowest relevant check locally. Repair the implementation, catalog/lockfile, generated artifacts or workflow root cause; do not delete tests, skip lint or shrink the matrix merely to pass.
- For intended snapshot changes, inspect actual export/package differences before updating snapshots. Rebuild and rerun tests; stale-build guards must remain enabled.
- For code/config defects: fix → local checks → review diff → commit → push → record **new SHA** → discover and watch its complete workflow set. An older repaired run cannot validate a new commit.
- For a verified transient runner/network failure with unchanged code, rerun once using `gh run rerun RUN_ID --repo OWNER/REPO --failed`, then re-watch and verify the incremented attempt. Avoid endless reruns of deterministic failures.
- On missing credentials, npm ownership, policy approval or an unsupported environment, preserve work and state the precise human action required. Never add broad tokens or disable security gates to force completion.

## Optional publication

No tag is needed for ordinary CI delivery. When publication is explicitly authorized, verify normal CI first, then follow the checked-out release script/workflow. The inspected README says a first npm publication must create the package before Trusted Publisher is connected; do not assume a new GitHub repo inherits that connection. Verify package identity/access, first-publish authorization, version/tag and OIDC workflow binding before a publishing action. Afterward verify the Release run, registry version and installability. Label GitHub CI, GitHub release, npm publication and local live-installation independently.

<!--
Source references:
- https://github.com/dsh-tauri/starter-plugin/blob/0639209665efa85abd76c02b9565caaf46591809/.github/workflows/ci.yml
- https://github.com/dsh-tauri/starter-plugin/blob/0639209665efa85abd76c02b9565caaf46591809/.github/workflows/release.yml
- https://github.com/sxzz/workflows/blob/main/.github/workflows/unit-test.yml
- https://cli.github.com/manual/gh_run_list
- https://cli.github.com/manual/gh_run_watch
- https://cli.github.com/manual/gh_run_view
- https://cli.github.com/manual/gh_pr_checks
-->
