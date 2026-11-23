# TraceBack Context Engine

Evidence-backed incident and delivery context inside Jira, built as an Atlassian Forge app.

## Current implementation

- A Forge `jira:issueContext` module named **TraceBack Context Engine**.
- A read-only **TraceBack Investigator** Rovo Agent and **TraceBack Tools** `rovo:mcp` module in the `codegeist/rovo-integrated` candidate branch; live Rovo/MCP acceptance remains pending.
- A read-only resolver that reads the active Jira issue as the signed-in user.
- Normalized Jira issue summary, description, status, type, priority, project, and timestamps.
- Existing inward/outward Jira issue links, including relationship, status, type, priority and safe same-site issue links.
- A Teamwork Graph client that retrieves linked goals, external deployments, and pull requests through Atlassian's curated GraphQL queries, following cursors for up to five pages (125 records) per category and reporting when the safety cap or bounded request-time budget is reached.
- Source-linked evidence with status, environment, provider, timestamps, and verified HTTPS links.
- Explicit graph states: available, empty, partial, and unavailable. Empty results are not treated as proof that no upstream data exists. Jira requests including response-body parsing and optional Graph requests have deadlines sized below Forge's 25-second resolver invocation ceiling; timed-out Graph pagination preserves already loaded evidence.
- An explicit evidence coverage ledger showing Jira and Teamwork Graph states alongside observability sources that are not integrated (telemetry, logs, traces, alerts, feature flags, and runtime configuration); not-integrated means not queried, never empty.
- Suggested next checks prioritized from observed deployment, pull-request and linked Jira-work states/timestamps, with a rationale and source link where available; they are not root-cause findings.
- Tests for issue normalization, related Jira work links, UI Kit issue-context extraction, investigation-lead prioritization and non-causal wording, issue ARI validation, request deadlines including hanging response bodies, graph evidence normalization, pagination timeouts, adapter behavior, empty results, partial GraphQL responses, and unsafe source URLs.

## Why TraceBack

An engineer investigating a Jira incident needs more than an issue description. TraceBack assembles existing Jira-linked work plus delivery context already connected to that work item: goals, deployments, and pull requests. It shows where each record came from and what is still missing, so the engineer can investigate without confusing correlation with causation.

## Evidence and safety boundaries

- Jira issue content, Jira issue relationships, and linked external metadata are untrusted evidence.
- Jira and Teamwork Graph reads execute as the current user.
- The server derives the Jira issue ARI from the fetched issue ID and Forge invocation cloud context; it does not trust a client- or model-supplied ARI.
- Teamwork Graph records are permission-filtered and may be omitted when a scope or permission is missing. An empty result therefore includes a visible warning.
- Only verified HTTPS source URLs are clickable.
- Missing telemetry, service logs, traces, alert history, feature-flag history, and runtime configuration remain explicitly marked not integrated/not queried; no metrics or incidents are synthesized.
- Linked changes are context, not proof of incident causation. Suggested next checks explain the observed state and link to the source record; they are not root-cause findings or probabilities.
- The app is read-only: no rollback, feature-flag change, deployment trigger, issue update, or production mutation.

## Requirements

- Node.js 24
- npm
- Atlassian Forge CLI 15.1.0 (pinned in the validation workflow)
- An Atlassian Jira Cloud site where the app can be installed

## Local validation

```bash
npm install
npm test
npm run lint:syntax
npm run lint:frontend
npx --yes @forge/cli@15.1.0 lint
```

The Forge CLI lint command requires a registered app ID in `manifest.yml`. Registration, deployment, installation, and live acceptance testing are separate gates; passing GitHub CI alone does not prove that the app is deployed or judge-installable.

Register the app only once with `forge register`. Registration generates the app ID and updates `manifest.yml`. Do not re-register an existing app because doing so can disconnect it from its previous environments and stored data.

## Required permissions

The manifest requests:

- `read:jira-work` for Jira issue context.
- `read:graph:issue:jira` for the Jira work item in Teamwork Graph.
- `read:graph:goal:atlassian` for linked Atlassian goals.
- `read:graph:deployment:external` for linked deployments.
- `read:graph:pull-request:external` for linked pull requests.

These are read-only scopes. An organization administrator must approve and grant the requested Teamwork Graph scopes, and the signed-in user must still have permission to see the underlying records. Because Teamwork Graph is a Preview API with organization-wide data implications, install it only in a test organization with test data unless an explicitly approved production path exists. A site with no connected GitHub/DevOps provider or no linked records will show an honest empty state.

See [docs/TEAMWORK_GRAPH_ADMIN_APPROVAL.md](docs/TEAMWORK_GRAPH_ADMIN_APPROVAL.md) for the administrator scope request and the current test-site/production-tenant acceptance boundary.

## Safe test-site deployment

The connected staging tenant is `brand7.atlassian.net`. Read-only inspection currently finds Jira project `KAN` with zero issues; the connected Atlassian Teamwork Graph connector can read some Confluence context, but this is not Forge runtime proof.

The staging installation workflow is a separate, manually dispatched, user/admin-controlled gate. It is restricted to the connected staging tenant and is not run by pull-request CI or this automation. Do not install or upgrade the app, create Jira/Confluence test data, or approve scopes automatically. See [docs/STAGING_READINESS_2026-11-21.md](docs/STAGING_READINESS_2026-11-21.md) for the exact prerequisites.

## Deploy without Codespaces

Use [docs/DEPLOY_FROM_GITHUB_ANDROID.md](docs/DEPLOY_FROM_GITHUB_ANDROID.md) to register the app only if needed, run Forge lint, and deploy to the Forge development environment. That workflow does not install or upgrade the app on any Jira site. It uses repository secrets; never put an Atlassian API token in chat or source control. See [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md) for the evidence-safe under-five-minute demo storyboard; it is a plan, not a recorded video. See [docs/ROVO_AGENT.md](docs/ROVO_AGENT.md) and [docs/JUDGE_INSTALLATION.md](docs/JUDGE_INSTALLATION.md) for the Rovo/MCP design and judge acceptance instructions.

## Dependency security

Exact-head CI reports **0 high, 6 moderate, 0 critical** after the narrow `prosemirror-view@1.42.9` fix; all ProseMirror view entries resolve to 1.42.9. The six npm audit entries are affected dependency paths rooted in two moderate advisories (`glob` and `minimatch`), not six independent Forge CVEs. The current Forge packages are already at their latest stable versions, while the fixes require major overrides outside the declared `@forge/manifest` → `glob` → `minimatch` ranges. See [docs/DEPENDENCY_AUDIT.md](docs/DEPENDENCY_AUDIT.md) and [docs/DEPENDENCY_AND_GRAPH_COMPATIBILITY_2026-11-22.md](docs/DEPENDENCY_AND_GRAPH_COMPATIBILITY_2026-11-22.md). This is not an audit-clean result. Do not apply `npm audit fix --force` or out-of-range overrides without compatibility testing.

## Jira installation and acceptance

No Jira site installation is part of the Forge development deployment workflow.

- `251fa04c84.atlassian.net` is the production/earlier TraceBack tenant, not a test target.
- `brand7.atlassian.net` is the connected staging tenant. Its Jira Software project `KAN` currently has zero issues.
- Connector-side Teamwork Graph access to Confluence space `SD` does not establish that the Forge app has effective Graph scopes or runtime access.
- The staging workflow is manual and restricted to `brand7.atlassian.net`; this automation does not install/upgrade the app or approve scopes.

Live acceptance requires a genuine non-production Jira incident with authentic linked Teamwork Graph records, two approved users with different access to at least one linked record, and staging administrator confirmation of the four read-only Graph scopes. See [docs/DEPLOY_TO_TEST_SITE_ANDROID.md](docs/DEPLOY_TO_TEST_SITE_ANDROID.md) and [docs/TEAMWORK_GRAPH_ADMIN_APPROVAL.md](docs/TEAMWORK_GRAPH_ADMIN_APPROVAL.md).

## Validation

- GitHub Actions runs unit tests, JavaScript syntax checks, and a separate JSX compilation check.
- Forge CLI lint is conditional on the app being registered; until then CI emits a warning instead of claiming Forge validation passed.
- Live staging panel/Rovo/MCP acceptance, administrator scope confirmation, and two-user permission isolation remain unverified; CI does not install or upgrade any site.

## Codegeist submission status

PR #24 remains open, draft, and unmerged. The latest exact-head CI run [#45103358815](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/45103358815) passed on `e181e14f9996067413e26ab9d3d27e4b6aa9e591`: 4,193 tests passed, zero failed/skipped, and syntax/frontend checks passed. The preceding safety-hardening code commit `4677f3e3dc00e47ad4793a5777ef613eb208a2e0` also passed exact-head CI in [#45103041853](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/45103041853). Forge lint and development deployment were skipped by PR-event conditions. Passing CI does not establish Forge staging runtime acceptance. Keep the submission blocked until the real-incident, linked-Graph, administrator-scope, Rovo/MCP, and two-user permission gates have evidence.
