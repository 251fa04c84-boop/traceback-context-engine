# Codegeist 2026 eligibility and judge evidence plan

**Updated:** 21 November 2026  
**Candidate:** TraceBack Context Engine  
**Primary category recommendation:** Apps for Software Teams

## Official competition constraints

The official Codegeist 2026 rules specify:
- Forge app integrating at least one Atlassian product or platform capability.
- Three main categories: Apps for Software Teams, Apps for Business Teams, and Apps for Specialized Industries.
- Bonus categories for Best Agents, Atlassian MCP, Teamwork Graph integration, and Marketplace-published apps.
- A public YouTube demonstration shorter than five minutes, an installation link, complete setup instructions, a project description, and explanation of the Atlassian technology requirement.
- Stage one is a pass/fail viability screen; stage two scores technological implementation, design, impact, innovation, and presentation equally.
- One submission can win at most one grand prize and one bonus prize.

Official rules: https://codegeist2026.devpost.com/rules  
Official event page: https://codegeist2026.devpost.com/

## Current repository evidence

| Opportunity | Repository evidence | Status / proof still required |
|---|---|---|
| Apps for Software Teams | Jira issue-context panel, incident timeline, evidence-ranked next checks, Rovo investigation | Best fit by problem/audience; must verify installable end-to-end user journey |
| Best Agents | `manifest.yml` declares `rovo:agent` and binds the `get-traceback-investigation` action | Module is present; verify installed agent discovery, invocation and accurate output |
| Best app with Atlassian MCP | `manifest.yml` declares `rovo:mcp` and exposes `get-traceback-investigation` | Module/tool wiring is present; verify actual Atlassian MCP discovery and invocation |
| Best apps with Teamwork Graph | Forge service queries Teamwork Graph for linked goals, deployments and pull requests; read scopes are declared | Code path is present; verify real linked records in the Forge runtime under two user permission levels |
| Best Marketplace published app | No listing or Marketplace review ticket is evidenced in this repository snapshot | Not currently evidenced; do not claim eligibility until a listing or review ticket exists |

A manifest declaration is not the same as a working runtime integration. Do not claim a bonus prize is proven solely from the YAML.

## Recommended positioning

**TraceBack reconstructs an incident's delivery context from Jira and Atlassian Teamwork Graph, ranks the next checks with explainable deterministic rules, and exposes the same permission-aware evidence to a human issue panel and Rovo/MCP tools.**

Target the Software Teams grand-prize category. The current repository has formal integration points for Rovo Agent, Atlassian MCP and Teamwork Graph, but the judge-facing submission should emphasize only the integrations that pass live acceptance. The rules limit one submission to at most one grand prize and one bonus prize; multiple bonus integrations are useful product breadth, not multiple bonus wins.

## Judge-critical proof sequence

1. **Installability:** create a Forge sharing/install link for a dedicated, non-production test site; provide clear configuration steps and avoid automatic scope consent.
2. **Real incident path:** open a genuine Jira incident with linked Teamwork Graph deployment and pull-request records; show their source links, timeline and review leads.
3. **Evidence honesty:** demonstrate that empty, partial, unavailable and not-integrated sources are visibly distinct. Show that missing telemetry/logs are not represented as healthy or negative evidence.
4. **Agent parity:** ask the installed Rovo agent to investigate the same issue and compare its evidence, source links and caveats with the issue panel.
5. **MCP parity:** discover and invoke the exposed tool through Atlassian MCP; verify that it uses the invoking user's permissions and returns the same read-only evidence.
6. **Permission isolation:** repeat the investigation as a user who cannot access one linked record; prove the hidden record and URL do not leak through the UI, Rovo or MCP.
7. **Presentation:** make a public YouTube video under five minutes. Demonstrate the real app, not only screenshots or a fabricated fixture. Explain the problem, the evidence flow, the agent/MCP experience and the limits.

## Five-minute demo structure

- 0:00–0:25 — Incident investigation problem and target user.
- 0:25–1:15 — Open a real Jira incident and show the linked evidence.
- 1:15–2:10 — Explain the provenance-aware timeline and deterministic review leads.
- 2:10–3:00 — Show source coverage and the handling of partial/unavailable evidence.
- 3:00–3:50 — Run the same investigation through Rovo and MCP.
- 3:50–4:30 — Demonstrate permission boundaries and read-only behavior.
- 4:30–4:55 — Summarize impact and the verified limitations.

Do not record this demo until the exact build used in the recording has passed CI and live acceptance. Never show private customer data or secrets.

## Release decision

The candidate remains draft. Do not merge, deploy to production, approve new scopes, install/upgrade on the connected production tenant, or create artificial Jira/Confluence records to make the demo look complete. A separate authorized staging site and genuine linked records are required for the remaining acceptance work.
