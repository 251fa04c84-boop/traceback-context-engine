# Rovo action Teamwork Graph fallback acceptance

**Status:** Automated regression coverage added; live Forge/Rovo acceptance remains pending.

## Why this gate exists

Atlassian's Rovo Action manifest documentation states that action functions receive the action payload and relevant Atlassian context. Its Jira example includes the site cloud ID and Jira issue context. TraceBack uses this context to read the active issue as the invoking user and then requests optional Teamwork Graph evidence.

A recent Atlassian Developer Community report describes a case where the same user's Teamwork Graph query succeeds from a Forge UI resolver but returns an organization-permission error from a Rovo action. This is a community-reported behavior, not an official Atlassian statement that Graph requests are unsupported in Rovo actions:

- Official Rovo action payload/context reference: https://developer.atlassian.com/platform/forge/manifest-reference/modules/rovo-action/
- Community report: https://community.developer.atlassian.com/t/requestteamworkgraph-works-from-a-ui-resolver-but-returns-user-is-not-permitted-to-query-this-organization-inside-a-rovo-action/104086

## Required behavior

1. Resolve the active Jira issue context and reject mismatched issue keys before any API request.
2. Fetch the Jira issue using `api.asUser().requestJira()`.
3. Attempt Teamwork Graph using the current-user client.
4. If Graph is denied, unavailable, malformed, or times out, preserve the successfully retrieved Jira issue and return an explicit `unavailable` Graph status.
5. Never switch to `asApp()` to bypass the user's Graph permission boundary.
6. Do not expose raw upstream error details in the user-visible warning.
7. Do not describe missing Graph records as an empty relationship set or claim that live Graph access works.

## Automated regression added

Test: `preserves Jira investigation when the Rovo action Graph request is denied` in `test/rovo-investigation-action.test.js`.

The test uses the real `fetchTeamworkGraphEvidence` service with a mocked current-user Graph request that throws an organization-permission error. It asserts that:
- Jira issue data is still returned.
- Graph status is `unavailable`, not `empty`.
- The warning does not leak the upstream error.
- Exactly one Jira request and one Graph request occur.
- No app-level authorization is attempted.

This is deterministic unit-level evidence only. It does not prove the live Forge Rovo action is permitted to query Teamwork Graph.

## Live acceptance still required

On a dedicated Atlassian test site, use an existing Jira issue with genuine linked goal, deployment, and/or external pull-request records. Compare the same issue and current user through:

- The Forge Jira issue-context resolver.
- The TraceBack Rovo action.

Record the exact invocation time, issue key, user permission state, HTTP/GraphQL result, returned relationship counts, and visible status. Test both a user with access and a user without access. Do not approve scopes, install/upgrade the app, or use the connected production tenant for this test.

If the UI resolver succeeds but the Rovo action is denied, retain the graceful fallback and record the limitation. Do not use `asApp()`, broaden scopes, or cache another user's Graph data as a workaround without a separately reviewed security design.

## External repository patterns applied

- Atlassian Forge Skills: separate invocation-context, permission, and runtime checks; treat unrun static-analysis steps as gaps.
- Precedent: test denied visibility and fail closed; do not expose cached evidence without per-viewer authorization.
- Forge Inspired: keep the Rovo action bounded and its read-only behavior explicit.

No external repository code or runtime dependency was copied for this change.
