# TraceBack Context Engine

Evidence-backed incident and delivery context inside Jira, built as an Atlassian Forge app.

## Current implementation

- A Forge `jira:issueContext` module named **TraceBack Context Engine**.
- A read-only resolver that reads the active Jira issue as the signed-in user.
- Normalized Jira issue summary, description, status, type, priority, project, and timestamps.
- Existing inward/outward Jira issue links, including relationship, status, type, priority and safe same-site issue links.
- A Teamwork Graph client that retrieves linked goals, external deployments, and pull requests through Atlassian's curated GraphQL queries, following cursors for up to five pages (125 records) per category and reporting when the safety cap or bounded request-time budget is reached.
- Source-linked evidence with status, environment, provider, timestamps, and verified HTTPS links.
- Explicit graph states: available, empty, partial, and unavailable. Empty results are not treated as proof that no upstream data exists. Jira requests including response-body parsing and optional Graph requests have deadlines sized below Forge's 25-second resolver invocation ceiling; timed-out Graph pagination preserves already loaded evidence.
- Suggested next checks prioritized from observed deployment, pull-request and linked Jira-work states/timestamps, with a rationale and source link where available; they are not root-cause findings.
- Tests for issue normalization, related Jira work links, UI Kit issue-context extraction, investigation-lead prioritization and non-causal wording, issue ARI validation, request deadlines including hanging response bodies, graph evidence normalization, pagination timeouts, adapter behavior, empty results, partial GraphQL responses, and unsafe source URLs.

## Codegeist submission preparation

A fact-checked submission draft and judge-readiness checklist are in [docs/CODEGEIST_SUBMISSION_DRAFT.md](docs/CODEGEIST_SUBMISSION_DRAFT.md). The demo storyboard is in [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md); do not record or publish it until live acceptance gates pass.

## Why TraceBack

An engineer investigating a Jira incident needs more than an issue description. TraceBack assembles existing Jira-linked work plus delivery context already connected to that work item: goals, deployments, and pull requests. It shows where each record came from and what is still missing, so the engineer can investigate without confusing correlation with causation.

## Evidence and safety boundaries

- Jira issue content, Jira issue relationships, and linked external metadata are untrusted evidence.
- Jira and Teamwork Graph reads execute as the current user.
- The server derives the Jira issue ARI from the fetched issue ID and Forge invocation cloud context; it does not trust a client- or model-supplied ARI.
- Teamwork Graph records are permission-filtered and may be omitted when a scope or permission is missing. An empty result therefore includes a visible warning.
- Only verified HTTPS source URLs are clickable.
- Missing telemetry, service logs, traces, and alert history remain missing; no metrics or incidents are synthesized.
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

## Deploy without Codespaces

Use [docs/DEPLOY_FROM_GITHUB_ANDROID.md](docs/DEPLOY_FROM_GITHUB_ANDROID.md) to register, lint, deploy, and install through a consent-gated GitHub Actions workflow. It uses repository secrets; never put an Atlassian API token in chat or source control. See [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md) for the evidence-safe under-five-minute demo storyboard; it is a plan, not a recorded video.

## Dependency security

The inspected npm audit reported unresolved high and moderate dependency findings. See [docs/DEPENDENCY_AUDIT.md](docs/DEPENDENCY_AUDIT.md) for the dated report. The lockfile is committed and `npm ci` is verified; upstream high and moderate advisories remain unresolved. Do not apply `npm audit fix --force` without compatibility testing.

## Jira installation and acceptance

Target development site: `251fa04c84.atlassian.net`.

After registration, Forge lint, deployment, and installation:

1. Open a Jira issue in the **new issue view**.
2. Open the **Investigate** issue-context panel.
3. Confirm that the displayed Jira fields match the issue.
4. Confirm that linked Jira work items are shown with the correct relationship, status, type, priority, and same-site link.
5. Confirm that Teamwork Graph evidence is shown when linked goal, deployment, or pull-request records are visible to the current user.
6. Confirm suggested next checks are derived from actual evidence state/timestamps and each lead links to the supporting record.
7. Verify empty, partial, and unavailable states without hiding the Jira issue details.
8. Open each source link and confirm it points to the expected Jira or HTTPS source record.

The `jira:issueContext` module does not work in Jira's old issue view. Teamwork Graph is currently a Forge Preview feature, so its schema and availability may change under Atlassian's published preview policy.

## Validation

- GitHub Actions runs unit tests, JavaScript syntax checks, and a separate JSX compilation check.
- Forge CLI lint is conditional on the app being registered; until then CI emits a warning instead of claiming Forge validation passed.
- Live Jira installation, organization-administrator scope grants, and end-to-end Teamwork Graph retrieval still require a registered and deployed Forge app.

## Codegeist submission status

An evidence-grounded, explicitly provisional submission draft is maintained in [docs/CODEGEIST_SUBMISSION_DRAFT.md](docs/CODEGEIST_SUBMISSION_DRAFT.md). It distinguishes implemented core behavior from the unaccepted Rovo/MCP candidate and lists the remaining release gates.

This branch is still under development and PR #1 remains a draft. Do not submit until app registration, Forge lint, deployment, installation, the live judge journey, and the public demo video have all been verified.
