'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { fetchJiraIssue } = require('../src/services/jira-issue');

test('reads the Jira response body within the request deadline', async () => {
  const issue = { id: '10006', key: 'DEMO-9' };
  const result = await fetchJiraIssue(async () => ({
    ok: true,
    status: 200,
    async json() { return issue; }
  }), 100);
  assert.deepEqual(result, issue);
});

test('times out when Jira response headers arrive but the response body never settles', async () => {
  await assert.rejects(
    fetchJiraIssue(async () => ({
      ok: true,
      status: 200,
      json() { return new Promise(() => {}); }
    }), 10),
    /Jira request timed out/i
  );
});

test('does not parse a Jira 404 response body', async () => {
  await assert.rejects(
    fetchJiraIssue(async () => ({
      ok: false,
      status: 404,
      json() { throw new Error('must not parse'); }
    }), 100),
    /Issue not found or you do not have permission/i
  );
});

test('does not expose Jira upstream response-body errors', async () => {
  await assert.rejects(
    fetchJiraIssue(async () => ({
      ok: true,
      status: 200,
      async json() { throw new Error('sensitive upstream payload'); }
    }), 100),
    /unreadable issue response/i
  );
});

test('returns a safe message when the Jira request itself rejects', async () => {
  await assert.rejects(
    fetchJiraIssue(async () => { throw new Error('private upstream detail'); }, 100),
    /Jira request failed/i
  );
});

test('does not parse a redirect response even if its ok flag is inconsistent', async () => {
  await assert.rejects(
    fetchJiraIssue(async () => ({
      ok: true,
      status: 302,
      json() { throw new Error('must not parse redirect body'); }
    }), 100),
    /Jira request failed \(302\)/i
  );
});

test('rejects non-success statuses before reading their response body', async () => {
  for (const status of [204, 304, 401, 429, 500]) {
    await assert.rejects(
      fetchJiraIssue(async () => ({
        ok: true,
        status,
        json() { throw new Error('must not parse non-success body'); }
      }), 100),
      new RegExp('Jira request failed \\(' + status + '\\)')
    );
  }
});
