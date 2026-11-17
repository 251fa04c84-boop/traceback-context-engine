# TraceBack Context Engine — Acceptance Test Record

## Current build snapshot — 17 November 2026

> This snapshot supersedes older test counts and statuses in the historical record below.

- Deployed Forge development version **2.21.0** does not include the Rovo Agent/MCP feature.
- Experimental branch: `codegeist/rovo-agent-mcp`, current validated code commit `047214c29cf55e94768a9c49039776572ccf3d12` before this documentation-only refresh.
- CI [run #44084902302](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44084902302): **4,126 tests passed, 0 failed, 0 skipped**; syntax checks, frontend compilation and Forge CLI lint passed.
- The feature branch is based on the application branch, which still reports **9 high and 4 moderate** npm audit findings. The separate dependency-remediation PR #2 has a zero-finding audit but remains draft pending independent review and live acceptance.
- No Rovo Agent deployment, Rovo chat invocation, MCP discovery, Rovo Studio invocation, or judge-site installation has been performed.
- The four Teamwork Graph scopes remain unapproved on the connected Jira site. Live Teamwork Graph acceptance is still blocked on a dedicated test site and organization-admin approval.
- No production deployment, scope consent, Marketplace publication, or final Devpost submission has been performed.

This record must be completed against an actually deployed Forge app. A successful unit-test run is not a substitute for a live Jira installation.

## Environment under test

- Forge app ID: **`ari:cloud:ecosystem::app/b7cbb6a8-de78-4ba8-91fb-48733c1c2157`**
- Forge environment: **Development deployed successfully; production not deployed**
- Jira site: **251fa04c84.atlassian.net**
- Jira view: New issue view only
- Test issue: **DEMO-7** (service-desk IT Help; temporary technical test only, not a representative software-team incident)
- Test user: **Record the Jira account and the permissions used; do not put credentials here**
- App installation link: **Not generated; judge sharing not configured**

## Pre-installation gates

- [x] App registered once; generated app ID is present in manifest.yml.
- [x] Forge CLI lint and manifest/source validation completed successfully in development deployment workflow #6 and CI run #299.
- [x] Forge app deployed to the development environment in workflow #6.
- [x] Development app installed on `251fa04c84.atlassian.net` by workflow #6. Note: this is the user's production Jira site, so this is a controlled development installation, not a separate test tenant.
- [ ] Requested Jira and Teamwork Graph scopes are granted by an organization administrator.
- [ ] Confirm the target Atlassian organization is a test organization with test data only, unless a production deployment has an explicitly approved path.
- [ ] An organization administrator approves the Teamwork Graph scopes; these scopes can expose organization-wide data and Atlassian requires organization-admin installation.
- [ ] The site has the expected graph connectors enabled, if external PR/deployment records are to be shown.
- [ ] The judge installation link is generated using Atlassian's supported sharing flow.

## Jira issue-context acceptance

- [ ] Open DEMO-7 in Jira's new issue view and visually confirm the Investigate panel.
- [ ] Expand Investigate in the issue context area.
- [ ] Verify the issue key, summary, status, issue type, priority and description match the live issue.
- [ ] Verify the panel remains read-only.
- [ ] Verify a Jira issue without linked work still renders with a clear empty state.
- [ ] Verify a user who cannot access an issue cannot use the panel to retrieve it.

## Related Jira work acceptance

- [ ] Choose an issue with at least one inward or outward Jira issue link.
- [ ] Verify the related issue key and summary match Jira.
- [ ] Verify the relationship label (for example, "blocks", "is blocked by", or "relates to") is correct.
- [ ] Verify status, type and priority are accurate.
- [ ] Open the relative /browse/ISSUE-KEY link and confirm it stays on the same Jira site.
- [ ] Verify malformed issue keys or missing linked issues are not rendered as clickable entries.

## Teamwork Graph acceptance

- [ ] Confirm the organization administrator granted read:graph:issue:jira.
- [ ] Confirm the organization administrator granted read:graph:goal:atlassian.
- [ ] Confirm the organization administrator granted read:graph:deployment:external.
- [ ] Confirm the organization administrator granted read:graph:pull-request:external.
- [ ] Record that Teamwork Graph is a Forge Preview API and verify the current curated-query schema before final deployment.
- [ ] Verify linked goals, external deployments and external pull requests when real records exist.
- [ ] Verify cursor pagination follows later pages for each relationship category and does not duplicate records.
- [ ] Verify a category with more than 125 records is marked as capped with a visible warning rather than silently appearing complete.
- [ ] Verify each source URL opens the corresponding Atlassian or external record over HTTPS.
- [ ] Verify a graph response with no linked items is shown as empty, not as proof that no evidence exists elsewhere.
- [ ] Verify partial GraphQL errors preserve valid returned records and are labelled partial.
- [ ] Verify a permission denial or failed graph request becomes unavailable while Jira issue details remain visible.
- [ ] Verify a missing, HTTP, malformed, or credential-bearing URL is never clickable.

## Suggested next checks acceptance

- [ ] A failed production deployment produces a high-priority lead with the exact deployment source link; a failed non-production deployment is medium priority.
- [ ] A recent production deployment produces a timeline-check lead only, with explicit non-causation wording.
- [ ] An open/draft pull request produces a review lead with its source link.
- [ ] Unresolved linked Jira work and archived goals produce low-priority leads.
- [ ] Empty/unavailable Teamwork Graph results suggest verifying connectors and scopes, not inventing evidence.
- [ ] Invalid timestamps do not create time-proximity leads.
- [ ] Every lead rationale states what was observed and never claims that the source caused the Jira issue.

## Evidence honesty and safety

- [ ] No synthetic telemetry, logs, traces, deployment records, pull requests or metrics are presented as real.
- [ ] No root cause is asserted from issue text or a simple relationship.
- [ ] No uncalibrated probability/confidence percentage is shown.
- [ ] No production action, rollback, feature-flag change, deployment trigger or Jira mutation is exposed.
- [ ] The UI clearly distinguishes Jira links from Teamwork Graph external evidence.

## Rovo Agent and MCP acceptance — pending

- [ ] Deploy the feature branch to a dedicated Forge development environment after the dependency branch is reviewed.
- [ ] Install the app in a dedicated Atlassian test organization.
- [ ] Verify the TraceBack Investigator agent appears in Rovo chat.
- [ ] Ask the agent to investigate a permitted Jira issue and confirm it invokes `get-traceback-context`.
- [ ] Confirm the returned Jira issue fields and linked Jira work items match the source issue.
- [ ] Confirm Teamwork Graph available, empty, partial, unavailable and truncated states are described accurately.
- [ ] Confirm the agent cites source links where available and never claims root cause from a relationship or timestamp.
- [ ] Confirm a malformed issue key is rejected before any Jira or Graph request.
- [ ] Confirm a user without Jira permission cannot retrieve the issue through the Rovo action.
- [ ] Confirm the action is read-only and exposes no create/update/delete/deploy/rollback/feature-flag tools.
- [ ] In Rovo Studio, verify the TraceBack MCP tool is discoverable after site administrator authorization.
- [ ] Invoke the MCP tool from a customer-created test agent using a permitted issue key.
- [ ] Verify the MCP response is bounded, structured, and preserves source links and graph warnings.\n- [ ] Confirm long descriptions and oversized evidence lists are truncated/capped without dropping the explicit truncation state.\n- [ ] Inject a prompt-like instruction into a test issue description or linked record and confirm the Rovo Agent treats it as untrusted data, not as instructions.
- [ ] Record the exact Rovo Agent and MCP version, test issue, site, account permissions, screenshots and results.

## Results

| Test | Result | Evidence / notes |
| --- | --- | --- |
| App registered | Pass | Forge workflow #6 registered app; app ID recorded in manifest. |
| Forge lint | Pass | Forge CLI lint reported no issues in workflow #6 and CI run #299. |
| Automated tests | Pass | CI run #299: 38 passed, 0 failed. |
| Syntax checks | Pass | CI run #299: syntax checks passed. |
| Frontend compilation | Pass | CI run #299: JSX bundle compiled successfully. |
| Locked dependency install | Pass | CI run #299 used `npm ci` successfully. |
| Dependency audit | Warning | CI run #299: 9 high, 4 moderate, 0 critical; unresolved upstream dependency findings. |
| Forge deployment | Pass | Development deployment succeeded in workflow #6; not production. |
| App installation | Pass | Development app installation completed on 251fa04c84.atlassian.net in workflow #6. |
| Jira issue context | Pending | App panel has not been visually verified in Jira issue view. |
| Related Jira work | Partial | Atlassian connector confirms DEMO-7 links to DEMO-8 with relationship `relates to`; Forge panel rendering not yet visually verified. |
| Teamwork Graph goals | Pending | No live app response recorded. |
| Teamwork Graph deployments | Pending | No live app response recorded. |
| Teamwork Graph pull requests | Pending | No live app response recorded. |
| Empty / partial / unavailable states | Unit tests only | Runtime acceptance not yet performed. |
| Source links | Partial | Jira API confirms DEMO-7 → DEMO-8 source record; panel link behavior not visually verified. |

Do not change a result to Pass until the corresponding live action has been performed and recorded.


## Follow-up verification — 17 November 2026

- Latest branch CI [run #299](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44011667051) completed successfully on commit `4aa2af260c66306003b00975ddc359e2590137b6`.
- The run confirms `npm ci`, **38/38 tests**, syntax checks, frontend compilation, and dependency-audit reporting. Forge CLI validation was **skipped** by the workflow condition on this run; do not treat it as a fresh Forge CLI lint result. The earlier successful Forge CLI lint remains recorded in development deployment workflow #6 and CI run #293.
- Atlassian Jira connector read verified the available projects: `DEMO` and `TCE`; both are `service_desk` projects. `TCE` currently has zero issues. There is no Jira Software project or representative software-team incident available on this site for acceptance testing.
- Atlassian Teamwork Graph connector query on `DEMO-7` returned no related goal, external deployment, or external pull-request relationships. A query on the `TCE` project ARI also returned no relationships. This is a connector-side observation only; it does not prove the Forge app's own Teamwork Graph scopes or UI are working.
- No Jira issues, projects, relationships, permissions, or production settings were modified during this follow-up.


## CI refresh — 17 November 2026

- Latest push CI [run #301](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44012419499) completed successfully on commit `516d101cc6fb676daf3571a857e83e22278bbbaa`.
- Verified steps: `npm ci`, report-only dependency audit, **38/38 tests**, syntax checks, frontend JSX compilation, and authenticated Forge CLI validation. Forge CLI validation completed successfully.
- PR CI [run #302](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44012423027) also passed its applicable checks; Forge CLI validation was skipped by the PR-event workflow condition.
- The dependency audit remains **9 high, 4 moderate, 0 critical**. CI success is not a vulnerability remediation or a live Jira/Teamwork Graph acceptance result.


## Live Jira connector probe — 17 November 2026

A clearly labelled, low-priority temporary Jira Task was created in the existing `DEMO` project for a safe live-context probe:

- Issue: [DEMO-9](https://251fa04c84.atlassian.net/browse/DEMO-9), summary `[TraceBack TEST] Temporary issue-context panel acceptance check`.
- Labels: `traceback-test`, `temporary`, `acceptance-check`.
- Jira REST via the authenticated connector returned the expected key, summary, description, Open status, Low priority, and empty issue links.
- Teamwork Graph context lookup resolved the JiraWorkItem ARI and returned an empty relationship summary for goals, external deployments, and external pull requests.
- This proves the connector-side Jira issue and graph query paths can resolve the test issue, but does **not** prove the Forge app's runtime resolver, granted scopes, or rendered issue-context panel.
- No artificial links, deployments, goals, or pull requests were created. No production/customer incident data was used.
- Browser profile inspection shows the saved TinyFish profile has a Google sign-in only, not an Atlassian sign-in. Therefore visual panel verification is still blocked until an authenticated Atlassian browser session is available.

The temporary test issue is intentionally left in place for inspection and can be removed after acceptance testing.


## Live Forge runtime failure and corrective patch — 17 November 2026

The installed development panel was visually inspected on [DEMO-9](https://251fa04c84.atlassian.net/browse/DEMO-9) using the saved browser session.

- The TraceBack Context Engine panel was present under Jira's Automation section and showed a DEV environment label.
- On expand, the UI displayed its loading message and then failed with `Resolver is not a constructor`. Retrying reproduced the same error. No issue or Teamwork Graph evidence rendered.
- Root cause was isolated to the backend resolver import interop: `src/index.js` used CommonJS `require('@forge/resolver')` directly as a constructor, without normalizing the package's default-export shape.
- Corrective patch in commit `53e2226a0143ed83737a6e34beb7bfe7742cab9c` now selects `resolverModule.default || resolverModule` and explicitly validates that the result is constructable.
- Regression test `test/resolver-runtime.test.js` constructs the actual installed package using the same normalization. CI run [#310](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44018574721) passed tests, syntax, frontend compilation and Forge CLI lint on commit `46f711f82a84ce0420fef5e7f8eb95b2b4dfb131`.
- The follow-up CI workflow now deploys and upgrades **only the Forge development environment** on pushes to `codegeist/forge-foundation`, after checks succeed. It does not deploy production.
- **Not yet verified:** the corrected code must complete its development deployment, then the same Jira panel must be reopened to confirm the constructor error is gone and live issue/evidence states render. A green CI run is not proof of runtime success.
