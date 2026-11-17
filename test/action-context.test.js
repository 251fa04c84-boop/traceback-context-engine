'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveActionIssueKey } = require('../src/domain/action-context');

test('accepts a valid issue key supplied by the user when no active issue context exists', () => {
  assert.equal(resolveActionIssueKey('DEMO-9', undefined), 'DEMO-9');
});

test('uses the active Jira issue context when the requested key is omitted', () => {
  assert.equal(resolveActionIssueKey('', 'PAY-123'), 'PAY-123');
});

test('rejects malformed issue keys before any Jira request can be made', () => {
  assert.throws(() => resolveActionIssueKey('https://evil.example/DEMO-9', undefined), /valid Jira issue key/i);
  assert.throws(() => resolveActionIssueKey('DEMO-0', undefined), /valid Jira issue key/i);
});

test('rejects an action input that conflicts with the active Jira issue context', () => {
  assert.throws(() => resolveActionIssueKey('DEMO-9', 'PAY-123'), /must match the active Jira issue context/i);
});

test('rejects malformed active issue context instead of trusting action input', () => {
  assert.throws(() => resolveActionIssueKey('DEMO-9', 'not-a-key'), /active Jira issue context is invalid/i);
});

test('requires an issue key when neither input nor active context is available', () => {
  assert.throws(() => resolveActionIssueKey(undefined, undefined), /Jira issue key is required/i);
});
