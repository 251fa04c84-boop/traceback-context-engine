# Dependency audit record

## Latest inspected report

- Source: GitHub Actions CI run [#185](https://github.com/251fa04c84-boop/traceback-context-engine/actions/runs/43993221433)
- Commit inspected: `11cb58a5bf38df5e5b2a8dee8ed9960ed714305e`
- Date: 17 November 2026 (UTC)
- Result: **12 advisories — 8 high, 4 moderate, 0 critical**
- The audit command did not change dependencies. No `npm audit fix --force` was run.

| Package | Severity | Direct dependency |
| --- | --- | --- |
| `@atlaskit/adf-schema` | High | No |
| `@atlaskit/adf-schema-generator` | High | No |
| `@atlaskit/adf-utils` | High | No |
| `@atlaskit/editor-prosemirror` | High | No |
| `@atlaskit/forge-react-types` | High | No |
| `@forge/api` | Moderate | Yes |
| `@forge/bridge` | High | Yes |
| `@forge/manifest` | Moderate | No |
| `@forge/react` | High | Yes |
| `glob` | Moderate | No |
| `minimatch` | Moderate | No |
| `prosemirror-view` | High | No |

The audit output identified advisories for `glob` (GHSA-3g3m-2fjr-6pw4), `minimatch` (GHSA-g3hv-75wg-m249), and `prosemirror-view` (GHSA-c8x8-7fp4-3x9w). The other package entries also reported affected dependency ranges; their full `via` paths are emitted in later CI logs.

## Install warning

The same `npm install` run reported that `iframe-resizer@4.4.5` has a postinstall script (`node bin/post.js`) not yet covered by npm's `allowScripts` approval. CI continued and the frontend compile passed, but this warning needs an explicit compatibility review before production deployment. Do not approve install scripts blindly.

## Reproducibility gap

The repository currently has no `package-lock.json`. CI uses `npm install`, so transitive dependency resolution can change between runs. Before release, generate and review a lockfile with Node.js 24/npm, commit it, and change CI/local instructions to use `npm ci`.

## Release decision

- No critical advisory was present in the inspected report.
- High and moderate advisories remain unresolved; passing tests do not mean the dependency tree is vulnerability-free.
- Do not use `npm audit fix --force`: the Forge UI Kit packages have major-version compatibility constraints.
- Before release, inspect each current advisory and its fixed version against the actual installed dependency tree, update only compatible packages, regenerate the lockfile, and rerun all tests, JSX compilation, Forge lint, deployment and live acceptance tests.
- Re-run `npm audit` after the dependency tree is locked. This record is historical and must not be presented as the current audit result after package changes.
