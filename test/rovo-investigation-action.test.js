'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { runTracebackInvestigationAction } = require('../src/domain/rovo-investigation-action');
const { resolveActionIssueKey } = require('../src/domain/action-context');

function route(strings, ...values) {
  return strings.reduce((result, part, index) => result + part + (values[index] ?? ''), '');
}

function dependencies(overrides = {}) {
  const calls = { asUser: 0, asApp: 0, jira: [], graph: [] };
  const api = {
    asUser() {
      calls.asUser += 1;
      return {
        async requestJira(url, options) {
          calls.jira.push({ url, options });
          return { ok: true };
        }
      };
    },
    asApp() {
      calls.asApp += 1;
      throw new Error('Rovo action must not use app-level authorization.');
    }
  };
  const defaults = {
    api,
    route,
    fetchJiraIssue: async (request, timeoutMs) => {
      assert.equal(timeoutMs, 8000);
      await request();
      return { id: '10001', key: 'PAY-123' };
    },
    defaultJiraRequestTimeoutMs: 8000,
    resolveActionIssueKey,
    normalizeIssue: (issue) => ({
      ...issue,
      relatedWorkItems: [{ key: 'PAY-122', status: 'In Progress' }]
    }),
    fetchTeamworkGraphEvidence: async (client, issueId, cloudId) => {
      calls.graph.push({ client, issueId, cloudId });
      return { status: 'available', goals: [], deployments: [], pullRequests: [] };
    },
    buildInvestigationLeads: (input) => [{
      sourceType: 'jiraIssue',
      sourceId: input.relatedWorkItems[0].key
    }],
    buildIncidentTimeline: (input) => [{
      sourceType: 'jiraIssue',
      sourceId: input.issue.key,
      graphStatus: input.teamworkGraph.status
    }]
  };
  return { dependencies: { ...defaults, ...overrides }, calls };
}

test('runs the action as the invoking user and passes the documented Jira context to Graph', async () => {
  const { dependencies: deps, calls } = dependencies();
  const result = await runTracebackInvestigationAction({
    ...deps,
    payload: {
      context: {
        cloudId: 'cloud-123',
        jira: { url: 'https://example.atlassian.net/browse/PAY-123' }
      }
    }
  });

  assert.equal(calls.asUser, 1);
  assert.equal(calls.asApp, 0);
  assert.equal(calls.jira.length, 1);
  assert.match(calls.jira[0].url, /\/issue\/PAY-123\?/);
  assert.deepEqual(calls.jira[0].options, { headers: { Accept: 'application/json' } });
  assert.equal(calls.graph[0].client, deps.api);
  assert.equal(calls.graph[0].issueId, '10001');
  assert.equal(calls.graph[0].cloudId, 'cloud-123');
  assert.deepEqual(result.investigationLeads, [{ sourceType: 'jiraIssue', sourceId: 'PAY-122' }]);
  assert.deepEqual(result.incidentTimeline, [{
    sourceType: 'jiraIssue',
    sourceId: 'PAY-123',
    graphStatus: 'available'
  }]);
  assert.match(result.accessBoundary, /invoking user/);
  assert.match(result.evidenceBoundary, /not proof of causation/);
});

test('uses an explicit issue key only when it matches active Jira context', async () => {
  const { dependencies: deps, calls } = dependencies();
  await runTracebackInvestigationAction({
    ...deps,
    payload: {
      issueKey: 'PAY-123',
      context: { jira: { issueKey: 'PAY-123' }, cloudId: 'cloud-123' }
    }
  });
  assert.equal(calls.jira.length, 1);
  assert.match(calls.jira[0].url, /\/issue\/PAY-123\?/);
});

test('rejects a mismatched issue key before making any Jira or Graph request', async () => {
  const { dependencies: deps, calls } = dependencies();
  await assert.rejects(
    runTracebackInvestigationAction({
      ...deps,
      payload: {
        issueKey: 'PAY-999',
        context: { jira: { issueKey: 'PAY-123' }, cloudId: 'cloud-123' }
      }
    }),
    /must match the active Jira issue context/i
  );
  assert.equal(calls.asUser, 0);
  assert.equal(calls.jira.length, 0);
  assert.equal(calls.graph.length, 0);
});

test('requires a valid issue key when active issue context is absent', async () => {
  const { dependencies: deps, calls } = dependencies();
  await assert.rejects(
    runTracebackInvestigationAction({ ...deps, payload: {} }),
    /Jira issue key is required/i
  );
  assert.equal(calls.asUser, 0);
  assert.equal(calls.jira.length, 0);
  assert.equal(calls.graph.length, 0);
});

test('propagates Jira read failures without attempting Graph access', async () => {
  const { dependencies: deps, calls } = dependencies({
    fetchJiraIssue: async () => { throw new Error('Jira read failed'); }
  });
  await assert.rejects(
    runTracebackInvestigationAction({
      ...deps,
      payload: { issueKey: 'PAY-123' }
    }),
    /Jira read failed/
  );
  assert.equal(calls.graph.length, 0);
});
