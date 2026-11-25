# TraceBack Context Engine

Evidence-backed incident investigation for Jira, built as an Atlassian Forge app.

## Safe staging deployment

The connected staging tenant is `brand7.atlassian.net`. Read-only inspection on 25 November 2026 found one visible Jira project, `KAN`, with zero issues and no configured Incident issue type. A connector-side Teamwork Graph read of Confluence space `SD` returned four page targets (three templates and one RAJ execution tracker); this is not incident evidence or proof that the Forge app can query Graph at runtime.

The manual staging workflow deploys code only to the Forge `staging` environment after explicit confirmation. It does not install or upgrade the app on any Jira/Confluence site, target a site, or approve scopes. An already-existing staging installation is required for panel/Rovo runtime acceptance; its version and effective scope grants are not currently verifiable through the connected read-only Atlassian operation catalog. See [staging readiness](docs/STAGING_READINESS_2026-11-23.md).

## Development deployment

Use the [development deployment guide](docs/DEPLOY_FROM_GITHUB_ANDROID.md) to register the app only if necessary, run Forge lint, and deploy to the Forge development environment. The development workflow has no Jira site install/upgrade command and does not target `251fa04c84.atlassian.net`.

## Project status

See the [staging acceptance guide](docs/DEPLOY_TO_TEST_SITE_ANDROID.md) and [staging readiness record](docs/STAGING_READINESS_2026-11-23.md) for the current validation and acceptance boundaries.
