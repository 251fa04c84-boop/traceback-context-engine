'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { getIssueKeyFromProductContext, getRetryIssueKey } = require('../src/domain/incident');

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

test('uses the active context issue key for retry before falling back to the last attempted key', () => {
  assert.equal(typeof getRetryIssueKey, 'function', 'getRetryIssueKey must be implemented');
  assert.equal(
    getRetryIssueKey({ extension: { issue: { key: 'DEMO-9' } } }, 'DEMO-8'),
    'DEMO-9'
  );
  assert.equal(getRetryIssueKey(undefined, 'DEMO-8'), 'DEMO-8');
  assert.equal(getRetryIssueKey(undefined, 'not-an-issue'), null);
});
