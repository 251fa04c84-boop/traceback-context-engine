# Atlassian upstream dependency security escalation

**Purpose:** request an upstream-compatible remediation or written mitigation for the current Forge SDK dependency audit. This document is a prepared escalation packet, not a submitted Atlassian support ticket.

## Observed dependency tree

The exact core CI lockfile audit reports **9 high, 4 moderate, 0 critical** findings.

The relevant installed stable Forge package versions are:
- `@forge/api@8.5.0`
- `@forge/bridge@7.3.0`
- `@forge/react@12.5.0`
- `@forge/manifest@13.9.0`

These are the latest stable versions surfaced by the npm package pages checked on 18 November 2026:
- [@forge/api](https://www.npmjs.com/package/@forge/api)
- [@forge/bridge](https://www.npmjs.com/package/@forge/bridge)
- [@forge/react](https://www.npmjs.com/package/@forge/react)
- [@forge/manifest](https://www.npmjs.com/package/@forge/manifest)

The two upstream compatibility conflicts are:

### 1. High: ProseMirror pin in Atlaskit/Forge UI dependencies

- Advisory: [GHSA-c8x8-7fp4-3x9w](https://github.com/advisories/GHSA-c8x8-7fp4-3x9w) / CVE-2026-104847.
- Patched `prosemirror-view`: **1.42.3 or later**.
- The current lockfile resolves `prosemirror-view@1.41.5`.
- `@atlaskit/editor-prosemirror@8.0.3` and `9.0.0` both pin `prosemirror-view@1.41.5`.
- Forge UI dependencies bring these packages into the app tree through `@forge/bridge@7.3.0` and `@forge/react@12.5.0`.

Request:
1. Publish compatible Forge/Atlaskit package versions that resolve to `prosemirror-view@1.42.3+` without requiring consumers to override an exact upstream pin; or
2. Provide written compatibility guidance and the accepted mitigation/extension path for apps whose dependency tree is pinned by Atlassian-owned packages.

### 2. Moderate: glob range in @forge/manifest

- Advisory: [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4).
- First patched `glob` release identified: **14.0.2**.
- `@forge/manifest@13.9.0` declares `glob@^13.0.0`, which excludes the patched 14.x line.
- `@forge/api@8.5.0` and `@forge/bridge@7.3.0` both bring `@forge/manifest@13.9.0` into the installed tree.

Request:
1. Publish a compatible `@forge/manifest` release with a patched supported `glob` dependency range; or
2. Provide a patched 13.x release if one is technically possible; or
3. Confirm in writing whether a scoped `glob@14` override is supported for the affected Forge toolchain and whether it is acceptable for Marketplace security review.

## Why automatic fixes were not applied

- npm's broad suggested fixes downgrade direct Forge SDK packages across major versions (for example, `@forge/bridge@5.5.0`, `@forge/react@11.4.0`, and `@forge/api@6.1.1`) relative to the app's declared `^7.3.0`, `^12.5.0`, and `^8.5.0` requirements.
- The isolated dependency candidate can reach zero npm audit findings using a scoped `glob@14.0.2` override, a `prosemirror-view@1.42.9` override, and a patched `minimatch` version. However, the `glob@14` override crosses `@forge/manifest@13.9.0`'s declared `^13.0.0` range, so it is not merged into the core app.
- Force-upgrading or silently overriding Atlassian-owned package pins would replace a visible vulnerability with an unverified compatibility risk.

## Evidence already collected

- The app uses Forge UI Kit React and Forge Bridge; the vulnerable ProseMirror packages are transitive dependencies, not direct application imports.
- The app does not implement a rich-text editor or expose a ProseMirror paste workflow.
- The advisory's described XSS requires attacker-provided HTML to be pasted into a ProseMirror editor. This narrows the apparent app-specific attack surface but does not clear the dependency finding or waive Marketplace requirements.
- Core CI and the refreshed Rovo candidate both pass automated tests and Forge CLI lint; the core development deployment succeeded. The dependency audit remains non-zero.
- Atlassian's [Marketplace cloud-app security requirements](https://developer.atlassian.com/platform/marketplace/security-requirements/) prohibit known high-severity third-party dependencies.
- Atlassian's [Marketplace Security Enforcement Policy](https://developer.atlassian.com/platform/marketplace/marketplace-security-enforcement-policy/) describes the extension process when remediation is genuinely blocked by an upstream dependency or platform-owned change.

## Requested response from Atlassian

Please confirm:
1. The earliest supported Forge SDK/Atlaskit release that removes the ProseMirror advisory from the dependency tree.
2. The earliest supported `@forge/manifest` release that resolves the `glob` advisory without a cross-major override.
3. Whether the current dependency tree is considered a platform-owned upstream blocker for Marketplace security review.
4. What evidence and process are required to request a remediation extension while the upstream packages are being fixed.

## Escalation channel

Use the official Atlassian Developer Support / Ecosystem Support process or the relevant Atlassian Developer Community topic. Do not include API tokens, passwords, private customer data, or production issue content in the request.

Related repository tracking: [Issue #6](https://github.com/251fa04c84-boop/traceback-context-engine/issues/6) and [Dependency audit](DEPENDENCY_AUDIT.md).
