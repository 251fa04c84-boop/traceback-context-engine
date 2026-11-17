# Live runtime acceptance — 17 November 2026

## Deployment and CI evidence

- Branch: `codegeist/forge-foundation`
- Development-only deployment workflow: [GitHub Actions run #312](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44018706814)
- Run #312 completed successfully. All 11 steps passed, including `npm ci`, dependency audit reporting, `npm test`, syntax checks, frontend compilation, Forge CLI validation, and **Deploy and upgrade the development installation**.
- PR validation run [#313](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44018714861) completed successfully. Its deploy step was correctly skipped because the event was a pull request.
- The deploy workflow is scoped to the development environment and exact project branch; it does not deploy production.

## Live Jira panel retest

Browser acceptance was performed after run #312 using the existing saved browser profile on:

- Jira issue: [DEMO-9](https://251fa04c84.atlassian.net/browse/DEMO-9)
- Summary: `[TraceBack TEST] Temporary issue-context panel acceptance check`
- Status: Open
- Priority: Low
- Browser automation run: `ee51e8ca-b39d-4f58-b688-c09b2d380b5e`

**Result: Pass — the panel loaded and rendered its sections.** The previously reproducible `Resolver is not a constructor` runtime error was absent. This confirms the resolver constructor normalization fix works in the deployed development installation.

### Evidence shown by the live panel

| Area | Live result | Interpretation |
| --- | --- | --- |
| Jira issue context | Loaded | The resolver successfully fetched and rendered DEMO-9. |
| Related Jira work | 0 linked work items | This test issue has no Jira issue links. |
| Teamwork Graph goals | Unavailable; 0 returned | Graph evidence query reported an error state; do not treat as a verified empty result. |
| External deployments | 0 linked records | No linked deployment records were returned. |
| External pull requests | 0 linked records | No linked pull-request records were returned. |
| Telemetry/logs/traces | Not connected | No root cause can be verified from this test issue. |

The panel's user-facing warning says some connected evidence could not be loaded and recommends checking Teamwork Graph scopes and the user's Jira access. It also correctly states that relationships do not prove causation.

## Independent Teamwork Graph connector probe

The Atlassian connected Teamwork Graph lookup for `DEMO-9` resolved the JiraWorkItem ARI and returned only user-created/reported/updated relationships in its summary. It returned no goal, external deployment, or external pull-request relationship counts. This is consistent with the test issue having no linked external evidence, but it does **not** validate the Forge app's GraphQL query or prove its scopes are granted.

Official Atlassian documentation confirms:
- Forge `requestTeamworkGraph()` returns a `{ data, errors }` object and can return partial data alongside field-level errors: [Forge API reference](https://developer.atlassian.com/platform/forge/apis-reference/ui-api-bridge/requestTeamworkGraph/).
- The Teamwork Graph API is in Preview, and missing or disabled object scopes can cause unreadable data to be omitted: [API tutorial](https://developer.atlassian.com/platform/teamwork-graph/call-the-teamwork-graph-api/).
- Each object type requires its own granular scope and the organization admin must grant the requested scopes: [Teamwork Graph scopes](https://developer.atlassian.com/platform/teamwork-graph/scopes/).

## Remaining acceptance gates

1. Diagnose the exact GraphQL errors from the Forge runtime for the three curated relationships (goals, deployments, pull requests); the current UI intentionally surfaces a generic safe warning rather than raw upstream errors.
2. Verify that the app's granular Teamwork Graph scopes have been granted by the organization administrator in the Connected Apps installation/configuration.
3. Test against a representative software-team Jira issue that has real linked goals, external deployments, and/or external pull requests from enabled connectors. Do not create synthetic evidence to make the panel appear populated.
4. Verify the empty, partial, unavailable, pagination and source-link states against real responses.
5. Continue dependency remediation review: the latest audit remains 9 high, 4 moderate, 0 critical. Do not apply forced major upgrades without compatibility tests.
6. Keep production deployment, Marketplace sharing, judge install link and submission gated until all required acceptance evidence exists.

## Status

- Resolver runtime: **PASS** (live development panel retest).
- Development CI/deploy: **PASS** (run #312).
- PR CI: **PASS** (run #313).
- Jira issue context rendering: **PASS** (DEMO-9).
- Teamwork Graph data integration: **PARTIAL / NOT ACCEPTED** (runtime error state; no positive linked-record proof).
- Production release and judge installation: **NOT DONE**.


## Connected Apps authorization audit — 17 November 2026

The Jira Manage apps / Connected Apps Authorization view for the installed TraceBack Context Engine app was inspected read-only after the runtime retest.

- App status: Installed.
- Core permission **View Jira issue data**: enabled.
- `read:graph:issue:jira`: listed but unchecked/disabled.
- `read:graph:goal:atlassian`: listed but unchecked/disabled.
- `read:graph:deployment:external`: listed but unchecked/disabled.
- `read:graph:pull-request:external`: listed but unchecked/disabled.
- No authorization settings were changed during this inspection.

This explains the observed split: the Forge panel can fetch and render the Jira issue, while the Teamwork Graph relationship data is unavailable. The app already requests these scopes in `manifest.yml`, but the site installation has not granted them. Per Atlassian's granular-scope model, the site administrator must enable the relevant object scopes in Connected Apps. The next required action is explicit administrator approval of these four read-only scopes, followed by a short propagation wait and a fresh live panel retest.

Until that approval is granted, do not claim Teamwork Graph integration is accepted or that the missing records are genuinely absent.


## Expanded automated verification — 17 November 2026

The test suite has been expanded from the earlier baseline to **103 automated test cases** across the Node.js built-in test runner.

### Coverage areas added

- Resolver handler behavior: active issue binding, cross-issue request rejection, malformed issue keys, Jira 404 and 503 responses, requested field minimization, current-user API context, and graceful failure when optional Teamwork Graph access is unavailable.
- Teamwork Graph adversarial inputs: malformed top-level data, invalid connection shapes, missing stable IDs, wrong node types, unsafe schemes, URL credentials, hostile error messages, and invalid identifiers.
- Pagination behavior: category-specific cursors, completed-category skipping, repeated/missing/blank cursor detection, deduplication, page safety limits, partial failures, and error preservation.
- Investigation logic: all terminal Jira statuses, active statuses, failed/in-progress deployments, production severity, open/draft/merged pull requests, archived goals, priority ordering, malformed collections, and timestamp boundaries.

### CI evidence

- Push run [#327](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44025703532), commit `9e9124d3211fcac75bb170af989875b52aa2fc1a`: the 103-test step passed; syntax checks and frontend compilation passed; Forge CLI validation passed. Development deployment was still running at the time this record was written.
- Preceding push run [#325](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44025626773), commit `7de893502e01b9cfe5deeb6c8f5257876a1f7650`: tests, syntax, frontend compilation and Forge CLI validation passed; it includes the 91-test suite before the final investigation edge-case matrix.
- The initial expanded run [#320](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44025467990) intentionally caught three failures (78/81 passing). Two were incorrect adversarial test assumptions; one exposed that array-shaped GraphQL data was accepted as an empty response. The implementation now rejects array-shaped `data` as unavailable, and the corrected test suite passed in later CI.

These are automated unit/handler tests and build validations. They do not replace a live test with administrator-approved Teamwork Graph scopes or real connected external records.
