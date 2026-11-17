# TraceBack Rovo investigator

## What this adds

The Forge app declares a read-only Rovo Agent named **TraceBack Investigator** and one GET action, **Get Jira investigation evidence**.

The action reuses the app's existing Jira and Teamwork Graph read services. Jira requests and Teamwork Graph requests run as the invoking user (`api.asUser()`); the action input is not an authorization mechanism. If Atlassian supplies an active Jira issue context, the requested issue key must match it. Without active issue context, the action requires a syntactically valid Jira issue key.

The response includes:
- normalized Jira issue fields and linked Jira work items;
- Teamwork Graph goals, external deployments, and external pull requests;
- explicit available, empty, partial, or unavailable evidence status;
- ranked investigation leads from the existing deterministic rules;
- explicit access and evidence boundaries.

## Safety properties

- Read-only action (`actionVerb: GET`); no Jira mutation, deployment, rollback, feature-flag, or production execution function is declared.
- No arbitrary URL, JQL, GraphQL, or API endpoint is accepted from the agent.
- Issue key input is syntax-checked; when active Jira context exists, mismatched issue keys are rejected.
- Jira and Graph reads execute as the current user.
- Linked records and temporal proximity are clues, not proof of causation.
- Issue descriptions and linked record content are untrusted data, not instructions.
- Missing or permission-filtered sources are not described as confirmed empty sources.

## Platform prerequisites and limitations

- A site administrator must have Rovo enabled for users to discover and use the agent.
- The agent is app-based and follows Forge workspace data-access boundaries. It does not gain cross-product access merely because the user can access another Atlassian product.
- The existing four granular Teamwork Graph scopes remain unchanged and still require the relevant organization-admin approval. No new OAuth scopes are introduced by this branch.
- This branch is not deployed. The agent's availability, action invocation, and live Teamwork Graph behavior have not yet been browser-accepted.

## Why there is no Rovo MCP module in this branch

Atlassian's current Forge reference labels `rovo:mcp` as Early Access Program (EAP), experimental, unsupported, subject to change, and not recommended for production use. It would be misleading to present an EAP MCP server as a production-ready feature. This branch therefore targets the generally documented Forge Rovo Agent + action path first. MCP can be evaluated separately if Atlassian's support status changes or the project explicitly accepts the EAP risk.

## Automated validation coverage

The focused action-context test suite covers valid explicit keys, active-context fallback, malformed and URL-shaped keys, active-context mismatch, invalid active context, and missing keys. The repository CI test run also exercises the existing Jira and Teamwork Graph domain and service tests. These tests do not replace Forge manifest lint or live Rovo invocation.

## Acceptance gates

1. Forge CLI manifest lint on the exact branch.
2. Unit tests and syntax/frontend checks pass.
3. Deploy only to a separate Atlassian test site after administrator approval.
4. Enable Rovo on that site and verify the agent appears to an authorized test user.
5. Invoke the action against a known Jira Software issue with genuine linked Teamwork Graph records.
6. Verify permission-denied, empty, partial, unavailable, mismatched-issue, and malformed-key behavior.
7. Confirm no writes occur and that returned links resolve to the original source records.

Until all gates pass, describe this as an implementation candidate, not a working/live Rovo integration.
