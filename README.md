# TraceBack Context Engine

Evidence-backed incident investigation for Jira, built as an Atlassian Forge app.

## Safe test-site deployment

The connected staging tenant is `brand7.atlassian.net`. Read-only inspection on 23 November 2026 found Jira project `KAN` with zero issues. A connector-side Teamwork Graph read of Confluence space `SD` returned four page targets, but this is not proof that the Forge app can query Graph at runtime.

The staging workflow is manual, requires two explicit confirmations, and is restricted to `brand7.atlassian.net`. This automation does not dispatch it, install/upgrade the app, create test data, or approve scopes. See [docs/STAGING_READINESS_2026-11-23.md](docs/STAGING_READINESS_2026-11-23.md).

## Development deployment

Use [docs/DEPLOY_FROM_GITHUB_ANDROID.md](docs/DEPLOY_FROM_GITHUB_ANDROID.md) to register the app only if necessary, run Forge lint, and deploy to the Forge development environment. The development workflow has no Jira site install/upgrade command and does not target `251fa04c84.atlassian.net`.

## Project status

See [docs/CODEGEIST_SUBMISSION_DRAFT.md](docs/CODEGEIST_SUBMISSION_DRAFT.md), [docs/SUBMISSION_CHECKLIST.md](docs/SUBMISSION_CHECKLIST.md), and [docs/TEAMWORK_GRAPH_ADMIN_APPROVAL.md](docs/TEAMWORK_GRAPH_ADMIN_APPROVAL.md) for the current validation and acceptance boundaries.
