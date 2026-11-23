# Deploy TraceBack to the Forge development environment from GitHub Actions

This phone-friendly workflow can register the existing TraceBack Forge app only when its manifest has no app ID, run Forge lint, and deploy code to the Forge **development environment**.

**It does not install or upgrade the app on any Jira site.** It does not grant or approve Teamwork Graph scopes, deploy to Forge production, or change a production tenant.

**Workflow:** [Forge development deploy (no Jira site install)](https://github.com/251fa04c84-boop/traceback-context-engine/actions/workflows/forge-dev-deploy.yml)

## 1. GitHub Actions secrets

The workflow expects two repository secrets:

| Secret name | Value |
| --- | --- |
| `FORGE_EMAIL` | Email address for the Atlassian account that owns the registered Forge app |
| `FORGE_API_TOKEN` | Forge-scoped Atlassian API token |

If the secrets are not already configured, an authorized repository maintainer must add them through [Repository Actions secrets](https://github.com/251fa04c84-boop/traceback-context-engine/settings/secrets/actions). Never paste the token into chat, an issue, a commit, a workflow input, or a source file.

## 2. Manual development-environment deployment

This workflow is manual. It is not triggered by pull-request CI.

1. Open [Actions → Forge development deploy](https://github.com/251fa04c84-boop/traceback-context-engine/actions/workflows/forge-dev-deploy.yml).
2. Select **Run workflow** only when a development-environment code deployment is explicitly required.
3. Keep the workflow definition branch on `main`.
4. Set `source_branch` to `codegeist/forge-foundation`; the workflow rejects other source branches.
5. If `manifest.yml` already contains `app.id`, the workflow skips registration. Do not re-register an existing app.
6. Only if the manifest has no app ID, first inspect [Atlassian Developer Console → My apps](https://developer.atlassian.com/console/myapps/). Confirm the app has never been registered before selecting `confirm_no_existing_registration` and `accept_forge_terms`. If an earlier registration exists, stop and recover its existing app ID instead.

There is no target-site, install-mode, or scope-approval input. The workflow has no `forge install` or `forge install --upgrade` command.

## 3. What the workflow does

- Verifies the source branch and the existing Forge credentials.
- Installs the committed lockfile with `npm ci` when present.
- Registers the Forge app only if no `app.id` exists and the explicit registration confirmations are supplied.
- Runs Forge CLI lint.
- Deploys only to the Forge `development` environment.
- Does not install or upgrade the app on any Jira or Confluence site.

A successful run is development-environment deployment evidence only. It is not proof of Jira panel rendering, Rovo discovery, Teamwork Graph access, MCP OAuth, or two-user permission isolation.

## 4. Production and staging boundaries

- `251fa04c84.atlassian.net` is the production/earlier TraceBack tenant. It is not a development or test target. This workflow no longer contains an installation command for it.
- The connected staging tenant is `brand7.atlassian.net`. Read-only inspection on 23 November 2026 found Jira project `KAN` with zero issues. A separate Teamwork Graph connector read of Confluence space `SD` returned four page targets; that does not prove Forge runtime access.
- The separate staging workflow is a manual, user/admin-controlled gate. This automation will not dispatch it, install/upgrade the app, create test records, or approve scopes.

Before any future staging runtime acceptance, the staging owner must provide a genuine non-production Jira incident with authentic linked Teamwork Graph records, two approved test users with different access to at least one linked record, and confirmation that the four read-only Graph scopes are approved for the staging installation. Do not fabricate records or use production data.

See [docs/STAGING_READINESS_2026-11-23.md](STAGING_READINESS_2026-11-21.md), [docs/TEAMWORK_GRAPH_ADMIN_APPROVAL.md](TEAMWORK_GRAPH_ADMIN_APPROVAL.md), and [docs/DEMO_SCRIPT.md](DEMO_SCRIPT.md) for the current acceptance boundary and judge-demo plan.
