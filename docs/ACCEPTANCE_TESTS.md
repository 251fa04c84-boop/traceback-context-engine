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


---

## Latest consolidated status snapshot — 17 November 2026

This snapshot supersedes older historical status tables above where they conflict. Earlier entries are retained as dated evidence of how the implementation evolved.

### Automated and deployment verification

- The application branch `codegeist/forge-foundation` at commit `0a3be47e0dcc623d2bb6477d52db7098b6ad8a27` passed push CI [#44068107693](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44068107693): **4,110 tests passed, 0 failed, 0 skipped**; syntax, frontend compilation, authenticated Forge CLI lint, development deployment and existing installation check passed.
- The combined application + patched dependency PR merge result passed [#44068798362](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44068798362): **4,110 tests passed, 0 failed, 0 skipped**, and npm audit reported **0 vulnerabilities**.
- The patched dependency branch passed authenticated Forge CLI lint and the isolated dependency validation workflow [#44068789142](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44068789142).
- The exact patched dependency tree was deployed to Forge **development** as app version **2.16.0** in [#44072061196](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44072061196). The run completed `npm ci`, verified the three patched versions, confirmed zero npm audit findings, passed Forge CLI lint, packaged the app, validated the manifest and deployed successfully.
- No production Forge environment deployment was performed. The deployment run did not run `forge install --upgrade` and did not change any manifest scopes.
- PR #1 (application) and PR #2 (dependency remediation) both remain open, draft and unmerged. PR #2 is based on `codegeist/forge-foundation` and includes the dependency audit, README and submission draft documentation.

### Current live acceptance state

- The existing development installation is on `251fa04c84.atlassian.net`, which is a production Jira tenant. It is a controlled development installation, not a separate test organization.
- The latest Forge development deployment (2.16.0) has **not** received a fresh browser/UI retest. An earlier browser retest verified that the panel rendered after the resolver constructor fix, but that is not a retest of the latest backend transport and dependency deployment.
- The four Teamwork Graph scopes remain unapproved/unchecked in the previously inspected Connected Apps authorization state: `read:graph:issue:jira`, `read:graph:goal:atlassian`, `read:graph:deployment:external`, and `read:graph:pull-request:external`.
- No real linked Teamwork Graph goal, deployment or pull-request record has been accepted through the Forge app's own live GraphQL path. The connected Atlassian Graph connector's Jira-to-Jira relationship probe is not a substitute for this app runtime test.
- No Jira data, relationships, permissions, scopes, or production Forge settings were changed by the dependency remediation or development deployment.
- The judge installation link and public YouTube demo video have not been generated.

### Remaining acceptance gates

1. Use a separate Atlassian test organization (preferred) with a real Jira Software project and representative, non-sensitive test data.
2. Obtain explicit organization-administrator approval for the four read-only Teamwork Graph scopes and connect the relevant external provider(s).
3. Reopen a real linked Jira issue in the new issue view and visually verify the deployed 2.16.0 panel, issue context, related Jira work, real Teamwork Graph records, pagination, source links and empty/partial/unavailable states.
4. Capture the browser evidence and record the exact test issue and returned record types without copying secrets or private customer data.
5. Independently review the cross-major `glob`/`minimatch` overrides in draft PR #2 before merging it into the application branch. The successful development deployment is compatibility evidence, not an Atlassian support statement.
6. After the dependency PR is reviewed and merged, rerun the final base-branch CI/deploy checks and confirm the installed development version.
7. Only after the live acceptance gates pass, prepare the production deployment, Forge sharing/judge installation link, and public under-five-minute YouTube demo.

**Acceptance status:** Automated tests, dependency audit on the patched branch, Forge lint, and Forge development deployment are **PASS**. Fresh visual runtime acceptance, administrator-approved Teamwork Graph access, real linked-record retrieval, judge sharing, and public demo are **PENDING**. Production deployment and Marketplace listing are **NOT DONE**.


---

## Fresh Atlassian connector and schema verification — 17 November 2026

This is a read-only follow-up using the connected Atlassian account and current official developer references. It does not replace a live Forge app/browser acceptance test.

### Accessible Jira environment

- `getAccessibleAtlassianResources` returned exactly one accessible site: `251fa04c84.atlassian.net`.
- `listJiraProjects` returned exactly two projects:
  - `DEMO` — Demo service space, project type `service_desk`, 9 issues.
  - `TCE` — TraceBack Context Engine, project type `service_desk`, 0 issues.
- No Jira Software project or separate Atlassian test organization is available through the currently connected account. The accessible site is the production Jira tenant; do not grant new graph scopes there without explicit organization/security-owner approval.
- Therefore the available issues are not a representative software-team incident environment for final Codegeist acceptance.

### Read-only issue and Teamwork Graph probes

- `DEMO-9`: Jira REST returned the expected issue key, summary, description, Open status and Low priority; `issuelinks` was empty. The connected Teamwork Graph context lookup resolved its JiraWorkItem ARI and returned only user-created/reported/updated relationships. No linked goal, external deployment or external pull request was returned.
- `DEMO-7`: the connected Teamwork Graph lookup returned a real Jira-to-Jira relationship to `DEMO-8`. No goal, external deployment or external pull request was returned in the result.
- These are connector-side observations only. They do not prove the Forge resolver's GraphQL query, the Forge installation's granted scopes, or the rendered panel. No artificial graph links or DevOps records were created.

### Official schema and permission cross-check

The current Atlassian developer documentation was checked against `src/services/teamwork-graph.js` and `manifest.yml`:

- The curated query catalog lists `jiraWorkItemGoals`, `jiraWorkItemLinkedExternalDeployments`, and `jiraWorkItemLinkedExternalPullRequests`; each supports `first` and `after` pagination.
- The selected fields are present on the documented object types: `AtlassianGoal`, `ExternalDeployment`, and `ExternalPullRequest`.
- The manifest requests the matching read-only object scopes: `read:graph:issue:jira`, `read:graph:goal:atlassian`, `read:graph:deployment:external`, and `read:graph:pull-request:external`, plus `read:jira-work`.
- The resolver uses `api.asUser()` for both Jira and Teamwork Graph access, consistent with the documented current-user authorization model.
- Atlassian documents that a missing/disabled object scope can silently omit unreadable objects and relationships rather than returning a useful error. An empty graph response therefore cannot be treated as proof that no linked evidence exists.

References:
- [Forge requestTeamworkGraph reference](https://developer.atlassian.com/platform/forge/apis-reference/ui-api-bridge/requestTeamworkGraph/)
- [Teamwork Graph curated queries](https://developer.atlassian.com/platform/teamwork-graph/curated-queries/)
- [Teamwork Graph granular scopes](https://developer.atlassian.com/platform/teamwork-graph/scopes/)
- [Teamwork Graph API tutorial and troubleshooting](https://developer.atlassian.com/platform/teamwork-graph/call-the-teamwork-graph-api/)

### Result and safety boundary

- Connector Jira issue read: **PASS**.
- Connector Jira-to-Jira graph relationship read (DEMO-7 → DEMO-8): **PASS**.
- Real goal/deployment/pull-request evidence for the app: **NOT VERIFIED**.
- Forge app Teamwork Graph scope approval: **NOT VERIFIED / ADMIN ACTION REQUIRED**.
- Representative Jira Software test issue: **NOT AVAILABLE** on the one accessible site.
- Fresh browser acceptance of Forge development version 2.16.0: **PENDING**.
- No Jira issue, project, relationship, permission, scope, or production setting was modified by these checks.


## Latest application reliability validation — 17 November 2026

The application base branch now includes:
- A complete 8-second Jira request deadline that covers both request headers and JSON body parsing.
- A 12-second total Teamwork Graph budget with a 5-second per-request cap; timed-out later pages preserve earlier evidence and mark unfinished categories partial.
- Stale UI response protection when issue context changes or a newer refresh supersedes an earlier request.
- An honest empty Teamwork Graph message rather than a false statement that linked records were returned.

Latest app source commit `fffaef7204d514e10237461f1440e6d904d5dd1b` passed **4,120 tests, 0 failed, 0 skipped** in PR workflow [#44079753736](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44079753736). The matching push workflow [#44079747452](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44079747452) passed syntax, frontend compilation, authenticated Forge CLI lint, development deployment and installation upgrade. The workflow's latest follow-up removes automatic scope consent; it does not alter manifest permissions.

The live acceptance gates in this document remain pending: fresh browser verification on a suitable test site, explicit organization-admin approval for Teamwork Graph scopes, and real linked-record verification.


## Scoped dependency validation — 17 November 2026

The separate draft dependency PR #2 is rebased directly onto application commit `ee32378a385666c4c86adb13a43d3f01ce610c31`. The current PR head `e3d6e6c943a18767aa13ee499c4f9165c3e59308` has **4,124 tests passed, 0 failed, 0 skipped**, strict `npm audit --audit-level=low` with **0 vulnerabilities**, successful `npm ls prosemirror-view glob minimatch --all`, syntax checks, frontend compilation and authenticated Forge CLI lint.

- PR validation: [#44080696080](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44080696080).
- Authenticated push validation: [#44080687502](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44080687502).
- Two direct compatibility tests call the actual `@forge/manifest@13.9.0` `PackageValidator` with glob 14: one matching extra file and one missing pattern. Both passed.
- The current scoped dependency tree was not deployed by these workflows; the push validation deliberately skipped the deployment step on `security/**`.
- The remaining semver compatibility question is explicit: `@forge/manifest@13.9.0` declares `glob@^13.0.0`, while the scoped override supplies 14.0.2. The direct consumer test reduces practical risk but does not constitute an Atlassian support statement.
- The app branch itself still reports 9 high and 4 moderate audit findings until the reviewed dependency PR is integrated.
