# Evidence-Ranked Investigation Leads

**Branch:** `feature/evidence-ranked-leads-2026-11-21`  
**Base:** `codegeist/rovo-integrated`  
**Purpose:** Make TraceBack's suggested next checks explainable, deterministic, and visibly distinct from a generic severity list.

## What changed

- Each investigation lead now has a bounded integer `rankScore` from 0 to 100.
- The UI labels it a **review score**, displays its evidence type, and explicitly states that it is not a probability, causal finding, or root-cause confidence.
- Priority badges are derived from the score using fixed thresholds: high >= 70, medium >= 40, otherwise low.
- Existing source links and cautionary rationales are preserved.
- Sorting is descending by score, with stable source order for ties.
- The score is computed only from fields already returned by the Jira/Teamwork Graph evidence layer. No model-generated score, new permission, external request, or new runtime dependency is introduced.

## Deterministic rule table

| Evidence observed | Review score | Evidence type |
|---|---:|---|
| Linked production deployment reports FAILED | 90 | direct-status |
| Linked non-production deployment reports FAILED | 65 | direct-status |
| Linked deployment is IN_PROGRESS | 55 | direct-status |
| Linked production deployment recorded within 24 hours of issue creation | 60 | temporal-association |
| Linked pull request is OPEN | 52 | direct-status |
| Linked pull request is DRAFT | 46 | direct-status |
| Linked merged pull request updated within 24 hours of issue creation | 58 | temporal-association |
| Unresolved linked Jira item with a blocking relationship | 38 | relationship |
| Other unresolved linked Jira item | 28 | relationship |
| Linked goal is archived | 18 | lifecycle-status |
| Graph evidence is empty or unavailable and no external records were returned | 8 | coverage-gap |

These are review-order heuristics, not calibrated risk probabilities. A higher score means "inspect this earlier", not "more likely to be the cause". Time proximity remains a clue only. The code does not infer causation from a Jira relationship, deployment status, or temporal association.

## External repository patterns considered

### W1nnnd/blast-radius — MIT

Repository: https://github.com/W1nnnd/blast-radius

The repository describes a deterministic, rule-based release-risk engine with named reasons and links back to evidence. Its manifest also demonstrates a unified Rovo agent and `rovo:mcp` surface over the same actions.

**Adopted as a design lesson:** scores should be deterministic, bounded, explainable, and traceable to evidence.

**Not copied:** its release scoring rules, product workflow, source code, or manifest. TraceBack's review score serves incident-investigation triage, not release go/no-go decisions.

### ArtyormSatori/contextforge-ai — Apache-2.0

Repository: https://github.com/ArtyormSatori/contextforge-ai

Its README describes a combined Jira issue panel, Teamwork Graph, Rovo and MCP experience.

**Adopted as a competitive benchmark only:** judges should be able to see the same useful context across the human UI and agent entry points.

**Rejected for direct adoption:** the inspected manifest declares Jira write scope, app storage, and a webtrigger-backed MCP endpoint. TraceBack's current read-only, current-user access boundary is preferable for its incident-evidence use case. The README's advertised features were not independently reproduced in a live tenant.

### Existing review sources

- Atlassian Forge Skills: manifest-first, permission-boundary, injection, timeout and security-review methodology.
- Atlassian Forge Inspired: bounded Rovo actions and explicit action contracts.
- Precedent: per-viewer authorization, bounded Graph access, and permission-focused tests.
- DRS Debug System: source-linked code-change evidence as a lead; keyword-based culprit inference and unsafe write/security patterns rejected.

No external source code was copied. No third-party runtime dependency was added.

## Tests added

- Failed production deployment receives the highest review score without any causal claim.
- Independent evidence types sort by the documented fixed rules.
- Source URLs remain attached to their lead.
- Temporal evidence is distinguished from direct status evidence.
- Existing tests continue to cover invalid timestamps, non-production severity, and Graph coverage gaps.

## Acceptance boundary

This branch is a code/test improvement only. CI must pass on the exact PR head before it is accepted. It does not establish live Teamwork Graph access, live Rovo discovery, external MCP OAuth, or two-user permission isolation. Those remain separate staging gates requiring genuine linked Jira evidence and an authorized staging site.

Keep the PR draft and unmerged until exact-head CI and the existing live acceptance gates are evidenced.


## Temporal evidence validation hardening — 21 November 2026

The follow-up temporal evidence change tightens the rule for time-based leads:

- Only timezone-qualified ISO-8601 timestamps with valid calendar/time components are accepted. Locale-specific, timezone-free, malformed and impossible dates are ignored.
- Both source `createdAt` and `updatedAt` fields are checked. The closest valid timestamp within 24 hours of Jira issue creation is selected.
- The lead carries the exact selected field, normalized UTC instant and distance in hours. The Jira panel renders those values.
- A time association remains a review clue only; it is not evidence of causation.

The test matrix covers explicit timezone offsets, the exact 24-hour boundary, fractional seconds, malformed/ambiguous dates, impossible calendar dates, and fallback to another valid source timestamp. This change does not add telemetry or claim to identify a root cause.
