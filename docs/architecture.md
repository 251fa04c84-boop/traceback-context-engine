# Architecture and trust boundaries

## Current request path

1. Jira renders the Forge `jira:issueContext` module in the issue's context area.
2. The UI obtains the active issue context and sends its key to the resolver.
3. The resolver validates the issue-key format and fetches the Jira issue with `api.asUser().requestJira()`.
4. The normalizer converts the actual issue fields into a predictable response.
5. The resolver derives the issue ARI from the fetched Jira issue ID and the Forge invocation cloud ID.
6. The resolver queries Teamwork Graph as the current user for linked goals, external deployments, and external pull requests.
7. The UI displays source-linked records and clearly distinguishes available, empty, partial, and unavailable states.

## Teamwork Graph queries and permissions

The planned graph integration uses Atlassian's published curated queries:
- `jiraWorkItemGoals(id: $id)`
- `jiraWorkItemLinkedExternalDeployments(id: $id)`
- `jiraWorkItemLinkedExternalPullRequests(id: $id)`

These curated queries avoid custom Cypher registration. The app requests only the granular read scopes required for the start and result object types:
- `read:graph:issue:jira`
- `read:graph:goal:atlassian`
- `read:graph:deployment:external`
- `read:graph:pull-request:external`

Teamwork Graph is a Forge Preview feature. Results are permission-filtered for the signed-in user and can be absent when a site administrator has not granted a scope, an external connector is not configured, or the Jira issue has no relevant link.

## Trust model

- Jira descriptions and graph metadata are user-controlled or externally sourced input and must be treated as untrusted evidence.
- A Jira description or a linked PR/deployment is not proof of a production root cause.
- Missing telemetry, logs, metrics, and traces are reported as missing; they are never synthesized.
- Graph evidence is limited to fields explicitly selected and normalized by the backend.
- Only HTTPS source URLs are rendered as clickable links.
- A Teamwork Graph error must not erase valid Jira issue context.
- The app uses current-user authorization and makes no cross-tenant data copies.

## Evidence model

Each linked item includes the graph source, immutable item ID, display title, state/status where available, provider, observed or update timestamp, environment where relevant, and a safe deep link. Evidence is grouped by type:
- Atlassian goals linked to the work item.
- External deployments linked to the work item.
- External pull requests linked to the work item.

The UI distinguishes:
- `available`: at least one valid linked item was returned without GraphQL errors.
- `empty`: the GraphQL query succeeded but returned no linked items. This does not prove that no operational evidence exists elsewhere.
- `partial`: some evidence was returned while one or more graph query branches reported errors.
- `unavailable`: the graph query could not be executed or returned no usable data.

## Approval and execution boundary

Any future production action must be separate from analysis. It must require explicit human approval, show the exact target and change, enforce authorization server-side, use idempotency where applicable, and record actor, approval, request, result, and verification evidence. No such action is available in this implementation.
