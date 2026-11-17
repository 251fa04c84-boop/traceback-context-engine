'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const workflow = fs.readFileSync(
  path.join(__dirname, '..', '.github', 'workflows', 'forge-dev-deploy.yml'),
  'utf8'
);

test('Forge install workflow never automatically confirms or consents to scopes', () => {
  assert.doesNotMatch(workflow, /--confirm-scopes/);
});

test('deployment requires explicit confirmation of prior organization-admin scope approval', () => {
  assert.match(workflow, /confirm_admin_scope_approval:/);
  assert.match(workflow, /CONFIRM_ADMIN_SCOPE_APPROVAL/);
  assert.match(workflow, /CONFIRM_ADMIN_SCOPE_APPROVAL" != "true"/);
});

test('deployment requires a separate explicit target-site installation confirmation', () => {
  assert.match(workflow, /confirm_development_site_install:/);
  assert.match(workflow, /CONFIRM_DEVELOPMENT_SITE_INSTALL" != "true"/);
});

test('manual deployment is restricted to the intended Forge application branch', () => {
  assert.match(workflow, /SOURCE_BRANCH" != "codegeist\/forge-foundation"/);
});

test('push events only validate the workflow definition and cannot deploy', () => {
  assert.match(workflow, /validate-workflow-on-push:/);
  assert.match(workflow, /if: github\.event_name == 'push'/);
  assert.match(workflow, /register-lint-deploy-install:/);
  assert.match(workflow, /if: github\.event_name == 'workflow_dispatch'/);
});
