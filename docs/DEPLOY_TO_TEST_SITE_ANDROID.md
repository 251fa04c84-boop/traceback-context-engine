# Deploy TraceBack to a separate free Atlassian test site from Android

## Why this is the next acceptance step

The only Jira site currently connected to this project is a production tenant. The app's core code is deployed there only in Forge development version 2.44.0; a fresh browser acceptance pass is not recorded. Do not use that tenant to approve new Teamwork Graph scopes or test the Rovo/MCP candidate.

Atlassian provides free cloud developer sites for testing. The traditional developer bundle includes Jira Software (5 users), Jira Service Management (1 agent), and Confluence (5 users). See [Atlassian's developer signup](https://go.atlassian.com/cloud-dev) and [official developer-site guidance](https://community.atlassian.com/learning/lesson/set-up-your-local-forge-development-environment).

## 1. Create a separate free developer site

1. Open [go.atlassian.com/cloud-dev](https://go.atlassian.com/cloud-dev) on your phone.
2. Sign in with the same Atlassian account that owns the registered TraceBack Forge app.
3. Create a **new** developer site. Do not select or reuse `251fa04c84.atlassian.net`.
4. Choose Jira Software as one of the products and complete the setup wizard.
5. Copy only the new site domain, for example `my-traceback-test.atlassian.net`. Do not send an API token or password.

The new developer site is for development/testing only. Keep real customer or personal production data out of it.

## 2. Run the isolated staging deployment from GitHub

The workflow is on the repository's default `main` branch, so it appears under GitHub Actions even though the app code lives on feature branches.

1. Open [GitHub Actions → Forge test-site deploy](https://github.com/251fa04c84-boop/traceback-context-engine/actions/workflows/forge-test-site-deploy.yml).
2. Tap **Run workflow**.
3. Select **`codegeist/forge-foundation`** as the source branch. The workflow intentionally permits only this maintained core Jira issue-context branch. It blocks the Rovo/MCP candidate until that branch is synchronized with core, dependency release gates are resolved, and its exact-head CI passes. Rovo/MCP will require a separate second acceptance pass.
4. Enter the new developer site domain exactly, such as `my-traceback-test.atlassian.net`.
5. Choose `install` for the first install. Choose `upgrade` only if TraceBack is already installed in the Forge **staging** environment on that test site.
6. Check both confirmations: that the target is a separate developer/test site and that it is not `251fa04c84.atlassian.net`.
7. Tap **Run workflow**.

This workflow uses the existing `FORGE_EMAIL` and `FORGE_API_TOKEN` repository secrets. It checks out pinned GitHub Actions releases, runs the core unit tests, syntax checks and frontend bundle compilation, then runs Forge CLI lint. It deploys to Forge **staging**, not the development environment already installed on the connected production tenant. It never registers/re-registers the app, never deploys to Forge production, and never uses `--confirm-scopes`.

## 3. Review Teamwork Graph permissions

The manifest requests these read-only scopes:

- `read:graph:issue:jira`
- `read:graph:goal:atlassian`
- `read:graph:deployment:external`
- `read:graph:pull-request:external`

After the test-site installation, an Atlassian organization administrator should review the app in Atlassian Administration / Connected apps and explicitly approve only the scopes needed for the test. Do not grant them on the connected production tenant. If the CLI install reports that administrator approval is required, stop; do not add a scope-confirmation flag or bypass the check.

See [docs/TEAMWORK_GRAPH_ADMIN_APPROVAL.md](TEAMWORK_GRAPH_ADMIN_APPROVAL.md) for the full request, data boundaries and current permission status. Allow about one minute after a scope change before repeating the app acceptance checks.

## 4. Live acceptance after installation

- Open a Jira issue in the **new issue view** and open the **Investigate** panel.
- Confirm Jira issue fields and linked Jira relationships.
- Check Teamwork Graph available, empty, partial and unavailable states. Do not invent or fabricate linked deployments, goals or pull requests.
- Open every source link and confirm it resolves to the actual source record.
- Confirm every suggested next check cites a real record and never claims that timing or a relationship proves cause.
- Enable Rovo on the test site, find **TraceBack Investigator**, and run a live investigation. Capture agent discovery, action invocation, evidence links and permission-boundary results.
- Do not claim the Atlassian MCP bonus unless the site administrator explicitly enables the Preview MCP exposure, OAuth consent is completed, and an external MCP client successfully invokes the tool.

## Important boundaries

- The staging deployment is separate from the existing Forge development installation.
- The workflow does not create the Atlassian developer site; you create it once in the browser.
- The workflow does not approve Teamwork Graph scopes.
- The workflow does not create a judge installation link or publish the app.
- The public judge link still requires the separate production distribution process after acceptance. Do not start that process yet.
