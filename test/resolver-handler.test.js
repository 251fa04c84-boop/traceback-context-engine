'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const path = require('node:path');

const CLOUD_ID = 'c0e47565-a2b1-472f-bd30-5c1e3684bb1e';
const ISSUE_CONTEXT = { extension: { issue: { key: 'DEMO-9' } }, cloudId: CLOUD_ID };

function loadResolverHandler({ jiraResponse, graphResponse, throwGraph = false } = {}) {
  const calls = { jira: [], graph: [], asUser: 0 };
  class FakeResolver {
    constructor() { this.definitions = {}; }
    define(name, handler) { this.definitions[name] = handler; }
    getDefinitions() { return this.definitions; }
  }
  const api = {
    route(strings, ...values) {
      return strings.reduce((result, part, index) => result + part + (values[index] ?? ''), '');
    },
    asUser() {
      calls.asUser += 1;
      return {
        async requestJira(url, options) {
          calls.jira.push({ url, options });
          return jiraResponse || {
            status: 200,
            ok: true,
            async json() {
              return {
                id: '10006',
                key: 'DEMO-9',
                fields: {
                  summary: 'Checkout investigation',
                  description: 'Payment retry failures',
                  status: { name: 'Open' },
                  priority: { name: 'High' },
                  issuetype: { name: 'Bug' },
                  created: '2026-11-16T10:00:00Z',
                  updated: '2026-11-16T10:30:00Z',
                  project: { key: 'DEMO' },
                  issuelinks: []
                }
              };
            }
          };
        },
        async requestTeamworkGraph(query, variables) {
          calls.graph.push({ query, variables });
          if (throwGraph) throw new Error('private Graph upstream error');
          return graphResponse || {
            data: {
              jiraWorkItemGoals: { edges: [], pageInfo: { hasNextPage: false, endCursor: null } },
              jiraWorkItemLinkedExternalDeployments: { edges: [], pageInfo: { hasNextPage: false, endCursor: null } },
              jiraWorkItemLinkedExternalPullRequests: { edges: [], pageInfo: { hasNextPage: false, endCursor: null } }
            }
          };
        }
      };
    }
  };

  const resolverPath = require.resolve('../src/index.js');
  delete require.cache[resolverPath];
  const originalLoad = Module._load;
  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === '@forge/resolver') return { default: FakeResolver };
    if (request === '@forge/api') return api;
    return originalLoad.call(this, request, parent, isMain);
  };
  let handler;
  try {
    handler = require('../src/index.js').handler.getIssueContext;
  } finally {
    Module._load = originalLoad;
    delete require.cache[resolverPath];
  }
  return { handler, calls };
}

test('resolver handler fetches only the active Jira issue and returns normalized context', async () => {
  const { handler, calls } = loadResolverHandler();
  const result = await handler({ payload: { issueKey: 'DEMO-9' }, context: ISSUE_CONTEXT });
  assert.equal(result.key, 'DEMO-9');
  assert.equal(result.summary, 'Checkout investigation');
  assert.equal(result.status, 'Open');
  assert.equal(result.priority, 'High');
  assert.equal(result.teamworkGraph.status, 'empty');
  assert.equal(calls.jira.length, 1);
  assert.match(calls.jira[0].url, /DEMO-9/);
  assert.equal(calls.jira[0].options.headers.Accept, 'application/json');
});

test('resolver rejects cross-issue payload targeting before any Jira or Graph request', async () => {
  const { handler, calls } = loadResolverHandler();
  await assert.rejects(
    handler({ payload: { issueKey: 'DEMO-10' }, context: ISSUE_CONTEXT }),
    /only load the Jira issue where it is currently open/i
  );
  assert.equal(calls.jira.length, 0);
  assert.equal(calls.graph.length, 0);
});

test('resolver rejects malformed issue keys before calling Jira', async () => {
  const { handler, calls } = loadResolverHandler();
  await assert.rejects(
    handler({ payload: { issueKey: 'https://evil.example' }, context: {} }),
    /valid active Jira issue key/i
  );
  assert.equal(calls.jira.length, 0);
});

test('resolver reports inaccessible or missing Jira issues with a safe 404 message', async () => {
  const { handler, calls } = loadResolverHandler({
    jiraResponse: { status: 404, ok: false, async json() { throw new Error('must not parse'); } }
  });
  await assert.rejects(
    handler({ payload: { issueKey: 'DEMO-9' }, context: ISSUE_CONTEXT }),
    /Issue not found or you do not have permission/i
  );
  assert.equal(calls.jira.length, 1);
  assert.equal(calls.graph.length, 0);
});

test('resolver reports non-OK Jira responses without leaking upstream response bodies', async () => {
  const { handler } = loadResolverHandler({
    jiraResponse: { status: 503, ok: false, async json() { throw new Error('must not parse'); } }
  });
  await assert.rejects(
    handler({ payload: { issueKey: 'DEMO-9' }, context: ISSUE_CONTEXT }),
    /Jira request failed \(503\)/
  );
});

test('resolver still returns Jira context when the optional Teamwork Graph API fails', async () => {
  const { handler } = loadResolverHandler({ throwGraph: true });
  const result = await handler({ payload: { issueKey: 'DEMO-9' }, context: ISSUE_CONTEXT });
  assert.equal(result.key, 'DEMO-9');
  assert.equal(result.teamworkGraph.status, 'unavailable');
  assert.doesNotMatch(result.teamworkGraph.warning, /private Graph upstream error/);
});

test('resolver queries Teamwork Graph using the numeric Jira issue id and site cloud id', async () => {
  const { handler, calls } = loadResolverHandler();
  await handler({ payload: { issueKey: 'DEMO-9' }, context: ISSUE_CONTEXT });
  assert.equal(calls.graph.length, 1);
  assert.equal(
    calls.graph[0].variables.id,
    `ari:cloud:jira:${CLOUD_ID}:issue/10006`
  );
});

test('resolver uses current-user API context for both Jira and Teamwork Graph reads', async () => {
  const { handler, calls } = loadResolverHandler();
  await handler({ payload: { issueKey: 'DEMO-9' }, context: ISSUE_CONTEXT });
  assert.equal(calls.asUser, 2);
  assert.equal(calls.jira.length, 1);
  assert.equal(calls.graph.length, 1);
});

test('resolver requests only the fields needed for the issue context view', async () => {
  const { handler, calls } = loadResolverHandler();
  await handler({ payload: { issueKey: 'DEMO-9' }, context: ISSUE_CONTEXT });
  const requested = new URLSearchParams(calls.jira[0].url.split('?')[1]).get('fields');
  assert.equal(
    requested,
    'summary,description,status,priority,issuetype,created,updated,project,issuelinks'
  );
});

test('resolver handles missing site cloud context without failing Jira issue rendering', async () => {
  const { handler } = loadResolverHandler();
  const result = await handler({
    payload: { issueKey: 'DEMO-9' },
    context: { extension: { issue: { key: 'DEMO-9' } } }
  });
  assert.equal(result.key, 'DEMO-9');
  assert.equal(result.teamworkGraph.status, 'unavailable');
});
