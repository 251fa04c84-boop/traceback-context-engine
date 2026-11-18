# TraceBack Context Engine — judge installation and acceptance guide

> **Status: staging install verified; judge distribution is not ready.** Forge app version 2.0.0 was successfully deployed to the staging environment and installed on the separate test site `brand7.atlassian.net` by workflow [#44271541973](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44271541973). This is not a production distribution or judge installation link. Do not use the staging site as a public judge installation target.

## What judges should evaluate

TraceBack is a read-only Jira issue-context app for software teams. It assembles:
- the active Jira issue and its existing linked Jira work items;
- Teamwork Graph goals, external deployments and external pull requests linked to that issue, when those records are available to the current user;
- deterministic, source-linked investigation leads that explain what to inspect next without claiming root cause.

The Rovo candidate also includes a read-only **TraceBack Investigator** agent and a **TraceBack Tools** MCP module. The agent exposes one GET action: **Get Jira investigation evidence**. It does not create or update Jira issues, trigger deployments, roll back services, or change feature flags.

## Before a judge installation link can be issued

The app owner must complete all of the following:
1. Resolve the open high-severity dependency findings or obtain a documented Atlassian-approved mitigation/extension for upstream-owned dependencies.
2. Complete exact-head CI, authenticated Forge CLI lint and a successful Forge production deployment.
3. Complete a controlled test-site install and browser acceptance on a separate Atlassian test site.
4. Obtain administrator approval for the four read-only Teamwork Graph scopes if the Teamwork Graph bonus is claimed.
5. Verify the Rovo agent in Rovo discovery and the MCP tool in Rovo Studio. For external MCP clients, the site/org administrator must explicitly enable external MCP exposure and the test user must complete OAuth 2.1 consent.
6. Complete the security, privacy, support and distribution metadata required by Atlassian.
7. Generate the official judge installation link through Forge distribution controls and verify it with a clean test account.

Until those steps are complete, no install URL should be published or promised.

## Judge setup once the official link exists

1. Open the official Forge installation URL supplied in the final Devpost submission.
2. Review the app name, requested permissions and data access. An Atlassian organization/site administrator must approve the installation and any organization-wide scopes.
3. Install the app on a Jira Cloud site that has Jira Software and the new issue view enabled.
4. Open a representative Jira issue and select **Investigate** in the issue-context panel.
5. Verify the Jira summary, status, priority, description and linked Jira work items against their source issues.
6. Inspect the Teamwork Graph sections. Each category may be available, empty, partial or unavailable depending on the linked records, scopes, connector configuration and current-user permissions.
7. Open source links and verify the linked goal, deployment or pull request in its original source system.
8. Review suggested next checks. Confirm each is grounded in an observed source record and does not present correlation as causation.

## Rovo Agent acceptance

1. In Rovo, discover **TraceBack Investigator**.
2. Ask it to investigate the active Jira issue.
3. Verify it invokes **Get Jira investigation evidence**.
4. Confirm it reports issue context, evidence categories, completeness/access status, ranked investigation leads and explicit unknowns.
5. Ask it to investigate a different issue key while a Jira issue context is active. The action must reject the mismatch before making Jira or Graph requests.
6. Confirm the action uses the invoking user's authorization and does not mutate Jira or production systems.

## MCP acceptance

1. In Rovo Studio, confirm **TraceBack Tools** exposes **Get Jira investigation evidence**.
2. For an external MCP client, the organization/site administrator must explicitly enable the selected app tools in Connected apps.
3. Connect the client to the official app endpoint using Atlassian OAuth 2.1 consent.
4. Invoke the read-only investigation tool with a permitted test issue.
5. Confirm results respect the invoking user's existing permissions. A missing scope or denied permission must not be bypassed with app-level authorization.

## Expected honest behavior

- **Available:** usable linked evidence was returned.
- **Empty:** the query returned no linked records visible to the current user; this does not prove no records exist elsewhere.
- **Partial:** some evidence was returned, but one or more categories/pages could not be completed.
- **Unavailable:** the source could not be queried or returned usable evidence.
- A Jira relationship or timestamp is never presented as proof of incident cause.
- Missing telemetry, logs, traces and alerts are not synthesized.
- The app is read-only; no action may perform a rollback, deployment, flag change or Jira mutation.

## Current verified limitations

- The Rovo/MCP candidate is installed on `brand7.atlassian.net` in Forge staging. The ChatGPT Atlassian integration is connected to that site (cloud ID `f3a80fda-b810-47e6-806b-ba68cca6507a`). Read-only inventory confirms one Jira Software project, **My Kanban Space (KAN)**, with **zero issues**. The connected tools do not expose Jira project creation. Live app acceptance therefore remains blocked until a genuine test issue exists in KAN (or an administrator provisions a dedicated test project and issue). No test data has been fabricated.
- The inspected production-tenant Jira sample DEMO-7 has one related Jira work item, but the Teamwork Graph probe returned no linked goals, external deployments or external pull requests. This is not test-site evidence and must not be used to claim staging acceptance.
- The four granular Teamwork Graph scopes are requested by the manifest, but administrator approval and runtime usability remain unverified. ChatGPT connector access does not prove Forge scope consent.
- Rovo discovery, Rovo Studio MCP visibility, external OAuth 2.1 consent and real action invocation have not yet been live-accepted.
- The public demo video and official judge installation URL do not yet exist.

For the test-site deployment workflow and admin scope request, see [DEPLOY_TO_TEST_SITE_ANDROID.md](DEPLOY_TO_TEST_SITE_ANDROID.md) and [TEAMWORK_GRAPH_ADMIN_APPROVAL.md](TEAMWORK_GRAPH_ADMIN_APPROVAL.md).
