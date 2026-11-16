'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { getIssueKeyFromProductContext } = require('../src/domain/incident');

test('reads the active Jira issue key from the UI Kit product extension context', () => {
  assert.equal(typeof getIssueKeyFromProductContext, 'function', 'getIssueKeyFromProductContext must be implemented');
  assert.equal(
    getIssueKeyFromProductContext({ extension: { issue: { key: 'DEMO-7' } } }),
    'DEMO-7'
  );
});

test('supports a platform-context issue-key fallback and trims surrounding whitespace', () => {
  assert.equal(typeof getIssueKeyFromProductContext, 'function', 'getIssueKeyFromProductContext must be implemented');
  assert.equal(
    getIssueKeyFromProductContext({ platformContext: { issueKey: ' DEMO-8 ' } }),
    'DEMO-8'
  );
});

test('rejects missing or malformed issue keys from context', () => {
  assert.equal(typeof getIssueKeyFromProductContext, 'function', 'getIssueKeyFromProductContext must be implemented');
  assert.equal(getIssueKeyFromProductContext(undefined), null);
  assert.equal(getIssueKeyFromProductContext({ extension: { issue: {} } }), null);
  assert.equal(getIssueKeyFromProductContext({ extension: { issue: { key: 'DEMO-0' } } }), null);
});
