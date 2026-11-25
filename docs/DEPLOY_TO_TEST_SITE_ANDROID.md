# TraceBack staging acceptance — manual authorization required

## Connected staging tenant

The connected non-production Atlassian tenant is **`brand7.atlassian.net`**. The connected production/earlier TraceBack tenant is **`251fa04c84.atlassian.net`** and must never be used for staging acceptance.

A fresh read-only check on 23 November 2026 found:

- One Jira Software project: **My Kanban Space (KAN)**, ID `10000`.
- The project currently contains **zero Jira issues**.
- A JQL search for `project = KAN ORDER BY created DESC` returned no issues.
- Teamwork Graph context for Confluence space `SD` returned four Confluence page targets through the connected Atlassian connector.
- A JiraSpace Graph lookup using numeric project ID `10000` did not resolve to an ARI.

The connector-side Confluence result proves only that the connected Atlassian connector can read some Teamwork Graph context. It does not prove that TraceBack's Forge runtime can call `api.asUser().requestTeamworkGraph()` successfully.

## Staging workflow boundary

The repository contains a manually dispatched [Forge test-site deploy workflow](https://github.com/251fa04c84-boop/traceback-context-engine/actions/workflows/forge-test-site-deploy.yml). Its target is restricted in the workflow itself and in the GitHub Actions input choices to the exact connected staging tenant `brand7.atlassian.net`; it rejects the production tenant and every other domain.

The workflow can deploy to Forge `staging` and install or upgrade the app on the selected Jira site. **This automation will not dispatch that workflow and will not install or upgrade the app on any site.** A separate explicit user authorization and staging administrator action would be required before any future installation or upgrade. No such action is authorized by this run.

The development deployment workflow is separate: it deploys only to Forge `development` and contains no Jira site installation command.

## Exact acceptance prerequisites

Do not attempt live panel, Rovo, or MCP acceptance until the staging owner/admin supplies all of the following:

1. One genuine non-production Jira incident key with authentic linked Teamwork Graph evidence (goal, external deployment, or external pull request); do not create or fabricate records for the demo.
2. Two approved staging test accounts with intentionally different access to at least one linked record.
3. Confirmation that the existing staging installation is the intended TraceBack app/version and that the four read-only Teamwork Graph scopes are approved for that staging installation:
   - `read:graph:issue:jira`
   - `read:graph:goal:atlassian`
   - `read:graph:deployment:external`
   - `read:graph:pull-request:external`

The Jira connector's read/write product access is not evidence that the Forge app has these scopes. The connected operation catalog did not expose a read-only Forge installation inventory operation in this check, so the previously recorded staging app version and effective scope state were not independently refreshed.

## Acceptance sequence after separate authorization

When the prerequisites are satisfied and a user explicitly authorizes the staging installation step:

- Verify the Jira panel against the real incident as the permitted user.
- Invoke the Rovo action on the same issue and compare normalized evidence, timeline, coverage, and source links.
- Verify that Graph unavailable, empty, partial, and available states remain distinct.
- Repeat as the restricted user and confirm that inaccessible object titles, URLs, and details are not exposed.
- Test external MCP discovery, OAuth consent, and invocation separately; do not claim MCP acceptance from manifest presence alone.
- Record sanitized runtime errors, request correlation IDs when available, exact app version, scope status, and the two-user comparison.

Until then, keep PR #24 draft and unmerged. No Jira/Confluence data, scopes, site installations, or production environments should be changed to manufacture a green demo.
