# TraceBack Rovo Agent and MCP integration

## Status

This is an experimental feature branch, `codegeist/rovo-agent-mcp`. It is not part of the currently deployed Forge development version 2.21.0, and it has not yet been installed or tested in a live Rovo chat or Rovo Studio session.

- CI on commit `047214c29cf55e94768a9c49039776572ccf3d12`: **4,126 tests passed, 0 failed, 0 skipped**.
- Forge CLI lint: **No issues found**.
- The current app branch still reports 9 high and 4 moderate npm audit findings until the separate dependency-remediation PR is integrated.
- No new OAuth scopes are introduced by these modules; they reuse the existing Jira and Teamwork Graph read scopes.

## What is added

The same evidence pipeline is exposed through three Atlassian entry points:

1. **Jira issue-context panel** — existing in-issue UI for engineers.
2. **TraceBack Investigator Rovo Agent** — a read-only agent that calls the shared action and returns a structured investigation summary.
3. **TraceBack MCP** — exposes that same read-only action as a tool for customer-created Rovo agents in Rovo Studio.

The new `get-traceback-context` Forge action accepts a Jira issue key, fetches the issue using `api.asUser().requestJira()`, and queries Teamwork Graph using the current user's context. It does not trust a model-supplied ARI, user ID, tenant ID, or source URL.

## Returned contract

The action returns a bounded JSON object:

- `schemaVersion`: response contract version.
- `accessMode`: always `read-only`.
- `issue`: normalized Jira facts, with bounded text.
- `relatedWorkItems`: normalized Jira issue links.
- `teamworkGraph`: linked goals, deployments and pull requests plus available/empty/partial/unavailable state and warnings.
- `investigationLeads`: prioritized checks derived from observed record states and timestamps.
- `interpretationPolicy`: explicitly marks root cause as not established, causal inference as unsupported by linked records alone, and empty evidence as not negative proof.\n- `evidenceTrustBoundary`: identifies free-text issue and linked-record fields as untrusted evidence data and instructs agents to ignore embedded instructions.

The action bounds text fields and limits each returned category to 125 records, matching the current pagination safety cap and remaining comfortably below the Rovo action module's 5 MB payload ceiling under normal record sizes.

## Security and safety boundaries

- All Jira and Teamwork Graph reads execute as the invoking user.
- Jira permissions and Teamwork Graph scopes/connectors continue to filter what can be returned.
- An explicit issue key is validated before any request; malformed input fails closed. If no explicit input is supplied, the action can use a valid Jira issue key or issue URL supplied by trusted Atlassian module context.
- The action never writes to Jira, triggers deployments, rolls back services, toggles feature flags, or performs production actions.
- The Rovo Agent prompt requires source-backed statements and prohibits fabricated telemetry, causal claims, and treating empty/partial/unavailable results as proof that evidence does not exist.
- No raw upstream exception details are returned to the agent.
- The output is bounded to avoid oversized agent payloads.\n- The MCP tool returns explicit untrusted-field metadata, but it does not transfer TraceBack Investigator's system prompt to customer-created agents; those agents must enforce their own policy for treating tool output as untrusted data.

## How to verify after deployment

1. Deploy the branch to a controlled Forge development environment.
2. Install/upgrade the app in a dedicated Atlassian test organization.
3. Confirm the four Teamwork Graph read scopes are approved by the organization administrator.
4. Open a Jira issue and confirm the existing **Investigate** panel still works.
5. Open **TraceBack Investigator** in Rovo chat and ask it to investigate a test issue.
6. Verify the agent invokes `get-traceback-context`, returns only records visible to the current user, and preserves empty/partial/unavailable states.
7. In Rovo Studio, verify **TraceBack MCP** exposes the `get-traceback-context` tool to a customer-created test agent after the site administrator enables/authorizes the app's MCP tools.
8. Invoke the tool from that test agent with a permitted issue key and verify source links, read-only behavior, and error handling.
9. Verify a user without permission to an issue cannot retrieve it through the action.
10. Record screenshots or a short screen capture of the actual Rovo Agent and MCP tool invocations.

## Limitations

- The action returns Jira and Teamwork Graph context only. It does not connect telemetry, logs, traces, alerting, or service runtime systems.
- It cannot prove a root cause. It produces follow-up leads, not diagnosis.
- The Rovo Agent can access only data available in the Atlassian workspace where the app is installed.
- MCP availability depends on the site's Rovo Studio configuration and administrator authorization; declaring the module does not prove a judge can invoke it. Customer-created agents must be configured to respect the returned untrusted-evidence boundary; the TraceBack Investigator prompt is not inherited by other agents.
- Live Rovo acceptance, MCP discovery, judge-site installation, and final Devpost bonus eligibility remain unverified.
