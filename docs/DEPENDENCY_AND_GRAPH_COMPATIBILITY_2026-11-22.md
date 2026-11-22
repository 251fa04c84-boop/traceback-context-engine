# Dependency and Teamwork Graph compatibility review — 22 November 2026

## Purpose

This note records a source-backed compatibility review for the current TraceBack candidate. It is not a waiver of vulnerabilities, an Atlassian support statement, or evidence of a successful Forge installation.

## Lockfile evidence

The candidate lockfile resolves:

| Package | Resolved version | Relevant dependency |
|---|---:|---|
| `@forge/manifest` | 13.9.0 | `glob: ^13.0.0` |
| `glob` | 13.0.7 | `minimatch: ^10.2.2` |
| `minimatch` | 10.2.6 | transitive under glob |

The root package declares `@forge/api@^8.5.0`, `@forge/bridge@^7.3.0`, and `@forge/react@^12.5.0`.

## Upstream package and advisory check

The current npm package pages checked on 22 November list stable releases:
- `@forge/api`: 8.5.0 — https://www.npmjs.com/package/%40forge/api
- `@forge/bridge`: 7.3.0 — https://www.npmjs.com/package/%40forge/bridge
- `@forge/react`: 12.5.0 — https://www.npmjs.com/package/%40forge/react
- `@forge/manifest`: 13.9.0 — https://www.npmjs.com/package/%40forge/manifest

The manifest package listing identifies 13.9.0 as the current stable tag. Its candidate lockfile dependency range remains `glob@^13.0.0`.

The current audit advisories:
- GHSA-3g3m-2fjr-6pw4 affects `glob` versions 9.0.0 through 14.0.1; patched release is 14.0.2. Advisory: https://github.com/advisories/GHSA-3g3m-2fjr-6pw4
- GHSA-g3hv-75wg-m249 affects `minimatch` before 11.0.1; patched release is 11.0.1. Advisory: https://github.com/advisories/GHSA-g3hv-75wg-m249

The required patched majors are outside the current parent package ranges (`@forge/manifest` -> `glob@^13`; `glob@13` -> `minimatch@^10.2.2`). A forced override to `glob@14` or `minimatch@11` would cross upstream-declared compatibility ranges. No such override is being applied to the supported candidate.

**Decision:** do not claim the six moderate findings are remediated. Do not run `npm audit fix --force`, downgrade Forge SDK packages, or force transitive major versions. Re-run the audit after Atlassian publishes a stable compatible dependency range or provides written compatibility guidance. The current candidate audit has 0 high, 6 moderate, 0 critical; the maintained core branch's previously recorded 9 high / 4 moderate snapshot is a separate branch/evidence point and must not be conflated with the candidate.

## Teamwork Graph API architecture

The current implementation calls `api.asUser().requestTeamworkGraph(query, variables)` in the Forge backend service. This is an officially documented supported path. Atlassian's current API reference explicitly distinguishes frontend `@forge/bridge` calls from backend `@forge/api` calls and says backend functions should use `api.asUser().requestTeamworkGraph()`:
- https://developer.atlassian.com/platform/forge/apis-reference/ui-api-bridge/requestTeamworkGraph/
- https://developer.atlassian.com/platform/forge/call-the-teamwork-graph-api/

The November 11 Forge changelog moved the bridge method to Preview for frontend use; this does not deprecate the documented backend `@forge/api` method:
- https://developer.atlassian.com/platform/forge/changelog/

The manifest declares object-level read scopes corresponding to the queried object types:
- `read:graph:issue:jira` — JiraWorkItem
- `read:graph:goal:atlassian` — AtlassianGoal
- `read:graph:deployment:external` — ExternalDeployment
- `read:graph:pull-request:external` — ExternalPullRequest

The Teamwork Graph scope reference confirms these names and states that the site administrator must grant requested scopes; end-user product permissions still apply:
- https://developer.atlassian.com/platform/teamwork-graph/scopes/

A missing scope can silently filter objects or relationships, so an empty Graph result is ambiguous. The app must preserve `empty`, `partial`, and `unavailable` states rather than claiming that no records exist.

## Rovo-specific runtime risk

A public Atlassian developer-community post dated 19 November 2026 reports a different Codegeist app whose same current-user Graph query succeeds from a UI resolver but fails from a Rovo action with an organization-permission error:
- https://community.developer.atlassian.com/t/requestteamworkgraph-works-from-a-ui-resolver-but-returns-user-is-not-permitted-to-query-this-organization-inside-a-rovo-action/104086

This is an external report, not an Atlassian-confirmed platform limitation and not evidence that TraceBack fails. It is sufficient reason to make Rovo Graph failure an explicit staging acceptance case.

A focused regression test was added to `test/rovo-investigation-action.test.js` to prove that when the Graph dependency returns an unavailable result, the Rovo action still returns the Jira issue, does not fabricate Graph records, keeps the Graph state as unavailable, and builds its timeline and coverage using that unavailable state. This test validates the application's fallback contract only; it does not prove that the live Rovo Graph request succeeds.

## Required acceptance sequence

1. Run the new Rovo Graph-unavailable regression test in CI.
2. In a real staging installation, invoke the Jira panel and Rovo action as the same permitted user against the same real Jira issue.
3. Record Graph response status, error code/message (sanitized), request correlation ID if available, and the evidence coverage state.
4. Repeat as a restricted user and verify that no inaccessible object titles, URLs, or details are returned.
5. If the Rovo action cannot query Graph while the Jira panel can, keep the action's Jira-only result explicitly partial/unavailable for Graph, record the platform limitation, and do not claim Rovo/Teamwork Graph parity.
6. Do not add scopes, install/upgrade, or create staging data without the staging administrator's explicit action.

## Release decision

The candidate remains draft. No deployment, installation, scope approval, production action, dependency override, or vulnerability waiver was performed. The six moderate candidate findings and all live staging acceptance gates remain open.
