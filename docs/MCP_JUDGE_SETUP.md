# Judge setup: Rovo Agent and Atlassian MCP

**Purpose:** give a judge or authorized staging administrator a repeatable way to verify the same read-only TraceBack investigation through the Jira issue panel, the installed Rovo agent, and an MCP client.

## Important platform behavior

The Forge `rovo:mcp` module exposes declared Forge actions as tools. External MCP access is **disabled by default** for each app installation. A site or organization administrator must explicitly enable the tools for that installation. Connecting an external client then uses OAuth 2.1 consent, and the tool executes subject to the invoking user's Atlassian permissions.

Official references:
- [Rovo MCP manifest reference](https://developer.atlassian.com/platform/forge/manifest-reference/modules/rovo-mcp/)
- [Build a Rovo MCP hello world app](https://developer.atlassian.com/platform/forge/build-a-hello-world-rovo-mcp/)
- [Rovo action manifest reference](https://developer.atlassian.com/platform/forge/manifest-reference/modules/rovo-action/)

## Before the test

1. Use a dedicated, non-production Atlassian test site.
2. Install the exact candidate build and record its version and commit SHA.
3. Have the site/org administrator review the requested read-only Jira and Teamwork Graph scopes. Do not assume deployment or installation means every scope is approved.
4. Use a genuine Jira incident with authentic linked Teamwork Graph goal, deployment, and/or pull-request records. Do not create artificial linked records to simulate a successful integration.
5. Select two test users: one who can access the linked evidence and one who cannot access at least one linked record. Use only accounts and data approved for this test.

## Verify the Jira panel

1. Open the genuine Jira incident.
2. Open **TraceBack Context Engine** and select **Investigate**.
3. Record the issue key, source records, source URLs, timeline timestamps, evidence status, and ranked next checks.
4. Confirm that unavailable, empty, partial, and not-integrated sources remain distinct.
5. Confirm the panel does not claim that temporal proximity or a Jira relationship proves causation.

## Verify the Rovo Agent

1. Open Rovo and locate **TraceBack Investigator** from the installed app.
2. Ask it to investigate the same Jira issue.
3. Compare its evidence records, timeline, ranked leads, coverage ledger, and warnings with the Jira panel.
4. Repeat as the restricted test user and confirm that inaccessible records are not exposed.

The agent should ask for a Jira issue key only when there is no valid active Jira issue context. An explicitly supplied key must match the active issue context.

## Enable and verify external MCP

1. As a site/org administrator, open Atlassian Administration.
2. Navigate to **Apps → Sites → [the test site] → Connected apps**.
3. Select the installed TraceBack app and open its app details.
4. Enable external MCP access and turn on the **TraceBack Tools** tool. External exposure is disabled by default.
5. Copy the UUID portion of `app.id` from `manifest.yml`. For the current registered app, the manifest value is `ari:cloud:ecosystem::app/b7cbb6a8-de78-4ba8-91fb-48733c1c2157`; use the UUID from the exact installed candidate if it changes.
6. Configure the MCP-compatible client with this endpoint:

   `https://mcp.atlassian.com/forge/b7cbb6a8-de78-4ba8-91fb-48733c1c2157`

7. Connect and complete the OAuth 2.1 consent flow. Select the intended test site and review the displayed app scopes and tools before approving.
8. Confirm the client discovers **get-traceback-investigation**.
9. Invoke it for the same issue and compare its returned evidence with the Jira panel and Rovo Agent.
10. Repeat with the restricted test user. Confirm the tool does not reveal records that user cannot access.

## Acceptance record

For each surface, record:

| Surface | Required evidence |
|---|---|
| Jira issue panel | Exact issue key, candidate version/SHA, returned source records, coverage states |
| Rovo Agent | Agent discovery, successful action invocation, output parity |
| External MCP | Admin enablement, OAuth consent, tool discovery, successful tool invocation |
| Permission boundary | Same issue tested as both permitted and restricted users; inaccessible records absent |
| Failure behavior | Missing scopes/connector access produces explicit partial/unavailable status without breaking Jira investigation |

A manifest declaration, successful CI run, or successful app installation alone is not proof of a working Agent or MCP invocation. Mark a surface **not verified** until its actual invocation is observed and recorded.

## Safety

- Read-only tests only.
- No Jira issue edits, comments, transitions, remote-link creation, deployments, rollbacks, or feature-flag changes.
- Do not enable scopes on a production tenant.
- Do not record private customer data, OAuth tokens, secrets, or personal information in screenshots or the public demo.
