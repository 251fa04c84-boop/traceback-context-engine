# TraceBack staging readiness — 23 November 2026

## Read-only tenant inspection

The connected non-production tenant is `brand7.atlassian.net`. The only accessible Jira project is **My Kanban Space (KAN)**, ID `10000`, with zero issues. JQL `project = KAN ORDER BY created DESC` returns no issue records.

Teamwork Graph context for Confluence space `SD` resolves the space ARI and returns four `space_has_documents` page targets. A JiraSpace lookup using numeric project ID `10000` does not resolve to an ARI. This is connector-side access only, not evidence that TraceBack's Forge runtime can query Teamwork Graph.

The connected production/earlier TraceBack tenant is `251fa04c84.atlassian.net`; it was not queried for staging acceptance and must not be used as a test target.

## Forge configuration and permission boundary

The app manifest on the active candidate requests `read:jira-work` plus four read-only Teamwork Graph scopes:

- `read:graph:issue:jira`
- `read:graph:goal:atlassian`
- `read:graph:deployment:external`
- `read:graph:pull-request:external`

Static source inspection shows Jira and Graph reads are requested as the invoking user. The Forge runtime's effective scope approval and installed app version were not independently verifiable through the available read-only Atlassian operation catalog.

## Deployment workflow safety

- The development workflow now deploys only to the Forge `development` environment and contains no Jira site install/upgrade command.
- The separate staging workflow is restricted to the exact connected staging tenant `brand7.atlassian.net`. It remains manual, requires two confirmations, and never uses `--confirm-scopes`.
- A pull-request safety workflow runs shell assertions over both deployment workflows; it does not deploy or install anything.

## Release blockers

1. No genuine staging Jira incident exists.
2. No authentic incident-linked goal, external deployment, or pull request is available.
3. No permitted/restricted user pair is available for object-level permission testing.
4. Forge app installation/version and effective Graph scope approval need confirmation from the staging administrator.
5. Live Jira panel, Rovo invocation, Forge Graph retrieval, and external MCP OAuth/invocation remain unverified.

**Minimum staging-owner action:** provide one existing genuine non-production incident with authentic linked Graph records, two approved staging users with different access to at least one linked record, and confirmation of the four read-only scopes for the intended staging installation. Do not create synthetic records or use production.
