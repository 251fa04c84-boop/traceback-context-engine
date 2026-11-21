# External Repository Review and Adoption Plan — 21 November 2026

**Candidate:** `codegeist/rovo-integrated`  
**Reviewed candidate head:** `06701c80b172b8a5d8064ba1d2bf61f7c2863747`  
**Purpose:** accelerate TraceBack with proven external patterns without importing unnecessary dependencies, weakening the read-only boundary, or copying a competing submission.

This is a source-inspection record, not a claim that the reviewed repositories were integrated or that their advertised runtime behavior was independently reproduced.

## Executive decisions

- Use Atlassian's Forge Skills as a review methodology and current-documentation aid; do not add it as a runtime dependency.
- Use Atlassian's Forge Inspired examples as manifest and Rovo interaction references; preserve TraceBack's read-only action contract.
- Treat Atlassian's hosted MCP server as a separate integration/authentication reference. It does not replace TraceBack's app-specific `rovo:mcp` module.
- Learn from Precedent's per-viewer filtering, bounded Teamwork Graph query construction, and focused permission tests. Do not copy its decision-ledger product or assume its README claims are proven by its checked-in unit tests.
- Learn from DRS's code-diff evidence idea, but reject its keyword-based culprit heuristic, stored Bitbucket token pattern, Jira write action, broad write scope, and unsafe-inline/unsafe-eval CSP settings.
- No third-party runtime dependency or source file is copied by this review.

## Repository-by-repository findings

### 1. Atlassian Forge Skills — Apache-2.0

Repository: https://github.com/atlassian/forge-skills

Inspected the repository README and these skill definitions:
- `skills/forge-security-review/SKILL.md`
- `skills/forge-app-review/SKILL.md`
- `skills/forge-debugger/SKILL.md`
- `skills/forge-cost-optimizer/SKILL.md`
- `skills/forge-connector/SKILL.md`

Useful practices to apply to TraceBack:
- Read the manifest first and map modules, scopes, resources, functions, runtime, and egress.
- Trace UI entry points through bridge calls, resolvers, and backend API calls.
- Separate user authorization from app authorization; review `asUser()` and `asApp()` paths explicitly.
- Review injection, tenant isolation, secrets, egress, public entry points, and agent-specific boundaries.
- Bound API calls, pagination, concurrency, payload sizes, logs, and invocation time without weakening authorization.
- Treat static-analysis tools that were not actually run as a coverage gap, never as a clean result.

**Not executed in this pass:** the skill's deterministic FSRT/OpenGrep scripts. The connected GitHub interface provided source inspection and CI evidence, but not a local checkout in which to run those scripts. This remains a security-review coverage gap.

### 2. Atlassian Forge Inspired — Apache-2.0

Repository: https://github.com/atlassian-labs/forge-inspired

Inspected the repository README and the `sprint-ready-agent/manifest.yml` example.

Useful patterns:
- Keep Rovo behavior explicit and task-bounded in the agent prompt.
- Use the manifest's action description and input contract to constrain what the agent can request.
- Make the user confirmation boundary explicit before any write action.
- Keep UI Kit resources, resolver wiring, and module declarations aligned.

TraceBack decision:
- Preserve the current read-only `GET` investigation action.
- Do not import write-capable actions from examples merely to make the agent appear more powerful.
- Keep facts, missing evidence, partial access, and hypotheses separate in the agent's output.

### 3. Official Atlassian MCP Server — Apache-2.0

Repository: https://github.com/atlassian/atlassian-mcp-server

Inspected the README and license. The README describes Atlassian's hosted MCP server, supported Atlassian products, and OAuth 2.1 / API-token authentication.

Useful patterns:
- Treat MCP exposure as an explicit administrator-controlled integration.
- Make the authentication model and required consent visible in judge setup instructions.
- Distinguish an app's own Rovo MCP tools from Atlassian's hosted MCP endpoint.

TraceBack decision:
- Keep the app-specific `rovo:mcp` module as the source of TraceBack investigation tools.
- Do not add a second MCP server or duplicate Atlassian APIs without a concrete judge/client requirement.
- External MCP/OAuth acceptance remains a separate live gate; a manifest declaration alone is not proof of external client access.

### 4. Precedent — MIT; direct Codegeist 2026 competitor

Repository: https://github.com/vanichitkara/precedent

Inspected its README, manifest, `src/permissions.ts`, `src/resolvers.ts`, `src/twg/client.ts`, `src/actions.ts`, `prompts/agent.md`, `test/permissions.test.ts`, and `test/twg.test.ts`.

Useful engineering patterns:
- Re-check source-record visibility for the current viewer before returning records captured or stored by the app.
- Fail closed when the authorization check is unavailable.
- Batch page visibility checks and deduplicate identifiers.
- Bound Teamwork Graph query fan-out and cap related objects.
- Test hidden records, malformed identifiers, failed authorization checks, null Graph relationships, and duplicate results.
- Require the agent to call tools for current facts and cite only links returned by those tools.

Important caution:
- In the inspected implementation, `linksForViewer` re-checks document/page links but retains non-document link types without an equivalent per-object re-check in that helper. Do not copy this cached-link pattern into TraceBack unless each cached object type is proven safe for every viewer.
- The README describes a two-account permission test, while the checked-in `test/permissions.test.ts` uses a mocked `SourceAccess` implementation. The checked-in unit test is useful, but it does not itself demonstrate a live two-account staging acceptance test.

Competitive positioning:
- Precedent focuses on preserving and checking team decisions.
- TraceBack should remain differentiated around incident investigation: issue context, source-linked delivery evidence, completeness/access status, ranked leads, and next verification steps.
- Do not copy its product concept or submission narrative.

### 5. DRS Debug System — MIT

Repository: https://github.com/vero-code/drs-debug-system

Inspected its README, manifest, and `src/index.js`.

Potentially useful idea:
- A linked code diff can provide concrete supporting evidence for an investigation.

Patterns rejected for TraceBack:
- Searching commit messages for keywords such as `auth`, `fix`, or `hotfix` is not reliable root-cause analysis.
- The inspected implementation reads a Bitbucket token from Forge Storage and sends it as a bearer token to an external API.
- It uses `asApp()` to create Jira issues and declares `write:jira-work`.
- Its manifest includes `unsafe-inline` and `unsafe-eval` script/style allowances.

TraceBack decision:
- Do not adopt the token-storage, broad write-scope, automatic ticket-creation, or permissive CSP patterns.
- If code-change evidence becomes available through an authorized linked PR, display the source URL and change metadata as an investigation lead; do not infer causation from commit-message keywords.

## TraceBack fit and current verification

The current TraceBack source already implements several of the useful reliability patterns:
- Teamwork Graph requests run through the current-user client.
- Request and total-duration budgets are bounded.
- Pagination is capped, completed categories are skipped, and duplicate nodes are removed.
- Partial, unavailable, timeout, malformed-response, and non-2xx states are represented explicitly.
- Tests cover pagination, timeouts, HTTP 403, partial data, malformed ARIs, and adversarial Graph responses.

Relevant in-repository references:
- `src/services/teamwork-graph.js`
- `src/domain/teamwork-graph.js`
- `src/services/request-timeout.js`
- `test/teamwork-graph-service.test.js`
- `test/teamwork-graph-pagination.test.js`
- `test/teamwork-graph-adversarial.test.js`

These are source/test observations; they do not establish successful live Forge Teamwork Graph access.

## Adoption ledger

| External source | Decision | Runtime dependency added? | Code copied? |
|---|---|---:|---:|
| Atlassian Forge Skills | Apply review methodology | No | No |
| Forge Inspired | Use as module/prompt reference | No | No |
| Atlassian MCP Server | Use as auth/admin reference | No | No |
| Precedent | Learn permission and Graph test patterns; independently validate all access boundaries | No | No |
| DRS Debug System | Retain only the general idea of source-linked diff evidence; reject unsafe patterns | No | No |

## Next engineering actions

1. Transplant the already-tested, narrow `prosemirror-view@1.42.9` remediation onto a fresh branch based on the current Rovo candidate; keep it separate from the existing diverged PR #12 branch.
2. Run exact-head CI on the new security branch, including `npm ci`, `npm ls prosemirror-view --all`, all tests, syntax/frontend checks, and authenticated Forge CLI lint.
3. Continue the main candidate's dependency audit without forced upgrades or out-of-range overrides.
4. Use the valid staging Jira project ARI when checking Teamwork Graph context; obtain a real existing issue with authentic linked evidence before claiming issue-level Graph acceptance.
5. After an authorized issue is available, validate Rovo discovery/action invocation and permission boundaries in staging.
6. Keep all PRs draft and unmerged until every release gate has evidence.

## Safety

This review was read-only against external repositories and the TraceBack candidate. It did not copy external source code, add dependencies, change production, install or upgrade an Atlassian app, approve scopes, create Jira/Confluence data, or merge/close any PR.
