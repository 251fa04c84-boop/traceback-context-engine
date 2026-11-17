'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveActionIssueKey, issueKeyFromContextUrl } = require('../src/domain/action-context');

test('accepts a valid issue key supplied by the user when no active issue context exists', () => {
  assert.equal(resolveActionIssueKey('DEMO-9', undefined), 'DEMO-9');
});

test('uses the active Jira issue key when the requested key is omitted', () => {
  assert.equal(resolveActionIssueKey('', 'PAY-123'), 'PAY-123');
});

test('recovers the active issue key from Atlassian context URL when the key field is absent', () => {
  assert.equal(resolveActionIssueKey('', undefined, 'https://example.atlassian.net/browse/PAY-123'), 'PAY-123');
});

test('recovers the issue key from the context URL when the documented key field is non-string', () => {
  assert.equal(resolveActionIssueKey('', 1, 'https://example.atlassian.net/browse/PAY-123'), 'PAY-123');
});

test('rejects malformed issue keys before any Jira request can be made', () => {
  assert.throws(() => resolveActionIssueKey('https://evil.example/DEMO-9', undefined), /valid Jira issue key/i);
  assert.throws(() => resolveActionIssueKey('DEMO-0', undefined), /valid Jira issue key/i);
});

test('rejects an action input that conflicts with the active Jira issue context', () => {
  assert.throws(() => resolveActionIssueKey('DEMO-9', 'PAY-123'), /must match the active Jira issue context/i);
});

test('rejects an action input that conflicts with the active Jira context URL', () => {
  assert.throws(() => resolveActionIssueKey('DEMO-9', undefined, 'https://example.atlassian.net/browse/PAY-123'), /must match the active Jira issue context/i);
});

test('rejects inconsistent active issue key and URL context', () => {
  assert.throws(() => resolveActionIssueKey('', 'DEMO-9', 'https://example.atlassian.net/browse/PAY-123'), /active Jira issue context is inconsistent/i);
});

test('rejects unsafe or malformed context URLs', () => {
  assert.equal(issueKeyFromContextUrl('http://example.atlassian.net/browse/PAY-123'), '');
  assert.equal(issueKeyFromContextUrl('https://example.atlassian.net/projects/PAY/issues/123'), '');
  assert.equal(issueKeyFromContextUrl('https://example.atlassian.net/browse/not-a-key'), '');
  assert.equal(issueKeyFromContextUrl('https://user:pass@example.atlassian.net/browse/PAY-123'), '');
});

test('rejects malformed active issue context instead of trusting action input', () => {
  assert.throws(() => resolveActionIssueKey('DEMO-9', 'not-a-key'), /active Jira issue context is invalid/i);
});

test('requires an issue key when neither input nor active context is available', () => {
  assert.throws(() => resolveActionIssueKey(undefined, undefined), /Jira issue key is required/i);
});
