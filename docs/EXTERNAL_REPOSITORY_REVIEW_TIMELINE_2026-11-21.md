# External Repository Review: Incident Timeline Improvement

**Date:** 2026-11-21  
**Implementation branch:** `feature/source-linked-incident-timeline-2026-11-21`  
**Base:** `feature/evidence-ranked-leads-2026-11-21`

## Repositories reviewed

### 1. MeetBrief — https://github.com/Sourendas/ayra-meetbrief-forge

- Public repository; MIT license verified from its LICENSE file.
- Its README and Forge manifest describe a single scannable issue brief with Snapshot, Recent, Discussion, Open questions and Sources.
- It explicitly distinguishes verified workspace facts from seat templates and marks failed reads as partial/error instead of inventing URLs or facts.
- Its manifest shows a Jira issue panel and Rovo agent calling structured gather/assemble actions.

**Applied as design guidance:** a source-linked chronological view, explicit source provenance, and honest treatment of missing timestamps. No MeetBrief source code was copied.

### 2. Precedent — https://github.com/qybaihe/precedent

- Public repository; MIT license verified from its LICENSE file.
- Its README describes a decision register surfaced consistently across Jira, Confluence, Rovo and MCP.
- It describes viewer-specific filtering and fail-closed visibility checks, including two-account testing.

**Applied as an acceptance principle:** timeline records must only originate from the already permission-filtered Jira and Teamwork Graph reads made as the current user. This timeline adds no app-level fallback, data store, scope or cross-user cache. Live two-user verification remains a separate staging requirement. No Precedent source code was copied.

### 3. Four Hours — https://github.com/Marc-Dvci/four-hours

- Public repository; MIT license verified from its LICENSE file.
- Its README and manifest describe an incident evidence workflow with explicit evidence, reporting time boundaries, recurrence checks, and read-only evidence actions.
- Its Rovo/MCP surface exposes incident evidence and recurrence as separate read actions.

**Applied as design guidance:** make timestamps and source references explicit, avoid silently turning incomplete evidence into a complete report, and keep incident evidence read-only. No Four Hours source code was copied.

### 4. Blast Radius — https://github.com/W1nnnd/blast-radius

- Public repository; MIT license verified in the earlier repository review.
- Its README describes deterministic named rules with links to the evidence behind each finding.

**Applied in the parent branch:** bounded deterministic review-priority scores and visible rationale, explicitly not a probability or causal confidence. No source code copied.

## Implementation in this branch

- Adds `src/domain/timeline.js`, a pure deterministic timeline builder.
- Uses Jira issue created/last-updated timestamps and Teamwork Graph deployment/pull-request created/last-updated timestamps.
- Sorts events chronologically; stable tie ordering makes output reproducible.
- Each event retains source type, source identifier, source label, source URL (where the source supplied one), timestamp field and provenance statement.
- Invalid or missing timestamps are omitted rather than guessed.
- Last-updated markers explicitly state that they are not a complete issue, deployment, commit or review history.
- UI renders the timeline and direct source links while stating the view is not a complete audit history.
- Adds regression tests for chronological order, stable ordering, duplicate suppression, invalid/missing timestamps, source links and provenance.
- Adds the new domain module to `lint:syntax`.

## Security and correctness boundaries

- No new network requests, external dependencies, manifest scopes, Forge modules, writes, app storage, or cross-user cache.
- The timeline consumes only the current user's existing normalized Jira and Teamwork Graph response.
- Graph partial/unavailable state is not overwritten or presented as complete by this timeline.
- A chronological relationship is not proof of causation.
- Missing intermediate history is called out rather than synthesized.

## Remaining acceptance work

1. Run full CI on the exact PR head and inspect logs.
2. Verify with a real Jira incident linked to real deployment and pull-request records on an authorized staging site.
3. Verify a user with restricted source access cannot see hidden source records or links.
4. Confirm Rovo and issue-panel outputs use the same evidence semantics.
5. Keep the PR draft and unmerged until the above gates are evidenced.
