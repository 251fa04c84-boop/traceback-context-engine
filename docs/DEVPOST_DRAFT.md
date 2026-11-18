# TraceBack Context Engine — Devpost submission draft

> **Draft only. Do not submit until the final checklist is complete.** The text below describes implemented design and automated validation. Live Teamwork Graph, Rovo/MCP, judge installation and public video claims must be updated only after those capabilities are demonstrated on the final build.

## Project title

TraceBack Context Engine

## One-line description

Start incident investigations with more of the context already linked to your Jira issue.

## Short description

TraceBack is a read-only Atlassian Forge app that brings Jira issue context, related Jira work and linked delivery evidence into one investigation view. It queries Atlassian Teamwork Graph for linked goals, external deployments and pull requests, then suggests source-linked next checks without pretending that correlation proves root cause.

## The problem

When an incident is tracked in Jira, the issue rarely contains the whole investigation context. Related work may live in other Jira issues, delivery systems, pull requests and organizational goals. Engineers spend time switching between tools and manually reconstructing what is connected to the affected work item. Missing permissions or incomplete integrations can also make an apparently empty search misleading.

## The solution

TraceBack adds an **Investigate** panel to the Jira issue view. It:
- reads the active issue and existing linked Jira work items as the signed-in user;
- retrieves linked Atlassian goals, external deployments and external pull requests through curated Teamwork Graph queries when those records are available;
- follows bounded pagination, deduplicates records and reports available, empty, partial or unavailable evidence states;
- shows source links and record status so engineers can verify each item;
- ranks deterministic next checks from observed record states and timestamps;
- explicitly separates observations from hypotheses and never claims root cause from a relationship or timestamp alone.

The app does not fabricate telemetry, logs, traces, deployments or metrics. It does not execute rollbacks, change feature flags, trigger deployments or modify Jira issues.

## What makes it different

TraceBack focuses on evidence integrity rather than an impressive but unsupported diagnosis. It makes missing and partial context visible, links findings to original records, and keeps investigation suggestions explainable. The goal is to help engineers decide what to inspect next while preserving their existing permissions and production controls.

## Technology

- Atlassian Forge Jira issue-context module and resolver.
- Node.js 24 runtime.
- Forge UI Kit React frontend.
- Jira REST reads as the invoking user.
- Atlassian Teamwork Graph curated GraphQL relationships for Jira work items, goals, external deployments and external pull requests.
- Bounded pagination, response validation, source URL allowlisting and deterministic investigation-lead ranking.
- Optional candidate integration: a read-only Forge Rovo Agent and `rovo:mcp` tool exposing one GET action, **Get Jira investigation evidence**.

## Current validation evidence

- Core build: **4,143 automated tests passed, 0 failed, 0 skipped** on 18 November 2026.
- Refreshed Rovo/MCP candidate: **4,159 automated tests passed, 0 failed, 0 skipped** on its exact push head; authenticated Forge CLI lint reported no issues.
- Core Forge development deployment succeeded as version **2.49.0**. No site installation or upgrade was performed by that workflow.
- The npm audit still reports **9 high and 4 moderate** findings in the current core dependency tree; see the dependency audit and upstream escalation packet.

## Live demo and integration claims — fill only after acceptance

- Test-site Jira issue: `[VERIFIED ISSUE KEY]`
- Verified linked Jira issue: `[VERIFIED KEY]`
- Verified Teamwork Graph records: `[LIST ONLY THE TYPES AND RECORDS ACTUALLY SHOWN]`
- Rovo Agent discovery/invocation: `[VERIFIED / NOT VERIFIED]`
- Rovo MCP Studio visibility: `[VERIFIED / NOT VERIFIED]`
- External MCP invocation: `[VERIFIED / NOT VERIFIED]`
- Judge installation URL: `[OFFICIAL FORGE DISTRIBUTION LINK]`
- Public demo video: `[PUBLIC YOUTUBE URL, UNDER FIVE MINUTES]`

Do not replace these placeholders with sample or fabricated data.

## Category and bonus

- Main category candidate: **Apps for Software Teams**.
- Do not claim the **Best Agents**, **Teamwork Graph**, or **Atlassian MCP** bonus until the corresponding live acceptance checklist passes.
- Select at most one optional bonus category under the current rules.

## Links to complete before submission

- Source repository: https://github.com/251fa04c84-boop/traceback-context-engine
- Core draft PR: https://github.com/251fa04c84-boop/traceback-context-engine/pull/1
- Refreshed Rovo/MCP draft PR: https://github.com/251fa04c84-boop/traceback-context-engine/pull/9
- Judge installation and acceptance: [JUDGE_INSTALLATION.md](JUDGE_INSTALLATION.md)
- Demo storyboard: [DEMO_SCRIPT.md](DEMO_SCRIPT.md)
- Submission checklist: [SUBMISSION_CHECKLIST.md](SUBMISSION_CHECKLIST.md)
- Dependency audit: [DEPENDENCY_AUDIT.md](DEPENDENCY_AUDIT.md)

## Final pre-submit conditions

1. Resolve the dependency security release gate or obtain written Atlassian mitigation/extension.
2. Complete separate test-site installation and browser acceptance.
3. Verify genuine Teamwork Graph records and source links.
4. Verify Rovo Agent discovery and action invocation; verify MCP separately if selected.
5. Deploy and distribute the approved build, then verify the official judge installation link with a clean account.
6. Record the actual app UI and narration in a public YouTube video under five minutes.
7. Recheck official Codegeist rules, eligibility, deadline and submission fields.
8. Submit and retain Devpost's receipt.
