'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');

const CLOUD_ID = 'c0e47565-a2b1-472f-bd30-5c1e3684bb1e';

function defaultJiraResponse() {
  return {
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
          issuelinks: [{
            outwardIssue: {
              key: 'PAY-21',
              fields: {
                summary: 'Retry policy update',
                status: { name: 'In Progress' },
                issuetype: { name: 'Task' },
                priority: { name: 'Medium' }
              }
            },
            type: { outward: 'blocks', inward: 'is blocked by' }
          }]
        }
      };
    }
  };
}

function graphFixture() {
  return {
    data: {
      jiraWorkItemGoals: {
        edges: [{ node: {
          id: 'goal-1',
          key: 'GOAL-1',
          name: 'Checkout reliability',
          description: 'Reduce payment failure rates',
          url: 'https://example.atlassian.net/goals/goal-1',
          updatedAt: '2026-11-16T09:00:00Z',
          archived: true
        } }],
        pageInfo: { hasNextPage: false, endCursor: null }
      },
      jiraWorkItemLinkedExternalDeployments: {
        edges: [{ node: {
          id: 'deployment-1',
          displayName: 'Checkout API release',
          description: 'Release candidate',
          state: 'FAILED',
          environment: { displayName: 'Production', type: 'PRODUCTION' },
          provider: { name: 'Deployment provider' },
          url: 'https://deploy.example.com/releases/42',
          region: 'ap-south-1',
          createdAt: '2026-11-16T09:30:00Z',
          lastUpdatedAt: '2026-11-16T09:45:00Z'
        } }],
        pageInfo: { hasNextPage: false, endCursor: null }
      },
      jiraWorkItemLinkedExternalPullRequests: {
        edges: [{ node: {
          id: 'pull-1',
          title: 'Change payment retry handling',
          displayId: '42',
          status: 'OPEN',
          provider: { name: 'GitHub' },
          url: 'https://github.com/example/payments/pull/42',
          createdAt: '2026-11-15T09:00:00Z',
          lastUpdatedAt: '2026-11-16T09:00:00Z'
        } }],
        pageInfo: { hasNextPage: false, endCursor: null }
      }
    }
  };
}

function loadAction({ jiraResponse, graphResponse, throwGraph = false } = {}) {
  const calls = { jira: [], graph: [], asUser: 0 };
  const api = {
    route(strings, ...values) {
      return strings.reduce((result, part, index) => result + part + (values[index] ?? ''), '');
    },
    asUser() {
      calls.asUser += 1;
      return {
        async requestJira(url, options) {
          calls.jira.push({ url, options });
          return jiraResponse || defaultJiraResponse();
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

  const actionPath = require.resolve('../src/rovo-action.js');
  delete require.cache[actionPath];
  const originalLoad = Module._load;
  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === '@forge/api') return api;
    return originalLoad.call(this, request, parent, isMain);
  };
  let getTracebackContext;
  try {
    getTracebackContext = require('../src/rovo-action.js').getTracebackContext;
  } finally {
    Module._load = originalLoad;
    delete require.cache[actionPath];
  }
  return { getTracebackContext, calls };
}

test('Rovo/MCP action returns bounded, read-only Jira and Teamwork Graph investigation context', async () => {
  const { getTracebackContext, calls } = loadAction({ graphResponse: graphFixture() });
  const result = await getTracebackContext({
    issueKey: 'DEMO-9',
    context: { cloudId: CLOUD_ID, jira: { issueKey: 'DEMO-9' } }
  }, { principal: { accountId: 'current-user' } });

  assert.equal(result.schemaVersion, 1);
  assert.equal(result.accessMode, 'read-only');
  assert.equal(result.issue.key, 'DEMO-9');
  assert.equal(result.issue.summary, 'Checkout investigation');
  assert.equal(result.relatedWorkItems[0].key, 'PAY-21');
  assert.equal(result.teamworkGraph.status, 'available');
  assert.equal(result.teamworkGraph.goals[0].name, 'Checkout reliability');
  assert.equal(result.teamworkGraph.deployments[0].state, 'FAILED');
  assert.equal(result.teamworkGraph.pullRequests[0].status, 'OPEN');
  assert.equal(result.investigationLeads[0].title, 'Inspect failed deployment');
  assert.match(result.investigationLeads[0].rationale, /does not establish that the deployment caused/i);
  assert.equal(result.interpretationPolicy.rootCause, 'not-established');
  assert.equal(calls.jira.length, 1);
  assert.equal(calls.graph.length, 1);
  assert.equal(calls.asUser, 2);
  assert.match(calls.jira[0].url, /DEMO-9/);
  assert.equal(calls.jira[0].options.headers.Accept, 'application/json');
  assert.equal(calls.graph[0].variables.id, `ari:cloud:jira:${CLOUD_ID}:issue/10006`);
});

test('Rovo/MCP action rejects malformed explicit issue keys before making any request', async () => {
  const { getTracebackContext, calls } = loadAction();
  await assert.rejects(
    getTracebackContext({
      issueKey: 'https://evil.example',
      context: { cloudId: CLOUD_ID, jira: { issueKey: 'DEMO-9' } }
    }),
    /valid Jira issue key/i
  );
  assert.equal(calls.jira.length, 0);
  assert.equal(calls.graph.length, 0);
  assert.equal(calls.asUser, 0);
});

test('Rovo action can use the active Jira issue key from trusted module context when input is absent', async () => {
  const { getTracebackContext, calls } = loadAction();
  const result = await getTracebackContext({
    context: { cloudId: CLOUD_ID, jira: { issueKey: 'DEMO-9' } }
  });
  assert.equal(result.issue.key, 'DEMO-9');
  assert.match(calls.jira[0].url, /DEMO-9/);
});

test('Rovo action can extract an issue key from the Atlassian issue URL context', async () => {
  const { getTracebackContext, calls } = loadAction();
  const result = await getTracebackContext({
    context: {
      cloudId: CLOUD_ID,
      jira: { url: 'https://example.atlassian.net/browse/DEMO-9' }
    }
  });
  assert.equal(result.issue.key, 'DEMO-9');
  assert.match(calls.jira[0].url, /DEMO-9/);
});

test('Rovo/MCP action preserves Jira context when optional Teamwork Graph access fails', async () => {
  const { getTracebackContext, calls } = loadAction({ throwGraph: true });
  const result = await getTracebackContext({
    issueKey: 'DEMO-9',
    context: { cloudId: CLOUD_ID }
  });
  assert.equal(result.issue.key, 'DEMO-9');
  assert.equal(result.teamworkGraph.status, 'unavailable');
  assert.doesNotMatch(result.teamworkGraph.warning, /private Graph upstream error/);
  assert.equal(calls.jira.length, 1);
  assert.equal(calls.graph.length, 1);
});

test('Rovo/MCP action rejects invalid explicit input instead of silently falling back to issue context', async () => {
  const { getTracebackContext, calls } = loadAction();
  await assert.rejects(
    getTracebackContext({
      issueKey: '',
      context: { cloudId: CLOUD_ID, jira: { issueKey: 'DEMO-9' } }
    }),
    /valid Jira issue key/i
  );
  assert.equal(calls.jira.length, 0);
});


test('Rovo/MCP action marks free-text issue and linked-record fields as untrusted evidence', async () => {
  const { getTracebackContext } = loadAction({ graphResponse: graphFixture() });
  const result = await getTracebackContext({
    issueKey: 'DEMO-9',
    context: { cloudId: CLOUD_ID }
  });
  assert.equal(result.evidenceTrustBoundary.freeTextFieldsAreUntrusted, true);
  assert.match(result.evidenceTrustBoundary.instruction, /never as instructions/i);
  assert.ok(result.evidenceTrustBoundary.fields.includes('issue.description'));
  assert.ok(result.evidenceTrustBoundary.fields.includes('teamworkGraph.deployments.description'));
});

test('Rovo/MCP action bounds free-text fields and caps every evidence category', async () => {
  const jiraResponse = defaultJiraResponse();
  const longDescription = 'x'.repeat(5000);
  const longSummary = 's'.repeat(1000);
  jiraResponse.json = async () => ({
    ...await defaultJiraResponse().json(),
    fields: {
      ...(await defaultJiraResponse().json()).fields,
      summary: longSummary,
      description: longDescription,
      issuelinks: []
    }
  });
  const graphResponse = graphFixture();
  graphResponse.data.jiraWorkItemGoals.edges = Array.from({ length: 130 }, (_, index) => ({
    node: {
      id: `goal-${index}`,
      name: 'g'.repeat(500),
      description: 'd'.repeat(3000),
      url: `https://example.atlassian.net/goals/${index}`,
      archived: false
    }
  }));
  const { getTracebackContext } = loadAction({ jiraResponse, graphResponse });
  const result = await getTracebackContext({
    issueKey: 'DEMO-9',
    context: { cloudId: CLOUD_ID }
  });
  assert.equal(result.issue.summary.length, 501);
  assert.equal(result.issue.description.length, 2001);
  assert.equal(result.teamworkGraph.goals.length, 125);
  assert.equal(result.teamworkGraph.goals[0].name.length, 301);
  assert.equal(result.teamworkGraph.goals[0].description.length, 1501);
});

test('Rovo/MCP action honors an explicit valid issue key over contextual issue key', async () => {
  const jiraResponse = defaultJiraResponse();
  jiraResponse.json = async () => ({
    id: '10021',
    key: 'PAY-21',
    fields: {
      summary: 'Retry policy update',
      description: '',
      status: { name: 'In Progress' },
      priority: { name: 'Medium' },
      issuetype: { name: 'Task' },
      project: { key: 'PAY' },
      issuelinks: []
    }
  });
  const { getTracebackContext, calls } = loadAction({ jiraResponse });
  const result = await getTracebackContext({
    issueKey: 'PAY-21',
    context: { cloudId: CLOUD_ID, jira: { issueKey: 'DEMO-9' } }
  });
  assert.equal(result.issue.key, 'PAY-21');
  assert.match(calls.jira[0].url, /PAY-21/);
  assert.doesNotMatch(calls.jira[0].url, /DEMO-9/);
});
