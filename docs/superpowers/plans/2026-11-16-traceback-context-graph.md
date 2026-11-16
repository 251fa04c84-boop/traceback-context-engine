# Teamwork Graph Evidence Integration Implementation Plan

> **For agentic workers:** Execute the tasks in order. Steps use checkbox syntax and require fresh verification before completion.

**Goal:** Extend TraceBack Context Engine from Jira-only context to a read-only, source-linked incident evidence view using Teamwork Graph curated queries.

**Architecture:** The Forge resolver continues to read Jira as the current user. It derives a Jira work-item ARI from the fetched issue ID and Forge invocation cloud ID, calls the published curated queries for linked goals, deployments, and pull requests, normalizes only whitelisted fields, and returns a safe evidence model. The UI renders source links and distinguishes available, empty, partial, and unavailable states.

**Tech Stack:** Forge Node.js 24, `@forge/api`, `@forge/resolver`, `@forge/react`, `@forge/bridge`, Node built-in test runner.

**Spec:** `docs/superpowers/specs/2026-11-16-traceback-codegeist-design.md`

## Global Constraints

- Use Node.js 24 and current Forge packages already declared in `package.json`.
- Preserve `api.asUser()` for Jira and Teamwork Graph reads.
- Request only `read:jira-work`, `read:graph:issue:jira`, `read:graph:goal:atlassian`, `read:graph:deployment:external`, and `read:graph:pull-request:external`.
- Use the curated queries `jiraWorkItemGoals`, `jiraWorkItemLinkedExternalDeployments`, and `jiraWorkItemLinkedExternalPullRequests`; do not use raw `cypherQuery`.
- Do not add production mutations, user tokens, API keys, external services, fabricated evidence, or unsupported root-cause claims.
- Keep the pull request draft until Forge CLI validation and live Jira acceptance testing are complete.

## Review Focus

1. Jira returns an issue without a numeric ID or the resolver invocation has no cloud ID — return the Jira context but mark graph evidence unavailable.
2. Teamwork Graph returns partial data with GraphQL errors — preserve valid linked records and report a partial state.
3. A linked source item has a missing or non-HTTPS URL — display its metadata but do not render an unsafe clickable link.
4. Graph returns no related records — show an explicit empty state, not a false "connected operational sources" count.
5. Jira is visible but Teamwork Graph scopes are denied or results are filtered — keep the Jira issue context functional and explain the empty/unavailable state without claiming no evidence exists elsewhere.

---

### Task 1: Align product documentation with the actual issue-context module

**Files:**
- Modify: `README.md`
- Modify: `docs/architecture.md`
- Create: `docs/superpowers/specs/2026-11-16-traceback-codegeist-design.md`
- Create: `docs/superpowers/plans/2026-11-16-traceback-context-graph.md`

- [ ] Replace issue-panel references with issue-context references.
- [ ] Document the Teamwork Graph evidence objective and explicit non-goals.
- [ ] State that Forge registration, deployment, installation, and live acceptance testing remain incomplete.

### Task 2: Implement the Teamwork Graph evidence model from the existing RED tests

**Files:**
- Modify: `test/teamwork-graph.test.js` only to remove redundant assertions and add any missing negative cases.
- Create: `src/domain/teamwork-graph.js`

**Interfaces:**
- `buildJiraIssueAri(cloudId, issueId)` validates the UUID cloud ID and positive numeric Jira issue ID, then returns the canonical Jira issue ARI.
- `normalizeTeamworkGraphResponse(response)` returns `{ status, source, goals, deployments, pullRequests, warning }`.
- Goal shape: `id, key, name, description, url, updatedAt, archived`.
- Deployment shape: `id, title, state, environment, environmentType, provider, url, createdAt, updatedAt`.
- Pull request shape: `id, title, displayId, status, provider, url, createdAt, updatedAt`.

- [ ] Run `npm test` and verify the new tests fail because the module/functions are absent.
- [ ] Implement ARI validation and safe HTTPS URL normalization.
- [ ] Normalize only whitelisted graph fields, including valid data when GraphQL errors are partial.
- [ ] Distinguish `available`, `empty`, `partial`, and `unavailable` graph states.
- [ ] Run the full `npm test` suite and verify all tests pass.

### Task 3: Add the user-scoped Teamwork Graph adapter

**Files:**
- Create: `src/services/teamwork-graph.js`
- Modify: `src/index.js`
- Modify: `manifest.yml`

**Interfaces:**
- `fetchTeamworkGraphEvidence(apiClient, issueId, cloudId)` returns the normalized evidence model.
- The adapter builds the Jira ARI only from the fetched Jira issue ID and Forge invocation context.
- Resolver response adds `teamworkGraph` without removing valid normalized Jira fields.

- [ ] Add the three curated GraphQL queries with exact, whitelisted fields.
- [ ] Add the four minimum granular graph scopes.
- [ ] Keep the Jira result available if Graph access fails; catch and normalize Graph errors.
- [ ] Add adapter tests using an injected API client so tests do not need a live Atlassian site.
- [ ] Run the full test suite.

### Task 4: Render linked evidence in the issue-context sidebar

**Files:**
- Modify: `src/frontend/index.jsx`

- [ ] Display the Teamwork Graph availability state and warning text.
- [ ] Render linked goals with title, key, and safe HTTPS source link.
- [ ] Render deployments with state, environment, provider, timestamp, and safe HTTPS link.
- [ ] Render pull requests with title, status, provider, timestamp, and safe HTTPS link.
- [ ] Show explicit empty/unavailable states without discarding Jira issue details.
- [ ] Keep the layout compact for Jira issue-context sidebars.

### Task 5: CI, dependency and platform validation

**Files:**
- Modify: `.github/workflows/ci.yml` if needed.

- [ ] Run `npm install`.
- [ ] Run `npm test`.
- [ ] Run `npm run lint:syntax`.
- [ ] Run Forge CLI lint with the pinned CLI version; if app registration is required, document the blocker instead of claiming lint passed.
- [ ] Inspect npm audit findings; do not use `npm audit fix --force`.
- [ ] Re-check GitHub Actions logs for the latest commit SHA.

### Task 6: Judge readiness and submission evidence

**Files:**
- Modify: `README.md`
- Create: `docs/ACCEPTANCE_TESTS.md`
- Create: `docs/SUBMISSION_CHECKLIST.md`

- [ ] Record the live Jira test issue, site, user permissions, UI view mode, and observed results.
- [ ] Record Teamwork Graph scope grants, connector availability, and whether linked PR/deployment/goal records actually returned.
- [ ] Prepare a concise under-five-minute demo script with no unverified claims.
- [ ] Keep the app draft until Forge deployment and installation are verified.

## Self-review checklist

- [ ] Implementation matches the design goals and does not invent operational evidence.
- [ ] Every graph field rendered by the UI is explicitly selected and whitelisted.
- [ ] Permission failures and empty graph results are distinguishable.
- [ ] ARI and source-link validation is covered.
- [ ] The Jira resolver remains read-only and uses current-user authorization.
- [ ] The README and submission claims match what was actually deployed and tested.
