# Architecture and trust boundaries

## Current request path

1. Jira renders the Forge `jira:issueContext` module in the issue's context area.
2. The UI obtains the active issue context and sends its key to the resolver.
3. The resolver validates the issue-key format and fetches the Jira issue with `api.asUser().requestJira()`.
4. The normalizer converts the actual issue fields and inward/outward Jira issue links into a predictable response.
5. The resolver derives the issue ARI from the fetched Jira issue ID and the Forge invocation cloud ID.
6. The resolver queries Teamwork Graph as the current user for linked goals, external deployments, and external pull requests.
7. The UI displays Jira-linked work items, Teamwork Graph source-linked records, and evidence-backed suggested next checks, clearly distinguishing available, empty, partial, and unavailable states.

## Jira issue links

The resolver also requests Jira's `issuelinks` field. The backend only normalizes linked issue keys that pass the Jira issue-key validator, deduplicates links, records whether each link is inward or outward, and builds a relative `/browse/ISSUE-KEY` URL so links remain on the current Jira site. This is Jira work context, not external operational evidence.

## Teamwork Graph queries and permissions

The current graph integration uses Atlassian's published curated queries:
- `jiraWorkItemGoals(id: $id)`
- `jiraWorkItemLinkedExternalDeployments(id: $id)`
- `jiraWorkItemLinkedExternalPullRequests(id: $id)`

These curated queries avoid custom Cypher registration. The current request fetches the first 10 records from each connection and does not yet paginate. The app requests only the granular read scopes required for the start and result object types:
- `read:graph:issue:jira`
- `read:graph:goal:atlassian`
- `read:graph:deployment:external`
- `read:graph:pull-request:external`

Teamwork Graph is a Forge Preview feature. Results are permission-filtered for the signed-in user and can be absent when a site administrator has not granted a scope, an external connector is not configured, or the Jira issue has no relevant link.

## Trust model

- Jira descriptions and graph metadata are user-controlled or externally sourced input and must be treated as untrusted evidence.
- A Jira description, Jira issue link, or linked PR/deployment is not proof of a production root cause.
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

## Suggested investigation leads

The lead builder uses only the normalized Jira issue creation time, Jira-linked work-item statuses, and Teamwork Graph deployment/PR/goal records. It can suggest checking failed production deployments (high priority), failed non-production deployments (medium priority), in-progress deployments, a production deployment recorded within 24 hours of issue creation, open/draft pull requests, recently merged pull requests, unresolved related Jira work, archived goals, or missing graph connectivity. Each suggestion includes a rationale, priority, and supporting source URL where available. Time proximity and links are treated as triage clues, never proof of causation. Invalid timestamps do not create time-proximity leads.

## Approval and execution boundary

Any future production action must be separate from analysis. It must require explicit human approval, show the exact target and change, enforce authorization server-side, use idempotency where applicable, and record actor, approval, request, result, and verification evidence. No such action is available in this implementation.
