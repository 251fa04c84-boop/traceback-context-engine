# Codegeist 2026 eligibility and judge evidence plan

**Updated:** 21 November 2026  
**Candidate:** TraceBack Context Engine  
**Primary category recommendation:** Apps for Software Teams

## Official competition constraints

The official Codegeist 2026 rules specify:
- Forge app integrating at least one Atlassian product or platform capability.
- Three main categories: Apps for Software Teams, Apps for Business Teams, and Apps for Specialized Industries.
- Bonus categories for Best Agents, Atlassian MCP, Teamwork Graph integration, and Marketplace-published apps.
- A public YouTube demonstration shorter than five minutes, an installation link, complete setup instructions, a project description, and explanation of the Atlassian technology requirement.
- Stage one is a pass/fail viability screen; stage two scores technological implementation, design, impact, innovation, and presentation equally.
- One submission can win at most one grand prize and one bonus prize.

Official rules: https://codegeist2026.devpost.com/rules  
Official event page: https://codegeist2026.devpost.com/

## Current repository evidence

| Opportunity | Repository evidence | Status / proof still required |
|---|---|---|
| Apps for Software Teams | Jira issue-context panel, incident timeline, evidence-ranked next checks, Rovo investigation | Best fit by problem/audience; must verify installable end-to-end user journey |
| Best Agents | `manifest.yml` declares `rovo:agent` and binds the `get-traceback-investigation` action | Module is present; verify installed agent discovery, invocation and accurate output |
| Best app with Atlassian MCP | `manifest.yml` declares `rovo:mcp` and exposes `get-traceback-investigation` | Module/tool wiring is present; verify actual Atlassian MCP discovery and invocation |
| Best apps with Teamwork Graph | Forge service queries Teamwork Graph for linked goals, deployments and pull requests; read scopes are declared | Code path is present; verify real linked records in the Forge runtime under two user permission levels |
| Best Marketplace published app | No listing or Marketplace review ticket is evidenced in this repository snapshot | Not currently evidenced; do not claim eligibility until a listing or review ticket exists |

A manifest declaration is not the same as a working runtime integration. Do not claim a bonus prize is proven solely from the YAML.

## Recommended positioning

**TraceBack reconstructs an incident's delivery context from Jira and Atlassian Teamwork Graph, ranks the next checks with explainable deterministic rules, and exposes the same permission-aware evidence to a human issue panel and Rovo/MCP tools.**

Target the Software Teams grand-prize category. The current repository has formal integration points for Rovo Agent, Atlassian MCP and Teamwork Graph, but the judge-facing submission should emphasize only the integrations that pass live acceptance. The rules limit one submission to at most one grand prize and one bonus prize; multiple bonus integrations are useful product breadth, not multiple bonus wins.

## Judge-critical proof sequence

1. **Installability:** create a Forge sharing/install link for a dedicated, non-production test site; provide clear configuration steps and avoid automatic scope consent.
2. **Real incident path:** open a genuine Jira incident with linked Teamwork Graph deployment and pull-request records; show their source links, timeline and review leads.
3. **Evidence honesty:** demonstrate that empty, partial, unavailable and not-integrated sources are visibly distinct. Show that missing telemetry/logs are not represented as healthy or negative evidence.
4. **Agent parity:** ask the installed Rovo agent to investigate the same issue and compare its evidence, source links and caveats with the issue panel.
5. **MCP parity:** discover and invoke the exposed tool through Atlassian MCP; verify that it uses the invoking user's permissions and returns the same read-only evidence.
6. **Permission isolation:** repeat the investigation as a user who cannot access one linked record; prove the hidden record and URL do not leak through the UI, Rovo or MCP.
7. **Presentation:** make a public YouTube video under five minutes. Demonstrate the real app, not only screenshots or a fabricated fixture. Explain the problem, the evidence flow, the agent/MCP experience and the limits.

## Five-minute demo structure

- 0:00–0:25 — Incident investigation problem and target user.
- 0:25–1:15 — Open a real Jira incident and show the linked evidence.
- 1:15–2:10 — Explain the provenance-aware timeline and deterministic review leads.
- 2:10–3:00 — Show source coverage and the handling of partial/unavailable evidence.
- 3:00–3:50 — Run the same investigation through Rovo and MCP.
- 3:50–4:30 — Demonstrate permission boundaries and read-only behavior.
- 4:30–4:55 — Summarize impact and the verified limitations.

Do not record this demo until the exact build used in the recording has passed CI and live acceptance. Never show private customer data or secrets.

## Release decision

The candidate remains draft. Do not merge, deploy to production, approve new scopes, install/upgrade on the connected production tenant, or create artificial Jira/Confluence records to make the demo look complete. A separate authorized staging site and genuine linked records are required for the remaining acceptance work.


## Strategic update — 22 November 2026

### Verified engineering baseline

- Current PR #24 head: `cfd9f36a42f56e6c499885fb1889d9c9e6bffb21`.
- Exact PR-head workflow [#44981590219](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44981590219) completed successfully. The actual job log confirms lockfile installation, ProseMirror dependency validation, syntax lint, frontend compilation and **4,193 tests passed, 0 failed, 0 skipped**.
- Candidate dependency audit remains **0 high, 6 moderate, 0 critical**. This is not a clean audit and not a vulnerability waiver.
- Forge CLI validation and development deployment were skipped on the pull-request event. This run does not prove a Forge deployment or live app runtime.
- PR #24 remains draft, open and unmerged.

### Prize strategy — optimize for proof, not category count

The rules permit at most one grand prize and one bonus prize per submission. Therefore, do not dilute the judge narrative by presenting every category as an equal target.

1. **Primary: Apps for Software Teams.** Lead with the incident-response workflow and the concrete problem: reconstructing delivery context without making unsupported causal claims.
2. **Bonus candidate: Best Teamwork Graph.** This is the strongest differentiated bonus if, and only if, real Graph records are returned in Forge runtime and the permitted/restricted-user comparison passes.
3. **Best Agents and Atlassian MCP: supporting product breadth.** Demonstrate the same action through Rovo and MCP only after live discovery, invocation and permission-boundary acceptance. Do not present a declared manifest module as a verified integration.
4. **Marketplace: not a current target.** No listing or Marketplace review ticket is evidenced. Do not spend critical staging time on it before the core installable journey is proven.

### Judge-proof narrative

The single memorable claim should be: **“TraceBack helps incident responders see what the delivery evidence supports, what it does not support, and exactly what to verify next.”**

Demonstrate it in this order:
- Start with one genuine incident and a short, credible responder pain point.
- Show original Jira and linked Graph source records with provenance.
- Show how the timeline and deterministic leads narrow the next checks without claiming root cause.
- Deliberately show one missing/partial/unavailable source and explain why it is not equivalent to an empty source.
- Compare the same investigation through the Jira panel and Rovo; add MCP only if it has passed a real invocation.
- Show the restricted user's result and prove inaccessible records are not leaked.

Do not spend demo time on architecture slides, generic AI claims, simulated Graph data, or unverified product capabilities. Keep a sanitized evidence log tying every demo screen to the installed version, commit, user role and observed result.

### Next gate sequence

| Priority | Gate | Exit evidence |
|---|---|---|
| P0 | Exact-head CI | Run #44981590219 successful on current head; recorded above |
| P0 | Dependency decision | Upstream-compatible patched tree or explicit owner-approved risk decision; no force override |
| P0 | Real staging incident | Existing, approved issue with authentic linked Graph records |
| P0 | Scope and permission check | Admin-confirmed read scopes and permitted/restricted-user test results |
| P1 | Forge app runtime | Installed candidate SHA/version and successful panel result |
| P1 | Rovo parity | Live action result compared with panel for the same user and issue |
| P1 | MCP proof | Admin enablement, OAuth, discovery and invocation evidence |
| P2 | User study | 5–8 engineers, raw anonymized observations, no unsupported impact claims |
| P2 | Submission package | Install link, setup guide, public demo under five minutes, exact build identity |

### Current blocker ownership

The remaining P0 blockers require staging-owner/admin participation, not additional speculative code. The staging snapshot records project KAN with zero issues; connector-side Confluence/Graph results are not a substitute for Forge runtime evidence. Do not create synthetic issues or linked records. Ask the staging owner for a genuine incident, two approved test users with different access, and explicit confirmation of the four read-only Teamwork Graph scopes.

### Release posture

Keep PR #24 draft and unmerged. No production deployment, install/upgrade, scope approval, data mutation, or fabricated evidence. A successful CI run is a code-quality gate, not competition readiness by itself.


### CI provenance correction — 22 November 2026

A review of the raw logs for PR runs #44981401866 and #44981590219 found that GitHub checked out the synthetic `refs/pull/24/merge` commit, even though each run's metadata recorded the PR head SHA. Their passing test results are valid for the tested merge result, but they must **not** be described as tests executed on the PR head commit itself.

To close this evidence gap, `.github/workflows/ci.yml` now explicitly checks out `github.event.pull_request.head.sha` for pull-request events (and `github.sha` for push events), then verifies `git rev-parse HEAD` against that expected SHA before installing dependencies or running tests. The resulting new CI run must pass before this workflow correction is considered accepted. Until then, exact-head validation is pending.

This correction does not change the app runtime, manifest, dependency tree or deployment configuration. It does not install, deploy, merge or grant scopes.
