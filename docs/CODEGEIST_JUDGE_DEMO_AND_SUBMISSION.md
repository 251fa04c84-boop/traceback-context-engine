# Codegeist 2026 judge demo and submission package

**Candidate:** TraceBack Context Engine  
**Recommended grand-prize category:** Apps for Software Teams  
**Potential bonus:** Best Teamwork Graph, only after live Teamwork Graph acceptance  
**Candidate baseline:** PR #23 head `3c2760c41ac31bc317036f43c66c58d829e12ea7`  
**Status:** Draft preparation package. This document does not claim a staging installation, live Rovo invocation, external MCP invocation, or permission-isolation test has passed.

## Submission description (review-ready draft)

TraceBack Context Engine helps software teams investigate Jira incidents without confusing correlation with causation. It gathers the Jira issue and the linked delivery context available through Atlassian Teamwork Graph, then presents a provenance-aware incident timeline, deterministic ranked investigation leads, and an evidence-coverage ledger.

Every finding is tied to the source records that were actually returned. The coverage ledger distinguishes observed Jira data, available/partial/empty/unavailable Teamwork Graph results, and operational systems that are not integrated. A nearby deployment or related issue is presented as a lead to verify—not as proof of root cause.

The same read-only investigation is available in the Jira issue panel and through a Rovo action. A declared Rovo MCP tool can expose that action to compatible clients after an administrator explicitly enables it and the user completes OAuth consent. All Jira and Teamwork Graph reads are made as the invoking user. The app does not perform rollbacks, change feature flags, edit Jira issues, or execute production remediation.

**Problem:** During an incident, responders must manually reconstruct context across Jira and delivery records. This consumes time and encourages unsupported assumptions when evidence is missing or access is partial.

**Approach:** TraceBack assembles the available records, preserves source and timestamp provenance, ranks deterministic next checks, and makes gaps explicit.

**Atlassian technology:** Forge Jira issue context, Rovo Agent/action, Rovo MCP, and Teamwork Graph.

**Audience and impact:** Incident responders, SREs, platform engineers, and software delivery teams. The intended impact is faster, more disciplined investigation—not automatic root-cause claims or autonomous production changes.

**Honest limitations:** Telemetry, logs, traces, alerts, feature-flag history, and runtime configuration are not currently integrated. Teamwork Graph access depends on the app's declared scopes, admin-granted scopes, connector availability, and the user's own permissions. Rovo and external MCP must be verified in a real installed staging environment before being described as live integrations in the final submission.

## Five-minute public demo script

Record only after the exact build used in the recording has passed CI and the staging acceptance matrix below. Use a dedicated non-production site and approved, non-sensitive incident data. Target duration: 4:40–4:55.

| Time | Screen/action | Narration |
|---|---|---|
| 0:00–0:25 | Title and real incident context | "Incident responders often have to reconstruct delivery context from scattered records. TraceBack makes the evidence and the gaps visible in one investigation." |
| 0:25–1:10 | Open the genuine Jira incident and launch TraceBack | "The investigation starts from the Jira issue itself. TraceBack reads it with the current user's Jira permissions and preserves the source issue." |
| 1:10–1:55 | Show linked goals, deployments and pull requests, with source links | "Where Teamwork Graph returns linked delivery records, each item remains traceable to its source. A link or nearby timestamp is a lead—not proof that the change caused the incident." |
| 1:55–2:40 | Show timeline and ranked investigation leads | "The timeline uses explicit timestamp provenance. Ranked leads are deterministic next checks with explanations, not invented probabilities or an asserted root cause." |
| 2:40–3:15 | Show evidence coverage states | "The ledger distinguishes available, partial, empty, unavailable and not-integrated sources. An empty or inaccessible result is never presented as proof that no evidence exists." |
| 3:15–3:55 | Investigate the same issue through installed Rovo Agent | "The Rovo action returns the same read-only evidence model. We compare the source records, timeline, leads and coverage against the Jira panel." |
| 3:55–4:25 | If accepted, show external MCP discovery and invocation; otherwise show the setup guide and label it not yet verified | "The same GET action can be exposed through Atlassian MCP after an administrator enables the tool and the user grants OAuth consent. This step is shown as live only if the actual invocation has been captured." |
| 4:25–4:45 | Show permitted/restricted user comparison and close | "The app respects each user's access. TraceBack helps teams investigate from evidence while keeping uncertainty and permission boundaries explicit." |

**Fallback if Rovo Teamwork Graph fails in the staging environment:** Do not hide the failure or substitute fixture data. Show the Jira investigation still working, show Graph as unavailable/partial with its warning, and state that the Graph-in-Rovo runtime path remains under validation. Do not claim Best Teamwork Graph acceptance until it passes.

## Staging acceptance prerequisites

A staging administrator and project owner must supply:
- A dedicated, authorized, non-production Atlassian site where this app may be installed.
- A genuine existing Jira incident key with authentic linked Teamwork Graph goal, deployment and/or pull-request records.
- Two approved test accounts: one allowed to see the linked records and one deliberately lacking access to at least one linked record.
- Confirmation that the test data and resulting screenshots/video may be used in a public hackathon submission.

Do not send passwords, API tokens, OAuth codes, customer data, or personal information in this repository or chat. Do not use the previously connected tenant if it is production or lacks explicit staging authorization. Do not create artificial Jira or Confluence records to manufacture a successful demo.

## Acceptance matrix — record actual evidence, not assumptions

For every row, capture candidate version/SHA, timestamp, test user role (not account ID), expected result, observed result, and a sanitized screenshot or log reference.

| Test | Procedure | Pass condition | Current status |
|---|---|---|---|
| Build identity | Record installed Forge app version and source SHA | Matches the candidate under test | Not run: staging install not authorized |
| Jira panel | Open the genuine incident and investigate | Issue is read as current user; source link and issue key match | Unit-level path tested; live not verified |
| Teamwork Graph in panel | Inspect linked goal/deployment/PR evidence | Returned records and links are genuine; missing scopes/access are not represented as empty truth | Unit fixtures only; live not verified |
| Rovo agent | Invoke TraceBack Investigator for same issue | Agent is discovered; action succeeds; evidence/coverage matches panel | Not live verified |
| Teamwork Graph in Rovo | Repeat Graph retrieval through Rovo action | Same expected records or explicit unavailable/partial fallback; no silent false-empty | Not live verified; known platform risk to test |
| External MCP enablement | Admin enables TraceBack Tools for this staging installation | Tool appears only after per-installation admin enablement | Not live verified |
| MCP OAuth and discovery | Connect an MCP client using the endpoint derived from the installed app ID | OAuth 2.1 consent completes; only expected site/tool is exposed | Not live verified |
| MCP invocation | Invoke `get-traceback-investigation` for the same issue | Read-only response matches the other surfaces for the same user | Not live verified |
| Restricted-user test | Repeat panel, Rovo and MCP as restricted user | No inaccessible record, URL, title or content leaks; Jira fallback remains usable | Not live verified |
| Scope denial | Disable one Graph scope in staging after admin approval, then retest | Missing scope is surfaced as partial/unavailable or ambiguous empty with a warning; no false claim of completeness | Not live verified |
| Read-only boundary | Review available tools and attempt no mutation operation | Only the declared GET investigation tool is exposed; no issue edits or production actions | Static manifest/code audit only |
| Public demo safety | Review recording frame-by-frame | No secrets, tokens, private customer information or fabricated runtime state | Not recorded |

### MCP endpoint and admin flow

Use the UUID from the exact installed candidate's `manifest.yml`, not a stale copied value:

`https://mcp.atlassian.com/forge/<UUID-from-app.id>`

An administrator must explicitly enable the exposed tool for that app installation in Atlassian Administration. The MCP client then completes OAuth 2.1 consent; the user selects the intended installed site and reviews the app scopes/tools. Do not put OAuth tokens or client credentials in the submission.

## Security and permission audit record

Static inspection of the PR #23 candidate shows:
- `rovo:mcp` exposes only `get-traceback-investigation`.
- The action is declared with `actionVerb: GET`; its only declared input is an optional Jira issue key.
- The action obtains Jira data using `api.asUser().requestJira(...)`.
- Teamwork Graph reads are performed using `api.asUser().requestTeamworkGraph(...)`.
- The action does not use `api.asApp()`, Jira write APIs, deployment APIs, rollback APIs, or feature-flag mutation APIs.
- The requested Teamwork Graph scopes correspond to the queried object types: `read:graph:issue:jira`, `read:graph:goal:atlassian`, `read:graph:deployment:external`, and `read:graph:pull-request:external`. The Jira REST read uses `read:jira-work`.
- The active Jira issue context is authoritative; a supplied issue key must match it. Issue keys are validated before being interpolated into the Jira route.
- Graph requests have per-request and total time bounds; unavailable Graph evidence does not prevent the Jira issue from being returned.
- The evidence model explicitly says linked records and timing do not prove causation.

**Boundary of this audit:** These are code/manifest findings, not proof of runtime enforcement. Actual two-user access isolation, admin scope toggles, OAuth consent, MCP tool discovery and Rovo action invocation must be tested on the authorized staging site.

## Platform-specific risk to test

A recent Atlassian developer-community report describes Teamwork Graph succeeding in a Forge UI resolver but failing inside a Rovo action for the same user and query. This report is not an official platform guarantee or proof that this app will fail. It is a concrete reason to test the exact Rovo action path on staging. If it fails, preserve the Jira-only investigation and mark Graph unavailable/partial; do not fabricate or cache another user's records to work around it.

## Submission checklist

- [ ] Confirm official Devpost entry fields and final deadline directly before submission.
- [ ] Select Apps for Software Teams as the primary category unless official rules or product evidence materially change.
- [ ] Claim Best Teamwork Graph only after live graph evidence is captured; claim Best Agents/MCP only after their real invocation is recorded.
- [ ] Provide install link for the exact judge-ready candidate and clearly identify required admin actions/scopes.
- [ ] Publish a public YouTube video shorter than five minutes, in English, matching the exact build and staging behavior.
- [ ] Include setup steps, test issue prerequisites, expected outputs, limitations and failure behavior.
- [ ] Explain Forge, Jira, Rovo, MCP and Teamwork Graph usage accurately.
- [ ] Remove all secrets and private data from repository, logs, screenshots and video.
- [ ] Keep this candidate draft until staging acceptance and submission assets are reviewed.
- [ ] Never claim a live test, bonus eligibility, deployment, or Marketplace publication without its corresponding evidence.

## Current verified engineering baseline

PR #23 exact head: `3c2760c41ac31bc317036f43c66c58d829e12ea7`. GitHub Actions run `44920415294` completed successfully on the pull-request merge ref containing this head. The job ran `npm ci`, ProseMirror dependency-tree validation, dependency audit, `npm test` (4,192 passed; 0 failed; 0 skipped), syntax check, and frontend bundle check. Forge CLI lint and deployment steps were skipped by workflow conditions. The audit reported six moderate vulnerabilities; do not use force upgrades or major downgrades without compatibility evidence.

This baseline is not a substitute for Forge CLI validation, a staging install, real Rovo/MCP invocations, or the two-user permission tests.
