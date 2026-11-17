# Dependency audit record

## Latest inspected report

- Source: GitHub Actions CI run [#225](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/43995744629)
- Commit inspected: `e20ec60bfd5820e0d9726dc378abd128b79af16e`
- Date: 17 November 2026 (UTC)
- Result: **12 advisories — 8 high, 4 moderate, 0 critical**
- Automated tests: **34 passed, 0 failed** in the same run.
- The audit command did not change dependencies. No `npm audit fix --force` was run.

| Package | Severity | Direct dependency | Reported path |
| --- | --- | --- | --- |
| `@atlaskit/adf-schema` | High | No | `@atlaskit/adf-schema-generator`, `@atlaskit/editor-prosemirror` |
| `@atlaskit/adf-schema-generator` | High | No | `@atlaskit/editor-prosemirror` |
| `@atlaskit/adf-utils` | High | No | `@atlaskit/adf-schema`, `@atlaskit/editor-prosemirror` |
| `@atlaskit/editor-prosemirror` | High | No | `prosemirror-view` |
| `@atlaskit/forge-react-types` | High | No | `@atlaskit/adf-schema` |
| `@forge/api` | Moderate | Yes | `@forge/manifest` |
| `@forge/bridge` | High | Yes | `@atlaskit/adf-schema`, `@forge/manifest` |
| `@forge/manifest` | Moderate | No | `glob` |
| `@forge/react` | High | Yes | ADF schema, Forge React types, Forge bridge |
| `glob` | Moderate | No | Direct advisory and `minimatch` |
| `minimatch` | Moderate | No | Direct advisory |
| `prosemirror-view` | High | No | Direct advisory |

## Root advisories and compatibility assessment

The three direct advisory records were checked against the GitHub Advisory Database:

- [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4): `glob` versions 9.0.0 through 14.0.1 are affected; first patched version is 14.0.2.
- [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249): `minimatch` versions 7.0.0 through 11.0.0 are affected; first patched version is 11.0.1.
- [GHSA-c8x8-7fp4-3x9w](https://github.com/advisories/GHSA-c8x8-7fp4-3x9w): `prosemirror-view` versions below 1.42.3 are affected; first patched version is 1.42.3.

The current npm `latest` tags were checked on 17 November 2026: `@forge/api` 8.5.0, `@forge/bridge` 7.3.0, and `@forge/react` 12.5.0. These are the direct versions used by this project. npm's suggested audit fixes downgrade them to major versions 6.1.1, 5.5.0, and 11.4.0 respectively. Those are not safe automatic fixes for this app.

The transitive dependency metadata explains why blindly overriding is also unsafe: `@forge/manifest@13.9.0` declares `glob ^13.0.0`, while the first patched glob is 14.0.2; the current published `@atlaskit/editor-prosemirror@9.0.0` declares `prosemirror-view 1.41.5`, while the first patched view is 1.42.3. These are upstream Atlassian dependency constraints, not an isolated direct dependency that can be safely changed without a compatibility test. Do not force major overrides or downgrade the Forge UI Kit packages merely to silence npm audit.

## Install-script warning

The same CI run reported that `iframe-resizer@4.4.5` has a postinstall script (`node bin/post.js`) not yet covered by npm's `allowScripts` approval. The exact published script only prints a notice about the library's version 5 package split; it does not write build files, execute a network request, or perform a required build step. CI can safely leave this script blocked. Do not approve it just to remove the warning.

## Reproducibility gap

The repository currently has no `package-lock.json`. CI falls back to `npm install` until the lockfile exists; after the user runs the consent-gated Forge development workflow, that workflow commits the generated lockfile and CI switches to `npm ci`. Review that lockfile and rerun the audit before release.

## Release decision

- **No critical advisory** was present in the inspected report.
- **High and moderate advisories remain unresolved** in the current upstream Forge dependency tree. Passing tests do not mean the dependency tree is vulnerability-free.
- Keep the direct Forge packages on their current compatible latest versions; do not use `npm audit fix --force`.
- Recheck Atlassian package releases for patched transitive dependencies, then regenerate the lockfile and rerun the audit, unit tests, syntax checks, JSX compilation, Forge lint, deployment, and live acceptance tests.
- This record is historical and must be refreshed after the lockfile is generated or dependency versions change.
