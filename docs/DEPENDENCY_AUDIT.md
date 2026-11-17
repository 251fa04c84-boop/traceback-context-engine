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
