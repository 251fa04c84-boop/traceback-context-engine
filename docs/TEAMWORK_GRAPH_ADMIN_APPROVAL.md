# Teamwork Graph administrator approval request

> **Use a separate Atlassian test organization with test data.** Do not approve these scopes on a production organization unless the organization's security/data owner has explicitly reviewed and approved that use.

## Request

Please review and, if approved, authorize the TraceBack Context Engine Forge app to read the following Teamwork Graph object types in the test organization:

- `read:graph:issue:jira` — resolve the Jira work item in Teamwork Graph.
- `read:graph:goal:atlassian` — read Atlassian goals linked to that work item.
- `read:graph:deployment:external` — read external deployment records linked to that work item.
- `read:graph:pull-request:external` — read external pull-request records linked to that work item.

The app also requests `read:jira-work` for the Jira issue context.

## Why the app needs these permissions

TraceBack adds a read-only **Investigate** panel to Jira issues. It shows the issue's existing Jira relationships and, where available, the goals, deployments and pull requests already linked to that Jira work item in Teamwork Graph. It uses these records to suggest source-linked next checks for an engineer's investigation.

## Data handling and safeguards

- The app uses the signed-in user's Jira and Teamwork Graph context; it does not grant a user access to records they cannot otherwise read.
- These Teamwork Graph scopes are read-only. The app does not create, edit, delete, link, or unlink graph records.
- The app does not trigger deployments, rollbacks, feature-flag changes, or Jira mutations.
- The current implementation does not persist Teamwork Graph records to app storage or send them to an external AI/analytics service.
- External source links are accepted only when they are valid HTTPS URLs without embedded credentials.
- Results are bounded to 25 records per page and at most five pages (125 records) per relationship category. Truncation is reported to the user.
- Missing, partial, unavailable, or permission-filtered evidence is shown explicitly; missing data is not treated as proof that no evidence exists.
- A relationship or timestamp is not represented as proof of incident causation.

## Before approving

1. Confirm the target is a separate test organization and that the test data is appropriate for this app.
2. Review the four object scopes above and the app's current manifest.
3. Confirm the relevant Atlassian goals and external DevOps providers are configured in that test organization.
4. Approve only the scopes required for the intended test. If any scope is not acceptable, leave it disabled; the app will report that category as unavailable.
5. After approval, ask the app tester to verify the real returned records and source links in Jira's new issue view.

## Current status

The four granular scopes remain unchecked/disabled on the only Atlassian site currently connected to this ChatGPT account. That site is a production Jira tenant. No scope has been changed. Core application code revision `abc24d51b2b2d0053a1e9adc20a16734a0f10dde` was deployed to Forge development as version **2.44.0** by [CI run #44103273512](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44103273512); later core pushes were documentation-only and correctly skipped redundant redeployment. This confirms a development deployment, not browser acceptance, Teamwork Graph access, a separate test site, or a judge installation. Do not enable these scopes on the connected production tenant.


## Latest environment verification — 17 November 2026

The connected Atlassian account currently exposes exactly one site, `251fa04c84.atlassian.net`. Its two visible Jira projects are both service-desk projects (`DEMO` and `TCE`); `TCE` has no issues. There is no separate test organization or Jira Software project available through this connection. The site is a production tenant, so this request is **not** permission to enable the scopes there. Forge development version 2.44.0 is deployed on that site, but a fresh browser acceptance pass is not recorded.

Read-only Teamwork Graph probes found one existing Jira-to-Jira relationship (DEMO-7 → DEMO-8), but no linked goal, external deployment or external pull request on the checked issues. Do not create artificial relationships or records to make the demo appear populated.

Atlassian's current scope reference states that each object type needs its own scope and that an admin must grant each requested scope. A missing scope can silently omit unreadable objects and relationships rather than returning an API error. After approval in a suitable test organization, allow approximately one minute for the scope change to propagate, then rerun the app's live acceptance checks.

References:
- [Teamwork Graph scopes and admin restrictions](https://developer.atlassian.com/platform/teamwork-graph/scopes/)
- [Teamwork Graph API troubleshooting](https://developer.atlassian.com/platform/teamwork-graph/call-the-teamwork-graph-api/)


## Automation consent safeguard — 17 November 2026

The Forge development deployment workflow no longer uses the CLI `--confirm-scopes` option. Future CI runs may deploy code and attempt to upgrade the existing development installation, but they will not automatically consent to newly requested scopes. Any scope change must be reviewed and approved explicitly by the responsible Atlassian organization administrator. The app manifest still requests the same four read-only Teamwork Graph scopes; this workflow update does not grant or revoke them.
