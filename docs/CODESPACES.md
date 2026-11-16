# Open and run this project in Codespaces

This repository includes a Node 24 development container so the project can be worked on from a browser, including an Android phone.

1. Open the repository on GitHub and switch to the `codegeist/forge-foundation` branch.
2. Tap **Code** → **Codespaces** → **Create codespace on codegeist/forge-foundation**.
3. Wait for the browser editor to finish creating the environment and installing npm dependencies.
4. Open the terminal and run:

```bash
npm test
npx @forge/cli login
npx @forge/cli register
npx @forge/cli lint
```

5. Complete Atlassian sign-in in the browser when Forge CLI asks.
6. Register the app. Review the app ID written to `manifest.yml`.
7. Only after lint succeeds, deploy to the development environment:

```bash
npx @forge/cli deploy
npx @forge/cli install
```

Choose the development site `251fa04c84.atlassian.net` when prompted.

Do not paste Atlassian credentials, API tokens or secrets into chat or commit them to GitHub. Codespaces usage is subject to your GitHub account's included quota; stop/delete the codespace when finished.
