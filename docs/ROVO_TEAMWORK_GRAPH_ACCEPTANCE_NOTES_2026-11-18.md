# Rovo and Teamwork Graph live-acceptance notes — 18 November 2026

This is an evidence-led test guide for the staging acceptance gate. It records third-party platform observations, not claims that TraceBack has passed those tests.

## 1. Rovo availability on developer sites

A public Atlassian Developer Community report for Codegeist 2026 describes free developer sites where the admin UI says Rovo is enabled but Rovo Chat is absent and the Agents page shows zero agents. A community reply suggests using a Forge demo site provisioned with the enterprise editions of Jira, Confluence, JSM and Rovo. This is community guidance, not an Atlassian guarantee.

**Acceptance implication:** if `brand7.atlassian.net` has no Rovo Chat/Agents UI, do not diagnose the Forge module as broken solely from that symptom. First verify the site's plan/features and whether a Rovo-enabled Forge demo site is available. Do not replace the existing staging tenant or touch the connected production tenant without an explicit plan.

Reference: https://community.developer.atlassian.com/t/rovo-chat-agents-not-available-on-free-developer-site-for-codegeist-2026/103526

## 2. Teamwork Graph false-success cases to test

A November 2026 community field report documents several failure modes that can look like valid empty results:

- Graph scope approval is organization-admin controlled and object-type-specific.
- A missing scope may silently omit rows rather than return an authorization error.
- Rate limiting may produce empty results; retry with bounded backoff and report incomplete evidence rather than claiming there is no data.
- HTTP 200 is not sufficient: GraphQL responses can contain an `errors` array (including operation-name failures) with no usable data.
- Curated query pagination can report `hasNextPage: true` even when a page is short.
- The report recommends `api.asUser()` for permission-filtered reads.

These observations are external community evidence and must be verified against current official Forge/Teamwork Graph documentation and our own exact implementation before changing code.

**Acceptance checklist:**
1. Have an organization admin approve the four requested read-only object scopes on the staging site only.
2. Use a user who can see the linked Jira issue and genuine related goal/deployment/pull-request records.
3. Verify each Graph response checks HTTP status, GraphQL errors and actual data—not just `res.ok`.
4. Verify pagination continues until `hasNextPage === false`.
5. Compare authorized and unauthorized users; ensure no cross-user or cross-tenant data leaks.
6. Test rate-limit and partial-source failures; the UI/agent must disclose incomplete evidence.
7. Confirm an empty result is not presented as proof that no related records exist when scopes/data may be missing.

Reference: https://community.developer.atlassian.com/t/reading-the-teamwork-graph-api-from-a-forge-rovo-agent-the-failures-that-return-http-200-or-an-empty-list/103629

## 3. External MCP enablement ordering

A November 2026 community report describes an external `rovo:mcp` exposure failure when the app was connected to Jira and Confluence before external tools were enabled. A community reply says the behavior was unintended and a fix was being rolled out. The report's workaround was to enable external MCP tools while the installation was Jira-only, then connect Confluence.

**Acceptance implication:** TraceBack currently targets Jira. If external MCP is tested and the endpoint rejects tool listing despite the admin toggle, record the exact error and installed product order; do not claim OAuth or MCP acceptance. Re-check current Atlassian status before applying any workaround.

Reference: https://community.developer.atlassian.com/t/rovo-mcp-external-endpoint-returns-not-allowed-to-expose-its-tools-when-enable-tools-is-turned-on-while-the-app-is-connected-to-jira-confluence/103670

## 4. TraceBack release boundary

The staging deploy/install is verified separately. This note does not mark browser acceptance, Rovo discovery, Graph scope consent, live Graph data, action invocation, external MCP, OAuth, or judge distribution as passed. Keep PR #9 draft/unmerged until these gates and dependency security review are complete.

No production tenant, production scope, or production installation is part of this acceptance plan.


## 5. Official Atlassian API compatibility cross-check — 18 November 2026

I compared the exact TraceBack query/service implementation on `codegeist/rovo-integrated` with the current Atlassian Forge and Teamwork Graph references:

- The Forge `requestTeamworkGraph` reference explicitly supports backend calls through `@forge/api` using `api.asUser()`; the frontend bridge API is an alternative, not a requirement to move Graph calls into the browser. TraceBack's backend service uses `apiClient.asUser().requestTeamworkGraph(query, variables)`, so its execution model matches the documented backend path.
- The official curated-query catalog lists all three relationship fields used by TraceBack: `jiraWorkItemGoals`, `jiraWorkItemLinkedExternalDeployments`, and `jiraWorkItemLinkedExternalPullRequests`. Each supports `first` and `after` pagination arguments.
- The official catalog says curated queries return Relay-style `edges` and `pageInfo`, and caps `first` at 25. TraceBack requests `first: 25`, passes independent cursors, and continues while `hasNextPage` is true.
- The Forge reference confirms calls execute as the current user and require declared scopes plus the user's underlying permissions. TraceBack declares the Jira issue, goal, external deployment and external pull-request object scopes and does not use app-level Graph authorization.
- The official API documentation warns that missing scopes can silently omit records. TraceBack therefore correctly treats empty results as ambiguous and reports missing scopes/permissions/connectors as possible explanations rather than asserting that no linked records exist.

Official references:
- Forge `requestTeamworkGraph` API reference (last updated 10 Nov 2026): https://developer.atlassian.com/platform/forge/apis-reference/ui-api-bridge/requestTeamworkGraph/
- Teamwork Graph curated-query catalog and pagination contract: https://developer.atlassian.com/platform/teamwork-graph/curated-queries/
- Teamwork Graph scope reference: https://developer.atlassian.com/platform/teamwork-graph/scopes/

**Review conclusion:** the current backend API choice, three curated relationship fields, page size, pagination shape, current-user authorization and manifest scope categories align with the official documentation reviewed on 18 November 2026. This is a documentation/schema cross-check only; it does not validate the query against the staging tenant's live schema, prove scope consent, or establish that real linked records are returned. Browser and tenant-level runtime acceptance remain pending.
