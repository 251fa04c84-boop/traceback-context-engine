# TraceBack Context Engine — Acceptance Test Record

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
