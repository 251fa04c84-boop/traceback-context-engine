# TraceBack Context Engine — Release Readiness & Codegeist Strategy

**Snapshot:** 20 November 2026, 08:55 IST  
**Candidate branch:** `codegeist/rovo-integrated`  
**Candidate commit before this record:** `8b23462ddc27f5d9c0431de4a7e3bd9c6e14e5a5`  
**Primary PR:** [#9 — Rovo Agent and MCP candidate](https://github.com/251fa04c84-boop/traceback-context-engine/pull/9)  
**Security PR:** [#12 — ProseMirror remediation candidate](https://github.com/251fa04c84-boop/traceback-context-engine/pull/12)

This file is a dated evidence snapshot. It supersedes older status statements only where the facts below are newer. It does not mark the project release-ready.

## 1. Repository and pull-request state

### PR #9 — Rovo/MCP candidate

- Open, draft, unmerged; base `codegeist/forge-foundation`, head `codegeist/rovo-integrated`.
- Current PR head observed: `8b23462ddc27f5d9c0431de4a7e3bd9c6e14e5a5`.
- Push CI [#44666603732](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44666603732) completed successfully. The actual job steps show lockfile install, dependency audit report, unit tests, syntax checks, frontend bundle check and authenticated Forge CLI lint all completed successfully. Forge CLI output included **“No issues found.”** Deployment and site installation steps were skipped.
- PR CI [#44666609583](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44666609583) completed successfully. The PR workflow intentionally skipped authenticated Forge CLI lint and deployment; do not represent the PR event as having run those steps.
- The push log reports **13 dependency vulnerabilities: 9 high and 4 moderate**. The audit is report-only for high/moderate findings. This is not a clean dependency audit.
- No submitted reviews or inline review threads were returned for PR #9 at this check.

### PR #12 — isolated ProseMirror remediation

- Open, draft, unmerged; base `codegeist/rovo-integrated`, head `security/rovo-current-prosemirror`.
- Head observed: `1b6a1fecaf53b20d85f01ead6f46b0fa4d546e0a`.
- Comparison against the current Rovo branch is **diverged: 10 commits ahead and 8 behind**; merge base is `1e51e1f2b863198acf753d590e7fc9fd4514c644`. Do not merge or assume it includes the latest Rovo candidate.
- Exact-head push CI [#44334621435](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44334621435) completed successfully. Job steps show `npm ci`, the ProseMirror dependency-tree validation, audit report, unit tests, syntax checks, frontend compilation and authenticated Forge CLI lint all completed successfully; Forge CLI output included **“No issues found.”** Deployment was skipped.
- The PR's recorded audit result is **0 high, 6 moderate, 0 critical**. It is a partial remediation, not an audit-clean release.
- Next safe engineering step for this PR is a fresh isolated branch update/rebase plan and exact-head validation. Do not rewrite the existing PR branch or merge it as part of routine automation.

## 2. Staging tenant — new read-only access finding

The connected Atlassian resources now include **`https://brand7.atlassian.net`**, so the earlier statement that this tenant was not exposed to the connector is no longer current.

Read-only checks performed on 20 November:

- `listJiraProjects` returned one project: **My Kanban Space (KAN)**, ID `10000`, type `software`, with `totalIssueCount: 0`.
- `listJiraBoards` returned one simple board: **KAN board**, ID `1`.
- JQL `project = KAN ORDER BY updated DESC` returned no issues.
- Teamwork Graph context lookup using object type `JiraSpace` and identifier `KAN` failed with: **“Could not resolve 'KAN' to an ARI.”**
- Follow-up Graph lookups using the visible board URL and project-settings URL also failed to resolve those URLs to an ARI.

Interpretation:
- The connector can now read the staging Jira project and board inventory.
- There is still no issue to use for an end-to-end test.
- The failed Graph lookups are identifier-resolution failures. They are **not** proof that Graph scopes are denied, nor proof that Forge runtime Graph access works.
- ChatGPT's Atlassian connector and the Forge app's `api.asUser().requestTeamworkGraph()` are distinct authorization paths.

No Jira issue, project, board, relationship, permission, or scope was created or changed.

## 3. Forge implementation and authorization boundary

The current manifest requests:
- `read:jira-work`
- `read:graph:issue:jira`
- `read:graph:goal:atlassian`
- `read:graph:deployment:external`
- `read:graph:pull-request:external`

The Rovo agent and action are declared read-only. The action fetches Jira data as the invoking user, uses the curated Teamwork Graph query, and describes relationships as investigation leads rather than proof of causation. It does not declare a Jira mutation action.

The current Graph service has request and total-duration limits, per-category pagination, deduplication, partial-error handling, and unavailable/truncated states. These are source-level observations and unit-test targets, not live Graph acceptance.

**Not verified:** administrator consent for the four granular Graph scopes, effective Forge runtime access, positive linked goal/deployment/PR records, Rovo agent discovery, Rovo action invocation, Rovo Studio MCP visibility, and browser-level staging acceptance.

## 4. Dependency/security decision

- Main Rovo candidate audit remains **9 high / 4 moderate / 0 critical**.
- PR #12 narrows the findings but leaves **6 moderate** and is diverged from the current candidate.
- The separate `glob@14` override experiment crosses the declared `@forge/manifest@13.9.0` `glob@^13.0.0` range. Do not promote it as an upstream-compatible fix without independent compatibility evidence.
- Do not apply `npm audit fix --force`, major Forge downgrades, prerelease Forge packages, or overrides that cross upstream ranges without a supported compatibility case and full validation.
- Keep the existing app dependencies and security PRs isolated until a compatible path is established.

## 5. Codegeist strategy

**Primary category:** Apps for Software Teams.

**Positioning:** TraceBack should be presented as an evidence-grounded investigation workspace that connects Jira work to delivery context and explicitly distinguishes facts, missing evidence, partial access, and hypotheses. Its differentiator is trustworthy investigation, not an unsupported claim that AI can identify root cause automatically.

### Recommended competition path

1. Prioritize a working Rovo Agent and a complete, reproducible user journey.
2. Treat **Best Agents** as the conditional bonus target only if agent discovery, a real action invocation, and permission-boundary tests pass. Do not claim Teamwork Graph or Atlassian MCP bonus eligibility until those specific live gates pass.
3. If no bonus integration is demonstrably accepted by submission time, submit in the main category without a bonus claim rather than overstate capabilities.
4. Build the judge narrative around one real issue: issue context → linked Jira work → available Graph evidence → ranked investigation leads → explicit missing/unknown evidence → next verification steps.
5. Show empty, partial and unavailable states honestly. Every positive claim should have a source link; temporal proximity and issue relationships must never be narrated as proof of causation.
6. Optimize all five judging dimensions equally: technological implementation, design, potential impact, innovation/idea, and presentation. A clean, short, working demonstration is more valuable than adding unverified integrations.
7. Keep the judge path low-friction: clear installation prerequisites, minimum scopes, test steps, no paid-service dependency, and a public demo video under five minutes.

The existing submission checklist records the official deadline as **22 December 2026, 12:00 p.m. Pacific Time** (23 December, 1:30 a.m. IST). Recheck the [official rules](https://codegeist2026.devpost.com/rules) immediately before submission in case they change.

## 6. Release gates and next actions

| Gate | Current state | Next safe action |
|---|---|---|
| Candidate CI / Forge lint | Passed on PR #9 push head | Keep collecting exact-head evidence after every code change |
| Main dependency audit | Open: 9 high, 4 moderate | Identify supported upstream fixes; no forced upgrades |
| PR #12 compatibility | Partial patch; 10 ahead / 8 behind | Prepare isolated rebase/update only after reviewing diff and conflicts |
| Staging issue data | Blocked: 0 issues | Staging owner supplies an existing representative issue with authentic linked evidence, or explicitly creates a clearly labelled test issue and links genuine records |
| Graph scope consent | Not verified | Site/org administrator reviews and explicitly approves the four read-only scopes on staging only |
| Forge Graph runtime | Not verified | Re-test after admin consent using the real issue; capture raw status safely and surface only sanitized outcomes |
| Rovo discovery/action | Not verified | Test discovery, invocation, active-issue binding, mismatch rejection, and unauthorized-user boundaries |
| MCP visibility | Not verified | Test Rovo Studio visibility; test external MCP/OAuth only if the intended judge flow requires it |
| Browser acceptance | Not verified for current candidate | Run the staged UI acceptance matrix after a valid issue and authorization are available |
| Judge installation/demo | Not ready | Prepare the judge install path and record a real under-five-minute demonstration after live acceptance |

### Minimum external prerequisite

A staging site/org administrator must **approve the four read-only Teamwork Graph scopes on `brand7.atlassian.net`**, and the staging owner must provide a representative Jira issue key with authentic linked evidence. Until those prerequisites exist, live Graph acceptance is blocked.

## 7. Safety record

This pass used read-only GitHub and Atlassian inspection plus a documentation-only GitHub commit. No production deployment, production installation, site upgrade, scope approval, PR merge/closure, permission grant, arbitrary Jira/Confluence data creation, or secret disclosure was performed.

**Release decision: NOT READY. Keep PR #9 and PR #12 draft and unmerged.**
