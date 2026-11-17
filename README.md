# TraceBack Context Engine

Evidence-backed incident investigation for Jira, built as an Atlassian Forge app.

## Safe test-site deployment

Use [docs/DEPLOY_TO_TEST_SITE_ANDROID.md](docs/DEPLOY_TO_TEST_SITE_ANDROID.md) to create a separate free Atlassian developer site and deploy the Rovo candidate to the isolated Forge staging environment from GitHub Actions. This does not touch the connected production Jira tenant and does not auto-consent to Teamwork Graph scopes.

The workflow is manual and requires explicit confirmation of a separate test-site target. It uses the existing GitHub Actions Forge credentials and does not register or re-register the app.

## Project status

See [docs/CODEGEIST_SUBMISSION_DRAFT.md](docs/CODEGEIST_SUBMISSION_DRAFT.md), [docs/SUBMISSION_CHECKLIST.md](docs/SUBMISSION_CHECKLIST.md), and [docs/TEAMWORK_GRAPH_ADMIN_APPROVAL.md](docs/TEAMWORK_GRAPH_ADMIN_APPROVAL.md) for current validation and acceptance boundaries.