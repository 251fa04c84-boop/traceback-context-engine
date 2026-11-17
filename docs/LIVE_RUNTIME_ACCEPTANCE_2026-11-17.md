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
