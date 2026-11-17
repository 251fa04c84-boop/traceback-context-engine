# TraceBack Context Engine — Acceptance Test Record

This record must be completed against an actually deployed Forge app. A successful unit-test run is not a substitute for a live Jira installation.

## Environment under test

- Forge app ID: **Not registered yet**
- Forge environment: **Not deployed yet**
- Jira site: **251fa04c84.atlassian.net**
- Jira view: New issue view only
- Test issue: **Choose and record a software-team issue with linked Jira work and, where available, Teamwork Graph records**
- Test user: **Record the Jira account and the permissions used; do not put credentials here**
- App installation link: **Not generated yet**

## Pre-installation gates

- [ ] App registered once with forge register; review the generated app ID in manifest.yml.
- [ ] forge lint and current manifest/source validation completed successfully.
- [ ] Forge app deployed to the development environment.
- [ ] App installed on the test Jira site.
- [ ] Requested Jira and Teamwork Graph scopes are granted by an organization administrator.
- [ ] An organization administrator approves the Teamwork Graph scopes; these scopes can expose organization-wide data and Atlassian requires organization-admin installation.
- [ ] The site has the expected graph connectors enabled, if external PR/deployment records are to be shown.
- [ ] The judge installation link is generated using Atlassian's supported sharing flow.

## Jira issue-context acceptance

- [ ] Open an issue in Jira's new issue view.
- [ ] Expand Investigate in the issue context area.
- [ ] Verify the issue key, summary, status, issue type, priority and description match the live issue.
- [ ] Verify the panel remains read-only.
- [ ] Verify a Jira issue without linked work still renders with a clear empty state.
- [ ] Verify a user who cannot access an issue cannot use the panel to retrieve it.

## Related Jira work acceptance

- [ ] Choose an issue with at least one inward or outward Jira issue link.
- [ ] Verify the related issue key and summary match Jira.
- [ ] Verify the relationship label (for example, "blocks", "is blocked by", or "relates to") is correct.
- [ ] Verify status, type and priority are accurate.
- [ ] Open the relative /browse/ISSUE-KEY link and confirm it stays on the same Jira site.
- [ ] Verify malformed issue keys or missing linked issues are not rendered as clickable entries.

## Teamwork Graph acceptance

- [ ] Confirm the organization administrator granted read:graph:issue:jira.
- [ ] Confirm the organization administrator granted read:graph:goal:atlassian.
- [ ] Confirm the organization administrator granted read:graph:deployment:external.
- [ ] Confirm the organization administrator granted read:graph:pull-request:external.
- [ ] Record that Teamwork Graph is a Forge Preview API and verify the current curated-query schema before final deployment.
- [ ] Verify linked goals, external deployments and external pull requests when real records exist.
- [ ] Verify cursor pagination follows later pages for each relationship category and does not duplicate records.
- [ ] Verify a category with more than 125 records is marked as capped with a visible warning rather than silently appearing complete.
- [ ] Verify each source URL opens the corresponding Atlassian or external record over HTTPS.
- [ ] Verify a graph response with no linked items is shown as empty, not as proof that no evidence exists elsewhere.
- [ ] Verify partial GraphQL errors preserve valid returned records and are labelled partial.
- [ ] Verify a permission denial or failed graph request becomes unavailable while Jira issue details remain visible.
- [ ] Verify a missing, HTTP, malformed, or credential-bearing URL is never clickable.

## Suggested next checks acceptance

- [ ] A failed production deployment produces a high-priority lead with the exact deployment source link; a failed non-production deployment is medium priority.
- [ ] A recent production deployment produces a timeline-check lead only, with explicit non-causation wording.
- [ ] An open/draft pull request produces a review lead with its source link.
- [ ] Unresolved linked Jira work and archived goals produce low-priority leads.
- [ ] Empty/unavailable Teamwork Graph results suggest verifying connectors and scopes, not inventing evidence.
- [ ] Invalid timestamps do not create time-proximity leads.
- [ ] Every lead rationale states what was observed and never claims that the source caused the Jira issue.

## Evidence honesty and safety

- [ ] No synthetic telemetry, logs, traces, deployment records, pull requests or metrics are presented as real.
- [ ] No root cause is asserted from issue text or a simple relationship.
- [ ] No uncalibrated probability/confidence percentage is shown.
- [ ] No production action, rollback, feature-flag change, deployment trigger or Jira mutation is exposed.
- [ ] The UI clearly distinguishes Jira links from Teamwork Graph external evidence.

## Results

| Test | Result | Evidence / notes |
| --- | --- | --- |
| App registered | Not run | |
| Forge lint | Not run | |
| Forge deployment | Not run | |
| App installation | Not run | |
| Jira issue context | Not run | |
| Related Jira work | Not run | |
| Teamwork Graph goals | Not run | |
| Teamwork Graph deployments | Not run | |
| Teamwork Graph pull requests | Not run | |
| Empty / partial / unavailable states | Not run | |
| Source links | Not run | |

Do not change a result to Pass until the corresponding live action has been performed and recorded.
