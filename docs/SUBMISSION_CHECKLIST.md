# TraceBack Context Engine — Codegeist Submission Checklist

**Target category:** Apps for Software Teams  
**Target bonus prize:** Best apps with Teamwork Graph integration  
**Current state:** Development draft; not ready to submit.

## Official Codegeist 2026 terms (recheck before final submission)

Official sources: [Devpost listing](https://codegeist2026.devpost.com/) · [Official rules](https://codegeist2026.devpost.com/rules)

- **Submission deadline:** Tuesday, December 22, 2026 at 12:00 p.m. Pacific Time. On that date Pacific is UTC−8, so this is Wednesday, December 23, 2026 at 1:30 a.m. India Standard Time.
- **Judging:** Stage One is pass/fail for theme fit and appropriate use of the required Atlassian capability. Stage Two weights Technological Implementation, Design, Potential Impact, Innovation/Idea, and Presentation equally at 20% each.
- **Eligibility:** Individual entrants are allowed and must be at least the age of majority where they reside. The named excluded places include Brazil, Quebec, Russia, Belarus, Crimea, Cuba, Iran, North Korea, Syria, Sudan and Myanmar, plus locations barred by applicable law or OFAC. India is not on that named list; all legal, sanctions, conflict-of-interest and other eligibility terms still apply.
- **Main category cash prizes (one set per category):** First place USD 15,000 (three first-place awards total, one per category), plus two Team 2027 AMER tickets for the winning team; travel is not included. Second place USD 8,000 (three awards total). Third place USD 5,000 (three awards total).
- **Bonus prizes:** USD 1,500 each for Best Agents, Atlassian MCP, Teamwork Graph integration, and Marketplace listing (six awards per bonus category). A submission may receive at most one main category prize and one bonus prize; it cannot receive multiple bonus prizes.
- **Payment:** Winners are subject to identity, eligibility and role verification. Required Forms are due within 10 business days after they are sent. Cash prizes are delivered within 60 days after the Sponsor/Devpost receives completed Required Forms. Winners are responsible for applicable taxes and wire/foreign-exchange fees.
- **Intellectual property and publicity:** The entrant retains ownership of the submission and grants the Sponsor a fully paid, non-exclusive license to use it for judging. The publicity rights in the rules apply during the Hackathon Period and for three years afterward. Ensure all included code, libraries, images, audio and other assets are original or used under compatible licenses.

These are advertised awards, not a guarantee of winning or payment. Re-read the official rules in case the Sponsor or Devpost has amended them before you submit.

## Competition terms verified

- [ ] Confirm entrant eligibility and any conflict-of-interest restrictions at submission time.
- [ ] Confirm the current official rules again immediately before submitting; rules may be amended.
- [ ] Record the entrant name and individual/team status accurately.
- [ ] Ensure all code and assets submitted are original work or used under compatible licenses.
- [ ] Keep a copy of the final submitted version and evidence of receipt.

## Product and Forge readiness

- [ ] Product meaningfully addresses the software-team theme: understanding work, delivery and linked context from a Jira issue.
- [ ] App registered in Forge exactly once.
- [ ] Current manifest and source pass forge lint.
- [ ] App deployed to a working Forge environment.
- [ ] App deployed to the Forge production environment before enabling external sharing.
- [ ] In Atlassian Developer Console → Distribution → Distribution controls, set the unlicensed app to **Sharing**, choose Jira, and copy the generated installation link. See [Atlassian's Forge distribution guide](https://developer.atlassian.com/platform/forge/distribute-your-apps/).
- [ ] App installed by a Jira site administrator using the official judge installation link.
- [ ] All judge instructions and required scope grants are clear and complete.
- [ ] App works in Jira's new issue view.
- [ ] Live acceptance tests are completed and recorded in docs/ACCEPTANCE_TESTS.md.
- [ ] No paid service, secret, or recurring service requirement blocks judge access.
- [ ] The project operates consistently and is free for judge evaluation.

## Teamwork Graph bonus evidence

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
- [ ] Select Best apps with Teamwork Graph integration as the single target bonus prize.
- [ ] Provide project title and concise description.
- [ ] Describe the real problem, target users, workflow, and measurable value.
- [ ] Explain the Forge implementation and Teamwork Graph API use.
- [ ] Provide public repository link if intended for reviewers.
- [ ] Provide the working Forge judge installation link.
- [ ] Provide complete setup, installation, scope-grant and testing instructions.
- [ ] Provide public YouTube video link under five minutes.
- [ ] Ensure video shows the working app on the actual Atlassian UI and demonstrates real end-to-end behavior.
- [ ] Explain how the app meets the main technology requirement.
- [ ] Include the Teamwork Graph bonus-prize write-up.
- [ ] Submit the entire form before the official deadline; save Devpost's submission receipt and final snapshot.

## Five-minute demo outline

1. **Problem (0:00–0:35):** incident investigations are fragmented across Jira work, delivery records and goals.
2. **Jira issue (0:35–1:10):** open a real issue and show its title, status, priority and description.
3. **Related work (1:10–1:50):** show Jira-linked work items and explain relationship labels.
4. **Teamwork Graph (1:50–3:20):** show linked goals, deployments and pull requests with source links and state.
5. **Evidence honesty (3:20–4:15):** show empty/partial/unavailable handling; explain that correlation is not root cause.
6. **Impact and architecture (4:15–4:50):** summarize current-user authorization, read-only access and how the workflow helps a software team decide what to inspect next.

Do not narrate a capability that was not shown working in the submitted build.

## Prize verification and payment

The official rules advertise cash awards. Payment is conditional on winner selection and identity/qualification/role verification. Keep entrant and banking/tax information accurate and respond to Required Forms within the stated deadline; the rules say monetary prizes are delivered within 60 days after Sponsor/Devpost receives completed Required Forms. Account for wire/foreign-exchange fees, taxes and applicable Indian banking/foreign-exchange reporting obligations.
