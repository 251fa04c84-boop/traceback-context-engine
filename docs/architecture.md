# Architecture and trust boundaries

## Current request path

1. Jira renders the Forge issue panel on an issue.
2. The UI obtains the issue key from Forge view context.
3. The UI invokes the getIssueContext resolver.
4. The resolver validates the issue-key format.
5. The resolver calls Jira REST API using api.asUser(), preserving the current user's permissions.
6. The domain normalizer converts Jira fields into a predictable response.
7. The UI labels the source as Jira and states that operational sources are not connected.

## Trust model

- Jira issue content is user-controlled input and must be treated as untrusted evidence.
- A Jira description is not proof of a production root cause.
- Missing telemetry is reported as missing; it is never synthesized.
- The current version performs read-only Jira access.
- No recovery, rollback, feature-flag or other production mutation is implemented.

## Planned evidence model

Each future evidence item should include source type and integration identity, source record identifier and deep link, observed and ingestion timestamps, service/environment identifiers, raw value or immutable reference, and integrity/validation status.

Correlation must preserve provenance and explain which observations support or contradict a hypothesis. Confidence must not be presented as a probability unless calibrated against labelled data.

## Approval and execution boundary

Any future production action must be separate from analysis. It must require explicit human approval, show the exact target and change, enforce authorization server-side, use idempotency where applicable, and record actor, approval, request, result and verification evidence. No action is available in this starter implementation.
