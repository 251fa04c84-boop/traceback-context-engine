# TraceBack Context Engine

Evidence-based incident investigation inside Jira, built as an Atlassian Forge app.

## Implemented in this branch

- A Forge `jira:issuePanel` module named **TraceBack Context Engine**.
- A backend resolver that reads the currently opened Jira issue as the signed-in user.
- Normalization of summary, description, status, issue type, priority, project and timestamps.
- An evidence-boundary message: Jira issue context is not the same as verified operational telemetry.
- Unit tests for issue normalization and malformed payload handling.
- Architecture notes defining evidence provenance and human approval requirements.

## Important limitations

No live telemetry, log, deployment, tracing, alerting or rollback integration is connected in this version. The app does not guess a root cause, generate fake metrics, or execute recovery actions. Those capabilities will be added only with real, permissioned integrations and explicit approval controls.

Jira's issue-panel visibility rules also apply: the panel button is shown only to users who have permission to edit the issue, and the module works in Jira's new issue view, not the old issue view.

## Requirements

- Node.js 24 (matches the Forge runtime)
- npm
- Atlassian Forge CLI
- Access to an Atlassian Jira Cloud site

## Local setup

The repository can be reviewed and tested through GitHub. A local Forge deployment still requires Node.js 24, npm, the Forge CLI, and an authenticated Atlassian account.

```bash
npm install
npm test
npx --yes @forge/cli@15.1.0 lint
```

Registration and deployment are separate authenticated steps; do not run them until lint succeeds and the app manifest has been reviewed.

Register the app with the Forge CLI before deployment. Registration generates the app ID and updates `manifest.yml`. Review that generated change before committing it.

## Jira installation

Install to the development site `251fa04c84.atlassian.net`. After installation, open a Jira issue, open the Apps menu, and select **TraceBack Context Engine**. Use a test account with edit permission on the issue and Jira's new issue view.

## Permissions

The manifest requests `read:jira-work`. The resolver uses `api.asUser()` so issue access follows the current user's Jira permissions. No API keys or external credentials are required for this first slice.

## Test strategy

- Unit tests cover normalization, nested Atlassian document text, and invalid payloads.
- GitHub Actions runs unit tests, syntax checks and Forge CLI lint.
- Manual acceptance test: install on the development site and verify the panel displays that issue's actual Jira fields.

## Product direction

1. Jira issue context and source-linked evidence.
2. Optional integrations for deployment changes, service logs, metrics and traces.
3. Evidence correlation with confidence and explicit missing-data reporting.
4. Recovery recommendations with human approval.
5. Auditable execution and post-action verification, only when real integrations are configured.

See [docs/architecture.md](docs/architecture.md) for trust boundaries and [docs/CODESPACES.md](docs/CODESPACES.md) for phone-friendly cloud setup.
