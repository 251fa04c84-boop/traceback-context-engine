# TraceBack staging readiness — 21 November 2026

## Verified site state

The connected Atlassian site previously identified for staging is `brand7.atlassian.net`. A read-only inspection on 21 November 2026 returned one visible Jira project:

- Project: My Kanban Space
- Key: `KAN`
- Project ID: `10000`
- Issue count reported by Jira: `0`

A project search returned no other visible projects. A JQL attempt using the previously mentioned keys `TCE`, `DEMO`, and `TSD` was rejected because those keys do not exist on this site. Do not treat issue keys from another Atlassian site as staging data.

## Consequence

The site is reachable, but it currently contains no Jira issue suitable for a genuine incident acceptance test. This does not establish that the Forge candidate is installed there, that Teamwork Graph scopes are enabled, or that Rovo/MCP are configured.

No Jira issue, project, Confluence page, relationship, or other test record was created. No scopes were approved. No app was installed or upgraded. No production site was accessed for staging acceptance.

## Next safe acceptance path

1. Have the staging administrator populate or identify an existing, authentic incident in an authorized non-production site, with real linked Teamwork Graph records. Do not manufacture relationships or use fixtures in the public demo.
2. Identify two approved test users: one who can view the linked records and one who is deliberately restricted from at least one record.
3. Confirm the app candidate SHA and installed Forge version before testing.
4. Run the same incident through the Jira panel, Rovo action, and external MCP client. Record the same source IDs, timestamps, leads, timeline, and coverage states for each user.
5. Verify that the restricted user receives no inaccessible record details, titles, or URLs. Check that Jira evidence remains usable when Graph access is denied.
6. Record administrator scope enablement and OAuth consent as explicit setup steps. Do not approve production scopes.
7. Capture sanitized logs and screenshots only after actual invocations. Do not substitute mock data or claim that a skipped test passed.

## Candidate and CI evidence

- PR #23: https://github.com/251fa04c84-boop/traceback-context-engine/pull/23
- PR #23 exact head: `3c2760c41ac31bc317036f43c66c58d829e12ea7`
- PR #23 CI: https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44920415294
- PR #23 CI result: 4,192 tests passed; 0 failed; 0 skipped. Forge CLI validation and deployment were skipped.
- PR #24: https://github.com/251fa04c84-boop/traceback-context-engine/pull/24
- PR #24 docs commit: `efb75a2fd8296263e488410823f1356b5dbf4ff5`
- PR #24 CI: https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44921310022
- PR #24 CI result: 4,192 tests passed; 0 failed; 0 skipped. This validates the code snapshot plus documentation commit; it is not a live Forge/Rovo/MCP acceptance result.

## Strategic judge position

Primary grand-prize category remains **Apps for Software Teams**. The preferred bonus target remains **Best Teamwork Graph**, but only after authentic linked records are retrieved in the installed Rovo path and the permission tests pass. Best Agents and Best Atlassian MCP remain conditional opportunities requiring real discovery and invocation evidence.

Until those gates pass, the demo must label Rovo/MCP as unverified or show the honest Jira-only fallback with Graph marked unavailable/partial. Do not claim bonus eligibility, runtime integration success, or root-cause detection from temporal proximity.


## Follow-up connector-side Teamwork Graph read — 22 November 2026

A fresh read-only check through the connected Atlassian account confirmed:

- The accessible-resources call still returns only `brand7.atlassian.net`.
- Jira project inventory still contains only `KAN` (My Kanban Space, ID `10000`), with `totalIssueCount: 0`.
- The Confluence `SD` space is readable through Teamwork Graph. A `getGraphContext` request for that space returned the `space_has_documents` relationship with four Confluence page targets and no further page of results.
- The connector therefore has **some Teamwork Graph read access** on this tenant. This is connector-side access only; it does not prove that the Forge app's `api.asUser().requestTeamworkGraph()` call has effective scopes or works in an installed app runtime.
- No genuine Jira incident or linked goal, external deployment, or pull-request record is available for TraceBack acceptance. No two-user permission comparison can be run without approved test accounts.

The latest PR #24 exact-head CI run [#44922332097](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44922332097) completed successfully on `66a62fb2660aad58746863adf17c818c7d4012eb`: 4,192 tests passed, 0 failed, 0 skipped; committed-lockfile installation, ProseMirror dependency-tree validation, audit reporting, syntax checks, and frontend compilation completed. The audit reported six moderate findings and zero high/critical findings on this candidate. Forge CLI validation and development deployment were skipped because this was a pull-request event.

No Jira or Confluence data, links, permissions, or scopes were changed. No app was deployed, installed, or upgraded. The Forge runtime, Rovo action, external MCP invocation, and two-user permission boundary remain unverified.

**Remaining external prerequisite:** the staging owner/admin must make one genuine non-production Jira incident with authentic linked Teamwork Graph records and two approved test users available, and separately confirm the four read-only Graph scopes for the staging installation. Do not use production data or fabricate linked records.


## Follow-up verification — 22 November 2026 (PR #24 candidate)

Candidate branch: `docs/codegeist-judge-package-2026-11-21`  
Candidate head: `80dd8c6f3b07dbb77706cd2a8302d4c8e797e396`  
PR: https://github.com/251fa04c84-boop/traceback-context-engine/pull/24

### Exact-head CI

Workflow [#44981401866](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44981401866) completed successfully with `head_sha` equal to the candidate head above.

The actual job log confirms:
- Committed-lockfile `npm ci`: passed.
- ProseMirror dependency-tree validation: passed; resolved `prosemirror-view@1.42.9`.
- `npm test`: **4,193 passed, 0 failed, 0 skipped**, including the new Rovo Graph-unavailable fallback regression.
- `npm run lint:syntax`: passed.
- `npm run lint:frontend`: passed.
- Candidate dependency audit: **0 high, 6 moderate, 0 critical**.
- Forge CLI validation and development deployment: skipped by pull-request event conditions.

This is exact PR-head CI, not Forge installation or live runtime acceptance.

### Rovo failure-mode regression

The new test in `test/rovo-investigation-action.test.js` verifies that when the Teamwork Graph service returns an explicit unavailable state during a Rovo action:
- the Jira issue is still returned;
- the action does not use app-level authorization;
- no Graph records are fabricated;
- the unavailable status and warning remain visible;
- timeline and evidence coverage consume the unavailable state.

This verifies the fallback contract under a controlled test. It does not prove a live Rovo action can query Teamwork Graph successfully.

### Staging recheck boundary

The latest read-only connector-side inspection of `brand7.atlassian.net` still found Jira project `KAN` with zero issues. Confluence space `SD` returned four page targets through the connected Teamwork Graph connector. This is not Forge-app runtime evidence. No real Jira incident or linked Graph deployment/pull-request/goal data is available for acceptance, and no permitted/restricted user pair has been supplied.

### Current decision

PR #24 remains open, draft and unmerged. The six moderate dependency findings remain open; no forced major override or vulnerability waiver was applied. Forge runtime, Rovo invocation, external MCP OAuth/tool invocation, and two-user permission isolation remain unverified. No app installation/upgrade, scope approval, Jira/Confluence mutation, or production action was performed.

### Minimum staging-owner prerequisite

The staging owner must identify one genuine non-production Jira incident with authentic linked Teamwork Graph records, provide two approved test users with different access to at least one linked record, and confirm the four declared read-only Graph scopes for the staging installation. Do not manufacture incident data or use production.
