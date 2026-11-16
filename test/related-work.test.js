'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  normalizeRelatedIssues
} = require('../src/domain/incident');

test('normalizes outward-linked Jira work items with a safe same-site route', () => {
  const result = normalizeRelatedIssues([
    {
      type: { name: 'Relates', outward: 'relates to', inward: 'relates to' },
      outwardIssue: {
        key: 'DEMO-8',
        fields: {
          summary: 'Automatically update linked requests',
          status: { name: 'Waiting for support' },
          issuetype: { name: 'IT Help' },
          priority: { name: 'Medium' }
        }
      }
    }
  ]);

  assert.deepEqual(result, [{
    key: 'DEMO-8',
    summary: 'Automatically update linked requests',
    status: 'Waiting for support',
    issueType: 'IT Help',
    priority: 'Medium',
    relationship: 'relates to',
    url: '/browse/DEMO-8'
  }]);
});

test('normalizes inward-linked Jira work items using the inward relationship label', () => {
  const result = normalizeRelatedIssues([
    {
      type: { name: 'Blocks', outward: 'blocks', inward: 'is blocked by' },
      inwardIssue: {
        key: 'PAY-21',
        fields: {
          summary: 'Payment retry handler',
          status: { name: 'In Progress' },
          issuetype: { name: 'Bug' },
          priority: { name: 'High' }
        }
      }
    }
  ]);

  assert.deepEqual(result, [{
    key: 'PAY-21',
    summary: 'Payment retry handler',
    status: 'In Progress',
    issueType: 'Bug',
    priority: 'High',
    relationship: 'is blocked by',
    url: '/browse/PAY-21'
  }]);
});

test('ignores malformed or unsafe linked issue keys and missing issue objects', () => {
  const result = normalizeRelatedIssues([
    { type: { outward: 'relates to' }, outwardIssue: { key: 'https://evil.example/issue/1', fields: { summary: 'Unsafe' } } },
    { type: { outward: 'relates to' }, outwardIssue: { key: 'DEMO-0', fields: { summary: 'Invalid key' } } },
    { type: { outward: 'relates to' }, inwardIssue: null },
    null
  ]);

  assert.deepEqual(result, []);
});

test('returns an empty list for missing Jira issue links', () => {
  assert.deepEqual(normalizeRelatedIssues(undefined), []);
  assert.deepEqual(normalizeRelatedIssues(null), []);
  assert.deepEqual(normalizeRelatedIssues('not-an-array'), []);
});
