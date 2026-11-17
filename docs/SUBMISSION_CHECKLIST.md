# TraceBack Context Engine — Codegeist Submission Checklist

**Target category:** Apps for Software Teams  
**Conditional bonus candidates:** Teamwork Graph integration, Best Agents, or Best app with Atlassian MCP — select at most one, and only after that integration passes live acceptance.  
**Current state:** Development draft; not ready to submit.

## Latest verified build status — 17 November 2026

- **Core app / PR #1:** exact head `0779c1d15e0c2d545ecd1b11f075644cabc3671a`; push CI [#44120823676](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44120823676) succeeded with **4,131 tests, 0 failed** and authenticated Forge CLI manifest lint passed. This latest commit changes documentation only; the last app-source deployment remains Forge development version **2.44.0** from [#44103273512](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44103273512). Fresh browser acceptance of v2.44.0 is not recorded.
- **Dependency remediation / PR #2:** exact head `56a6c12e62d324bc4c5a6462acbec04ff90b1200`; push [#44117469209](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44117469209) and PR [#44117483740](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44117483740) both succeeded with **4,135 tests, 0 failed**, strict npm audit **0 vulnerabilities**, dependency-tree checks and authenticated Forge CLI lint. The scoped `glob@14.0.2` override is outside `@forge/manifest@13.9.0`'s declared `^13.0.0` range. This branch is two core commits behind and GitHub currently reports PR #2 as not mergeable; reconcile and rerun exact-head CI after independent compatibility review. Keep draft and unmerged.
- **Rovo/MCP / PR #5:** exact head `8f3b840baaba80c118781291fbf4cad292c1b6ed`; push [#44116281155](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44116281155) and PR [#44116292798](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44116292798) both succeeded with **4,147 tests, 0 failed**; authenticated Forge CLI manifest lint passed on push. GitHub reports the PR mergeable, but its branch is nine commits behind/diverged from the latest core head; do not assume it includes the latest core-only documentation. Feature-branch deployment was skipped. Live Rovo/MCP discovery, invocation and permission-boundary acceptance remain outstanding.
- All three branches pin checkout/setup-node to verified immutable release commits; CI disables unnecessary checkout credentials and package-manager caching and requires the committed lockfile.
- The core and Rovo branches still report **9 high and 4 moderate** npm audit findings. The zero-finding audit applies only to PR #2's isolated dependency tree.
- The connected Atlassian account exposes only one site, `251fa04c84.atlassian.net`, which is a production tenant. The four Teamwork Graph scopes remain disabled. No genuine linked goal/deployment/pull-request evidence has been accepted through the Forge runtime.
- **Not submission-ready yet:** no separate test-site installation, fresh browser acceptance, judge installation link, public demo video, or final Devpost submission is verified.

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

- [ ] Product meaningfully addresses the software-team theme: understanding work, delivery and linked context from a Jira issue.
- [ ] App registered in Forge exactly once.
- [ ] Current manifest and source pass forge lint.
- [x] Forge development deployment completed (version 2.38.0); fresh browser acceptance of that version remains pending.
- [ ] App deployed to the Forge production environment before enabling external sharing.
- [ ] In Atlassian Developer Console → Distribution → Distribution controls, set the unlicensed app to **Sharing**, choose Jira, and copy the generated installation link. See [Atlassian's Forge distribution guide](https://developer.atlassian.com/platform/forge/distribute-your-apps/).
- [ ] App installed by a Jira site administrator using the official judge installation link.
- [ ] An organization administrator approves and grants the Teamwork Graph scopes; Atlassian requires organization-admin installation for these organization-wide data scopes.
- [ ] All judge instructions and required scope grants are clear and complete.
- [ ] App works in Jira's new issue view.
- [ ] Live acceptance tests are completed and recorded in docs/ACCEPTANCE_TESTS.md.
- [ ] No paid service, secret, or recurring service requirement blocks judge access.
- [ ] The project operates consistently and is free for judge evaluation.

## Teamwork Graph bonus evidence (optional; complete only if this is the one selected bonus)

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
- [ ] Preferred bonus: Best Agents, but only after the Rovo agent is deployed, discovered, and a live action invocation plus permission-boundary test passes. Teamwork Graph and Atlassian MCP are alternatives only; MCP additionally requires administrator enablement and OAuth consent. Select at most one bonus. If no candidate passes live acceptance, submit without a bonus.
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
- [ ] Include a write-up for exactly the one bonus selected (if any); do not include or claim multiple bonus categories.
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

## Prize verification and payment

The official rules advertise cash awards. Payment is conditional on winner selection and identity/qualification/role verification. Keep entrant and banking/tax information accurate and respond to Required Forms within the stated deadline; the rules say monetary prizes are delivered within 60 days after Sponsor/Devpost receives completed Required Forms. Account for wire/foreign-exchange fees, taxes and applicable Indian banking/foreign-exchange reporting obligations.
