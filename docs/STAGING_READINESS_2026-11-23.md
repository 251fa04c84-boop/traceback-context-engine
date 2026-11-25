# TraceBack staging readiness — 25 November 2026

## Current read-only tenant evidence

Connected non-production tenant: `brand7.atlassian.net`.

- Jira project inventory returns exactly one visible project: **My Kanban Space (KAN)**, ID `10000`.
- Project insight reports `totalIssueCount: 0`; JQL `project = KAN ORDER BY updated DESC` returns no issues.
- Project issue-type metadata returns six types: Epic (`10001`), Subtask (`10002`), Task (`10003`), Story (`10004`), Feature (`10005`), and Bug (`10006`). No Incident type is configured. A JQL search using `issuetype = Incident` was rejected as an unknown value.
- Teamwork Graph context for Confluence space SD resolves to `ari:cloud:confluence:f3a80fda-b810-47e6-806b-ba68cca6507a:space/262148` and returns four page targets: three templates and one RAJ execution tracker. There is no incident-linked Jira evidence among these targets.
- A JiraSpace Graph lookup using project key `KAN` does not resolve to an ARI. Do not infer from this failed lookup that all Graph access is unavailable; the Confluence-space Graph read succeeds.
- The connector-side Graph read is not Forge runtime evidence.

The connected production/earlier TraceBack tenant `251fa04c84.atlassian.net` was not queried and must not be used for staging acceptance.

## Static Forge manifest comparison

On 25 November 2026, `manifest.yml` was read from:

- `codegeist/forge-foundation` (blob `3eb1ea5022b07f578e7244e3d7fb76ea4a9a1ba4`)
- `codegeist/rovo-integrated` (blob `104f3864e0cd5611bc0c37e36061d7dc2f6f7425`)
- `test/real-panel-rovo-parity-2026-11-21` (blob `8d49460a295a3d2aea72b34dee07089feb044edb`)

All three contain app ID `ari:cloud:ecosystem::app/b7cbb6a8-de78-4ba8-91fb-48733c1c2157` and the same five read-only scopes:

- `read:jira-work`
- `read:graph:issue:jira`
- `read:graph:goal:atlassian`
- `read:graph:deployment:external`
- `read:graph:pull-request:external`

Static manifest configuration does not prove effective scope approval or runtime access.

## Latest verified CI and security evidence

### PR #24 — Codegeist judge package

- PR: https://github.com/251fa04c84-boop/traceback-context-engine/pull/24
- Exact head: `e19372aefa9b59a170fb0f52f633726aa3de6128`
- Exact-head CI: https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/45320387074
- GitHub reports the run completed successfully on that exact head.
- Actual job log confirms: committed-lockfile `npm ci`, ProseMirror dependency-tree validation, `npm test` (**4,193 passed, 0 failed, 0 skipped**), `npm run lint:syntax`, and `npm run lint:frontend` all completed successfully.
- The same audit log reports **6 moderate, 0 high, 0 critical** vulnerabilities. Resolved `prosemirror-view` is `1.42.9`.
- Forge CLI lint and development deployment were skipped by pull-request conditions. This is not live Forge, Jira panel, Rovo, Teamwork Graph, or MCP acceptance.

### PR #25 — deployment safety

- PR: https://github.com/251fa04c84-boop/traceback-context-engine/pull/25
- Previous exact-head safety run: https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/45105021628
- The actual job log confirms the earlier deployment-safety script passed. This run predates the current deploy-only staging-workflow hardening; the new commit must receive its own CI result before the updated check is called passed.

The GitHub connector did not expose a Dependabot/code-scanning alert listing operation in this run. The six moderate findings above are from the exact-head npm audit log; do not treat them as a complete GitHub security-alert inventory. Do not use `npm audit fix --force`, major Forge downgrades, or incompatible transitive overrides.

## Deployment safety and branch status

- The PR #25 branch removes the Jira site install/upgrade path from the Forge development workflow.
- This update changes the staging workflow to a manual, explicitly confirmed **Forge staging environment deployment only**. It has no Jira site target and no app install/upgrade command.
- The safety script now asserts that neither development nor staging workflow can install/upgrade an app, target a Jira site, or auto-consent to scopes.
- PR #25 remains open and draft. Its changes are not on default `main`.
- **Important default-branch risk:** the current `main` version of `.github/workflows/forge-dev-deploy.yml` still contains a manual `forge install` / `forge install --upgrade` path targeting `251fa04c84.atlassian.net`. Do not dispatch that default-branch workflow. PR #25 must remain unmerged under the current instruction, so this branch-level mitigation does not yet change `main`.

## Release blockers

1. KAN has no Jira issue and no Incident issue type, so there is no genuine staging incident for acceptance.
2. No incident-linked goal, external deployment, or external pull request is available.
3. The current read-only Atlassian operation catalog does not expose Forge installation/version/effective-scope inventory. The staging administrator must confirm whether the intended app is already installed and which scopes are already granted. No installation or scope approval will be performed by this automation.
4. No permitted/restricted test-user pair is available.
5. Live Jira panel, Rovo invocation, Forge Teamwork Graph retrieval, external MCP OAuth/invocation, and judge-demo evidence remain unverified.

**Minimum staging-owner handoff:** confirm an already-existing TraceBack staging installation with the four read-only Graph scopes already granted, and provide one genuine non-production incident with authentic linked Graph evidence plus two approved users with different access to at least one linked record. Do not create data, install/upgrade the app, approve scopes, or use production to satisfy this gate.
