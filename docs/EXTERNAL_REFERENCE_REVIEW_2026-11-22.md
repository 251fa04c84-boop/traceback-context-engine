# External Reference Review: Incident Investigation Patterns (2026-11-22)

## Purpose and decision

This review evaluates the user-supplied public repositories as engineering references for TraceBack. It does not import or copy their source code. TraceBack remains an evidence-first, read-only Jira investigation app; all external patterns are subordinate to its current-user authorization boundary, explicit Graph availability states, bounded requests, and truthful uncertainty language.

## References inspected

- [Atlassian TWG CLI](https://github.com/atlassian/twg-cli) — public, agent-first Teamwork Graph CLI and agent integration surface. Its README emphasizes outcome-oriented agent workflows, public-safe documentation, and excluding customer data, private URLs, tokens, and internal runbooks.
- [Repowise](https://github.com/repowise-dev/repowise), especially [Change Records](https://github.com/repowise-dev/repowise/blob/main/docs/layers/CHANGES.md) — reconstructs changes from Git history, retains provenance and unknown metadata as unknown, exposes evidence checklists, and describes multi-signal suspect ranking. The repository is AGPL-3.0; this review uses conceptual observations only and does not copy implementation.
- [Incident Time Machine](https://github.com/mtc0205/incident-time-machine), especially [Design](https://github.com/mtc0205/incident-time-machine/blob/main/docs/DESIGN.md), [scoring.ts](https://github.com/mtc0205/incident-time-machine/blob/main/src/core/scoring.ts), and [changeCorrelator.ts](https://github.com/mtc0205/incident-time-machine/blob/main/src/core/changeCorrelator.ts) — separates a deterministic core from Forge adapters, scores historical incident similarity, ranks change candidates with factor explanations, and tests time-window boundaries. Its repository declares MIT; no code is copied.

- [Change Suspects](https://github.com/HyunsikParker/change-suspects) — Codegeist Forge app that ranks changes before an incident using time proximity, shared components/labels, text relevance, and recorded change risk. It supports an editable incident start, configurable 24-hour / 3-day / 7-day windows, and displays changes after onset (including rollbacks/hotfixes). Its UI presents verbal strength bands and evidence reasons rather than a bare score. Its Jira calls use the current user. The repository declares MIT; this review does not copy code.
- [Codegeist Incident Commander](https://github.com/akmalkhaniub/codegeist-2026-incident-commander) and [Problèmes cachés](https://github.com/BaptisteFaisy/problemes-caches) — adjacent Codegeist approaches for incident response automation and recurring-incident grouping. They are comparison points, not implementation dependencies.
- [TraceBack](https://github.com/251fa04c84-boop/traceback-context-engine) — authoritative implementation and release gate.

## Transferable engineering patterns

### 1. Keep evidence retrieval and inference separate

Incident Time Machine's pure scoring core / thin Forge adapter split is a useful architectural pattern. TraceBack already has a domain/service split and should preserve it:

1. Adapters retrieve Jira and Teamwork Graph records as the invoking user.
2. Normalizers validate identifiers, timestamps, source URLs, and record shapes.
3. Domain functions derive timelines and review leads deterministically.
4. UI and Rovo render the same normalized evidence and explanations.

Do not let Rovo independently invent a second investigation algorithm. It should consume the same normalized investigation result as the panel.

### 2. Make suspect ranking explainable, not causal

Incident Time Machine demonstrates factor-level explanations for time proximity, service overlap, and change breadth. Repowise demonstrates multi-signal ranking and warns that a missing suspect is not thereby cleared. These are useful ideas, but TraceBack's current inputs do not establish service ownership, deployment-to-service mapping, PR file impact, or verified change-risk metadata.

Recommended future contract for each candidate:

- Stable source identity and source URL.
- Source type and exact source timestamp field.
- Observed timestamp and distance from incident onset.
- Relationship/service match only when explicitly present in retrieved evidence.
- Individual factor contributions, with unavailable factors omitted rather than guessed.
- rankScore and priority band explicitly labelled as review ordering, never probability or root-cause confidence.
- A concise rationale and explicit counter-evidence / missing evidence.

Do not adopt another project's numeric weights or thresholds without a TraceBack-specific labelled evaluation set. In particular, a generic ±48-hour window, service-prefix heuristic, or PR-size proxy is not validated for this app's current Graph fields.

### 3. Capture incident onset and the post-onset window carefully

Change Suspects highlights two useful workflow details: incident onset can differ from issue creation time, and later changes (rollbacks or hotfixes) can be important counter-evidence. It also supports several investigation windows and uses recorded deployment time when available instead of treating resolution time as deployment time.

For TraceBack, an editable onset time is a possible future enhancement only if it is clearly attributed to the user who supplied it, stored with timezone/precision, and never silently replaces the Jira creation timestamp. A post-onset change should be shown as a later event, not ranked as a pre-onset cause. TraceBack must not add the competitor's “mark cause” write action while its product contract remains read-only; at most it can link to the source Jira record and let the user make changes in Jira under their own permissions.

### 4. Preserve uncertainty as first-class data

Repowise's change metadata keeps unavailable values null/unknown rather than inferring them. TraceBack should continue to distinguish available, empty, partial, and unavailable Graph states. An empty or permission-filtered Graph result must never be translated into “no related changes exist.”

The existing coverage model correctly distinguishes sources TraceBack queried from telemetry, logs, traces, alerts, feature flags, and runtime configuration that it does not query. Keep that boundary visible in both panel and Rovo output.

### 5. Use a deterministic core and shared agent surfaces

TWG CLI's agent-first design supports concise, outcome-oriented Rovo/MCP tool descriptions. The same TraceBack evidence contract should power the Jira panel, Rovo action, and MCP tool. Every surface should disclose the current evidence state, source links, and authorization boundary.

Do not install TWG CLI as a runtime dependency or use it to bypass Forge's asUser() access checks. It is a developer/agent workflow reference, not proof of the app's own Graph permissions.

## TraceBack-specific gap assessment

| Area | Current verified position | Safe next step |
|---|---|---|
| Jira issue context | Current issue is normalized; linked Jira work is represented | Keep issue-key/context binding and invoking-user retrieval |
| Teamwork Graph | Goals, external deployments, and external pull requests; bounded pagination and explicit partial/unavailable states | Add no new Graph categories until scope, schema, and runtime support are verified |
| Timeline | Jira, deployment, and PR timestamps are normalized; malformed or missing timestamps are not invented | Add regression tests for late-arriving events, ties, and source timestamp provenance |
| Suspect ranking | Deterministic review leads from observed statuses and temporal associations | Consider factorized explanations only when the source record supplies the factor |
| Historical similarity | No verified resolved-incident corpus or responder history is currently integrated | Treat as a separate future capability requiring real permitted Jira history and privacy review |
| Rovo/MCP | Static action and permission design exists | Prove live discovery, invocation, identical evidence output, and restricted-user behavior in staging |
| Demo data | No fabricated staging incidents are allowed | If a demo fixture is ever added, isolate it, label it synthetic in every surface, and never mix it with live results |

## Strategic positioning for Codegeist

TraceBack should differentiate on **defensible investigation evidence and honest uncertainty**, not on claiming autonomous root-cause detection. Change Suspects already occupies the focused pre-incident change-ranking workflow, while Incident Time Machine emphasizes historical incident memory and other Codegeist projects explore automation and recurring-incident grouping. “AI incident triage” alone is therefore a crowded claim. The sharper story is:

1. Start from the Jira issue the responder is actually viewing.
2. Retrieve linked work context under that user's permissions.
3. Reconstruct a bounded, source-linked timeline.
4. Rank review leads with transparent evidence and no causal overclaim.
5. Show what is missing, partial, or inaccessible.
6. Give the same result to the panel, Rovo, and MCP without widening permissions.

Primary prize strategy remains Apps for Software Teams. Best Teamwork Graph, Best Agents, and Atlassian MCP are conditional bonuses only after their respective live runtime and permission acceptance gates pass. Do not claim a category based on manifest presence or offline tests.

## Licensing and reuse boundary

- Repowise is AGPL-3.0: do not copy its code, tests, or substantial expressive documentation into TraceBack without a separate compatibility decision.
- Incident Time Machine is MIT: any future code reuse still requires preserving its copyright and license notice and a deliberate dependency/security review. This review does not copy its code.
- TWG CLI is Apache-2.0: no TWG CLI code is imported here.
- The Codegeist comparison repositories are not dependencies and should not be copied without checking their exact license and provenance.

## Acceptance gates unchanged

This research does not satisfy live acceptance. Keep PR #24 draft until a genuine non-production Jira incident, authentic linked Graph records, administrator-confirmed read scopes, and permitted/restricted user tests are available. No app install, scope approval, production change, or synthetic incident creation is authorized by this reference review.
