# Codegeist 2026 — TraceBack Context Engine submission draft

> **Draft only — not submitted.** This copy describes the proposed final build. Rovo Agent and MCP are implemented on draft PR #3 but are not deployed or live-accepted. Do not publish claims about those integrations until the exact final build is installed and demonstrated.

## Submission identity

- **Project:** TraceBack Context Engine
- **Tagline:** Evidence, not guesses, for software incident investigations.
- **Category:** Apps for Software Teams
- **Primary bonus target:** Best apps with Teamwork Graph integration — only claim after the deployed app retrieves genuine linked records with approved scopes.
- **Additional candidate bonus categories:** Best Agents and Best apps with Atlassian MCP — only claim after live Rovo chat and Rovo Studio tool acceptance.
- **Important:** A submission may receive at most one bonus prize; do not imply three bonus wins are possible.
- **Not currently claimed:** Best Marketplace published app. No Marketplace listing or publication has been verified.

## Short description

TraceBack brings permission-aware Jira and Teamwork Graph evidence into software incident investigations. Engineers can inspect linked work in Jira, ask TraceBack Investigator in Rovo chat, or expose the same read-only context action to their own Rovo agents through MCP. TraceBack prioritizes source-linked next checks without fabricating telemetry or claiming correlation proves root cause.

## Full project description

When a software incident is tracked in Jira, the issue rarely contains the whole investigation. Engineers often need to move between related Jira tickets, delivery records, pull requests and team goals to understand what work is connected to the incident. That context is fragmented, and a relationship or timestamp can easily be mistaken for proof of cause.

**TraceBack Context Engine** assembles that context through Atlassian Forge and Teamwork Graph. Open the **Investigate** panel from a Jira issue in the new issue view and TraceBack reads the issue as the signed-in user. It displays the issue's key details and existing inward/outward Jira links, including relationship labels, status, type and priority. It also queries Teamwork Graph for linked goals, external deployments and external pull requests, following cursors with bounded pagination and de-duplicating records.

TraceBack then turns observed states and timestamps into prioritized next checks—for example, inspect a failed linked deployment, review an open pull request, or check an unresolved related Jira item. Each suggestion explains what was observed. It is an investigation lead, not a root-cause claim or probability score.

The same evidence path is also exposed through **TraceBack Investigator**, a read-only Rovo Agent, and **TraceBack MCP**, which makes the same action available to customer-created Rovo agents in Rovo Studio. These are not separate data pipelines with broader credentials: they reuse a shared action that validates the issue key and performs Jira and Teamwork Graph reads as the invoking user. The action explicitly labels issue and linked-record free text as untrusted evidence, and the Rovo prompt instructs the agent to ignore embedded instructions.

TraceBack is deliberately honest about missing data. It distinguishes available, empty, partial and unavailable Teamwork Graph results; permission-filtered or disconnected sources are not presented as proof that no evidence exists. Source URLs are validated before becoming links. The Jira panel, Rovo Agent and MCP action are read-only: they do not trigger deployments, rollbacks, feature-flag changes or Jira mutations.

TraceBack is designed for software teams that need to start an investigation with more of the context already connected to their work—without fabricating telemetry, hiding missing permissions, or overstating what the evidence proves.

## How it works

1. **Open the issue:** The Forge `jira:issueContext` module renders the Investigate panel in Jira's new issue view.
2. **Read permitted Jira context:** A Node.js 24 Forge resolver fetches the active issue as the signed-in user and normalizes relevant fields and issue links.
3. **Retrieve connected evidence:** The resolver derives the Jira work-item ARI from the server-side issue ID and site context, then queries Teamwork Graph for linked goals, external deployments and external pull requests.
4. **Bound and normalize results:** Each relationship is paginated at 25 records per page, up to five pages per category. Stable IDs are used for de-duplication; malformed records and unsafe source URLs are rejected.
5. **Suggest the next check:** Deterministic rules prioritize observed deployment states, pull-request states, related Jira work and archived goals. Each rationale describes what was observed and avoids causal language.
6. **Use Rovo:** TraceBack Investigator and TraceBack MCP call the shared `get-traceback-context` Forge action. The action validates issue keys, uses the invoking user's Jira and Teamwork Graph permissions, and returns bounded structured evidence plus an explicit non-causation policy.
7. **Show what is missing:** Available, empty, partial, unavailable and truncated states are explicit. Missing connector configuration or permissions are not silently represented as a clean bill of health.

## Technology and platform integration

- **Atlassian Forge:** Native Jira `jira:issueContext` module, UI Kit, Node.js 24 resolver.
- **Jira:** Current-user REST reads for issue fields and existing issue relationships.
- **Teamwork Graph:** Curated GraphQL relationships for Atlassian goals, external deployments and external pull requests.
- **Rovo Agent:** TraceBack Investigator uses a constrained, read-only prompt and the shared context action.
- **Atlassian MCP:** TraceBack MCP exposes the same action to customer-created agents in Rovo Studio after site administrator authorization.
- **Reliability controls:** Bounded cursor pagination, stable-ID de-duplication, input validation, safe HTTPS link validation, partial-error handling, explicit evidence states, bounded action output and timeout handling.
- **Safety controls:** No fabricated telemetry, no causal claims from linked records alone, no Jira mutation or operational action, explicit untrusted-evidence boundaries for free text, and no escalation of privilege through Rovo/MCP.

## Current engineering evidence — 17 November 2026

The work is split across three open draft PRs; no PR has been merged:

- **Application base:** 4,120 tests passed on the validated application branch; Forge development version 2.21.0 was deployed earlier. That deployment is not a production deployment, judge installation or fresh browser acceptance.
- **Dependency remediation PR #2:** the current isolated lockfile resolves `prosemirror-view@1.42.9`, scoped `glob@14.0.2`, and scoped `minimatch@11.0.8`. The exact PR validation [#44086974857](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44086974857) passed **4,124 tests**, strict npm audit reported **0 vulnerabilities**, and the matching push validation [#44086962378](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44086962378) passed Forge CLI lint. This PR remains draft because the glob override crosses the declared `@forge/manifest@13.9.0` semver range and requires independent compatibility review.
- **Rovo Agent/MCP PR #3:** the feature branch passed [push CI #44085511614](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44085511614) and [PR validation #44085697093](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44085697093): **4,126 tests passed, 0 failed, 0 skipped**, syntax/frontend checks passed, and Forge CLI lint reported **No issues found**. The Rovo modules have not been deployed or live-tested.
- **Combined final release:** the dependency remediation and Rovo feature have not yet been integrated into one final build and validated together.

## What makes TraceBack different

TraceBack is an evidence-assembly and investigation-guidance tool, not an AI-generated root-cause oracle. It favors provenance, permission-aware context and transparent uncertainty over fabricated metrics or unsupported confidence scores. Engineers can use the same read-only evidence path in Jira, Rovo chat, or their own Rovo agents. The human engineer remains in control of all operational decisions.

## Expected impact

TraceBack is intended to reduce context-switching at the start of a software incident investigation by putting already-linked work and delivery context next to the Jira issue. No measured MTTR reduction or productivity percentage is claimed. Add an impact claim only after a measured pilot with an agreed baseline and reproducible methodology.

## Judge setup and testing notes

**Installation link:** Not yet generated. Add the public Forge installation link only after the final build is shared through Atlassian's supported distribution flow and tested from a separate judge/test tenant.

**Required configuration:**
- Install the final Forge app into a Jira Cloud test organization using the judge installation link.
- Have the organization's administrator approve the four read-only Teamwork Graph scopes: `read:graph:issue:jira`, `read:graph:goal:atlassian`, `read:graph:deployment:external` and `read:graph:pull-request:external`.
- Connect relevant external development providers in the test organization if deployment and pull-request records are to be shown.
- Use a real Jira Software issue with genuine linked Jira work and Teamwork Graph records. Do not create synthetic deployment, pull-request, goal or telemetry records for the demo.
- Open the issue in Jira's **new issue view**, then expand **Investigate**.
- Open **TraceBack Investigator** in Rovo chat and verify the action call and source-linked response.
- In Rovo Studio, verify **TraceBack MCP** is administrator-enabled, discoverable and callable by a customer-created test agent.

**Known limitations:** The four Teamwork Graph scopes on the currently connected Jira site were observed as unchecked/disabled. The current deployed 2.21.0 build does not include Rovo modules, and the exact dependency tree in PR #2 has not been deployed. Until the final build is installed in a separate test organization, the scopes are approved, and live linked records plus Rovo/MCP calls are verified, the Teamwork Graph, Best Agents and Atlassian MCP bonus claims remain conditional.

## Video plan

The final video must be under five minutes, publicly hosted on YouTube, and contain real footage of the working app in Jira, Rovo chat and Rovo Studio. Use the timed storyboard in [DEMO_SCRIPT.md](DEMO_SCRIPT.md). Record only after the combined final build passes live acceptance. Do not use generated UI footage or describe evidence that is not visible and source-verified in the recording.

## Final submission checklist

- [ ] Review and resolve dependency PR #2's scoped glob compatibility caveat.
- [ ] Integrate PR #2 and PR #3 only after their independent review gates pass.
- [ ] Run one clean CI validation on the combined final branch.
- [ ] Deploy the exact final build to a separate Forge development/test organization.
- [ ] Obtain organization-admin approval for the four read-only Teamwork Graph scopes.
- [ ] Verify real linked Jira, goal, deployment and pull-request records and source URLs.
- [ ] Verify TraceBack Investigator in Rovo chat.
- [ ] Verify TraceBack MCP discovery and invocation in Rovo Studio.
- [ ] Generate and test the supported Forge judge installation link.
- [ ] Complete judge setup instructions, including connector and scope configuration.
- [ ] Record the actual Jira, Rovo and MCP workflows in a public YouTube video under five minutes.
- [ ] Add the final installation and video URLs to Devpost.
- [ ] Select Teamwork Graph, Best Agents and Atlassian MCP as bonus candidates only if each live integration is demonstrated and accepted; remember only one bonus prize can be awarded.
- [ ] Submit the completed Devpost entry before **22 December 2026, 12:00 pm Pacific Time**.
