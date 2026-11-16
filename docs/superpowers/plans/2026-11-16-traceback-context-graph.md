# Teamwork Graph Evidence Integration Implementation Plan

> **For agentic workers:** Execute the tasks in order. Steps use checkbox syntax and require fresh verification before completion.

**Goal:** Extend TraceBack Context Engine from Jira-only context to a read-only, source-linked incident evidence view using Teamwork Graph curated queries.

**Architecture:** The Forge resolver continues to read Jira as the current user. It derives a Jira work-item ARI from the fetched issue ID and Forge invocation cloud ID, calls the two published Teamwork Graph curated queries for linked deployments and pull requests, normalizes only whitelisted fields, and returns a safe evidence model. The UI renders source links and distinguishes available, empty, partial, and unavailable states.

**Tech Stack:** Forge Node.js 24, `@forge/api`, `@forge/resolver`, `@forge/react`, `@forge/bridge`, Node built-in test runner.

**Spec:** `docs/superpowers/specs/2026-11-16-traceback-codegeist-design.md`

## Global Constraints

- Use Node.js 24 and current Forge packages already declared in `package.json`.
- Preserve `api.asUser()` for Jira and Teamwork Graph reads.
- Request only `read:jira-work`, `read:graph:issue:jira`, `read:graph:deployment:external`, and `read:graph:pull-request:external`.
- Use the curated queries `jiraWorkItemLinkedExternalDeployments` and `jiraWorkItemLinkedExternalPullRequests`; do not use raw `cypherQuery`.
- Do not add production mutations, user tokens, API keys, external services, fabricated evidence, or unsupported root-cause claims.
- Keep the pull request draft until Forge CLI validation and live Jira acceptance testing are complete.

## Review Focus

1. Jira returns an issue without an ID or the resolver invocation has no cloud ID — return the Jira context but mark graph evidence unavailable.
2. Teamwork Graph returns partial data with GraphQL errors — preserve valid linked records and report a partial state.
3. A linked source item has a missing or non-HTTPS URL — display its metadata but do not render an unsafe clickable link.
4. Graph returns no related records — show an explicit empty state, not a false "connected operational sources" count.
5. The Jira issue is visible to the user but Teamwork Graph scopes are denied or filtered — keep the Jira issue panel functional and explain that graph evidence is unavailable or permission-filtered.

---

### Task 1: Align product documentation with the actual issue-context module

**Files:**
- Modify: `README.md`
- Modify: `docs/architecture.md`
- Create: `docs/superpowers/specs/2026-11-16-traceback-codegeist-design.md`
- Create: `docs/superpowers/plans/2026-11-16-traceback-context-graph.md`

- [ ] Replace issue-panel references with issue-context references.
- [ ] Document the Teamwork Graph evidence objective and the explicit non-goals.
- [ ] State that Forge registration, deployment, installation, and live acceptance testing remain incomplete.

### Task 2: Write the Teamwork Graph evidence normalizer tests first

**Files:**
- Create: `test/teamwork-graph.test.js`
- Create: `src/domain/teamwork-graph.js`

**Interfaces:**
- Produces: `normalizeTeamworkGraphEvidence(response)` returning `{ status, deployments, pullRequests, errors }`.
- Each deployment contains `id, title, state, environment, environmentType, provider, createdAt, url`.
- Each pull request contains `id, title, displayId, status, provider, createdAt, updatedAt, url, reviewerStatuses`.

- [ ] Add tests for valid deployment and pull-request records from GraphQL connection edges.
- [ ] Add tests for missing URLs and reject non-HTTPS URLs as clickable links.
- [ ] Add tests for empty results and partial GraphQL errors.
- [ ] Run `npm test` and verify the new tests fail for the expected missing normalizer.
- [ ] Implement the minimal pure normalizer.
- [ ] Run the full `npm test` suite and verify all tests pass.

### Task 3: Add the user-scoped Teamwork Graph adapter

**Files:**
- Create: `src/services/teamwork-graph.js`
- Modify: `src/index.js`
- Modify: `manifest.yml`

**Interfaces:**
- `fetchTeamworkGraphEvidence(apiClient, issueId, cloudId)` returns the normalizer's evidence model.
- The adapter builds `ari:cloud:jira:{cloudId}:issue/{issueId}` only from the fetched Jira issue ID and Forge invocation context.
- Resolver response adds `teamworkGraph` without removing valid normalized Jira fields.

- [ ] Add the two curated GraphQL queries with the exact whitelisted fields documented in the spec.
- [ ] Add the three minimum granular graph scopes.
- [ ] Keep the Jira result available if Graph access fails; catch and normalize Graph errors.
- [ ] Add adapter tests using an injected API client so tests do not need a live Atlassian site.
- [ ] Run the full test suite.

### Task 4: Render linked evidence in the issue-context sidebar

**Files:**
- Modify: `src/frontend/index.jsx`

- [ ] Display the Teamwork Graph availability state.
- [ ] Render deployment evidence with state, environment, provider, timestamp, and a safe HTTPS link.
- [ ] Render related pull requests with title, status, provider, timestamp, and a safe HTTPS link.
- [ ] Show an explicit empty state when no linked records exist.
- [ ] Show permission/unavailable messaging without discarding Jira issue details.
- [ ] Keep the layout compact for Jira issue-context sidebars.

### Task 5: CI, dependency and platform validation

**Files:**
- Modify: `.github/workflows/ci.yml` if needed.

- [ ] Run `npm install`.
- [ ] Run `npm test`.
- [ ] Run `npm run lint:syntax`.
- [ ] Run Forge CLI lint with the pinned CLI version; if app registration is required, document the blocker instead of silently claiming lint passed.
- [ ] Inspect npm audit findings; do not use `npm audit fix --force`.
- [ ] Re-check GitHub Actions logs for the latest commit SHA.

### Task 6: Judge readiness and submission evidence

**Files:**
- Modify: `README.md`
- Create: `docs/ACCEPTANCE_TESTS.md`
- Create: `docs/SUBMISSION_CHECKLIST.md`

- [ ] Record the live Jira test issue, site, user permissions, UI view mode, and observed results.
- [ ] Record Teamwork Graph scope grants, connector availability, and whether linked PR/deployment records actually returned.
- [ ] Prepare a concise under-five-minute demo script with no unverified claims.
- [ ] Keep the app draft until Forge deployment and installation are verified.

## Self-review checklist

- [ ] Implementation matches the design goals and does not invent operational evidence.
- [ ] Every graph field rendered by the UI is explicitly selected and whitelisted.
- [ ] Permission failures and empty graph results are distinguishable.
- [ ] Issue-key and source-link validation is covered.
- [ ] The Jira resolver remains read-only and uses current-user authorization.
- [ ] The README and submission claims match what was actually deployed and tested.
