# TraceBack Context Engine — Codegeist Submission Checklist

**Target category:** Apps for Software Teams  
**Potential bonus prize:** Best apps with Teamwork Graph integration — not yet selected; select only after live data acceptance  
**Current state:** Development draft; not ready to submit. The app is registered and deployed to Forge development (version 2.16.0 on the isolated dependency branch), but fresh live acceptance, admin scope approval, judge sharing, and the public demo remain incomplete.

## Official Codegeist 2026 terms (recheck before final submission)

Official sources: [Devpost listing](https://codegeist2026.devpost.com/) · [Official rules](https://codegeist2026.devpost.com/rules)

- **Submission deadline:** Tuesday, December 22, 2026 at 12:00 p.m. Pacific Time. On that date Pacific is UTC−8, so this is Wednesday, December 23, 2026 at 1:30 a.m. India Standard Time.
- **Judging:** Stage One is pass/fail for theme fit and appropriate use of the required Atlassian capability. Stage Two weights Technological Implementation, Design, Potential Impact, Innovation/Idea, and Presentation equally at 20% each.
- **Eligibility:** Individual entrants are allowed and must be at least the age of majority where they reside. The named excluded places include Brazil, Quebec, Russia, Belarus, Crimea, Cuba, Iran, North Korea, Syria, Sudan and Myanmar, plus locations barred by applicable law or OFAC. India is not on that named list; all legal, sanctions, conflict-of-interest and other eligibility terms still apply.
- **Main category cash prizes (one set per category):** First place USD 15,000 (three first-place awards total, one per category), plus two Team 2027 AMER tickets for the winning team; travel is not included. Second place USD 8,000 (three awards total). Third place USD 5,000 (three awards total).
- **Bonus prizes:** USD 1,500 each for Best Agents, Atlassian MCP, Teamwork Graph integration, and Marketplace listing (six awards per bonus category). A submission may receive at most one main category prize and one bonus prize; it cannot receive multiple bonus prizes.
- **Payment:** Winners are subject to identity, eligibility and role verification. Required Forms are due within 10 business days after they are sent. Cash prizes are delivered within 60 days after the Sponsor/Devpost receives completed Required Forms. Winners are responsible for applicable taxes and wire/foreign-exchange fees.
- **Intellectual property and publicity:** The entrant retains ownership of the submission and grants the Sponsor a fully paid, non-exclusive license to use it for judging. The publicity rights in the rules apply during the Hackathon Period and for three years afterward. Ensure all included code, libraries, images, audio and other assets are original or used under compatible licenses.

These are advertised awards, not a guarantee of winning or payment. Historical cross-check: Atlassian published official Codegeist 2025 and 2024 winner announcements ([2025](https://www.atlassian.com/blog/development/meet-the-winners-of-codegeist-2025-atlassian-williams-racing-edition), [2024](https://www.atlassian.com/blog/developers/codegeist-2024-winners)), but those announcements do not prove that individual bank transfers occurred. I have not found independent public proof of past payouts; treat the 2026 cash as conditional rules-based awards, not guaranteed income. Re-read the official rules in case the Sponsor or Devpost has amended them before you submit.

## Competition terms verified

- [ ] Confirm entrant eligibility and any conflict-of-interest restrictions at submission time.
- [ ] Confirm the current official rules again immediately before submitting; rules may be amended.
- [ ] Record the entrant name and individual/team status accurately.
- [ ] Ensure all code and assets submitted are original work or used under compatible licenses.
- [x] Confirm the repository was created on 16 November 2026, after the 27 October 2026 submission-period start; the Forge manifest and module are present. Keep the project original and do not rely on any previously published project version.
- [ ] Confirm the entrant has clicked **Join Hackathon** on Devpost; creating a project repository alone does not register the entrant.
- [ ] Keep a copy of the final submitted version and evidence of receipt.

## Product and Forge readiness

- [x] Product meaningfully addresses the software-team theme: understanding work, delivery and linked context from a Jira issue.
- [x] App registered in Forge exactly once.
- [x] Current manifest and source pass Forge CLI lint (`No issues found`).
- [x] App deployed to a working Forge development environment; patched dependency branch deployed as app version 2.16.0. Fresh browser acceptance of that version is still pending.
- [ ] App deployed to the Forge production environment before enabling external sharing.
- [ ] In Atlassian Developer Console → Distribution → Distribution controls, set the unlicensed app to **Sharing**, choose Jira, and copy the generated installation link. See [Atlassian's Forge distribution guide](https://developer.atlassian.com/platform/forge/distribute-your-apps/).
- [ ] App installed by a Jira site administrator using the official judge installation link.
- [ ] An organization administrator approves and grants the Teamwork Graph scopes; Atlassian requires organization-admin installation for these organization-wide data scopes.
- [ ] All judge instructions and required scope grants are clear and complete.
- [ ] App works in Jira's new issue view.
- [ ] Live acceptance tests are completed and recorded in docs/ACCEPTANCE_TESTS.md.
- [ ] No paid service, secret, or recurring service requirement blocks judge access.
- [ ] The project operates consistently and is free for judge evaluation.

## Teamwork Graph bonus evidence

The Teamwork Graph query implementation exists in the app, but the four granular scopes were observed unchecked/disabled on the connected Jira site. The code and unit tests alone do not establish live bonus eligibility. Keep every evidence checkbox below open until a real issue returns source-verified graph records in the deployed panel.

- [ ] The app consumes real data from the Teamwork Graph API as the current user.
- [ ] Official curated query usage and granular scopes are documented.
- [ ] A real test issue demonstrates linked goals, deployments, and/or pull requests where available.
- [ ] The video visibly shows the Teamwork Graph section and explains the source/provenance.
- [ ] Empty, partial and unavailable cases are shown honestly.
- [ ] Suggested next checks are visibly derived from actual linked statuses/timestamps, include source links, and explicitly disclaim causation.
- [ ] Bonus write-up explains what Graph context adds to a software team's investigation workflow.

## Devpost form

- [ ] Register/join the hackathon on Devpost.
- [ ] Select Apps for Software Teams.
- [ ] Select Best apps with Teamwork Graph integration only after administrator-approved scopes and real linked-record retrieval are demonstrated live. Do not select it yet.
- [ ] Provide project title and concise description.
- [ ] Describe the real problem, target users, workflow, and measurable value.
- [ ] Explain the Forge implementation and Teamwork Graph API use.
- [ ] Provide public repository link if intended for reviewers.
- [ ] Provide the working Forge judge installation link.
- [ ] Provide complete setup, installation, scope-grant and testing instructions.
- [ ] Provide a public YouTube video under five minutes; judges are not required to watch beyond five minutes.
- [ ] Ensure video shows the working app on the actual Atlassian UI and demonstrates real end-to-end behavior.
- [ ] Use only original or properly licensed audio, visuals and marks; the rules prohibit third-party trademarks and copyrighted music/material unless permission is held.
- [ ] Explain how the app meets the main technology requirement.
- [ ] Include the Teamwork Graph bonus-prize write-up.
- [ ] Submit the entire form before the official deadline; save Devpost's submission receipt and final snapshot.

## Demo outline

The detailed, evidence-safe 3:15–3:45 storyboard is in [docs/DEMO_SCRIPT.md](DEMO_SCRIPT.md). Record only after live acceptance passes; the public YouTube video must remain under five minutes.

1. **Problem (0:00–0:35):** incident investigations are fragmented across Jira work, delivery records and goals.
2. **Jira issue (0:35–1:10):** open a real issue and show its title, status, priority and description.
3. **Related work (1:10–1:50):** show Jira-linked work items and explain relationship labels.
4. **Teamwork Graph (1:50–3:20):** show linked goals, deployments and pull requests with source links and state.
5. **Evidence honesty (3:20–4:15):** show empty/partial/unavailable handling; explain that correlation is not root cause.
6. **Impact and architecture (4:15–4:50):** summarize current-user authorization, read-only access and how the workflow helps a software team decide what to inspect next.

Do not narrate a capability that was not shown working in the submitted build.

## Current dependency/security state

- The current application branch before the dependency PR reports 9 high, 4 moderate, 0 critical npm audit findings.
- Draft PR #2 contains patched overrides for `prosemirror-view@1.42.9`, scoped `glob@14.0.2` under `@forge/manifest`, and `minimatch@11.0.1` as glob's dependency. The rebased tree passed **4,124 tests**, strict npm audit with **0 vulnerabilities**, dependency-tree validation, syntax/frontend checks, and authenticated Forge CLI lint in [PR run #44080696080](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44080696080). It also passes direct tests against `@forge/manifest@13.9.0`'s `PackageValidator` glob call site.
- The exact scoped tree has now been deployed to Forge development as version 2.21.0 in [run #44081294538](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44081294538), and Jira confirmed the existing development installation was already at the latest version. This is not browser acceptance; it is a controlled development install on the connected production Jira tenant. The `glob` override still crosses the upstream `@forge/manifest` declared major range. PR #2 remains draft for independent review and live acceptance. The main application branch still has 9 high and 4 moderate findings until the reviewed dependency PR is integrated.

## Prize verification and payment

The official rules advertise cash awards. Payment is conditional on winner selection and identity/qualification/role verification. Keep entrant and banking/tax information accurate and respond to Required Forms within the stated deadline; the rules say monetary prizes are delivered within 60 days after Sponsor/Devpost receives completed Required Forms. Account for wire/foreign-exchange fees, taxes and applicable Indian banking/foreign-exchange reporting obligations.


## Latest engineering baseline — 17 November 2026

The application base commit `fffaef7204d514e10237461f1440e6d904d5dd1b` passed **4,120 automated tests, 0 failures, 0 skips** in PR validation [#44079753736](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44079753736). The matching push workflow [#44079747452](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44079747452) also passed syntax, frontend compilation, authenticated Forge CLI lint, Forge development deployment and the existing development installation upgrade. This does not clear the app-branch dependency findings; the separate scoped override PR must pass its strict audit and independent compatibility review before it can be integrated.

No browser retest, judge installation link, public YouTube demo, or final Devpost submission is recorded. The app remains a development draft.
