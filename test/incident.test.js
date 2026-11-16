'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { isValidIssueKey, normalizeIssue, plainText } = require('../src/domain/incident');

test('normalizes real Jira issue fields without inventing operational evidence', () => {
  const result = normalizeIssue({
    key: 'TCE-7',
    fields: {
      summary: 'Checkout errors increased',
      description: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Payments fail intermittently' }] }] },
      issuetype: { name: 'Incident' },
      status: { name: 'In Progress' },
      priority: { name: 'High' },
      project: { key: 'TCE' },
      created: '2026-11-16T10:00:00.000+0000',
      updated: '2026-11-16T10:30:00.000+0000'
    }
  });

  assert.equal(result.key, 'TCE-7');
  assert.equal(result.summary, 'Checkout errors increased');
  assert.match(result.description, /Payments fail intermittently/);
  assert.deepEqual(result.evidenceSources, ['Jira issue fields']);
  assert.deepEqual(result.connectedOperationalSources, []);
  assert.match(result.assessment, /cannot yet be verified/i);
});

test('rejects malformed issue payloads', () => {
  assert.throws(() => normalizeIssue(null), /valid Jira issue/i);
  assert.throws(() => normalizeIssue({ key: 'TCE-1' }), /valid Jira issue/i);
});

test('plainText handles null, strings, arrays and nested Atlassian document text', () => {
  assert.equal(plainText(null), '');
  assert.equal(plainText('hello'), 'hello');
  assert.equal(plainText(['a', 'b']), 'a b');
  assert.equal(plainText({ text: 'nested' }), 'nested');
});

test('accepts valid Jira issue keys and rejects malformed or unsafe values', () => {
  assert.equal(isValidIssueKey('TCE-7'), true);
  assert.equal(isValidIssueKey('TEAM_1-1234567890'), true);
  assert.equal(isValidIssueKey(' tce-7 '), false);
  assert.equal(isValidIssueKey('TCE-0'), true);
  assert.equal(isValidIssueKey('TCE-12345678901'), false);
  assert.equal(isValidIssueKey('TCE-7?fields=project'), false);
  assert.equal(isValidIssueKey('TCE/7'), false);
  assert.equal(isValidIssueKey(null), false);
});
