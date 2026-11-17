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

**This extension is not yet part of the accepted core release.** It must pass latest-head CI, Forge manifest validation, controlled test-site deployment, Rovo Agent discovery, MCP tool visibility, action invocation, and permission-boundary tests before the submission may describe it as a working integration. Rovo MCP is a Preview feature, not GA; external MCP use also requires administrator enablement, OAuth consent, and the invoking user's app consent entry for reliable `asUser()` calls.

## Why this is different

TraceBack focuses on **investigation evidence integrity**, not an AI-generated root-cause answer. It makes four things visible together:

1. **Provenance:** where each record came from and how it is linked to the issue.
2. **Completeness:** whether the source returned evidence, returned no records, returned partial data, or could not be queried.
3. **Permission boundaries:** evidence follows the signed-in user's access; missing access is not disguised as an empty result.
4. **Reasoned next checks:** suggestions explain which observed record or timestamp makes a follow-up worth investigating.

This is intended to reduce context-switching while keeping the engineer responsible for verifying the cause.

## Technology

- Atlassian Forge, Jira issue context module, UI Kit, Forge resolver, and Jira REST API.
- Atlassian Teamwork Graph curated GraphQL queries for linked goals, deployments, and pull requests.
- Node.js 24 runtime.
- Bounded asynchronous requests and pagination, deterministic normalization and ranking, source URL validation, and automated Node.js tests.

## Impact statement

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

## Current verified limitations

- The connected Atlassian account has only one available site; no separate test organization or representative Jira Software test project has been verified.
- The four granular Teamwork Graph scopes were last observed unchecked/disabled. Real linked goal/deployment/pull-request acceptance is outstanding.
- The current core application branch reports 9 high and 4 moderate npm audit findings. A separate draft dependency PR reports zero audit findings, but its scoped `glob@14.0.2` override crosses the declared `@forge/manifest@13.9.0` semver range and requires independent compatibility review.
- A prior Forge development deployment succeeded, but fresh browser acceptance of that exact deployed dependency tree is not recorded.
- No judge installation, final public demo video, Marketplace publication, or final Devpost submission is verified.

## Final positioning

TraceBack is an evidence-first Jira investigation companion. Its promise is not “AI knows the root cause.” Its promise is “the engineer can see the evidence, its provenance, its completeness, and the next thing worth verifying—without being misled by missing data or correlation.”
