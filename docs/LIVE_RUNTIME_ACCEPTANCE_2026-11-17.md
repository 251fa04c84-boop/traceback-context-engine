## Latest verified snapshot — 17 November 2026, 18:xx IST

This section supersedes older status statements below. Historical entries are retained as an audit trail.

### Branches and automated validation

- **Core app / PR #1:** head `69516f825589454fcd8ad6c685c33bfa3cfeef53`; GitHub reports the PR mergeable. CI [#534](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44091560700) completed successfully: `npm test`, syntax checks, frontend compilation, and the deployment-workflow safety regression tests passed. Forge CLI validation and deployment were skipped on the PR event.
- **Dependency remediation / PR #2:** head `9354cf40e04ce563ca857afb82ae379269350848`; GitHub reports the PR mergeable. The immediately preceding synchronized head passed CI [#541](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44091646699): installed dependency-tree checks, strict `npm audit --audit-level=low` (zero reported vulnerabilities), tests, syntax and frontend checks passed. The current head adds a documentation-only correction about the earlier development deployment; its CI [#544](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44091837844) is in progress.
- **Rovo Agent/MCP / PR #5:** head `533774b5732bdbf389dc4f93223d60bffcde445f`; GitHub reports the PR mergeable. CI [#542](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44091652806) completed successfully: locked install, tests, syntax and frontend compilation passed. Forge CLI manifest validation and deployment were skipped on the PR event.
- All three PRs remain **draft and unmerged**. The dependency branch's zero-audit result applies to its isolated lockfile only. The core application branch still reports **9 high and 4 moderate** npm audit findings until PR #2 is reviewed and integrated.
- PR #2 keeps `glob@14.0.2` scoped under `@forge/manifest`; that package declares `glob@^13.0.0`. The exact `PackageValidator` call path is covered by a direct integration test and the dependency tree passes `npm ls`, but the override crosses the declared major range and is not an Atlassian support statement. Keep the PR draft pending independent compatibility review and fresh exact-tree deployment acceptance.
- PR #5 adds a read-only Rovo Agent, GET action and one `rovo:mcp` module. Atlassian documents Rovo MCP as Preview, supported for early adopters but not GA. The latest PR CI does not validate the manifest with Forge CLI; live agent discovery, MCP visibility and action invocation remain unverified.

### Current app behavior and safety work

- The core Jira issue-context panel reads Jira and Teamwork Graph data as the current user, with bounded pagination, request deadlines, source links, deterministic investigation leads, and explicit evidence-completeness states.
- Category-level Teamwork Graph messages now distinguish unavailable, partial, empty and category-empty responses. Tests ensure unavailable evidence is not described as confirmed absence.
- Rovo action issue-key resolution now validates active Jira context and can safely recover a key from a strict HTTPS Jira `/browse/ISSUE-KEY` context URL; malformed URLs, conflicting context and mismatched keys are rejected.
- The manual Forge development deployment workflow requires separate confirmation of prior organization-admin scope approval and the target site. It deliberately does **not** use `--confirm-scopes`; push events cannot deploy. Regression tests guard these rules.
- No current branch changes have been deployed after the earlier Forge development version 2.21.0. That prior deployment used an earlier dependency-tree revision; it is not acceptance evidence for the current core, dependency, or Rovo branch heads.

### Live integration and submission status

- The only connected Atlassian site remains `251fa04c84.atlassian.net`, a production Jira tenant. There is no separate test organization or representative Jira Software project available through this connection.
- The four granular Teamwork Graph scopes remain unchecked/disabled: `read:graph:issue:jira`, `read:graph:goal:atlassian`, `read:graph:deployment:external`, and `read:graph:pull-request:external`. No scope was changed or consented to.
- No genuine linked goal, external deployment or external pull-request record has been verified through the Forge app. Do not fabricate graph data or claim the bonus integration is live.
- The provisional submission draft is `docs/CODEGEIST_SUBMISSION_DRAFT.md`; it now maps the five judging dimensions and includes conditional Teamwork Graph, Best Agents and MCP bonus write-ups. Do not select a bonus until its integration passes acceptance.
- No judge installation link, accepted public demo video, Marketplace submission, or final Devpost submission is verified.

# Live runtime acceptance — 17 November 2026

> **Current authoritative snapshot — 17 November 2026.** This section supersedes older status summaries below where they conflict. The dated historical entries are retained as an audit trail.

## Current application and security validation

- Application branch: `codegeist/forge-foundation`
- Latest application source commit: `ee32378a385666c4c86adb13a43d3f01ce610c31`
- Application push CI [#44080140312](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44080140312) and PR validation [#44080148055](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44080148055) passed **4,120 tests, 0 failures, 0 skips**, syntax/frontend checks, and authenticated Forge CLI lint. The push workflow also completed the Forge development deployment/install path.
- Separate dependency PR [#2](https://github.com/251fa04c84-boop/traceback-context-engine/pull/2), head `fcb5111355c23801cec67fdccadf3bb47a4663fe`, passed latest PR validation [#44081783709](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44081783709) and authenticated push validation [#44081776312](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44081776312): **4,124 tests, 0 failures, 0 skips; strict npm audit: 0 vulnerabilities; dependency-tree checks, syntax/frontend checks and Forge CLI lint passed**.
- The dependency branch includes an executable compatibility test against the actual exported `@forge/manifest@13.9.0` `PackageValidator` for a matching and a missing `extraFiles` glob.
- **Compatibility caveat:** `@forge/manifest@13.9.0` declares `glob@^13.0.0`, while PR #2 scopes `glob@14.0.2` under that package. The direct consumer test passed, but the override crosses the declared major-version range and is not an Atlassian support statement. PR #2 remains draft for independent compatibility review.
- The application branch without PR #2 still has **9 high and 4 moderate** npm audit findings. Do not describe the app branch itself as vulnerability-free.

## Forge development deployment

- The exact scoped dependency tree from PR #2 was deployed to Forge **development** as app version **2.21.0** by [run #44081294538](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44081294538).
- Forge reported deployment success; Jira reported the existing development installation was already at the latest version.
- The install command did not use `--confirm-scopes`; CI did not automatically consent to any new permissions.
- This is a controlled Forge development deployment on `251fa04c84.atlassian.net`, which Forge identifies as a **production Jira tenant**. It is not a production Forge environment deployment, separate test tenant, or judge installation.
- **Fresh browser acceptance of version 2.21.0 has not been completed.** Earlier browser evidence confirmed that an older deployed build rendered the Jira issue-context panel; it must not be represented as a fresh retest of 2.21.0.

## Teamwork Graph authorization and live-data acceptance

The last read-only Connected Apps authorization inspection found:

- `read:jira-work`: enabled.
- `read:graph:issue:jira`: unchecked/disabled.
- `read:graph:goal:atlassian`: unchecked/disabled.
- `read:graph:deployment:external`: unchecked/disabled.
- `read:graph:pull-request:external`: unchecked/disabled.

Only one Atlassian site is currently accessible through the connected account: `251fa04c84.atlassian.net`. The visible `DEMO` and `TCE` projects are service-desk projects; no separate test organization or representative Jira Software project is available through this connection.

Read-only connector probes found one existing Jira-to-Jira relationship from DEMO-7 to DEMO-8. They did not establish a linked goal, external deployment, or external pull request, and they do not prove that the Forge app's own GraphQL queries or granular scopes work.

**Required before claiming Teamwork Graph acceptance:**
1. Use a separate Atlassian test organization/site.
2. Have its organization administrator explicitly approve the four read-only Teamwork Graph scopes.
3. Use a representative Jira Software issue with genuine linked graph records and connected providers.
4. Retest the installed 2.21.0 app in a browser and verify the real source links plus available, empty, partial and unavailable states.

No scope change, permission grant, synthetic evidence creation, or Jira data mutation is recorded.

## Release and submission gates

- PR #1 and PR #2 are both open, draft and unmerged. The current GitHub review and inline-thread listings contain no submitted reviews.
- No production Forge deployment, Marketplace publication, judge installation link, public YouTube demo, or final Devpost submission is verified.
- Do not merge PR #2 until the cross-major `glob` override receives independent compatibility review and the deployed app passes fresh live acceptance.
- Do not merge PR #1 or claim the Teamwork Graph bonus until the administrator, real-data and browser acceptance gates above pass.

---

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


### Final confirmation after expanded suite

- Latest push run [#329](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44025809386), commit `9ebc1d73c4cc1d8278789b99141ebaabab0c88d8`: **103 tests passed, 0 failed, 0 skipped**; syntax, frontend compilation, Forge CLI validation and the development deploy/upgrade step all passed.
- Matching pull-request validation [#330](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44025815560) also completed successfully.
- After the successful development deployment, the saved-session browser retest [run report](https://agent.tinyfish.ai/runs/151892b3-c5ed-47de-94c7-bea36bab1a96) reopened DEMO-9 and confirmed the TraceBack Context Engine DEV panel is visible and rendered without the previous resolver/runtime error. This browser report did not capture the detailed content of the Graph relationship sections, so it is not counted as Teamwork Graph data acceptance.



## Latest expanded verification and independent graph probe — 17 November 2026

### Latest CI and development deployment

- Push workflow [#335](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44026413060), commit `fc76243643ccfa991613191cfa4aafb7ec88bfab`: **4,107 tests passed, 0 failed, 0 skipped**.
- JavaScript syntax checks and frontend JSX compilation passed.
- Forge CLI lint reported **No issues found**.
- Forge CLI deployed version 2.10.0 to the development environment and confirmed the Jira development installation was already at the latest version.
- Matching PR validation [#336](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44026419211) completed successfully.
- The dependency audit in run #335 still reported **13 findings: 9 high, 4 moderate, 0 critical**. These are unresolved; CI reports them but only fails on critical findings.

### Additional read-only Teamwork Graph connector probe

The connected Atlassian Teamwork Graph context lookup was run against existing Jira issues without editing any issue or relationship:

- `DEMO-9`: only user-created/reported/updated relationships were returned; no linked goal, external deployment or external pull request was present in the returned relationships.
- `DEMO-7`: returned a real `jira_work_item_links_jira_work_item` relationship to `DEMO-8`.
- `DEMO-8`: no linked goal, external deployment or external pull request relationship was returned.

This proves that the connected Teamwork Graph connector can resolve Jira work items and at least one existing Jira-to-Jira relationship on this site. It does **not** prove the Forge app's three curated GraphQL connections work, nor that the four granular Graph scopes have been granted. The connected connector and the Forge app use distinct authorization paths.

### Current gate status

- Automated tests/build/Forge lint/development deployment: **PASS**.
- Jira-to-Jira relationship discoverability through the connected Teamwork Graph connector: **PASS** for DEMO-7 → DEMO-8.
- Fresh visual acceptance of the newly deployed panel: **NOT VERIFIED** (browser automation wallet is unavailable).
- Forge app Teamwork Graph goal/deployment/pull-request retrieval: **NOT ACCEPTED**; admin-granted scopes and real linked records are still required.
- Dependency security: **OPEN** (9 high, 4 moderate, 0 critical).
- Production release, Marketplace publication and judge installation: **NOT DONE**.

No Jira data, Graph relationships, scopes, or production settings were changed by these probes.


## Backend Teamwork Graph transport hardening and latest redeployment — 17 November 2026

A review of the current Atlassian Forge documentation identified two transport shapes that must not be conflated: the backend `@forge/api` method is documented with an HTTP response whose body is read with `.json()`, while the frontend bridge exposes a direct `{ data, errors }` result. The backend adapter now accepts both shapes, preserves GraphQL errors, marks non-2xx HTTP responses unavailable, and safely handles malformed JSON.

Regression coverage added:
- HTTP 200 response with a JSON GraphQL body.
- HTTP 403 response with GraphQL errors.
- Invalid JSON response body.
- Existing direct `{ data, errors }` responses remain supported.

CI and development deployment evidence:
- Push run [#44067547334](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44067547334), commit `739cd08c96f747d7c72197b8ceb11156f44412cd`: **4,110 tests passed, 0 failed, 0 skipped**; syntax checks, frontend compilation, authenticated Forge CLI validation and development deployment/installation upgrade all succeeded.
- Matching PR validation [#44067552155](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44067552155) completed successfully on the same commit.
- Forge CLI reported **No issues found**; the development deployment completed and Jira confirmed the development installation was already at the latest version.
- This deployment remains the development environment on `251fa04c84.atlassian.net`; Forge CLI explicitly warned that this is a production Jira site. No production environment deployment was performed.

Acceptance boundary:
- The new transport tests validate both documented response shapes at unit level; they do not prove the site's disabled Teamwork Graph scopes have been granted.
- The last inspected Connected Apps authorization state still had all four granular Teamwork Graph scopes unchecked. No permission changes were made.
- A fresh authenticated browser retest of the newly deployed panel is still not available. The earlier visual retest proves the resolver UI rendered before this transport patch, not after it.
- Teamwork Graph goal/deployment/pull-request evidence remains **NOT ACCEPTED** until an organization administrator grants the scopes and a real linked-record issue is tested.
- The app-branch dependency audit remains **OPEN** at 9 high, 4 moderate, 0 critical. The zero-finding dependency override experiment is isolated on a separate security branch and is not yet merged.


## Reliability hardening and latest validation — 17 November 2026

Application commit: `fffaef7204d514e10237461f1440e6d904d5dd1b`.

Changes:
- The Jira request deadline now covers both the REST request and `response.json()`. A slow or stalled response body cannot leave the resolver waiting after headers have arrived.
- Teamwork Graph request timeouts are tested through the real pagination adapter. If a later page stalls, already received records remain visible and the unfinished category is marked truncated/partial.
- The Jira panel ignores stale asynchronous responses when the issue context changes or a newer refresh supersedes an earlier request.
- The empty Teamwork Graph state no longer displays the incorrect success message “Linked records were returned”; it explicitly says that no records were visible to the current user and that this does not prove no evidence exists elsewhere.
- Added five Jira response/timeout tests and one Graph pagination-timeout test.

CI:
- Push validation [#44079747452](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44079747452) completed successfully: locked install, dependency-audit reporting, automated tests, syntax checks, frontend compilation, authenticated Forge CLI lint, Forge development deployment and development installation upgrade all passed.
- Pull-request validation [#44079753736](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44079753736) completed successfully for the same application commit; PR-event-only Forge lint/deployment steps were skipped by design.
- The exact test count is not copied into this record because the retained GitHub job-log blob was no longer available when this note was written. The workflow job conclusion is successful; no guessed count is reported.

Deployment workflow safety:
- Removed the `--confirm-scopes` option from future automated development installs. CI may deploy and attempt the existing development installation upgrade, but it must not auto-consent to new app scopes. Any newly requested scopes must go through the explicit Atlassian administrator approval path.
- This workflow change does not alter the app manifest or grant/revoke any scope.

Acceptance boundary remains unchanged:
- The CI push job deployed the app to the Forge development environment and upgraded the existing development installation on `251fa04c84.atlassian.net`; Forge identifies that Jira tenant as a production site. It is not a separate judge/test tenant.
- No fresh browser acceptance of this exact commit is recorded.
- The four Teamwork Graph object scopes still require explicit organization-admin approval and real linked-record acceptance.
- The app-branch dependency audit remains open until the separate dependency PR is integrated after independent review.
- No production Forge deployment, Marketplace listing, public demo, or Devpost submission was performed.
