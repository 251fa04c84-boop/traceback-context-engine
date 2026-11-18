# Latest verified status — 18 November 2026, 14:50 IST

This is the current snapshot. Historical sections below are retained for audit history and must not override this snapshot.

- **Rovo candidate staging deploy/install: PASS.** Guarded GitHub Actions run [#44271541973](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44271541973) deployed Forge app version **2.0.0** and completed Jira installation on the explicitly confirmed test site `brand7.atlassian.net`.
- **Staging validation: PASS.** That exact run passed **4,159 tests, 0 failures, 0 skips**, syntax checks, frontend compilation and authenticated Forge CLI lint (“No issues found”). The workflow did not use `--confirm-scopes`.
- **Latest documentation CI: PASS.** Devpost draft update commit `bb7b8224e4b984b1cfdf092e5a45e7278dd2a90b` passed [CI #44272627348](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44272627348). PR #9 description has also been refreshed to distinguish verified staging installation from unverified live acceptance.
- **PR #9:** remains open, draft and unmerged. No production tenant was targeted.
- **Live Jira/browser acceptance: NOT VERIFIED.** The connected Atlassian connector currently exposes only `251fa04c84.atlassian.net`; read-only access to `brand7.atlassian.net` is not authorized to the connector. Successful Forge installation does not prove browser acceptance.
- **Teamwork Graph authorization/data: NOT ACCEPTED.** Administrator-approved effective Graph scopes and genuine linked goal/deployment/pull-request records have not been verified.
- **Rovo/MCP: PARTIAL.** Deployment and installation passed. Rovo discovery, action invocation, Rovo Studio MCP visibility, external MCP enablement and OAuth 2.1 consent remain unverified.
- **Dependency security: OPEN.** Main candidate baseline remains 9 high, 4 moderate, 0 critical. PR #11 is a separately tested partial reduction (0 high, 6 moderate) and remains draft; PR #2's cross-major `glob@14` override remains incompatible/unmergeable.
- **Submission: NOT READY, but the event is still open.** Official Codegeist 2026 rules list the submission deadline as **22 December 2026 at 12:00 pm Pacific Time**. The required package includes a judge installation link, setup instructions and a public YouTube demo under five minutes. Judge-install URL, accepted public demo video and submission receipt are not yet verified. Source: [official Devpost rules](https://codegeist2026.devpost.com/rules).
- **Safety:** no production install, production deployment, production scope consent or synthetic evidence creation was performed.


This is the current snapshot. Historical sections below are retained for audit history and must not override this snapshot.

- **Rovo candidate staging deploy/install: PASS.** Guarded GitHub Actions run [#44271541973](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44271541973) deployed Forge app version **2.0.0** to staging and completed Jira installation on `brand7.atlassian.net`.
- **Deployment validation: PASS.** The exact staging workflow run passed **4,159 tests, 0 failures, 0 skips**, syntax checks, frontend compilation and authenticated Forge CLI lint (“No issues found”). The workflow did not use `--confirm-scopes`.
- **PR #9 documentation refresh:** commit `4528b3e1959cfdd830a31da1e8c4119402b551be` records the successful staging install and explicit acceptance boundaries. Its follow-up CI [#44272287938](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44272287938) is currently running; test, syntax and frontend steps have passed, Forge CLI validation is still in progress. Do not call this latest docs head fully green until the run concludes.
- **Live Jira/browser acceptance: NOT VERIFIED.** The connected Atlassian connector currently exposes only `251fa04c84.atlassian.net`; a read-only request to `brand7.atlassian.net` was denied because that cloud ID is not granted to the connector. This is separate from successful Forge installation.
- **Teamwork Graph authorization/data: NOT ACCEPTED.** The staging workflow requested four granular Graph scopes but did not auto-consent. An administrator-authorized scope state and genuine linked goal/deployment/pull-request records have not been verified.
- **Rovo/MCP: PARTIAL.** Forge candidate deployed and installed. Rovo discovery, Rovo Studio MCP visibility, OAuth 2.1 consent and real action invocation remain unverified.
- **Dependency security: OPEN.** Core branch audit remains 9 high, 4 moderate, 0 critical. PR #11 is a ProseMirror-only partial remediation (0 high, 6 moderate) and remains draft. PR #2's zero-audit lockfile has an incompatible cross-major glob override and remains unmerged.
- **Submission: NOT READY.** Judge guide and Devpost draft exist, but no official judge installation URL, accepted public demo video or final submission receipt is verified.
- **Safety:** no production install, production deployment, production scope consent or synthetic evidence creation was performed.

# Latest verified status — 18 November 2026, 14:08 IST

This snapshot supersedes earlier status statements below when they conflict.

- **Automated tests:** refreshed Rovo/MCP app implementation head `ec91d08095cb09d57fd6d5d6274c80516db64696` passed exact-head push/PR CI with **4,159 passed, 0 failed, 0 skipped**. Authenticated Forge CLI lint reported no issues on push.
- **Latest documentation refresh:** dependency-audit note commit `160f2b06a6a12c517e870c58f98bd6e67c7250bf` and live Teamwork Graph probe record commit `07e8e6ba7caf3737b31ceaf540c883e1d53051ce` are docs-only changes. CI is running on the latest docs head; do not attribute the prior 4,159 count to this new docs head until those runs complete.
- **Forge validation:** exact Rovo app implementation head passed authenticated Forge CLI lint. The Rovo branch has not been deployed or installed. Last confirmed core development deployment is version **2.49.0** from core commit `a877c922ecc12b80f496d61009170fce4f74b240`; it is not the Rovo build.
- **Dependency security:** exact Rovo CI audit remains **9 high, 4 moderate, 0 critical**. Latest stable Forge package versions checked on npm are `@forge/api@8.5.0`, `@forge/bridge@7.3.0`, `@forge/react@12.5.0`, and `@forge/manifest@13.9.0`; no compatible stable patched release was identified. The zero-audit PR #2 still uses a cross-major `glob@14` override and remains unmerged.
- **Live Teamwork Graph:** a fresh read-only full-detail connector probe for `DEMO-7` targeting AtlassianGoal, ExternalDeployment and ExternalPullRequest returned **zero relationships**. Jira lookup showed one related Jira issue, `DEMO-8`. This is connector evidence on the connected production tenant, not Forge app acceptance.
- **Rovo/MCP:** draft PR [#9](https://github.com/251fa04c84-boop/traceback-context-engine/pull/9) declares the read-only Rovo agent and MCP tool and its automated tests pass. Live discovery, Rovo Studio visibility, external MCP OAuth and action invocation remain unverified.
- **Submission assets:** judge installation guide, Devpost draft, and 3:15–3:45 demo storyboard exist. There is no verified judge installation URL or public recorded demo video. The video must show real accepted app behavior, not mock or fabricate linked Graph evidence.
- **Staging workflow:** PR [#10](https://github.com/251fa04c84-boop/traceback-context-engine/pull/10) is merged to `main` as `96db161256696fba7de0546bccd6566600ac96ad`. The manual workflow now allows only the maintained core or reviewed Rovo candidate, blocks the connected production tenant, requires two explicit test-site confirmations, runs staging-only deploy/install, and never auto-consents to scopes. It is not triggered automatically.
- **External blockers:** only a production Atlassian tenant is connected. A separate test site, authorized organization administrator, approved four read-only Teamwork Graph scopes, and representative linked goal/deployment/pull-request test records are still required. No production scopes or production installs will be changed.

# Current authoritative status — 18 November 2026

> This section supersedes the historical status snapshots below. Keep the older records as an audit trail; do not use them as the current readiness statement.

- **Core tests/Forge validation:** latest core workflow-safety head `a21c02816514a7e01992102853b9da47a71193d2` passed push CI [#44260914438](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44260914438) and PR CI [#44260922611](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44260922611): **4,143 passed, 0 failed, 0 skipped**; syntax/frontend checks passed; authenticated Forge CLI lint reported **No issues found** on push. This workflow/test-only commit correctly skipped deployment. The last confirmed core development deployment remains version **2.49.0** from commit `a877c922ecc12b80f496d61009170fce4f74b240`.
- **Rovo/MCP candidate:** refreshed branch `codegeist/rovo-integrated`, PR [#9](https://github.com/251fa04c84-boop/traceback-context-engine/pull/9), app implementation head `ec91d08095cb09d57fd6d5d6274c80516db64696`. Exact-head push CI [#44259652556](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44259652556) and PR CI [#44259660304](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44259660304) both passed **4,159 tests, 0 failed, 0 skipped**; authenticated Forge CLI lint reported no issues on push. Latest workflow/docs head `68e93cafbfa043b21688f3a41c6045bf51ce8867` also passed push [#44260679031](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44260679031) and PR [#44260686456](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44260686456). This feature branch was not deployed or installed.
- **Latest documentation refresh:** PR #9 head `daf29ae52a1e15fe8a47af155063a996fe22e980` changes documentation only. Push CI [#44259860914](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44259860914) and PR CI [#44259867178](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44259867178) both completed successfully. App code remains at the exact tested Rovo/MCP implementation head above; no new app deployment or live acceptance is implied.
- **Dependency security:** base/core lockfile still reports **9 high, 4 moderate, 0 critical**. A separate ProseMirror-only candidate PR [#11](https://github.com/251fa04c84-boop/traceback-context-engine/pull/11) passed exact-head push [#44261114554](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44261114554) and PR [#44261122390](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44261122390): **4,143 tests**, clean `npm ls prosemirror-view --all`, Forge CLI lint no issues, and audit reduced to **0 high, 6 moderate, 0 critical**. Keep it separate/draft pending review. PR #2's zero-audit candidate still uses a `glob@14` override outside `@forge/manifest@13.9.0`'s declared `^13.0.0` range. See [the audit](DEPENDENCY_AUDIT.md) and [prepared upstream escalation packet](UPSTREAM_DEPENDENCY_ESCALATION.md).
- **Teamwork Graph live probe:** the connected account exposes only the production tenant. Read-only probe of DEMO-7 returned one related Jira work item, but no linked goal, external deployment or external pull request. The four granular Graph scopes have not been approved on a separate test site. Do not approve them on production.
- **Live Rovo/MCP:** agent/action code and automated permission-boundary tests are in PR #9. Live Rovo discovery, Rovo Studio MCP visibility, external MCP OAuth 2.1 connection and real action invocation remain unverified.
- **Staging workflow:** the guarded test-site workflow now has a two-branch allowlist for core and Rovo candidates, with production-tenant block, two explicit test-site confirmations, staging-only deploy, and no automatic scope consent. The workflow change is in draft PR [#10](https://github.com/251fa04c84-boop/traceback-context-engine/pull/10); the maintained core branch includes the same change and its regression test. PR #10 must be merged into `main` before the updated workflow is available for manual dispatch from the default branch.
- **Submission package:** [judge installation guide](JUDGE_INSTALLATION.md), [Devpost draft](DEVPOST_DRAFT.md), and [3:15–3:45 demo storyboard](DEMO_SCRIPT.md) are prepared. They are not a public judge installation link or a recorded demo video.
- **PR state:** PRs #1, #2, #5 and #9 remain draft/unmerged. No production install, production scope approval, Marketplace distribution, public demo video or final Devpost submission has occurred.

## Remaining external acceptance gates

1. Create a separate free Atlassian developer/test site and provide its domain.
2. Run the guarded Forge staging deployment and obtain organization-admin approval for the four read-only Teamwork Graph scopes on that test site.
3. Connect real test data: a linked goal, deployment and pull request where available; verify their source links and permission-filtered behavior.
4. Install the refreshed Rovo candidate on that test site; verify agent discovery, action invocation, Rovo Studio tool visibility, and external MCP only if an administrator explicitly enables it and OAuth consent succeeds.
5. Resolve the upstream dependency findings or obtain written Atlassian mitigation/extension guidance.
6. Complete browser acceptance, then deploy/distribute the approved build, generate and verify the official judge installation link, record the real app demo, and submit before the official deadline.

> **Latest verified status — 18 November 2026, 12:25 IST.** Core app/test baseline `c54570504e6bc0db8ae5aea9f99ce5157a7c7d8f` passed exact-head push CI [#44254554894](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44254554894): **4,137 tests, 0 failures**, syntax checks and frontend compilation; runner Node.js **24.22.2**. Audit remains **9 high, 4 moderate, 0 critical**. This run skipped Forge CLI lint and deployment because the change was tests-only; last confirmed app deployment remains Forge development version **2.44.0**.
>
> The core PR #1 is open, draft and mergeable. PR #2 (dependency experiment) is open/draft/not mergeable and now **57 ahead / 26 behind** core; it still crosses the declared `@forge/manifest@13.9.0` `glob@^13.0.0` range and its lockfile is behind current npm patches. PR #5 (Rovo/MCP) is open/draft and now **64 ahead / 33 behind** core; its older exact-head CI passed 4,147 tests, but the candidate has not been synchronized or live-accepted. PR #3 is closed as superseded; PR #7 was merged solely to synchronize deployment workflow hardening. No app-feature PR has been merged.
>
> Both manual deployment workflows now pin GitHub Actions to immutable SHAs. The test-site workflow accepts only `codegeist/forge-foundation`, blocks the connected production tenant, requires two explicit test-site confirmations, runs tests/syntax/frontend checks before Forge lint/deploy, and never auto-consents to Graph scopes. Safety regression tests now cover both deployment workflows.
>
> **Still blocked on external access/approval:** no separate Atlassian developer site has been created, no organization admin has approved the four Teamwork Graph scopes in a test org, and no fresh browser/Forge-panel Graph acceptance, Rovo/MCP live acceptance, judge installation link, public demo video or final Devpost submission is verified. Do not enable Graph scopes on the connected production tenant. Official Codegeist deadline: December 22, 2026, 12:00 p.m. Pacific (December 23, 1:30 a.m. IST).
>
> **Verified release snapshot — 18 November 2026, 12:15 IST.** Core branch head is `ae5555a37069b02a0fd6a8f2cdc370735741a164`. Exact-head push CI [#44253146366](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44253146366) passed **4,131 tests, 0 failures**, syntax checks and frontend bundle compilation. The runner used Node.js **24.22.2**. The audit still reports **9 high, 4 moderate, 0 critical**. This docs-only commit skipped Forge CLI lint and deployment; last confirmed app deployment remains development version **2.44.0** from [#44103273512](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44103273512).
>
> **PR state:** PR #1 is open/draft and GitHub reports it mergeable. PR #2 is open/draft, not mergeable, and its branch is **57 commits ahead / 12 behind** core; its isolated clean audit uses `glob@14.0.2` and `minimatch@11.0.8`, but that lock is stale and crosses `@forge/manifest@13.9.0`'s declared `glob@^13.0.0` range. PR #5 is open/draft and GitHub reports it mergeable, but its branch is **64 commits ahead / 19 behind** core; its last exact-head CI is [#44125938453](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44125938453), with 4,147 tests, 0 failures. No PR is merged.
>
> **Fresh dependency-version check:** npm currently lists `@forge/manifest@13.9.0`, `glob@14.0.6`, and `minimatch@11.0.9`. The isolated candidate still locks older `glob@14.0.2` / `minimatch@11.0.8`; newer versions have not yet been integrated into a lockfile or validated against the real Forge PackageValidator. Do not call the candidate fully remediated.
>
> **Live/submission gates remain open:** the connected Atlassian site is a production tenant; no separate test site, fresh browser acceptance, admin approval of Teamwork Graph scopes, verified real goal/deployment/PR records in the Forge panel, live Rovo/MCP acceptance, judge installation link, public demo video, or final Devpost submission is verified. Do not grant the four Graph scopes on production. The official Codegeist deadline is December 22, 2026, 12:00 p.m. Pacific (December 23, 1:30 a.m. IST).
>
> **Current verified status — 18 November 2026, 11:41 IST.** Core PR #1 is at `27ebc14e1f21ecf1dde696c167d1e05ff8cf5d16`; exact-head push [#44125944354](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44125944354) and PR [#44125957154](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44125957154) both succeeded. The latest docs-only CI includes **4,131 tests, 0 failures**; the core dependency audit still reports **9 high, 4 moderate, 0 critical**. The acceptance-record docs commit `6b1d3b3586e009e8c5957816a33ce108227890ba` also passed exact-head push [#44125914946](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44125914946) and PR [#44125927487](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44125927487).
>
> **Dependency candidate PR #2** is at `f74a2437872ca5794e5945cf4b7b20533272e34c`; push CI [#44125930181](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44125930181) succeeded. Its isolated audit reports zero vulnerabilities, but its `glob@14.0.2` override is outside `@forge/manifest@13.9.0`'s declared `^13.0.0` range and GitHub currently reports the PR as not mergeable. Do not merge until compatibility is resolved and PR CI is rerun.
>
> **Rovo/MCP candidate PR #5** is at `18545bef77fed0c7fd921b6c857f2a3f03536073`; exact-head push [#44125922718](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44125922718) and PR [#44125938453](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44125938453) both succeeded, with **4,147 tests, 0 failures**. Live Rovo discovery, MCP visibility, action invocation and permission-boundary acceptance remain unverified.
>
> All three PRs are open and draft. GitHub currently reports PR #1 and PR #5 mergeable, and PR #2 not mergeable. **No PR has been merged.** Core CI fails closed if npm audit returns an error/incomplete report; this does not resolve the core dependency findings. The app's last confirmed Forge deployment is development version **2.44.0**; no later app-source deployment is recorded.
>
> **Live/submission gates remain open:** no separate Atlassian test site, fresh authenticated browser acceptance, approved Teamwork Graph scopes, verified real Graph goal/deployment/PR records in the Forge panel, Rovo/MCP live acceptance, judge installation link, public demo video, Devpost join confirmation or final submission. A separate test site is recommended for safe live acceptance, not a formal prerequisite to writing code or preparing the submission. Do not grant organization-wide Graph scopes on the connected production tenant without explicit admin/security approval.
>
# TraceBack Context Engine — Codegeist Submission Checklist

**Target category:** Apps for Software Teams  
**Conditional bonus candidates:** Teamwork Graph integration, Best Agents, or Best app with Atlassian MCP — select at most one, and only after that integration passes live acceptance.  
**Current state:** Development draft; not ready to submit.

**Latest verification — 18 November 2026:** Core commit `a877c922ecc12b80f496d61009170fce4f74b240` passed push and PR CI [#44258873412](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44258873412) and [#44258866313](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44258866313): **4,143 tests passed, 0 failed, 0 skipped**. Authenticated Forge CLI lint reported no issues, and Forge development deployment completed successfully as version **2.49.0** without installing/upgrading any Jira site. The npm audit still reports **9 high, 4 moderate, 0 critical**.

A refreshed candidate branch `codegeist/rovo-integrated` adds the read-only Rovo Agent and MCP action on top of that core. Its exact-head CI is running; it has not been deployed or live-accepted. The original Rovo PR #5 remains draft/unmerged. The connected Jira sample DEMO-7 has one Jira issue link but no returned linked goals, deployments or external pull requests. No separate test site, approved Teamwork Graph scopes, official judge installation URL, public demo video, or final Devpost submission is verified.


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
