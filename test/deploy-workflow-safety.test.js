'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const workflow = fs.readFileSync(
  path.join(__dirname, '..', '.github', 'workflows', 'forge-dev-deploy.yml'),
  'utf8'
);

test('Forge development deployment pins GitHub Actions and disables package-manager caching', () => {
  assert.match(workflow, /actions\/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1/);
  assert.match(workflow, /actions\/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1/);
  assert.match(workflow, /package-manager-cache: false/);
  assert.doesNotMatch(workflow, /uses: actions\/(?:checkout|setup-node)@v\d/);
});

test('Forge development deployment only deploys to the development environment and never installs a site', () => {
  assert.match(workflow, /deploy --non-interactive -e development/);
  assert.match(workflow, /does not install or upgrade the app on any Jira site/i);
  assert.doesNotMatch(workflow, /npx\s+--yes\s+@forge\/cli@[^\s]+\s+install\b/i);
  assert.doesNotMatch(workflow, /--site\s/);
  assert.doesNotMatch(workflow, /--upgrade\b/);
  assert.doesNotMatch(workflow, /confirm_development_site_install|install_mode/);
});

test('Forge development deployment never auto-consents to or claims administrator scope approval', () => {
  assert.doesNotMatch(workflow, /--confirm-scopes/);
  assert.doesNotMatch(workflow, /confirm_admin_scope_approval|CONFIRM_ADMIN_SCOPE_APPROVAL/);
});

test('registration requires explicit confirmation only when no app ID exists', () => {
  assert.match(workflow, /confirm_no_existing_registration:/);
  assert.match(workflow, /CONFIRM_NO_EXISTING_REGISTRATION/);
  assert.match(workflow, /ACCEPT_FORGE_TERMS/);
  assert.match(workflow, /if grep -Eq '\^  id:' manifest\.yml/);
});

test('manual development deployment is restricted to the intended Forge application branch', () => {
  assert.match(workflow, /SOURCE_BRANCH" != "codegeist\/forge-foundation"/);
});

test('push events only validate the workflow definition and cannot deploy', () => {
  assert.match(workflow, /validate-workflow-on-push:/);
  assert.match(workflow, /if: github\.event_name == 'push'/);
  assert.match(workflow, /register-lint-deploy-development:/);
  assert.match(workflow, /if: github\.event_name == 'workflow_dispatch'/);
});

const testSiteWorkflow = fs.readFileSync(
  path.join(__dirname, '..', '.github', 'workflows', 'forge-test-site-deploy.yml'),
  'utf8'
);

test('test-site deployment is pinned to immutable GitHub Actions releases', () => {
  assert.match(testSiteWorkflow, /actions\/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1/);
  assert.match(testSiteWorkflow, /actions\/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1/);
  assert.match(testSiteWorkflow, /package-manager-cache: false/);
  assert.doesNotMatch(testSiteWorkflow, /uses: actions\/(?:checkout|setup-node)@v\d/);
});

test('test-site deployment is restricted to the maintained core branch', () => {
  assert.match(testSiteWorkflow, /options:\s*\n\s*- codegeist\/forge-foundation/);
  assert.doesNotMatch(testSiteWorkflow, /codegeist\/rovo-investigator/);
});

test('test-site deployment rejects production and any site other than the connected staging tenant', () => {
  assert.match(testSiteWorkflow, /type: choice[\s\S]*brand7\.atlassian\.net/);
  assert.match(testSiteWorkflow, /TARGET_SITE" == "251fa04c84\.atlassian\.net"/);
  assert.match(testSiteWorkflow, /TARGET_SITE" != "brand7\.atlassian\.net"/);
  assert.match(testSiteWorkflow, /CONFIRM_TEST_SITE_INSTALL" != "true"/);
  assert.match(testSiteWorkflow, /CONFIRM_NOT_PRODUCTION_SITE" != "true"/);
});

test('test-site deployment never auto-consents to Forge scopes or targets production', () => {
  assert.doesNotMatch(testSiteWorkflow, /(?:deploy|install)[^\n]*--confirm-scopes/);
  assert.doesNotMatch(testSiteWorkflow, /-e production/);
  assert.match(testSiteWorkflow, /deploy --non-interactive -e staging/);
  assert.match(testSiteWorkflow, /install --site "\$TARGET_SITE" --product jira --non-interactive -e staging/);
});

test('test-site deployment runs tests and frontend checks before Forge lint and deployment', () => {
  const tests = testSiteWorkflow.indexOf('run: npm test');
  const syntax = testSiteWorkflow.indexOf('run: npm run lint:syntax');
  const frontend = testSiteWorkflow.indexOf('run: npm run lint:frontend');
  const lint = testSiteWorkflow.indexOf('run: npx --yes @forge/cli@15.1.0 lint');
  const deploy = testSiteWorkflow.indexOf('deploy --non-interactive -e staging');
  assert.ok(tests >= 0 && syntax > tests && frontend > syntax && lint > frontend && deploy > lint);
});

const ciWorkflow = fs.readFileSync(
  path.join(__dirname, '..', '.github', 'workflows', 'ci.yml'),
  'utf8'
);

test('CI may deploy the Forge development environment but never installs or upgrades a site', () => {
  assert.match(ciWorkflow, /deploy --non-interactive -e development/);
  assert.doesNotMatch(ciWorkflow, /npx\s+--yes\s+@forge\/cli@[^\s]+\s+install\b/i);
  assert.doesNotMatch(ciWorkflow, /--site\s+251fa04c84\.atlassian\.net/i);
  assert.doesNotMatch(ciWorkflow, /--upgrade\s+all/i);
});

test('CI deployment step is explicitly documented as site-install-free', () => {
  assert.match(ciWorkflow, /Deploy development environment without installing or upgrading any site/);
  assert.match(ciWorkflow, /Detect app changes for development deployment only/);
});
