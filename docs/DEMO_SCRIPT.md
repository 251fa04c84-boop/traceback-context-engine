# TraceBack Context Engine — Codegeist 2026 demo script

**Target runtime:** 4:15–4:35 (hard limit: under 5:00)  
**Format:** screen recording of the actual Jira new-issue view, concise English narration, accurate captions.  
**Audio:** narration only is safest. Add music only if it is original or properly licensed. Do not add third-party logos or copyrighted clips.

> **Do not record the final video yet.** Replace every bracketed placeholder only after Forge development installation and live acceptance tests pass. Never show mocked or fabricated deployment, pull-request, goal, telemetry, or incident evidence.

## Pre-recording checklist

- [ ] The app is registered, deployed and installed in the test organization.
- [ ] An organization administrator has approved the Teamwork Graph scopes.
- [ ] The GitHub/DevOps connector is enabled in the Atlassian test organization if external records are to be shown.
- [ ] A real Jira Software issue is selected: `[ISSUE-KEY]`.
- [ ] At least one real linked Jira work item is visible.
- [ ] At least one real Teamwork Graph record is visible; record exactly which types returned (goal, deployment, pull request).
- [ ] The displayed records and source URLs have been checked against their source systems.
- [ ] No production-sensitive data, secrets, API tokens, private emails, or unrelated user data are visible.
- [ ] The app is shown in Jira's new issue view, not a mocked browser frame.
- [ ] TraceBack Investigator is deployed and its Rovo chat invocation has passed live acceptance.
- [ ] TraceBack MCP is enabled by the test-site administrator and its tool is discoverable in Rovo Studio.
- [ ] The Rovo Agent and MCP calls use the same permitted test issue and return source-verified evidence.
- [ ] Captions are accurate; the video is public on YouTube and under five minutes.

## Timed storyboard and narration

### 0:00–0:20 — The problem

**On screen:** Title card with “TraceBack Context Engine” and the problem statement.

**Narration:**  
“When a software issue becomes an incident, the issue itself is only one piece of the story. Engineers still need to connect related Jira work, delivery changes, and the goals behind the work. TraceBack brings the context already linked to the issue into one investigation view.”

### 0:20–0:50 — Open a real Jira issue

**On screen:** Open `[ISSUE-KEY]` in Jira's new issue view. Expand the **Investigate** issue-context panel.

**Narration:**  
“TraceBack opens directly from the Jira issue. It reads the issue as the signed-in user, so the context follows the user's existing Jira permissions. The panel keeps the issue summary and status visible while the investigation starts.”

### 0:50–1:20 — Related Jira work

**On screen:** Show the real inward/outward issue links, their relationship labels, statuses and priorities. Open one source link only if it is safe to show.

**Narration:**  
“First, TraceBack shows the Jira work already connected to this issue. Each relationship is labelled, and links stay within the same Jira site. This is work context, not a claim that one issue caused another.”

### 1:20–2:05 — Teamwork Graph evidence

**On screen:** Show only the real Teamwork Graph sections that returned data: linked goal, external deployment and/or external pull request. Open one or two source links to verify them.

**Narration:**  
“Next, TraceBack queries Atlassian Teamwork Graph for linked delivery context. Here are the records that were actually returned for this issue: [NAME ONLY THE TYPES AND RECORDS VERIFIED IN THE LIVE TEST]. Each item includes its state and a source link, so an engineer can inspect the original record.”

**Important:** If a category is empty, say it is empty or unavailable. Do not imply that no evidence exists elsewhere. Do not claim a GitHub or deployment record is present unless it is visible in the live app and verified at its source.

### 2:05–2:50 — Suggested next checks

**On screen:** Show the investigation leads and their priority/rationale/source link. Open one source record.

**Narration:**  
“TraceBack turns those observations into suggested next checks. A failed production deployment is prioritised differently from a failed non-production deployment. An open pull request or unresolved linked issue can also be a useful place to investigate. Each suggestion explains what was observed and points back to its source.”

### 2:50–3:25 — TraceBack Investigator Rovo Agent

**On screen:** Open the deployed TraceBack Investigator agent in Rovo chat. Ask it to investigate the same real Jira issue. Show the actual tool invocation and its source-backed summary.

**Narration:**  
“The same evidence pipeline is also available through TraceBack Investigator in Rovo. The agent calls the read-only context action, then separates Jira facts from linked delivery evidence and suggests what to inspect next. It uses the same signed-in user's permissions; it does not gain broader access just because an AI agent is involved.”

### 3:25–3:55 — TraceBack MCP

**On screen:** In Rovo Studio, show the administrator-enabled TraceBack MCP tool and invoke it from a customer-created test agent. Show the returned issue key, graph state and source link.

**Narration:**  
“Teams can also add the same action to their own Rovo agents through TraceBack MCP. It is one shared, permission-aware read path—not a separate service with broader credentials. The tool returns structured evidence and no production-changing operations.”

### 3:55–4:20 — Trust boundary

**On screen:** Show the availability state or warning text. Briefly show the read-only panel.

**Narration:**  
“TraceBack does not invent telemetry, assign an uncalibrated confidence score, or claim a root cause from a link or timestamp. If a connector, permission, or record is missing, the panel says so. It is an evidence-backed investigation aid, not an automated production operator.”

### 4:20–4:35 — Close

**On screen:** Return to the full panel and show the product name.

**Narration:**  
“TraceBack helps software teams investigate with linked Atlassian context wherever they work: inside Jira, through Rovo chat, or from a customer-created Rovo agent using MCP. One permission-aware, evidence-backed read path—without pretending correlation is root cause.”

## Claims that must stay out of the video unless independently measured

- Any percentage reduction in MTTR, incident duration, deployment failure rate, or engineering effort.
- “Root cause found”, “caused by”, or “guaranteed diagnosis”.
- “All company context” or “all deployments/PRs”; pagination is bounded and permissions/connectors filter results.
- “Production ready” before the live acceptance checklist is complete.
- “Teamwork Graph bonus qualified” as a proven outcome before the live API call and linked-record test are recorded.
- “Rovo Agent” or “MCP integration verified” unless the actual Rovo chat and Rovo Studio invocations are shown working in the submitted build.

## Final export checklist

- [ ] Runtime is 3:15–3:45 and definitely under 5:00.
- [ ] Narration and captions match what is visible.
- [ ] No secrets, private customer data, or unauthorized copyrighted material.
- [ ] All linked evidence shown is real and source-verified.
- [ ] YouTube visibility is **Public**.
- [ ] Copy the final YouTube URL into the Devpost submission and `docs/SUBMISSION_CHECKLIST.md`.
