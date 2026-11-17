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
