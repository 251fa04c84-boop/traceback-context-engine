# Codegeist 2026 — TraceBack Context Engine submission draft

> **Status: draft only.** This is prepared submission copy, not a submitted Devpost entry. Do not publish until the judge installation path and live acceptance gates are complete.

## Submission identity

- **Project:** TraceBack Context Engine
- **Tagline:** Evidence, not guesses, for software incident investigations.
- **Category:** Apps for Software Teams
- **Potential bonus:** Best apps with Teamwork Graph integration — select only after a live test proves the deployed app can retrieve real linked records with administrator-approved scopes.
- **Not currently claimed:** Best Agents, Best app with Atlassian MCP, or Best Marketplace published app. The current manifest does not expose the required Rovo modules/MCP tools, and the app has not been submitted for Marketplace listing.

## Short description

TraceBack brings the Jira work and delivery context already connected to an issue into a single, read-only investigation panel. It displays related Jira work, linked Atlassian goals, external deployments and pull requests when those records are available through the user's permissions. It then turns observed states and timestamps into prioritized next checks, with source links and clear warnings when evidence is missing or incomplete.

## Full project description

When a software incident is tracked in Jira, the issue rarely contains the whole investigation. Engineers often need to move between related Jira tickets, delivery records, pull requests and team goals to understand what work is connected to the incident. That context is fragmented, and a simple relationship or timestamp can easily be mistaken for proof of cause.

**TraceBack Context Engine** brings that context into the Jira issue itself. Open the **Investigate** panel from a Jira issue in the new issue view and TraceBack reads the issue as the signed-in user. It displays the issue's key details and existing inward/outward Jira links, including relationship labels, status, type and priority. It also queries Atlassian Teamwork Graph for linked goals, external deployments and external pull requests, following cursors with bounded pagination and de-duplicating records.

TraceBack does not turn correlation into a diagnosis. Its suggested next checks are deterministic and explain the observed reason: for example, inspect a failed linked deployment, review an open pull request, or check an unresolved related Jira item. Every suggestion is an investigation lead, not a root-cause claim or probability score.

The panel is deliberately honest about missing data. It distinguishes available, empty, partial and unavailable Teamwork Graph results; permission-filtered or disconnected sources are not presented as proof that no evidence exists. Source URLs are validated before they become links. The app is read-only and does not trigger deployments, rollbacks, feature-flag changes or Jira mutations.

TraceBack is designed for software teams that need to start an incident investigation with the context already connected to their work—without fabricating telemetry, hiding missing permissions, or overstating what the evidence proves.

## How it works

1. **Open the issue:** The Forge `jira:issueContext` module renders the Investigate panel in Jira's new issue view.
2. **Read permitted Jira context:** A Node.js 24 Forge resolver fetches the active issue as the signed-in user and normalizes the relevant fields and issue links.
3. **Retrieve connected evidence:** The resolver builds the Jira work-item ARI from the server-side issue ID and site context, then queries Teamwork Graph for linked goals, external deployments and external pull requests.
4. **Bound and normalize results:** Each relationship is paginated at 25 records per page, up to five pages per category. Stable IDs are used for de-duplication; malformed records and unsafe source URLs are rejected.
5. **Suggest the next check:** Deterministic rules prioritize observed deployment states, pull-request states, related Jira work and archived goals. Each rationale describes what was observed and avoids causal language.
6. **Show what is missing:** Available, empty, partial, unavailable and truncated states are explicit. Missing connector configuration or permissions are not silently represented as a clean bill of health.

## Latest reliability validation — 17 November 2026

The application base now has a full 8-second Jira request deadline including response-body parsing, a 12-second total Teamwork Graph budget with a 5-second per-request ceiling, timeout-safe partial evidence preservation, stale-response protection in the Jira panel, and an explicit empty-state message. The latest application validation passed **4,120 tests, 0 failed, 0 skipped** in [PR workflow #44079753736](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44079753736); matching push workflow [#44079747452](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44079747452) also passed Forge CLI lint and development deployment. The current dependency PR is being revalidated against this exact application base.

## Technology and platform integration

- **Atlassian Forge:** Native Jira `jira:issueContext` module, UI Kit, Node.js 24 resolver.
- **Jira:** Current-user REST reads for issue fields and existing issue relationships.
- **Teamwork Graph:** Curated GraphQL relationships for Atlassian goals, external deployments and external pull requests.
- **Reliability controls:** Bounded cursor pagination, stable-ID de-duplication, input validation, safe HTTPS link validation, partial-error handling and explicit evidence states.
- **Testing:** The rebased application plus scoped dependency branch has passed **4,124 automated tests, 0 failures, 0 skips**, syntax/frontend checks, authenticated Forge CLI lint, dependency-tree validation and strict npm audit with **0 vulnerabilities** in [PR run #44080696080](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44080696080). The exact scoped configuration has now been deployed to Forge development as app version **2.21.0** in [run #44081294538](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44081294538); Jira confirmed the existing development installation was already at the latest version. The deployment did not auto-consent to scopes. This is a controlled development installation on the connected production Jira tenant, not a production deployment or judge installation. Fresh browser acceptance remains outstanding.

## What makes TraceBack different

TraceBack is an evidence-assembly and investigation-guidance tool, not an AI-generated root-cause oracle. It favors provenance, permission-aware context and transparent uncertainty over fabricated metrics or unsupported confidence scores. The engineer can inspect the original source record for every suggested next check and remains in control of all operational decisions.

## Expected impact

TraceBack is intended to reduce context-switching at the start of a software incident investigation by putting already-linked work and delivery context next to the Jira issue. No measured MTTR reduction or productivity percentage is claimed. Any impact claim should be added only after a measured pilot with an agreed baseline and reproducible methodology.

## Judge setup and testing notes

**Installation link:** Not yet generated. Add the public Forge installation link only after the app is shared through Atlassian's supported distribution flow and tested from a separate judge/test tenant.

**Required configuration:**
- Install the Forge app into a Jira Cloud test organization using the judge installation link.
- Have the organization's administrator approve the requested read-only Teamwork Graph scopes: `read:graph:issue:jira`, `read:graph:goal:atlassian`, `read:graph:deployment:external` and `read:graph:pull-request:external`.
- Connect the relevant external development provider(s) in the test organization if deployment and pull-request records are to be shown.
- Use a real Jira Software issue with genuine linked Jira work and Teamwork Graph records. Do not create synthetic deployment, pull-request, goal or telemetry records for the demo.
- Open the issue in Jira's **new issue view**, then expand **Investigate**.

**Known limitation:** Teamwork Graph scopes on the currently connected Jira site were observed as unchecked/disabled. Until an organization administrator approves the scopes and the live app returns verified linked records, the Teamwork Graph bonus remains conditional and the app must show its honest unavailable/empty states. Do not use the current production Jira tenant for judge testing without explicit organizational approval; a separate test tenant is preferred.

## Video plan

The final video must be under five minutes, publicly hosted on YouTube, and contain real footage of the working app on Jira. Use the timed storyboard in [DEMO_SCRIPT.md](DEMO_SCRIPT.md). Record only after the live acceptance checklist passes. Do not use generated UI footage or describe evidence that is not visible and source-verified in the recording.

## Final submission checklist

- [ ] Confirm the deployed development app passes fresh browser acceptance on a separate test tenant.
- [ ] Obtain organization-admin approval for the four read-only Teamwork Graph scopes.
- [ ] Verify real linked Jira/goal/deployment/pull-request records and source URLs.
- [ ] Generate and test the supported Forge judge installation link.
- [ ] Complete the setup instructions for judges, including connector and scope configuration.
- [ ] Record the actual Jira app under five minutes; publish the video publicly on YouTube.
- [ ] Add the final installation and video URLs to Devpost.
- [ ] Select the Teamwork Graph bonus only if the live integration is demonstrated and accepted.
- [ ] Submit the completed Devpost entry before **22 December 2026, 12:00 pm Pacific Time**.
