# TraceBack Context Engine — Codegeist Product Design

**Date:** 2026-11-16  
**Target category:** Software Teams  
**Primary bonus target:** Best apps with Teamwork Graph integration

## Intent

Turn a Jira incident/work item into an evidence-backed investigation view that connects the issue to the real development, release, and outcome context available in Atlassian Teamwork Graph. The product helps an engineer answer: which Jira work items are related, which goal the work supports, which deployments are linked to this issue, which pull requests are related, and what is still unknown?

## Current state

The Forge app reads the active Jira issue through a resolver using `api.asUser()`, validates the issue key, normalizes Jira fields, and clearly states that issue text alone cannot establish a production root cause. The manifest uses `jira:issueContext` and Node.js 24. A Teamwork Graph normalizer test file is present in the branch's RED phase. The app is not yet registered, deployed, or installed on the development site.

## Approaches considered

1. **Jira-only issue context.** Lowest integration risk, but too shallow for the Codegeist theme and does not qualify for the Teamwork Graph bonus.
2. **Jira + Teamwork Graph curated queries (chosen).** Keep Jira issue access user-scoped and read-only, then retrieve the work item's linked Atlassian goals, external deployments, and pull requests using Atlassian's published curated GraphQL queries. This avoids custom Cypher registration and gives source-linked, permission-filtered cross-tool evidence.
3. **Call GitHub/CI/CD APIs directly and store credentials.** Rejected for this phase because it adds credential setup, external scopes, secret handling, and more failure modes; it also duplicates context already represented in Teamwork Graph.

## Goals

- Show the active Jira issue's actual title, status, priority, type, description, and provenance.
- Show existing Jira inward/outward linked work items with their relationship and same-site issue link.
- Retrieve linked Atlassian goals, deployments, and pull requests through Teamwork Graph as the current user.
- Display source name, state/status, time, environment where available, and an HTTPS deep link.
- Show a clear empty state when no links exist and a separate unavailable/partial state when graph access is missing or denied.
- Never convert missing data into a root-cause assertion.
- Preserve read-only permissions and avoid production actions.
- Keep the app responsive in the Jira issue-context sidebar and suitable for a short judge demonstration.
- Add explicit tests for valid records, empty results, partial GraphQL failures, malformed ARIs, and unsafe links.

## Non-goals

- No synthetic logs, metrics, traces, or deployment events.
- No automatic root-cause claim or uncalibrated confidence score.
- No rollback, feature-flag change, deployment trigger, or other production mutation.
- No third-party API keys, paid AI API, remote database, or recurring service cost in this phase.
- No custom persisted Cypher query unless later evidence shows the curated query catalog cannot cover the required journey.

## Security and evidence boundaries

- All Jira and Teamwork Graph reads execute as the current user.
- The server derives the issue ARI from the fetched Jira issue ID and Forge invocation cloud context; it does not trust a user- or model-supplied ARI.
- Jira descriptions and linked external metadata are untrusted evidence; they are never treated as executable instructions.
- Only HTTPS source URLs are rendered as links.
- Graph errors do not hide valid Jira context; they produce a visible unavailable/partial state.
- Teamwork Graph scopes are read-only and remain subject to site-admin scope grants and the interacting user's own permissions.

## Risks and unresolved gates

- Teamwork Graph is a Forge Preview feature and may change before GA.
- The app needs the minimum granular Graph scopes granted on the test site.
- The test site should have connected GitHub/DevOps data and Jira-to-goal/deployment/PR links for populated Teamwork Graph evidence; existing Jira issue links provide a separate, real work-context section where external connectors are absent.
- Forge app registration, CLI lint, deployment, installation, and a real issue-context acceptance test remain mandatory before submission.
- `jira:issueContext` works in Jira's new issue view, not the old issue view. The live installation must confirm where the app renders for the judge role.
- The currently connected Jira site contains a sample JSM service-desk project; the final demo should use a software-team Jira issue with real linked development evidence where available.

## Success criteria

A judge can open a Jira work item, see its exact Jira fields and related Jira work, inspect linked Atlassian goal/deployment/pull-request evidence with working source links, understand whether evidence is missing or inaccessible, and verify that the product never fabricates a cause or executes a production action.
