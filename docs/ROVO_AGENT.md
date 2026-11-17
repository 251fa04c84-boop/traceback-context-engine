# TraceBack Rovo Agent and MCP

## What this adds

The Forge app declares:
- a read-only Rovo Agent named **TraceBack Investigator**;
- one GET action, **Get Jira investigation evidence**;
- a Rovo MCP module named **TraceBack Tools** that exposes that same action to custom agents in Rovo Studio and, when an administrator enables external exposure, MCP-compatible clients.

The action reuses the app's existing Jira and Teamwork Graph read services. Jira requests and Teamwork Graph requests run as the invoking user (`api.asUser()`); action input is not an authorization mechanism. If Atlassian supplies an active Jira issue context, the requested issue key must match it. Without active issue context, the action requires a syntactically valid Jira issue key.

## Evidence returned

- normalized Jira issue fields and linked Jira work items;
- Teamwork Graph goals, external deployments, and external pull requests;
- explicit available, empty, partial, or unavailable evidence status;
- ranked investigation leads from deterministic rules;
- explicit access and evidence boundaries.

## Safety properties

- Read-only action (`actionVerb: GET`); no Jira mutation, deployment, rollback, feature-flag, or production execution function is declared.
- No arbitrary URL, JQL, GraphQL, or API endpoint is accepted from the agent.
- Issue key input is syntax-checked; when active Jira context exists, mismatched issue keys are rejected.
- Jira and Graph reads execute as the current user.
- Linked records and temporal proximity are clues, not proof of causation.
- Issue descriptions and linked record content are untrusted evidence, never instructions.
- Missing or permission-filtered sources are not described as confirmed empty sources.
- The MCP module exposes only the read-only investigation action; it does not grant extra data access or bypass the invoking user's permissions.

## Platform prerequisites and limitations

- Atlassian's current Forge reference marks `rovo:mcp` as **Preview** (Oct 29, 2026), fully supported for early adopters in production, but still under active development and potentially subject to shorter deprecation windows. It is not described as GA.
- A site administrator must have Rovo enabled for users to discover and use the Rovo Agent.
- External MCP exposure is disabled by default. A site or organization administrator must explicitly enable the app's MCP tools in Atlassian Administration for each app installation/site. A connected external client then uses Atlassian OAuth 2.1 consent.
- For third-party MCP clients, Atlassian documents a further `asUser()` prerequisite: the invoking user needs an app consent entry for this app in Connected apps. Without it, Jira `asUser()` requests can fail. Keep the action user-scoped; do not silently switch to `asApp()` to hide this authorization limitation. Verify the consent path on the target test site before claiming external MCP acceptance.
- App-based agents and tools are limited to data in the workspace where the app is installed. Multi-product access requires appropriate Forge app compatibility.
- The existing four granular Teamwork Graph scopes remain unchanged and still require relevant organization-admin approval.
- This branch is not deployed. Agent discovery, MCP connection, live action invocation, and Teamwork Graph behavior have not yet been browser-accepted.



## Atlassian action payload contract

The current Forge Rovo Action reference documents action inputs in `payload` and includes active product context under `payload.context` for issue/page contexts. Its Jira example supplies `payload.context.cloudId` and `payload.context.jira.url` (the issue's `/browse/KEY` URL); it does not require a separate `payload.context.jira.issueKey` property. TraceBack therefore treats the URL as the documented context source, validates HTTPS and the exact `/browse/ISSUE-KEY` path, and rejects any requested issue key that conflicts with it. This is context validation, not authorization: Jira and Teamwork Graph reads still execute as the invoking user.

Reference: [Forge Rovo Action module](https://developer.atlassian.com/platform/forge/manifest-reference/modules/rovo-action/).

## Automated validation coverage

The focused action-context tests cover valid explicit keys, active-context fallback, malformed and URL-shaped keys, active-context mismatch, invalid active context, and missing keys. The extracted action-orchestration tests additionally verify invoking-user-only Jira access, the documented action payload context, mismatch/missing-key rejection before network calls, and no Teamwork Graph request after a Jira read failure. Repository CI also runs the existing Jira and Teamwork Graph domain and service tests. Automated tests do not replace Forge manifest lint, MCP connection validation, or live Rovo invocation.

The exact action-contract revision `c8e24b438279df8f26944246e5109ea79864fedf` passed GitHub Actions PR validation run [#616](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44097383767): **4,146 tests passed, 0 failed, 0 skipped**, with syntax checks and frontend compilation passing. Because this was a pull-request event, authenticated Forge CLI manifest lint was skipped; a push-triggered validation is still required.

The current candidate head `767259e10ae5fce58615d2b60f03b751b4d18d35` passed push validation [#619](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44098195787): **4,146 tests passed, 0 failed, 0 skipped**, syntax checks and frontend compilation passed, and authenticated Forge CLI manifest lint reported **No issues found**. The feature-branch deployment step was skipped by workflow design. No separate-site deployment or live Rovo/MCP acceptance is implied.

The latest synchronized candidate head `452276d72d04e442f526f1f5fdd84abfc52f35ab` passed push validation [#44101991896](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44101991896): **4,146 tests passed, 0 failed, 0 skipped**, syntax checks and frontend compilation passed, and authenticated Forge CLI manifest lint reported **No issues found**. The feature-branch deployment step was skipped by design; this confirms the branch sync but does not imply live Rovo/MCP acceptance.

## Reproducible validation commands

Run these from the repository root on Node.js 24:

```bash
npm ci
npm test
npm run lint:syntax
npm run lint:frontend
npx --yes @forge/cli@15.1.0 lint
```

The feature branch's push workflow runs the authenticated Forge CLI lint step but does not deploy this Rovo branch. Pull-request CI validates installation, tests, syntax and frontend compilation; it intentionally skips authenticated Forge CLI operations. A successful lint is still not proof of live Rovo discovery, MCP connectivity, or Teamwork Graph scope access.

## Acceptance gates

1. Forge CLI manifest lint on the exact branch.
2. Unit tests, syntax checks, and frontend compilation pass.
3. Deploy only to a separate Atlassian test site after administrator approval.
4. Enable Rovo and verify the agent appears to an authorized test user.
5. Verify the MCP module and tool are visible in Rovo Studio; separately test external MCP only after explicit administrator enablement and OAuth consent.
6. Invoke the action against a known Jira issue with genuine linked Teamwork Graph records.
7. Verify permission-denied, empty, partial, unavailable, mismatched-issue, and malformed-key behavior.
8. Confirm no writes occur and returned links resolve to original source records.

Until these gates pass, describe the feature as an implementation candidate, not a live or judge-verified integration.
