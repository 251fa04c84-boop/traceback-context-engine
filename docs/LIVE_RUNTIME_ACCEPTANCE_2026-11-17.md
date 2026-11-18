# Authoritative staging deployment update — 18 November 2026, 14:30 IST

This entry supersedes the earlier statement above that the Rovo/MCP candidate had not been deployed or installed. It records a successful CI-driven Forge staging deployment and Jira installation; it does not claim browser or Rovo acceptance.

- GitHub Actions workflow run [#44271541973](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44271541973) completed with conclusion **success**.
- Workflow inputs verified from job logs: source branch `codegeist/rovo-integrated`; target `brand7.atlassian.net`; both explicit test-site confirmations `true`; install mode `install`.
- Job `deploy-to-test-site` completed successfully. The workflow's safety validation, `npm ci`, test suite, syntax checks, frontend compilation, Forge CLI lint, Forge staging deployment and Jira installation all passed.
- Automated tests: **4,159 passed, 0 failed, 0 cancelled, 0 skipped**.
- Forge CLI lint: **No issues found**.
- Forge deployed app version **2.0.0** to the Forge **staging** environment and reported deployment success.
- Forge CLI confirmed: **Install in Jira complete!** The app was installed in Jira on `brand7.atlassian.net` in the staging environment.
- The install command listed requested scopes: `read:jira-work`, `read:graph:issue:jira`, `read:graph:goal:atlassian`, `read:graph:deployment:external`, and `read:graph:pull-request:external`. The workflow deliberately did not pass `--confirm-scopes`. The logs do not independently establish which granular scopes were administratively consented or usable at runtime; do not claim Graph authorization acceptance without checking the site's authorization state.
- The CLI emitted a generic warning that a development app was being installed to a production site, but its explicit completion message identifies the target as `brand7.atlassian.net`; the workflow inputs and safety guard also verified this target was not `251fa04c84.atlassian.net`. No production tenant was targeted.
- The connected Atlassian MCP account still exposes only `251fa04c84.atlassian.net`, so it cannot independently inspect the new site's Jira issue or app authorization state. Fresh browser acceptance, real linked Teamwork Graph records, Rovo agent discovery, MCP tool visibility and action invocation remain **not yet verified**.

**Acceptance conclusion:** staging deployment and Jira installation are **PASS**. Live UI, granular Graph authorization/data, Rovo discovery and MCP invocation remain **PENDING**. No production install or scope consent was performed.

---

# Authoritative live probe update — 18 November 2026, 14:08 IST

This entry supersedes earlier live-probe status where it conflicts. It records a read-only connector probe, not a Forge app browser acceptance.

- The connected Atlassian account still exposes only `251fa04c84.atlassian.net`, which is a production tenant. No separate test site or organization is available through this connection.
- Read-only Jira lookup of `DEMO-7` succeeded. It returned one related Jira work item, `DEMO-8`, and issue metadata from the Demo service space. This is a service-desk sample, not a representative Jira Software incident.
- A fresh Teamwork Graph `detailLevel=full` probe restricted to target types `AtlassianGoal`, `ExternalDeployment`, and `ExternalPullRequest` returned **zero relationships**, with `hasNextPage=false`. This confirms no matching linked records were returned for this sample issue by this connector query. It does not prove that no such records exist elsewhere in the organization.
- The four app Teamwork Graph scopes remain unapproved on a separate test site: `read:graph:issue:jira`, `read:graph:goal:atlassian`, `read:graph:deployment:external`, and `read:graph:pull-request:external`. No scope was changed or consented.
- The refreshed Rovo/MCP candidate is PR [#9](https://github.com/251fa04c84-boop/traceback-context-engine/pull/9), head `e131a5b147bc1aa660a0a9059989d0d26899a0c8` for app implementation, plus documentation-only head `160f2b06a6a12c517e870c58f98bd6e67c7250bf`. Exact app-head push/PR CI passed 4,159 tests, and authenticated Forge CLI lint passed on push. Latest documentation-head CI is running separately.
- PR #9 has not been installed or deployed. Rovo discovery, Rovo Studio MCP visibility, external MCP OAuth 2.1 consent, and live action invocation remain unverified.
- No production Jira data was modified, no production scope was approved, and no app was installed or upgraded in this probe.

**Acceptance conclusion:** Teamwork Graph code paths have automated coverage and the connector can inspect Jira context, but real goal/deployment/pull-request retrieval through the TraceBack Forge app remains **not accepted**. A separate test site, organization-admin approval, and representative linked test records are still required.

---

# Authoritative follow-up — 17 November 2026, 15:38 UTC

This entry supersedes older build/version summaries below; older entries remain as history.

- **Last deployed core runtime:** source revision `abc24d51b2b2d0053a1e9adc20a16734a0f10dde`, Forge development version **2.44.0**, successfully deployed in [#44103273512](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44103273512). The existing development installation was already current. The target Jira site `251fa04c84.atlassian.net` is a production tenant; only its Forge **development** environment was deployed.
- **Runtime code comparison:** current core branch head `18562db4f372cf064b53d50c119e802e0f0b78a2` is 14 commits ahead of the deployment workflow commit. The exact diff contains workflow, documentation, and test changes only; no `src/`, `manifest.yml`, `package.json`, or `package-lock.json` changes. The deployed runtime source therefore still matches the current core app source.
- **Core validation:** [push CI #44115665646](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44115665646) and [PR CI #44115681024](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44115681024) passed **4,131 tests, 0 failures**; syntax, frontend compilation and authenticated Forge CLI lint passed. The core dependency audit still reports **9 high and 4 moderate** findings.
- **Dependency candidate PR #2:** head `e4af8f67050094f4a73d6bb88d6ef05e74269b6c`, [push CI #44115675013](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44115675013), **4,135 tests, 0 failures**, strict audit **0 vulnerabilities**, dependency-tree checks and Forge CLI lint passed. Keep draft: `glob@14.0.2` remains outside `@forge/manifest@13.9.0`'s declared `^13.0.0` range.
- **Rovo/MCP candidate PR #5:** head `8f3b840baaba80c118781291fbf4cad292c1b6ed`, [push CI #44116281155](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44116281155) and [PR CI #44116292798](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44116292798), **4,147 tests, 0 failures**; authenticated Forge CLI lint passed on push. Live Rovo/MCP acceptance remains pending.
- All three branches now use verified immutable GitHub Actions release commits, no unnecessary package-manager cache, least-privilege checkout credential settings, and a required committed lockfile.
- **Still blocked:** fresh browser acceptance, separate Atlassian test site, explicit organization-admin approval for the four Teamwork Graph scopes, genuine linked goal/deployment/pull-request evidence, Rovo/MCP live invocation, judge installation link, and public under-five-minute YouTube demo. No production app deployment or scope consent was performed.

---

## Latest verified snapshot — 17 November 2026

This section supersedes older status statements below. Historical entries are retained as an audit trail.

### Current branches and CI

- **Core app / PR #1:** current branch head `4a2b3c3bec8e7773463dd71a4ba483ba6da65e7b`; exact-head push CI [#44103953125](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44103953125) passed **4,130 tests**, syntax/frontend checks and authenticated Forge CLI manifest lint. The workflow-only change was validated and its deployment guard correctly skipped a redundant deploy. Core application source revision `abc24d51b2b2d0053a1e9adc20a16734a0f10dde` remains deployed to Forge development as version **2.44.0** from [#44103273512](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44103273512). This is installed on the connected production Jira tenant, not a separate test site or judge installation. Fresh browser acceptance is not recorded.
- **Dependency remediation / PR #2:** exact branch head `e290c6e8f76fcfde23c7f375f2ee3a77d18528d2`; push CI [#44101730325](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44101730325) and PR CI [#44101743851](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44101743851) each passed **4,134 tests**, with strict `npm audit --audit-level=low` reporting **0 vulnerabilities**. Authenticated Forge CLI validation passed on push; PR-event lint was skipped by design. The lockfile pins `prosemirror-view@1.42.9`, `glob@14.0.2` only beneath `@forge/manifest`, and `minimatch@11.0.8` beneath that glob.
- **Rovo Agent/MCP / PR #5:** exact branch head `18357a3433c17633f6295c9e6f8e21d39fd22d08`; push CI [#44102276569](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44102276569) and PR CI [#44102289313](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44102289313) each passed **4,146 tests**. Authenticated Forge CLI manifest lint passed on push; feature-branch deployment was skipped by design. Rovo discovery, MCP tool visibility, live action invocation and permission-boundary acceptance remain unverified.
- All three PRs remain **open, draft and unmerged**. Do not combine test counts: they are separate branch suites.

### Dependency security and compatibility

- The core application branch without PR #2 still reports **9 high, 4 moderate, 0 critical** npm audit findings.
- PR #2's isolated lockfile pins `prosemirror-view@1.42.9`, `glob@14.0.2` only under `@forge/manifest`, and `minimatch@11.0.8` only under that scoped glob. Its exact-head audit reports **0 npm audit vulnerabilities**.
- The GitHub-reviewed glob advisory [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4) affects glob releases from 9.0.0 through 14.0.1 and identifies 14.0.2 as the first patched release. Current public package records show glob 13.0.7 is still affected; no patched 13.x release is identified ([npm package record](https://www.npmjs.com/package/glob), [advisory](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4)).
- `@forge/manifest@13.9.0` declares `glob@^13.0.0`, while PR #2 uses a scoped glob 14 override. The inspected PackageValidator call site uses named async `glob(pattern)` without an AbortSignal/timeout; direct PackageValidator tests pass. This narrows observed reachability for the specific cancellation-bypass precondition, but does not prove all Forge toolchain paths are safe or establish Atlassian support. Keep PR #2 draft pending independent review and exact-tree live acceptance.

### Dependency security and compatibility

- The core application branch without PR #2 still reports **9 high, 4 moderate, 0 critical** npm audit findings.
- PR #2's isolated lockfile pins `prosemirror-view@1.42.9`, `glob@14.0.2` only under `@forge/manifest`, and `minimatch@11.0.8` only under that scoped glob. Its exact-head audit reports **0 npm audit vulnerabilities**.
- The GitHub-reviewed glob advisory [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4) affects glob releases from 9.0.0 through 14.0.1 and identifies 14.0.2 as the first patched release. Current public package records show glob 13.0.7 is still affected; no patched 13.x release is identified ([npm package record](https://www.npmjs.com/package/glob), [advisory](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4)).
- `@forge/manifest@13.9.0` declares `glob@^13.0.0`, while PR #2 uses a scoped glob 14 override. The inspected PackageValidator call site uses named async `glob(pattern)` without an AbortSignal/timeout; direct PackageValidator tests pass. This narrows observed reachability for the specific cancellation-bypass precondition, but does not prove all Forge toolchain paths are safe or establish Atlassian support. Keep PR #2 draft pending independent review and exact-tree live acceptance.

### Dependency security and compatibility

- The core application branch without PR #2 still reports **9 high, 4 moderate, 0 critical** npm audit findings.
- PR #2's isolated lockfile pins `prosemirror-view@1.42.9`, `glob@14.0.2` only under `@forge/manifest`, and `minimatch@11.0.8` only under that scoped glob. Its exact code/lockfile CI reported **0 npm audit vulnerabilities**.
- Manual upstream advisory review confirms `minimatch@11.0.8` is beyond the affected ranges for the November 2026 minimatch advisories, including the `escape()` correctness/security issue fixed in 11.0.8 ([GHSA-c859-jr93-m5j4](https://github.com/isaacs/minimatch/security/advisories/GHSA-c859-jr93-m5j4)) and the global-cache memory issue fixed in 11.0.8 ([GHSA-hqmv-qgp3-jx75](https://github.com/isaacs/minimatch/security/advisories/GHSA-hqmv-qgp3-jx75)).
- **PR #2 is not cleared for merge:** `@forge/manifest@13.9.0` declares `glob@^13.0.0`, while the scoped override uses major version 14. Direct `PackageValidator` tests and Forge CLI lint reduce risk but do not establish full compatibility or Atlassian support. Keep the PR draft pending independent review and exact-tree live acceptance.

### Current Jira test issue — read-only check

- Jira issue [DEMO-9](https://251fa04c84.atlassian.net/browse/DEMO-9) exists and is labelled `acceptance-check`, `temporary`, and `traceback-test`.
- Jira reports the project as **Demo service space** (`service_desk`), issue type Task, status Open, priority Low, with **zero Jira issue links and zero comments**.
- The issue description explicitly identifies it as a temporary TraceBack panel acceptance issue with no customer or production incident data. Do not use it for operational work or fabricate linked deployment/PR/goal evidence.
- This read-only Jira issue lookup verifies the issue metadata only. It does **not** prove that the latest Forge panel loaded in a browser or that the current Rovo/Teamwork Graph integration works.

### Teamwork Graph, live acceptance and submission

- Only one connected Atlassian site is available: `251fa04c84.atlassian.net`, a production Jira tenant. No separate test organization or representative Jira Software project is verified through this connection.
- The four granular Teamwork Graph scopes remain unchecked/disabled: `read:graph:issue:jira`, `read:graph:goal:atlassian`, `read:graph:deployment:external`, and `read:graph:pull-request:external`. No scope changes or consent were made.
- Existing connector probes found one Jira-to-Jira relationship (DEMO-7 → DEMO-8), but no verified linked goal, external deployment or external pull request. This does not prove the Forge app's GraphQL path or scope grants.
- The previous browser retest confirmed an older build rendered the Jira issue-context panel. A fresh browser retest of core version 2.38.0 is not recorded.
- No judge installation link, accepted public demo under five minutes, Marketplace submission or final Devpost submission is verified.

### Required remaining gates

1. Obtain a separate Atlassian test site and explicit organization-admin approval for the four read-only Teamwork Graph scopes.
2. Test the Forge panel on a representative Jira Software issue with genuine linked records.
3. Freshly browser-test core development version 2.38.0, including source links and available/empty/partial/unavailable states.
4. Independently resolve PR #2's cross-major `glob` override before merging.
5. Deploy and test the Rovo branch in a controlled test site; verify agent discovery, MCP tool visibility and action invocation.
6. Complete the judge installation flow, public YouTube demo and final Devpost submission.

No PR was merged, no permissions were changed, no production deployment was made, and no Devpost submission was performed in this update.

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
