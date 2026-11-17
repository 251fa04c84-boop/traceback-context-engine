# TraceBack Context Engine — Codegeist 2026 submission draft

> **Status: draft only.** This copy is prepared from the current repository implementation and recorded acceptance evidence. Do not submit it as final until the release gates at the end are complete. Replace bracketed fields only with verified facts. Never present the Rovo/MCP branch as live until it has been deployed and accepted.

## Suggested category

**Apps for Software Teams**

## Short description

TraceBack brings source-linked Jira and delivery context into one investigation workspace, helping engineers see what is connected, what is missing, and what to verify next—without mistaking correlation for root cause.

## Project description

When a software incident appears in Jira, the issue rarely contains the full story. Related work may be spread across other Jira issues, Atlassian goals, deployments, and pull requests. Engineers lose time switching between systems and can easily overinterpret a nearby deployment or linked work item as the cause.

TraceBack Context Engine is a native Atlassian Forge Jira issue-context app. It reads the active Jira issue as the signed-in user, gathers linked Jira work and available Teamwork Graph evidence, and presents that context in one investigation panel. Each result retains its source link and relationship information. The panel distinguishes available, genuinely empty, partial, and unavailable evidence so a missing permission or failed connector is not presented as proof that no record exists.

TraceBack also ranks deterministic investigation leads from observed evidence and timestamps. Each lead explains why it is worth checking and points back to the source record. These are investigation suggestions—not root-cause predictions, probabilities, or claims of causation. The app does not invent telemetry, logs, traces, metrics, deployments, or pull requests when those systems are not connected.

The design is deliberately read-only. Jira and Teamwork Graph requests execute as the current user; linked content is treated as untrusted evidence; external links must be HTTPS; and the app does not roll back deployments, change feature flags, edit Jira issues, or perform production actions.

### What is implemented in the core app

- Native Forge `jira:issueContext` panel for Jira's new issue view.
- Current-user Jira issue retrieval and normalization.
- Related Jira work items with relationship labels and safe same-site links.
- Curated Teamwork Graph retrieval for linked Atlassian goals, external deployments, and external pull requests.
- Bounded pagination, stable-ID deduplication, request deadlines, and partial-result preservation.
- Explicit available, empty, partial, and unavailable states.
- Evidence-linked, deterministic investigation leads with rationale.
- Read-only behavior and non-causal language throughout the UI.
- Automated tests for domain logic, request deadlines, pagination, partial GraphQL results, URL safety, normalization, and frontend compilation.

### Rovo Agent and MCP extension — implementation candidate

A separate draft pull request, [PR #5](https://github.com/251fa04c84-boop/traceback-context-engine/pull/5), adds a read-only Rovo Agent and a Rovo MCP module that expose the same investigation action. The action validates issue keys, uses active Jira context when available, and performs reads as the invoking user.

**This extension is still a draft candidate, not part of the accepted core release.** Its current head `ad0899703d58615462d0119fb34f5d610522a304` is synchronized with the latest core documentation and passed **4,146 automated tests**, syntax/frontend checks, and authenticated Forge CLI manifest lint (push CI [#44100957991](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44100957991)). The feature-branch deployment step was skipped by design. Controlled test-site deployment, Rovo Agent discovery, MCP tool visibility, live action invocation, and permission-boundary tests remain outstanding. Rovo MCP is a Preview feature, not GA; external MCP use also requires administrator enablement, OAuth consent, and the invoking user's app consent entry for reliable `asUser()` calls.

## Why this is different

TraceBack focuses on **investigation evidence integrity**, not an AI-generated root-cause answer. It makes four things visible together:

1. **Provenance:** where each record came from and how it is linked to the issue.
2. **Completeness:** whether the source returned evidence, returned no records, returned partial data, or could not be queried.
3. **Permission boundaries:** evidence follows the signed-in user's access; missing access is not disguised as an empty result.
4. **Reasoned next checks:** suggestions explain which observed record or timestamp makes a follow-up worth investigating.

This is intended to reduce context-switching while keeping the engineer responsible for verifying the cause.

## Judge-criteria alignment

The official judging dimensions are equally weighted. This is an honest evidence map, not a claimed judge score.

| Dimension | TraceBack evidence | Remaining proof needed |
| --- | --- | --- |
| Technology | Native Forge Jira issue context; current-user Jira/Graph reads; bounded pagination and request deadlines; source URL validation; automated tests and frontend compilation. | Fresh Forge CLI validation and live acceptance on a separate test site with real linked records. |
| Design | Context appears inside the Jira issue; source links, relationship labels, and explicit available/empty/partial/unavailable states keep the investigation understandable. | Browser review with engineers, accessibility/usability feedback, and screenshots from the accepted build. |
| Impact | The workflow is designed to reduce system switching and prevent false conclusions from missing or correlated evidence. | A controlled user test with measured task time, system switches, and evidence-interpretation accuracy; no impact percentage is claimed yet. |
| Innovation | Evidence integrity, completeness and provenance are first-class product behavior; investigation leads are explicitly not root-cause predictions. | Demonstrate the advantage against a real incident workflow. Include Rovo/MCP only if the separate extension passes its acceptance gates. |
| Presentation | A real-Jira demo storyboard and under-five-minute structure are prepared. | Record and publish the actual accepted build, add accurate captions, and verify the public YouTube link. |

## Technology

- Atlassian Forge, Jira issue context module, UI Kit, Forge resolver, and Jira REST API.
- Atlassian Teamwork Graph curated GraphQL queries for linked goals, deployments, and pull requests.
- Node.js 24 runtime.
- Bounded asynchronous requests and pagination, deterministic normalization and ranking, source URL validation, and automated Node.js tests.

## Conditional bonus-prize write-ups

These are prepared for the submission form, but **select a bonus only after the corresponding integration is deployed and demonstrated end-to-end**.

### Best apps with Teamwork Graph integration — primary bonus candidate

TraceBack consumes Atlassian Teamwork Graph context for the active Jira work item. It queries linked Atlassian goals, external deployments, and external pull requests, preserves the source record and relationship context, and makes permission-limited, partial, empty, and unavailable results explicit. The app uses this context to suggest evidence-backed follow-up checks without claiming that a linked record caused the incident. The integration is read-only and respects the invoking user's access.

**Acceptance evidence required before selecting:** [Insert the accepted test-site issue key, real linked record types, source URLs, and browser-test evidence. Do not claim this bonus if the four granular scopes remain unapproved or the app's GraphQL path has not returned genuine linked records.]

### Best Agents — conditional extension candidate

TraceBack Investigator is a read-only Rovo Agent that invokes a Forge GET action to assemble the same Jira and Teamwork Graph investigation snapshot. It distinguishes observed facts, missing or partial evidence, and hypotheses; rejects issue-key mismatches with the active Jira context; and never offers production mutations or unsupported root-cause claims.

**Acceptance evidence required before selecting:** [Insert the Rovo agent discovery screenshot, live action invocation, returned evidence/source links, and permission-boundary test results after the rebased PR #5 is validated and deployed.]

### Best app with Atlassian MCP — conditional extension candidate

TraceBack Tools exposes the same read-only investigation action through Forge's `rovo:mcp` module. It is designed for Rovo Studio custom agents and, after explicit administrator enablement and OAuth 2.1 consent, third-party MCP-compatible clients. External MCP calls remain user-scoped and require the invoking user's app consent entry for reliable `asUser()` execution.

**Acceptance evidence required before selecting:** [Insert the enabled MCP tool screenshot, OAuth consent result, successful external client invocation, and evidence/permission checks. Rovo MCP is Preview, not GA; disclose this clearly.]

**Not currently targeted:** Best Marketplace published app. TraceBack is not yet published or submitted for Marketplace listing.

## Impact statement

The reproducible pilot plan, task wording, counterbalancing method, metrics, and raw-results template are in [docs/USER_VALIDATION_PROTOCOL.md](USER_VALIDATION_PROTOCOL.md). This is a protocol only; no participant results are claimed.


**Do not insert an unmeasured time-saved or incident-reduction percentage.** The current repository evidence establishes implementation and automated validation, not a measured customer outcome.

For a defensible impact claim, run a small controlled usability test with engineers:
- Ask participants to investigate the same Jira issue once using their normal workflow and once with TraceBack.
- Record task completion time, number of system switches, whether participants correctly distinguish missing data from empty data, and whether they can open the source for each finding.
- Report the number of participants, test tasks, median time difference, and limitations.
- If no test is completed, describe the expected benefit as a design goal, not a measured result.

**Measured result:** [Insert only after the test is run and the method/results are recorded.]

## Demo plan

Use the real Jira new-issue view and a test issue with genuine linked records. The planned video is 3:15–3:45 and must remain under five minutes.

1. State the incident-investigation context problem.
2. Open a real Jira issue and the TraceBack Investigate panel.
3. Show related Jira work and relationship labels.
4. Show genuine Teamwork Graph evidence and open its source links.
5. Demonstrate one empty or unavailable state and explain why it is not treated as proof of absence.
6. Show a ranked next check and its evidence rationale.
7. Close with the read-only and correlation-versus-causation boundary.

Do not show synthetic records as real integrations. Do not record the final video until the current build passes live acceptance. Captions must match the narration; publish the final video publicly on YouTube and verify that the link opens without sign-in.

**Demo video:** [Insert verified public YouTube URL after recording.]

## Release and submission checklist

- [ ] Latest application and Rovo PR revisions pass CI.
- [ ] Dependency remediation is independently reviewed; the `glob@14.0.2` override's cross-major compatibility is explicitly accepted or replaced by an upstream-compatible fix.
- [ ] A separate Atlassian test site is available.
- [ ] Organization administrator approves the four read-only Teamwork Graph scopes.
- [ ] Genuine linked Jira, goal, deployment, and pull-request records are tested where available.
- [ ] Fresh browser acceptance covers available, empty, partial, unavailable, source links, and permission-denied behavior.
- [ ] Rovo Agent and MCP are validated if they are included in the submitted feature claims.
- [ ] Judge installation link is created and tested by an account that is not the developer.
- [ ] Public YouTube demo is under five minutes and uses only genuine, non-sensitive test data.
- [ ] Final Devpost description, category, bonus write-up, screenshots, source repository, and video link are reviewed for accuracy.
- [ ] Eligibility, prize terms, and submission status are checked in the official Codegeist portal before final submission.

## Automated validation snapshot — 17 November 2026

These are separate branch results; do not add the counts together or imply that the dependency/Rovo candidate branches are already part of the core app release.

| Branch / purpose | Exact CI evidence | Test result | Security result | What CI did not prove |
| --- | --- | --- | --- | --- |
| `codegeist/forge-foundation` core app | Push [#44100446606](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44100446606), head `388ec1a159e715e9dafe900bcb3eaba925662a8b` | 4,130 passed; 0 failed; 0 skipped | 9 high, 4 moderate, 0 critical remain | The run passed syntax/frontend checks, authenticated Forge CLI lint and Forge development deployment/install check; no fresh browser acceptance or Teamwork Graph live-data acceptance. |
| `codegeist/rovo-investigator` candidate | Push [#44100957991](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44100957991), head `ad0899703d58615462d0119fb34f5d610522a304` | 4,146 passed; 0 failed; 0 skipped | Same 9 high and 4 moderate findings as the core base | Forge CLI manifest lint passed; feature-branch deployment was skipped. Rovo discovery, MCP visibility, live action invocation and permission-boundary acceptance remain unverified. |
| `security/glob-minimatch-experiment` candidate | Push [#603](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44099908018) and PR [#604](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44099917882), head `b42b792d771a134af24b2817f705f8d06700d2fe` | 4,134 passed; 0 failed; 0 skipped | Strict `npm audit --audit-level=low`: 0 vulnerabilities | Forge CLI lint passed on push; PR strict audit passed. `glob@14.0.2` still crosses `@forge/manifest@13.9.0`'s declared `^13.0.0` range; exact-tree live deployment/browser acceptance is outstanding. |

The core run's deployment is Forge **development** on the connected production Jira tenant, not a production environment or judge installation. The dependency and Rovo branches remain separate and unmerged. The core app itself is not vulnerability-free; the zero-finding audit applies only to the isolated dependency candidate. Do not select a bonus or claim live integration acceptance until the required end-to-end evidence is recorded.
