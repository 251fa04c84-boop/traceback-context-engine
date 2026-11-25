# TraceBack staging deployment and runtime acceptance — no site installation

## Connected staging tenant

The connected non-production Atlassian tenant is **`brand7.atlassian.net`**. The connected production/earlier TraceBack tenant is **`251fa04c84.atlassian.net`** and must never be used for staging acceptance.

A fresh read-only inspection on 25 November 2026 found:

- One visible Jira Software project: **My Kanban Space (KAN)**, ID `10000`.
- Jira reports **zero issues** in KAN; JQL `project = KAN ORDER BY updated DESC` returns no issues.
- KAN exposes six issue types: Epic, Subtask, Task, Story, Feature, and Bug. It has no `Incident` issue type; JQL with `issuetype = Incident` is rejected because that value is not configured.
- Teamwork Graph context for Confluence space **SD** returns four page targets: three templates (product requirements, decision documentation, and meeting notes) and one RAJ execution tracker. None is an incident-linked Jira record.
- The Confluence Graph read is connector-side access only. It does not prove TraceBack's Forge runtime can call `api.asUser().requestTeamworkGraph()`.

## Staging workflow boundary

The manual [Forge staging deploy workflow](https://github.com/251fa04c84-boop/traceback-context-engine/actions/workflows/forge-test-site-deploy.yml) is being hardened to:

- Accept only the maintained `codegeist/forge-foundation` or `codegeist/rovo-integrated` source branches.
- Require an explicit `confirm_staging_deploy` input.
- Run lockfile installation, tests, syntax checks, frontend compilation, and Forge CLI lint.
- Deploy code only to the Forge **staging environment**.

It contains no `forge install`, `forge install --upgrade`, `--site`, `--upgrade`, or `--confirm-scopes` command. It does not install or upgrade the app on any Jira or Confluence site and does not grant scopes. This automation will not dispatch the workflow.

The development workflow is separate and deploys only to Forge **development**, without installing or upgrading the app on a Jira site.

A Jira panel/Rovo runtime test requires an **already-existing** staging app installation. The connected read-only Atlassian operation catalog did not expose an app-installation inventory operation, so the installed app version and effective scope grants could not be independently confirmed. Under the current safety policy, do not install or upgrade an app to fill that gap. If no existing staging installation is present, runtime acceptance remains blocked.

## Static Forge configuration

The manifests on `codegeist/forge-foundation`, `codegeist/rovo-integrated`, and `test/real-panel-rovo-parity-2026-11-21` were compared on 25 November 2026. All three contain the same app ID:

`ari:cloud:ecosystem::app/b7cbb6a8-de78-4ba8-91fb-48733c1c2157`

All three request the same five read-only scopes:

- `read:jira-work`
- `read:graph:issue:jira`
- `read:graph:goal:atlassian`
- `read:graph:deployment:external`
- `read:graph:pull-request:external`

This is manifest evidence only. It is not proof that an administrator granted the scopes to an installed staging app.

## Exact acceptance prerequisites

Do not attempt live panel, Rovo, or MCP acceptance until the staging owner/admin can confirm an existing staging installation and provide:

1. The installed TraceBack app/version and confirmation that the four read-only Graph scopes are already granted. Do not install, upgrade, or approve scopes as part of this automation.
2. One genuine non-production Jira incident key with authentic linked Teamwork Graph evidence (goal, external deployment, or external pull request). Do not create or fabricate records for the demo.
3. Two approved staging test accounts with intentionally different access to at least one linked record.

## Acceptance sequence when prerequisites exist

- Verify the Jira panel against the real incident as the permitted user.
- Invoke the Rovo action on the same issue and compare normalized evidence, timeline, coverage, and source links.
- Verify Graph unavailable, empty, partial, and available states remain distinct.
- Repeat as the restricted user and confirm inaccessible object titles, URLs, and details are not exposed.
- Test external MCP discovery, OAuth consent, and invocation separately; do not claim MCP acceptance from manifest presence alone.
- Record sanitized runtime errors, request correlation IDs when available, exact app version, effective scope state, and the two-user comparison.

Until then, keep all PRs draft and unmerged. No Jira/Confluence data, links, permissions, scopes, site installations, or production environments should be changed to manufacture a green demo.
