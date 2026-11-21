## Latest exact-head audit snapshot — 21 November 2026

This snapshot was captured from the successful PR #19 validation run [#44916569914](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44916569914), exact application commit `345de19c801ee2a8ed314246ae392ed31b0c8250`.

- `npm ci` completed from the committed lockfile.
- `npm ls prosemirror-view --all` dependency-tree validation passed.
- The audit reported **0 critical, 0 high, 6 moderate** vulnerable package entries.
- The six package entries are `@forge/api@8.5.0`, `@forge/bridge@7.3.0`, `@forge/manifest@13.9.0`, `@forge/react@12.5.0`, `glob@13.0.7`, and `minimatch@10.2.6`.
- The report traces the Forge package findings through the `@forge/manifest` / `@forge/bridge` dependency chain; `glob` is affected by [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4), and `minimatch` by [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249).
- npm's suggested automatic fixes would downgrade direct Forge packages across major versions (including `@forge/api@6.1.1`, `@forge/bridge@5.5.0`, and `@forge/react@11.4.0`). These are not safe compatibility fixes and were not applied.
- The exact run passed **4,181 tests, 0 failed, 0 skipped**, JavaScript syntax checks, and frontend bundle compilation.
- Forge CLI lint and deployment were skipped by workflow conditions. No live Forge installation or runtime acceptance is established.

**Decision:** retain the current Forge major lines and the narrow ProseMirror remediation. Do not apply `npm audit fix --force`, downgrade Forge packages, or introduce an out-of-range transitive override simply to obtain a zero-finding report. Track the six moderate entries as an open dependency risk and re-evaluate only against a supported upstream release or written Atlassian compatibility guidance.

---

## Authoritative exact-head snapshot — 21 November 2026

This section supersedes older aggregate counts below for the current evidence-ledger/security candidate stack.

- Candidate PR: [#18](https://github.com/251fa04c84-boop/traceback-context-engine/pull/18)
- Exact head: `0161fad54403bc3a18ea2539666315e34c91ddde`
- Exact-head PR CI: [#44906812892](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44906812892) completed successfully.
- Test suite: **4,176 passed, 0 failed, 0 skipped**.
- `npm ls prosemirror-view --all` passed; all resolved entries are `prosemirror-view@1.42.9`.
- Audit: **0 high, 6 moderate, 0 critical** (6 vulnerable package entries).
- The narrow ProseMirror fix removes the prior high-severity ProseMirror/Atlaskit chain from this candidate. It does not clear the remaining moderate findings.
- Remaining moderate package entries: `@forge/api`, `@forge/bridge`, `@forge/manifest`, `@forge/react`, `glob`, and `minimatch`.
- Do not blindly apply npm's suggested major Forge downgrades or a `glob@14` override outside `@forge/manifest`'s declared range. Keep remaining dependency work isolated until an upstream-compatible resolution is verified.
- Syntax checks and frontend compilation passed. Forge CLI validation was skipped on the PR event. Development deployment and site installation were skipped.
- No live Forge, Rovo, MCP, Teamwork Graph, or judge-install acceptance is established by this CI run.

This is a candidate validation record, not a claim that all dependencies are vulnerability-free or that the app is production-ready.

---

## Current upstream package recheck — 18 November 2026, 14:08 IST

The exact-head Rovo candidate CI [#44261385532](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44261385532) reran the committed lockfile audit. It still reports **13 vulnerable package entries: 9 high, 4 moderate, 0 critical**. The same run passed **4,159 tests, 0 failures, 0 skipped**, syntax/frontend checks, and authenticated Forge CLI lint (No issues found).

The audit package list remains:
- High: `@atlaskit/adf-schema`, `@atlaskit/adf-schema-generator`, `@atlaskit/adf-utils`, `@atlaskit/editor-json-transformer`, `@atlaskit/editor-prosemirror`, `@atlaskit/forge-react-types`, `@forge/bridge`, `@forge/react`, and `prosemirror-view`.
- Moderate: `@forge/api`, `@forge/manifest`, `glob`, and `minimatch`.

A fresh public npm registry check on 18 November shows the latest stable Atlassian Forge releases are still `@forge/api@8.5.0`, `@forge/bridge@7.3.0`, `@forge/react@12.5.0`, and `@forge/manifest@13.9.0`. Those match the app's current declared dependency lines; the current npm audit still flags the installed tree. Sources: [@forge/api](https://www.npmjs.com/package/%40forge/api), [@forge/bridge](https://www.npmjs.com/package/%40forge/bridge), [@forge/react](https://www.npmjs.com/package/%40forge/react), [@forge/manifest](https://www.npmjs.com/package/%40forge/manifest).

The latest Forge package listings show prerelease `next`/experimental versions, but no stable patched release was identified in this check. Do not substitute prereleases in a production dependency tree without explicit Atlassian support and full compatibility testing. npm's suggested automatic fixes still propose major downgrades (including `@forge/bridge@5.5.0`, `@forge/react@11.4.0`, and `@forge/api@6.1.1`), which are not acceptable blind fixes.

**Current decision:** the core/rovo-integrated lockfile is still not audit-clean. The isolated dependency candidate's zero-vulnerability result remains a separate, cross-major override experiment, not the supported fix. Keep issue #6 open and PR #2 isolated. Next safe step is upstream Atlassian confirmation or a stable compatible Forge/Atlaskit release; then regenerate the lockfile and repeat npm audit, dependency-tree checks, tests, Forge lint, development deploy, and live test-site acceptance.
 
> **Fresh package-level audit diagnosis — 18 November 2026, 12:30 IST.** I inspected the raw npm audit JSON printed by exact code/test CI run [#44254554894](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44254554894), rather than relying only on the aggregate count. It reports 13 vulnerable package entries: 9 high, 4 moderate, 0 critical.
>
> The high findings form one Atlaskit/Forge UI dependency chain: `@atlaskit/adf-schema`, `@atlaskit/adf-schema-generator`, `@atlaskit/adf-utils`, `@atlaskit/editor-json-transformer`, `@atlaskit/editor-prosemirror`, `@atlaskit/forge-react-types`, and `prosemirror-view`. The root ProseMirror advisory is [GHSA-c8x8-7fp4-3x9w](https://github.com/advisories/GHSA-c8x8-7fp4-3x9w), fixed at `prosemirror-view@1.42.3`; the current audit's automatic fix suggestion points to `@forge/bridge@5.5.0`, a major downgrade from the app's declared `^7.3.0`. npm also suggests `@forge/react@11.4.0` for the affected UI chain, a major downgrade from declared `^12.5.0`. Neither is an acceptable blind fix.
>
> The moderate findings are `@forge/api`, `@forge/manifest`, `glob`, and `minimatch`. npm suggests `@forge/api@6.1.1`, a major downgrade from declared `^8.5.0`, as a broad automatic fix. The `glob` advisory [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4) is fixed only from `glob@14.0.2`; all `glob@13.x` releases remain affected, while current `@forge/manifest@13.9.0` declares `glob@^13.0.0`. This is the precise upstream compatibility deadlock: a supported `@forge/manifest` release with an updated dependency range (or a vendor-confirmed fix) is needed to remove this finding without crossing the declared major range. The minimatch finding is fixed from `11.0.1`, but newer November 2026 advisories mean the isolated candidate's `11.0.8` must be retained or refreshed after checking the full advisory set.
>
> **Decision:** do not apply npm's suggested Forge major downgrades, do not force a `glob@14` override into the core branch, and do not merge dependency PR #2. This audit diagnosis is evidence for an upstream Atlassian dependency update request, not proof that any finding is exploitable through TraceBack's own code. Reassess when Atlassian publishes compatible Forge package releases; then run npm audit, full tests, Forge CLI lint, test-site deployment and live acceptance.
>
> **Latest release-gate snapshot — 18 November 2026, 12:25 IST.** Core test baseline `c54570504e6bc0db8ae5aea9f99ce5157a7c7d8f` passed [CI #44254554894](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44254554894): **4,137 tests, 0 failures**, syntax and frontend compilation, Node.js 24.22.2. Audit still reports **9 high, 4 moderate, 0 critical**. No new app deployment occurred.
>
> The isolated dependency PR #2 is now 57 commits ahead / 26 behind core and remains not mergeable. Its lockfile still uses `glob@14.0.2` / `minimatch@11.0.8`, whereas npm lists `glob@14.0.6` / `minimatch@11.0.9`. `@forge/manifest@13.9.0` remains current and declares `glob@^13.0.0`. The latest patches have not been integrated into a committed lockfile or validated against the real Forge PackageValidator. A newer patch version does not resolve the cross-major support issue. Keep the candidate isolated and unmerged.
>
> **Current package-version and release-gate update — 18 November 2026.** The latest core CI run [#44253146366](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44253146366) passed **4,131 tests, 0 failures** on core head `ae5555a37069b02a0fd6a8f2cdc370735741a164`; it used Node.js 24.22.2, passed syntax/frontend checks, and still reported **9 high, 4 moderate, 0 critical**. This was a documentation-only run; Forge CLI lint and deployment were skipped.
>
> A fresh npm registry check finds `@forge/manifest@13.9.0` still current, while `glob@14.0.6` and `minimatch@11.0.9` are newer than the isolated candidate's locked `glob@14.0.2` / `minimatch@11.0.8`. Sources: [@forge/manifest](https://www.npmjs.com/package/%40forge/manifest), [glob](https://www.npmjs.com/package/glob), [minimatch](https://www.npmjs.com/package/minimatch). These newer package versions have **not** been integrated into a lockfile or validated in TraceBack. The manifest package still declares the `glob@^13.0.0` compatibility range, so moving to glob 14 remains an override outside the upstream declared range. Updating the isolated experiment to newer patch releases may improve advisory coverage but does not resolve this compatibility issue. Do not merge or represent the candidate as upstream-supported until an Atlassian-compatible dependency tree is established and tested.
>
> Dependency candidate PR #2 remains draft and unmergeable; its branch is 57 commits ahead / 12 behind core. Core remains at 9 high / 4 moderate. No `npm audit fix --force`, production dependency override, or deployment has been performed.
>
## Authoritative current snapshot — 17 November 2026

> This section supersedes earlier historical statements below where they list `minimatch@11.0.1` as the current lockfile version or imply that an npm audit alone is sufficient.

The current isolated `security/glob-minimatch-experiment` branch lockfile resolves:

| Package | Locked version | Scope |
| --- | --- | --- |
| `prosemirror-view` | `1.42.9` | Root override for exact Atlaskit pins |
| `glob` | `14.0.2` | Scoped under `@forge/manifest` |
| `minimatch` | `11.0.8` | Scoped under `@forge/manifest > glob` |

**Why minimatch was refreshed:** the earlier `11.0.1` lockfile passed npm audit, but a new advisory published on 10 November 2026 affects `minimatch@11.0.0–11.0.6` and is fixed in `11.0.7` ([GHSA-cf2h-pxjq-68xw](https://github.com/isaacs/minimatch/security/advisories/GHSA-cf2h-pxjq-68xw)). A second advisory affects `11.0.3–11.0.7` and is fixed in `11.0.8` ([GHSA-hqmv-qgp3-jx75](https://github.com/isaacs/minimatch/security/advisories/GHSA-hqmv-qgp3-jx75)). The current lockfile therefore uses `11.0.8`, not the older `11.0.1`. This is a deliberate manual advisory check in addition to npm audit. A third advisory published on 11 November affects `minimatch@7.4.0–11.0.7` and is also fixed in `11.0.8` ([GHSA-c859-jr93-m5j4](https://github.com/isaacs/minimatch/security/advisories/GHSA-c859-jr93-m5j4)); it concerns `minimatch.escape()` failing to preserve literal matching for several edge cases. The current `11.0.8` lock therefore clears the published affected range for all three November 2026 minimatch advisories checked here. This does not change the separate `glob@14.0.2` versus `@forge/manifest` declared `^13.0.0` compatibility caveat.

**Latest exact-head validation:**
- PR validation [#44099917882](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44099917882) on exact documentation follow-up head `b42b792d771a134af24b2817f705f8d06700d2fe`: **4,134 tests passed, 0 failed, 0 skipped**; strict `npm audit --audit-level=low` passed with **0 vulnerabilities**; syntax and frontend checks passed.
- Authenticated push validation [#44099908018](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44099908018) on the same exact head: **4,134 tests**, `npm audit` **0 vulnerabilities**, dependency tree validation, syntax/frontend checks and Forge CLI lint (**No issues found**).
- `npm ls prosemirror-view glob minimatch --all` confirms the intended versions and no invalid tree.
- Direct integration tests against the actual `@forge/manifest@13.9.0` `PackageValidator` pass for a matching and a missing `extraFiles` glob.

**Remaining compatibility caveat:** `@forge/manifest@13.9.0` declares `glob@^13.0.0`, while the patched glob advisory is fixed in `glob@14.0.2`. The scoped override therefore crosses the declared major range. The inspected consumer call site and direct PackageValidator tests reduce risk but do not establish Atlassian support. Keep this PR draft pending independent compatibility review.

The app branch still has **9 high and 4 moderate** findings until this PR is integrated. The 0-finding audit applies only to this isolated lockfile. Version 2.21.0 was deployed earlier with the prior minimatch lock; the exact 11.0.8 tree has **not** been deployed or browser-accepted. The four Teamwork Graph scopes and fresh live acceptance remain outstanding. No production deployment, scope consent, Marketplace publication or Devpost submission has occurred.

# Dependency audit record

## Latest locked-dependency report

- Source: GitHub Actions CI run [#301](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44012419499)
- Commit inspected: `516d101cc6fb676daf3571a857e83e22278bbbaa`
- Date: 17 November 2026 (UTC)
- Lockfile: `package-lock.json` is committed; CI successfully used `npm ci`.
- Result: **13 vulnerable package entries — 9 high, 4 moderate, 0 critical**.
- Automated tests: **38 passed, 0 failed**.
- Syntax checks, frontend JSX bundle compilation, and authenticated Forge CLI lint all passed in CI run #301. Forge CLI reported **No issues found**. The PR-triggered CI run #302 also passed tests, syntax and frontend compilation; its Forge CLI step was skipped by its workflow condition.
- The audit command is report-only. No dependency upgrades or `npm audit fix --force` were applied. The latest run #301 re-confirmed the same 13 findings.

| Package | Severity | Direct dependency |
| --- | --- | --- |
| `@atlaskit/adf-schema` | High | No |
| `@atlaskit/adf-schema-generator` | High | No |
| `@atlaskit/adf-utils` | High | No |
| `@atlaskit/editor-json-transformer` | High | No |
| `@atlaskit/editor-prosemirror` | High | No |
| `@atlaskit/forge-react-types` | High | No |
| `@forge/api` | Moderate | Yes |
| `@forge/bridge` | High | Yes |
| `@forge/manifest` | Moderate | No |
| `@forge/react` | High | Yes |
| `glob` | Moderate | No |
| `minimatch` | Moderate | No |
| `prosemirror-view` | High | No |

## Root advisories and compatibility assessment

The npm report identifies upstream dependency advisories in the Atlassian Forge / Atlaskit dependency tree. The following root advisories were previously checked against the GitHub Advisory Database:

- [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4): affected `glob` versions; first patched version is 14.0.2.
- [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249): affected `minimatch` versions; first patched version is 11.0.1.
- [GHSA-c8x8-7fp4-3x9w](https://github.com/advisories/GHSA-c8x8-7fp4-3x9w): `prosemirror-view` versions below 1.42.3 are affected.

The current Forge packages are pinned by the package manifest to compatible semver ranges: `@forge/api ^8.5.0`, `@forge/bridge ^7.3.0`, and `@forge/react ^12.5.0`. npm's suggested automatic fixes have previously proposed major downgrades of these direct packages. Those changes are not safe to apply without a compatibility review and a new Forge deploy/test cycle.

The transitive constraints observed in the lockfile explain why blindly forcing overrides is unsafe: Forge manifest and Atlaskit packages constrain transitive versions, including `glob` and `prosemirror-view`. Do not force major overrides or downgrade the Forge UI Kit packages merely to silence npm audit. Re-check upstream Atlassian releases and test any override in an isolated branch before considering it for release.

## Install-script warning

The dependency install previously reported that `iframe-resizer@4.4.5` has a postinstall script not covered by npm's `allowScripts` approval. CI leaves that script blocked. Do not approve it merely to remove a warning; first inspect any future package/version change and confirm whether the script is required.

## Release decision

- **No critical advisory** was present in the latest locked-dependency report.
- **Nine high and four moderate findings remain unresolved.** Passing tests and Forge lint do not mean the dependency tree is vulnerability-free.
- The lockfile is now committed and `npm ci` is verified; the earlier reproducibility gap is closed.
- Keep the current compatible Forge package versions. Do not run `npm audit fix --force`.
- Revisit the audit after Atlassian ships patched compatible transitive dependencies, and rerun all tests, Forge lint, deployment and live acceptance before release.


## Latest revalidation — 17 November 2026

The latest locked-dependency audit was re-run by GitHub Actions push workflow [#335](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44026413060) at commit `fc76243643ccfa991613191cfa4aafb7ec88bfab).

- Result remains **13 vulnerable package entries: 9 high, 4 moderate, 0 critical**.
- `npm ci` completed successfully.
- The audit remains report-only for high/moderate findings; it fails CI only when critical findings are present.
- The same workflow passed **4,107 tests**, syntax checks, frontend compilation, Forge CLI lint, development deployment and Jira development installation upgrade.
- Passing these checks does not resolve the dependency advisories. Treat the high/moderate findings as an open release risk.

The current lockfile resolves `@forge/api 8.5.0`, `@forge/bridge 7.3.0`, `@forge/react 12.5.0`, `@forge/manifest 13.9.0`, `@atlaskit/adf-schema 56.7.3`, `@atlaskit/editor-prosemirror 8.0.3`, `prosemirror-view 1.41.5`, `glob 13.0.7`, and `minimatch 10.2.6`. In particular, the locked `prosemirror-view 1.41.5` remains below the previously identified patched version 1.42.3; this is not cleared by the passing app test suite.

No dependency upgrades were made in this documentation-only change. Do not claim the app is vulnerability-free, and do not use `npm audit fix --force`. Any remediation should be isolated, compatibility-reviewed, and followed by the complete CI, Forge deployment and live acceptance gates.


## Isolated remediation investigation — 17 November 2026

This investigation was performed on the separate `security/dependency-remediation` branch, based on the validated application commit `c1fbe07fabadcd6e03f17b993528668609e1b32e`. No production branch dependency versions were changed.

### Findings from the committed lockfile

- `@forge/bridge@7.3.0` depends on `@atlaskit/adf-schema@^56.7.0` and `@forge/manifest@13.9.0`.
- `@forge/react@12.5.0` depends on `@atlaskit/adf-schema`, `@atlaskit/adf-utils`, and `@atlaskit/forge-react-types`.
- Five installed copies of `@atlaskit/editor-prosemirror` (versions 8.0.3 and 9.0.0) declare an exact `prosemirror-view@1.41.5` dependency. The fixed version for GHSA-c8x8-7fp4-3x9w is 1.42.3.
- `@forge/manifest@13.9.0` declares `glob@^13.0.0`; the installed `glob@13.0.7` declares `minimatch@^10.2.2`. The audit's fixed versions are outside those declared major ranges (glob 14.0.2 and minimatch 11.0.1).
- The Forge UI source imports `@forge/react` and `@forge/bridge`; it does not directly import ProseMirror or an editor component. This narrows direct feature exposure but does not remove the vulnerable packages from the installed dependency tree or establish Marketplace compliance.

### Compatibility decision

No package or lockfile override was committed. Forcing `prosemirror-view@1.42.3` would override an exact upstream Atlaskit dependency declaration; forcing `glob@14.0.2` or `minimatch@11.0.1` would cross upstream major-version ranges. The npm audit's proposed direct Forge package fixes include major downgrades, which are not an acceptable blind remediation.

An Atlassian Developer Community report independently describes the same `prosemirror-view@1.41.5` pin in Forge UI Kit dependency trees and reports that an npm override leads to an `npm ls` dependency problem. This is corroborating community evidence, not an official Atlassian remediation commitment.

### Release impact and required next action

Atlassian's current Marketplace cloud-app security requirements explicitly prohibit known high- or critical-severity third-party dependencies. The current audit therefore remains a release blocker even though this app's own UI does not directly expose a ProseMirror editor and all functional tests pass.

The safe next action is to obtain an upstream patched Forge/Atlaskit dependency release or written Atlassian guidance on a supported mitigation. If Atlassian confirms that the vulnerability is not present in the shipped Forge app artifact or provides an accepted mitigation, retain that evidence and rerun the full dependency audit and Forge validation. Do not describe the issue as resolved solely because an override installs or because the affected editor is not directly used.

References:
- [GitHub advisory GHSA-c8x8-7fp4-3x9w](https://github.com/advisories/GHSA-c8x8-7fp4-3x9w) — fixed in `prosemirror-view@1.42.3`.
- [Atlassian Marketplace cloud-app security requirements](https://developer.atlassian.com/platform/marketplace/security-requirements/) — known high/critical third-party vulnerabilities are prohibited.
- [Atlassian Marketplace security enforcement policy](https://developer.atlassian.com/platform/marketplace/marketplace-security-enforcement-policy/) — explains vulnerability handling and remediation expectations.
- [Atlassian Developer Community report](https://community.developer.atlassian.com/t/forge-react-bridge-dependencies-pin-vulnerable-prosemirror-view-1-41-5-ghsa-c8x8-7fp4-3x9w/103359) — corroborates the upstream exact-version pin and override compatibility issue.


## Follow-up registry and override evidence — 17 November 2026

A fresh package-registry check changes the earlier assessment of the ProseMirror override and justifies a controlled CI experiment, but it does not yet establish a completed remediation:

- npm currently lists `prosemirror-view@1.42.9` as the latest stable release. The vulnerability is fixed from 1.42.3 onward. See [npm package versions](https://www.npmjs.com/package/prosemirror-view?activeTab=versions) and [GHSA-c8x8-7fp4-3x9w](https://github.com/advisories/GHSA-c8x8-7fp4-3x9w).
- The October 2026 Atlassian Developer Community thread linked above contains a later follow-up from a developer who tested a root npm override to `prosemirror-view@1.42.3` with Forge React/Bridge. They reported that all ProseMirror instances resolved to 1.42.3 and the corresponding high audit findings fell to zero in their clean test projects.
- The same follow-up clarifies that the `npm ls --all` `ELSPROBLEMS` result in that environment was caused by separate React peer-dependency declarations (`react-scrolllock` and `@atlaskit/analytics-next-stable-react-context` expecting React 16), and persisted both with and without the ProseMirror override. Therefore, the earlier interpretation that the override itself necessarily caused the npm tree error was too strong.
- This is community-reported compatibility evidence, not an official Atlassian support statement and not a test of this repository's exact lockfile, build output, or deployed Forge artifact.

### Updated next experiment

Test a root npm override to the latest stable patched `prosemirror-view` (currently 1.42.9) on this isolated branch only. Regenerate the lockfile using npm in a network-enabled CI runner, preserve npm's registry-provided integrity hash, then run `npm ci`, `npm ls prosemirror-view`, `npm audit --json`, the complete test suite, frontend/syntax checks, Forge CLI lint and a development deployment/live acceptance check. Inspect the built Forge bundle for ProseMirror code as additional evidence, not as a substitute for dependency-policy compliance.

Do not hand-edit or omit the lockfile integrity field, do not apply the override to the main application branch until the complete validation succeeds, and do not claim all high vulnerabilities are resolved unless the full audit confirms it. The separate `glob`/`minimatch` major-version constraints remain independently unresolved.


### Isolated ProseMirror override CI result — 17 November 2026

GitHub Actions run [44027756327](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44027756327) completed successfully on the isolated security branch at commit `8f9c2d68b99ec39ecf533188e5754ecdb2f45c53`.

Verified from the job log and retained artifact:

- `npm install --package-lock-only --ignore-scripts --no-audit --no-fund` succeeded using Node 24.22.2 / npm 11.19.1.
- `npm ci --ignore-scripts` succeeded; 403 packages installed.
- `npm ls prosemirror-view --all` succeeded, and a lockfile assertion confirmed every locked `prosemirror-view` entry is `1.42.9` (patched version).
- `npm audit --json`: 0 high, 0 critical, 6 moderate vulnerabilities (down from the previously recorded 9 high + 4 moderate). Do not describe the dependency tree as vulnerability-free.
- Tests: 4,107 passed, 0 failed, 0 skipped.
- `npm run lint:syntax` and `npm run lint:frontend` both passed.
- CI uploaded artifact `prosemirror-remediation-evidence` (artifact ID `14304290949`) containing the exact regenerated lockfile and JSON audit report. Artifact retention expires 24 November 2026.

The workflow was then extended to commit the CI-generated lockfile to this isolated branch only, after successful validation. That follow-up push and its resulting run must be checked before treating the lockfile as persisted. No changes were made to the main app branch, Forge deployment, or PR #1. The six moderate audit findings remain; the separate `glob`/`minimatch` remediation and Atlassian Marketplace policy review remain open.


## Full isolated override validation — 17 November 2026

A second, broader override experiment was completed on `security/glob-minimatch-experiment`, based on the separately validated application branch. The experiment changes only the isolated branch's npm overrides and generated lockfile; it does not change the main branch or PR #1.

**Successful validation:** [GitHub Actions run #44067874879](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44067874879), commit `a0aa2adca67b9ff7e11eb0c1a9aeb339be6cf6e7`.

- Node 24 / npm lockfile regeneration succeeded.
- `npm ci --ignore-scripts` succeeded.
- The lockfile contains exactly one installed copy of each overridden package: `prosemirror-view@1.42.9`, `glob@14.0.2`, and `minimatch@11.0.1`.
- `npm ls prosemirror-view glob minimatch --all` succeeded with no invalid dependency-tree errors.
- `npm audit --json` reported **0 vulnerabilities: 0 low, 0 moderate, 0 high, 0 critical**.
- Tests: **4,107 passed, 0 failed, 0 skipped**.
- JavaScript syntax checks and frontend JSX compilation passed.
- Authenticated Forge CLI lint completed and reported **No issues found**.
- The CI-generated lockfile was committed to this isolated branch after all checks passed. The run artifact (ID `14319879273`) preserves the lockfile and JSON audit report until 24 November 2026.

### Compatibility and release decision

This is materially stronger evidence than the earlier ProseMirror-only experiment: all three patched versions install together, npm's dependency-tree validation succeeds, the complete test suite passes, Forge CLI lint passes, and npm audit reports zero findings.

However, `glob@14.0.2` and `minimatch@11.0.1` cross the major-version ranges declared by upstream Forge/manifest dependencies. The successful `npm ls`, app tests, and Forge lint reduce the compatibility concern but do not constitute an Atlassian support statement or a deployed runtime test using this exact dependency tree. Therefore:

- Keep the overrides and lockfile isolated until the draft dependency PR is independently reviewed.
- Do not claim that the current main app branch is vulnerability-free; its existing lockfile still reports 9 high and 4 moderate findings.
- Do not deploy or merge the experiment automatically. Require a deliberate dependency review and a full Forge development deploy plus live acceptance before release.
- If Atlassian provides a supported upstream fix or written compatibility guidance, retain it with the PR.

The zero-vulnerability result is an observed npm audit result for this exact isolated lockfile and CI run, not a guarantee against undiscovered vulnerabilities or future advisories.


### Integration validation against the latest application branch — 17 November 2026

The dependency PR's merge-result CI [run #44068485217](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44068485217) tested the dependency changes together with the latest `codegeist/forge-foundation` application branch:

- `npm ci` succeeded and `npm audit` reported **0 vulnerabilities**.
- **4,110 tests passed, 0 failed, 0 skipped**, including the latest backend Teamwork Graph HTTP-response regression tests.
- JavaScript syntax checks and frontend JSX compilation passed.
- Forge CLI lint is skipped on pull-request events by design; the matching authenticated push validation [#44068478540](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44068478540) completed Forge CLI lint with **No issues found**.
- The PR remains draft and has not been deployed with the overridden dependency tree. The zero-audit result is verified, but development deployment/live acceptance of this exact combined tree remains a pre-release gate.


### Forge development deployment with the patched dependency tree — 17 November 2026

The exact dependency tree in this draft PR was deployed successfully to the Forge **development** environment by [GitHub Actions run #44072061196](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44072061196), commit `f94945ca327720bdbe12c72b3705c0a5f6d175ae`.

- `npm ci` installed the committed lockfile successfully (404 packages); npm reported **0 vulnerabilities**.
- The lockfile assertions confirmed `prosemirror-view@1.42.9`, `glob@14.0.2`, and `minimatch@11.0.1`.
- `npm audit --audit-level=low` passed with **0 findings**.
- Forge CLI 15.1.0 lint reported **No issues found**.
- Forge CLI deployed TraceBack Context Engine **version 2.16.0** to the **development** environment. Forge reported the version is eligible for the Runs on Atlassian program.
- This deployment did **not** deploy to the production Forge environment, change the manifest scopes, or run an installation upgrade. The existing development installation remains on the previously configured Jira site; that site is a production Jira tenant, so this is still a controlled development installation, not a separate test tenant.

This materially reduces the dependency compatibility risk because the patched tree passed npm installation, audit, Forge lint, packaging, manifest validation, and an actual Forge development deployment. It is not yet a live-runtime acceptance test of the deployed version: a fresh browser retest is still outstanding, and the Teamwork Graph scopes remain unapproved/disabled. Do not merge or release this draft solely on the basis of the deployment.

The one-off workflow used for this isolated deployment is removed from the final PR diff; the run record remains available at the link above.


## Scoped override hardening — 17 November 2026

A follow-up review narrowed the dependency override configuration on the isolated branch:

- `prosemirror-view@1.42.9` remains a root override because five installed Atlaskit editor packages declare the exact vulnerable `1.41.5` version.
- The `glob@14.0.2` override is now nested under `@forge/manifest` rather than applied globally. The inspected lockfile has one `glob` installation and `@forge/manifest@13.9.0` is its only direct consumer.
- The root `minimatch@11.0.1` override was removed. `glob@14.0.2` itself declares `minimatch@^11.0.0`, and the committed lockfile resolves that dependency to patched `11.0.1`.
- Added `test/dependency-overrides.test.js` to guard the intended override scope and assert that every locked ProseMirror view copy is patched.

This is a blast-radius reduction, not removal of the compatibility concern: `@forge/manifest@13.9.0` still declares `glob@^13.0.0`, while the scoped override supplies 14.0.2. The scoped change and regression test must pass a fresh `npm ci`, full test suite, audit, syntax/frontend checks and authenticated Forge CLI lint before this updated PR head can be considered validated. No app source, manifest scopes, Jira data, or production deployment were changed.


## Rebased scoped override and latest application test base — 17 November 2026

The scoped dependency experiment has been rebased onto application commit `ee32378a385666c4c86adb13a43d3f01ce610c31`, which includes the latest resolver request deadlines, Graph pagination timeout handling, stale-response protection and truthful empty-state copy. The security PR remains limited to dependency configuration, lockfile, regression assertions, CI audit gates and documentation; it does not change the Forge manifest or runtime application source.

The isolated dependency configuration remains:
- Root `prosemirror-view@1.42.9` override to satisfy exact vulnerable Atlaskit pins.
- `glob@14.0.2` scoped only under `@forge/manifest`; this still crosses `@forge/manifest@13.9.0`'s declared `glob@^13.0.0` range.
- No global `minimatch` override; glob 14 declares `minimatch@^11.0.0` and the lockfile resolves `11.0.1`.

The rebased scoped tree passed `npm ci`, `npm ls prosemirror-view glob minimatch --all`, strict `npm audit --audit-level=low` with **zero vulnerabilities**, **4,124 tests (0 failed, 0 skipped)**, syntax/frontend checks and authenticated Forge CLI lint. The PR test log confirms both exact `PackageValidator` integration tests passed. Evidence: [PR run #44080696080](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44080696080); authenticated push validation [#44080687502](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44080687502). The push workflow intentionally skips deployment on `security/**` branches. Keep the PR draft until independent compatibility review and fresh live runtime acceptance are complete.

The app-branch push workflow no longer passes `--confirm-scopes` to Forge installation. CI must not automatically consent to new scopes; any scope addition must be approved explicitly by an Atlassian organization administrator.


## Exact Forge manifest glob call-site compatibility test — 17 November 2026

The published `@forge/manifest@13.9.0` package source was inspected directly at [its `PackageValidator` implementation](https://npmfs.com/package/@forge/manifest/13.9.0/out/validators/package-validator.js). Its only observed `glob` call site is:

```js
return (await (0, glob_1.glob)(pattern)).some((file) => fs_1.default.lstatSync(file).isFile());
```

It uses the named asynchronous `glob(pattern)` API with no special options, classes, or internal exports. The upstream glob 14 package retains the named `glob()` API. To turn that source review into executable evidence, this PR adds a test that invokes the actual exported `PackageValidator` from `@forge/manifest@13.9.0` against a temporary matching file and a missing-file pattern while the lockfile resolves glob 14. This tests the exact consumer path rather than only testing `glob` in isolation.

This narrows the practical compatibility concern but does not erase the declared semver mismatch: the Atlassian package still specifies `glob@^13.0.0`. Retain the explicit override, its source review, the integration test, and the CI result for reviewer visibility. Do not call this an Atlassian-supported combination unless Atlassian confirms it.


## Controlled development deployment of the scoped tree — 17 November 2026

After the direct `@forge/manifest@13.9.0` consumer tests passed, the exact scoped dependency tree was deployed to the Forge **development** environment by [GitHub Actions run #44081294538](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44081294538), branch head `8f71a4280d5804336e2017c6843256f718af77e8`.

- `npm ci`, `npm ls prosemirror-view glob minimatch --all`, 4,124 tests, syntax/frontend checks, and authenticated Forge CLI lint passed.
- Strict npm audit on the matching PR validation remains **0 vulnerabilities** ([#44081054112](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44081054112)).
- Forge CLI deployed the scoped tree as development app version **2.21.0**; Jira reported the existing development installation was already at the latest version.
- The install command did not pass `--confirm-scopes`; no automatic scope consent was requested.
- This is a controlled development deployment on `251fa04c84.atlassian.net`, which Forge identifies as a production Jira site. It is not a production environment deployment, separate test tenant, or judge installation.
- A fresh browser retest of version 2.21.0 is still outstanding. The four Teamwork Graph scopes and representative real linked-record acceptance remain separate administrator/runtime gates.

The workflow's temporary exact-branch development-deploy condition has been reverted after this one validation run. Future security-branch pushes will not automatically deploy; the normal application branch workflow remains the only automatic development deployment path. It still does not auto-consent to scopes.


## Exact synchronized dependency-branch validation — 17 November 2026

The current scoped dependency candidate resolves `prosemirror-view@1.42.9`, `glob@14.0.2` only beneath `@forge/manifest`, and `minimatch@11.0.8` beneath that glob dependency.

GitHub Actions PR validation [#44093045715](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44093045715) on commit `8f2d5e24252f0c1969af38fbb6192825314fb133` completed successfully:
- `npm ci` and the dependency-tree assertions passed.
- Strict `npm audit --audit-level=low` reported **0 vulnerabilities**.
- **4,134 tests passed, 0 failed, 0 skipped**.
- JavaScript syntax checks and frontend JSX compilation passed.
- Forge CLI lint and development deployment were skipped on this PR event by workflow design; the exact `minimatch@11.0.8` tree has not yet been deployed or browser-accepted.

The tested commit is the latest package/lockfile revision. Subsequent workflow-only commits were used to inspect the push/deployment guard and then restore its original condition; they did not change package versions, lockfile contents, application source, or manifest scopes. The branch remains draft. Do not merge until an authenticated Forge CLI validation and controlled development deployment/live acceptance of this exact lockfile have been completed, and the `glob@14.0.2` semver override has been independently accepted.


### Advisory reachability review — 17 November 2026

The GitHub-reviewed advisory [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4) / [OSV record](https://osv.dev/vulnerability/GHSA-3g3m-2fjr-6pw4) describes an availability flaw when a glob walk is cancelled through `AbortSignal` or `AbortSignal.timeout()`: traversal can continue after cancellation. The advisory identifies the patched release as `glob@14.0.2`; the current `@forge/manifest@13.9.0` metadata still declares `glob@^13.0.0` ([npm package record](https://www.npmjs.com/package/%40forge/manifest)).

The inspected `PackageValidator` call site invokes the named asynchronous `glob(pattern)` API without passing an AbortSignal or timeout option. This means the specific cancellation-bypass precondition is not apparent in that observed call path. It is useful reachability evidence, not proof that every consumer path in the Forge toolchain is unaffected. The scoped override still uses the patched release, and the exact consumer integration tests still exercise matching and missing `extraFiles` patterns.

Decision: keep the override scoped to `@forge/manifest`, preserve the cross-major caveat, and do not describe the combination as Atlassian-supported. No patched 13.x release is identified by the current advisory record. Revisit when Atlassian publishes a compatible `@forge/manifest` release or provides written compatibility guidance.


## Latest synchronized dependency candidate validation — 17 November 2026

The branch was synchronized with the latest core acceptance documentation and CI workflow in merge commit `8ceb46e065213c6747aa8fac0ac791694ab9c216`.

- Push CI [#44104766251](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44104766251): **4,134 tests passed, 0 failed, 0 skipped**; locked install, installed dependency-tree assertions, syntax/frontend checks and authenticated Forge CLI lint passed.
- Matching PR CI [#44104778434](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44104778434): **4,134 tests passed, 0 failed, 0 skipped**; strict `npm audit --audit-level=low` reported **0 vulnerabilities**.
- The current lockfile still resolves one scoped `glob@14.0.2` beneath `@forge/manifest@13.9.0`, with `minimatch@11.0.8` beneath it. No global glob or minimatch override is used.
- The direct `PackageValidator` integration tests and the inspected `glob(pattern)` consumer call provide compatibility/reachability evidence, not an Atlassian support guarantee. The declared `^13.0.0` semver range remains incompatible with the overridden major.
- The synchronized security branch intentionally skips Forge deployment. No new scope consent, production installation, or live browser acceptance occurred.

The candidate remains draft and unmerged pending independent compatibility review. The core app's 9 high and 4 moderate audit findings are not cleared by this isolated zero-finding result.


## Release-gate tracking — 18 November 2026

GitHub issue [#6: Resolve Forge transitive high-severity advisories with an upstream-supported dependency tree](https://github.com/251fa04c84-boop/traceback-context-engine/issues/6) is now the canonical open release blocker.

Atlassian's current [cloud-app security requirements](https://developer.atlassian.com/platform/marketplace/security-requirements/) prohibit known high- or critical-severity third-party dependencies. The [Marketplace Security Enforcement Policy](https://developer.atlassian.com/platform/marketplace/marketplace-security-enforcement-policy/) specifies remediation timelines and an extension process for genuine upstream/platform-owned blockers.

The core branch still reports **9 high, 4 moderate, 0 critical**. The isolated zero-finding candidate remains unmerged because its `glob@14.0.2` override crosses the declared `@forge/manifest@13.9.0` `^13.0.0` range. Passing integration tests and Forge CLI lint do not constitute Atlassian compatibility approval.

**Release decision:** do not merge the candidate or claim Marketplace security compliance until a supported upstream dependency tree or written Atlassian mitigation is available, followed by exact-head CI and controlled live acceptance. Keep the existing fail-closed audit-report guard.


## Additional Forge-managed Node.js runtime advisory — 18 November 2026

Atlassian's Marketplace Developer Community published advisory [CVE-2026-111497: Node.js dependencies](https://community.developer.atlassian.com/t/security-advisory-cve-2026-111497-node-js-dependencies/103572). It describes a Brotli decompression issue that can affect Node.js applications processing attacker-influenced Brotli-encoded responses. Atlassian states that it is updating Forge-managed runtimes and directs developers still using end-of-life Node.js 18.x or 20.x to move to Node.js 22.x or 24.x and redeploy. The advisory lists upstream fixed versions **22.23.4, 24.22.1 and 26.12.1**.

TraceBack's current `manifest.yml` declares `app.runtime.name: nodejs24.x`; it does not declare Node.js 18 or 20. This satisfies the major-version migration direction in the advisory. However, the manifest selects a Forge-managed runtime major, not an independently pinned Node.js patch release. Repository inspection cannot prove which patched Node.js 24 patch level currently executes in Atlassian's managed runtime.

**Follow-up:** retain Node.js 24.x, monitor Atlassian's Forge runtime update confirmation, and redeploy the app after the managed runtime fix is confirmed if Atlassian requires redeployment. Do not attempt to bundle or override the Forge-managed Node runtime from application dependencies. This platform-runtime advisory is tracked separately from the npm dependency audit counts above.


## CI revalidation — 18 November 2026

The Forge-managed runtime advisory note above was committed as `4b421fa7847f35fb8e0db4f72f6faef991f64d64`. Its push workflow [#44250805927](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/44250805927) completed successfully. The job installed Node.js **24.22.2** on the GitHub Actions runner (the workflow requests Node.js 24), completed `npm ci`, ran the dependency audit, all **4,131 tests**, syntax checks, and frontend bundle compilation. The audit still reports **9 high, 4 moderate, 0 critical** vulnerabilities. The Forge CLI validation and deployment steps were skipped in this documentation-only run; this run does not verify the Forge-managed app runtime's patch level or constitute a new app deployment/live acceptance.

Atlassian's current Forge CLI setup documentation requires Node.js **22.23.4 or later** on the 22.x line, or **24.22.1 or later** on the 24.x line. The observed CI runner version 24.22.2 satisfies that local CLI requirement. This is distinct from the Forge-hosted app runtime selected by `manifest.yml`, whose exact patch version remains platform-managed and unverified from this repository.


## External upstream confirmation and escalation evidence — 18 November 2026

A public Atlassian Developer Community thread independently reports the same upstream dependency condition observed in this repository: Forge UI Kit applications using `@forge/react` and `@forge/bridge` receive `@atlaskit/editor-prosemirror`, whose published 9.0.0 dependency graph pins vulnerable `prosemirror-view@1.41.5` even when the application does not directly use ProseMirror editing. The thread reports that overriding `prosemirror-view` to the patched 1.42.3 line removed the high-severity audit findings in a clean test tree. A participant recommends an Atlassian Ecosystem Support Request because the vulnerable pin originates in Atlassian-owned packages. This is community reproduction and advice, not a formal Atlassian support statement.

Reference: https://community.developer.atlassian.com/t/forge-react-bridge-dependencies-pin-vulnerable-prosemirror-view-1-41-5-ghsa-c8x8-7fp4-3x9w/103359

The repository's isolated PR #11 goes further to `prosemirror-view@1.42.9`, with clean dependency-tree validation and 0 high / 6 moderate audit findings on its exact tested implementation commit. It remains a separate draft. This evidence supports keeping the narrow ProseMirror-only remediation as the preferred candidate for technical review; it does not justify merging without exact-head validation, runtime review, and an upstream compatibility decision.

**Escalation action:** request written Atlassian guidance on (1) the Marketplace treatment of this transitive high-severity finding when the dependency is pinned by Atlassian's own Forge UI packages, (2) the supported patched dependency version or release ETA, and (3) whether a temporary documented mitigation/extension is available while the upstream pin is corrected. Attach the exact `npm ls prosemirror-view --all`, `npm audit --json`, lockfile, and CI evidence from PR #11. Do not claim that the community thread grants a Marketplace exception.

**Decision unchanged:** main candidate baseline remains 9 high, 4 moderate, 0 critical; PR #11 remains draft/unmerged; the cross-major glob override experiment remains rejected for release. No dependency override is promoted to the release branch by this documentation update.
