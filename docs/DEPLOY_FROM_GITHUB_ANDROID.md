# Deploy TraceBack from GitHub Actions (phone-friendly)

This workflow avoids Codespaces and a local terminal. It is a manual, consent-gated workflow stored on the repository's default `main` branch. It checks out the selected app branch, registers the Forge app only if `manifest.yml` has no app ID, runs Forge lint, deploys to the development environment, and installs to the development Jira site.

**Workflow:** [Forge development deploy](https://github.com/251fa04c84-boop/traceback-context-engine/actions/workflows/forge-dev-deploy.yml)

## 1. Create an Atlassian Forge API token

1. Open [Atlassian API tokens](https://id.atlassian.com/manage-profile/security/api-tokens).
2. Choose **Create API token with scopes**.
3. Give it a label such as `traceback-forge-github-actions`.
4. Select **Forge** as the app.
5. Keep the recommended Forge scopes unless Atlassian's current UI says otherwise.
6. Create and copy the token. Do not paste it into chat, an issue, a commit, or a workflow file.

## 2. Add two GitHub Actions secrets

Open [Repository Actions secrets](https://github.com/251fa04c84-boop/traceback-context-engine/settings/secrets/actions).

Create these repository secrets:

| Secret name | Value |
| --- | --- |
| `FORGE_EMAIL` | The email address for the Atlassian account that owns the Forge app |
| `FORGE_API_TOKEN` | The Forge-scoped Atlassian API token you just created |

Never put the token in a normal repository variable or commit it to GitHub. Use the **Secrets** section.

## 3. Run the development deployment workflow

1. Open [Actions → Forge development deploy](https://github.com/251fa04c84-boop/traceback-context-engine/actions/workflows/forge-dev-deploy.yml).
2. Select **Run workflow**. Keep the workflow branch set to `main` (the workflow definition is on `main`).
3. Set **source_branch** to `codegeist/forge-foundation`.
4. If the manifest has no app ID, first check [Atlassian Developer Console → My apps](https://developer.atlassian.com/console/myapps/) for an existing TraceBack Context Engine registration. Select **confirm_no_existing_registration** only if no earlier registration exists. If it was registered before, stop and recover that existing app ID instead of registering a second time.
5. On the first registration only, select **accept_forge_terms**. This is your explicit approval for the workflow to accept Atlassian's Forge CLI terms and register the app once.
6. Select **confirm_readonly_scopes** only after reviewing the read-only scopes listed in the workflow. These allow Jira issue and linked Teamwork Graph reads. **Important:** Atlassian documents that installing apps with Teamwork Graph scopes requires an organization administrator because the scopes can access organization-wide data. If your Atlassian account is only a Jira site admin, ask an organization admin to run/approve this installation and grant the scopes.
7. Choose **install** if this app has never been installed on `251fa04c84.atlassian.net`; choose **upgrade** only if it is already installed there.
8. Leave **developer_space_id** empty unless the Forge CLI reports that you must choose a specific Developer Space. If it does, obtain the ID from the Atlassian Developer Console and run again only after checking whether registration already succeeded.

## 4. What the workflow does

- Verifies the two repository secrets are present.
- Installs the Node 24 project dependencies and commits the generated `package-lock.json` so later CI runs can use reproducible `npm ci` installs.
- Registers the Forge app only when `manifest.yml` has no `app.id`.
- Immediately commits the generated app ID back to `codegeist/forge-foundation`.
- Runs `forge lint`.
- Deploys to the Forge `development` environment.
- Installs or upgrades the app on the development Jira site using the selected mode.

The workflow does not deploy to production, publish a Marketplace listing, or expose a judge installation link. Teamwork Graph is currently a Forge Preview API: curated queries are supported for new apps, but schemas and behavior may change before general availability, with Atlassian's documented minimum one-month deprecation notice.

## Important recovery rule

If the workflow reports that registration succeeded but the commit/push of the generated app ID failed, **do not run registration again**. Stop and report the workflow run URL so the existing app ID can be recovered and written into the branch. Re-registering would create a different app ID and disconnect the repository from the first registration.

If the workflow fails at lint, deployment, or installation, share the run URL and error step. Do not disable Forge validation or bypass scope approvals to force a green result.

## After the development install

Complete every test in [docs/ACCEPTANCE_TESTS.md](ACCEPTANCE_TESTS.md), especially:
- Jira issue context and related Jira work in the new issue view.
- Real Teamwork Graph goal, deployment and pull-request results where connected.
- Empty, partial and unavailable graph states.
- Source links and non-causal suggested next checks.

Only after development acceptance passes should we deploy a production version and set distribution to **Sharing** in the Atlassian Developer Console. Atlassian requires a production deployment before generating a public installation link. The judge installation link is a separate final step; it is not the development-site install URL.
