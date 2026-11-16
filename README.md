# TraceBack Context Engine

Evidence-backed incident and delivery context inside Jira, built as an Atlassian Forge app.

## Current implementation

- A Forge `jira:issueContext` module named **TraceBack Context Engine**.
- A backend resolver that reads the currently opened Jira issue as the signed-in user.
- Normalization of summary, description, status, issue type, priority, project, and timestamps.
- An explicit evidence boundary: Jira issue text alone is not proof of a production root cause.
- Unit tests for issue normalization, malformed payloads, nested Atlassian document text, and issue-key validation.

## Product scope in this branch

The next implementation slice adds read-only Teamwork Graph context for:
- Atlassian goals linked to the work item.
- External deployments linked to the work item.
- External pull requests linked to the work item.

It uses Atlassian's curated GraphQL queries and current-user authorization. It does not create fake events or infer that a linked change caused an incident. If the site has no connected GitHub/DevOps data or no links for an issue, the app must say so.

## Evidence and safety boundaries

- Jira issue content and linked external metadata are untrusted evidence.
- Missing telemetry, logs, tracing, and deployment records must remain missing; no metrics or incidents are synthesized.
- Teamwork Graph results are filtered by the signed-in user's permissions and site-admin scope grants.
- Only verified HTTPS source URLs may be clickable.
- This version is read-only: no rollback, feature-flag change, deployment trigger, issue update, or production mutation.
- No root cause or confidence score is claimed without sufficient validated evidence.

## Requirements

- Node.js 24
- npm
- Atlassian Forge CLI 15.1.0 (pinned in the repository's current validation workflow)
- An Atlassian Jira Cloud site where the app can be installed

## Local validation

```bash
npm install
npm test
npm run lint:syntax
npx --yes @forge/cli@15.1.0 lint
```

Forge CLI validation, app registration, deployment, installation, and live acceptance tests are separate gates. The app is not considered submission-ready until it has been registered once, validated, deployed, installed on the development site, and tested in the new Jira issue view.

Register the app only once with `forge register`; registration creates the app ID and updates `manifest.yml`. Re-registering an existing app can disconnect it from its prior environments and stored data.

## Jira installation

Target development site: `251fa04c84.atlassian.net`.

After deployment and installation, open a Jira issue in the **new issue view** and expand **Investigate** in the issue-context area. Confirm that the panel shows the current issue's real fields and graph evidence (or an honest empty/unavailable state).

## Permissions

The app requests `read:jira-work` for issue context plus granular read-only Teamwork Graph scopes for Jira work items, Atlassian goals, external deployments, and external pull requests. These scopes are read-only; the signed-in user and site administrator still control which records are visible.

## Test strategy

- Unit tests cover Jira field normalization, issue-key validation, Teamwork Graph ARI construction, linked evidence normalization, empty graph results, and partial GraphQL failures.
- GitHub Actions runs unit tests and syntax checks; Forge CLI lint is gated on app registration.
- Manual acceptance tests must verify Jira issue context, Teamwork Graph scope grants, connector availability, linked records, source URLs, and permission-filtered empty states.

## Submission status

This repository and PR are still in development. A successful GitHub test run is not proof of Forge deployment or judge installability. Do not submit until the live Forge install, demo, setup instructions, and public installation link have all been verified.
