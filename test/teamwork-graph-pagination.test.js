'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { fetchTeamworkGraphEvidence } = require('../src/services/teamwork-graph');

const CLOUD_ID = 'c0e47565-a2b1-472f-bd30-5c1e3684bb1e';

function graphResponse({ goals = [], deployments = [], pullRequests = [], errors = [] } = {}) {
  return {
    data: {
      jiraWorkItemGoals: goals,
      jiraWorkItemLinkedExternalDeployments: deployments,
      jiraWorkItemLinkedExternalPullRequests: pullRequests
    },
    ...(errors.length ? { errors } : {})
  };
}

function connection(edges, hasNextPage = false, endCursor = null) {
  return { edges: edges.map((node) => ({ node })), pageInfo: { hasNextPage, endCursor } };
}

function apiClientFor(responses, captured = []) {
  let index = 0;
  return {
    asUser() {
      return {
        async requestTeamworkGraph(query, variables) {
          captured.push({ query, variables });
          const body = responses[Math.min(index, responses.length - 1)];
          index += 1;
          if (body instanceof Error) throw body;
          return body;
        }
      };
    }
  };
}

test('loads all Teamwork Graph pages for each relationship while skipping completed connections', async () => {
  const captured = [];
  const client = apiClientFor([
    graphResponse({
      goals: connection([{ id: 'goal-1', name: 'Reliable releases' }], true, 'goal-cursor-1'),
      deployments: connection([{ id: 'deployment-1', displayName: 'Production deploy', state: 'SUCCESSFUL' }]),
      pullRequests: connection([{ id: 'pr-1', title: 'Retry checkout', status: 'OPEN' }])
    }),
    graphResponse({
      goals: connection([{ id: 'goal-1', name: 'Reliable releases' }, { id: 'goal-2', name: 'Reduce incidents' }])
    })
  ], captured);

  const result = await fetchTeamworkGraphEvidence(client, '10006', CLOUD_ID);

  assert.equal(captured.length, 2);
  assert.match(captured[0].query, /first: 25/);
  assert.match(captured[0].query, /pageInfo/);
  assert.deepEqual(captured[0].variables, {
    id: 'ari:cloud:jira:c0e47565-a2b1-472f-bd30-5c1e3684bb1e:issue/10006',
    goalsAfter: null,
    deploymentsAfter: null,
    pullRequestsAfter: null,
    includeGoals: true,
    includeDeployments: true,
    includePullRequests: true
  });
  assert.equal(captured[1].variables.goalsAfter, 'goal-cursor-1');
  assert.equal(captured[1].variables.includeGoals, true);
  assert.equal(captured[1].variables.includeDeployments, false);
  assert.equal(captured[1].variables.includePullRequests, false);
  assert.deepEqual(result.goals.map((goal) => goal.id), ['goal-1', 'goal-2']);
  assert.equal(result.deployments.length, 1);
  assert.equal(result.pullRequests.length, 1);
  assert.deepEqual(result.truncatedCategories, []);
});


test('preserves already loaded evidence when a later pagination request throws', async () => {
  const captured = [];
  const client = apiClientFor([
    graphResponse({
      goals: connection([{ id: 'goal-1', name: 'Reliable releases' }], true, 'goal-cursor-1'),
      deployments: connection([]),
      pullRequests: connection([])
    }),
    new Error('temporary network failure')
  ], captured);

  const result = await fetchTeamworkGraphEvidence(client, '10006', CLOUD_ID);

  assert.equal(captured.length, 2);
  assert.equal(result.status, 'partial');
  assert.deepEqual(result.goals.map((goal) => goal.id), ['goal-1']);
  assert.match(result.warning, /some connected evidence could not be loaded/i);
  assert.deepEqual(result.truncatedCategories, ['goals']);
});

test('bounds pagination and clearly reports categories with more than five pages', async () => {
  const captured = [];
  const responses = Array.from({ length: 5 }, (_, page) => graphResponse({
    goals: connection([{ id: `goal-${page + 1}`, name: `Goal ${page + 1}` }], true, `goal-cursor-${page + 1}`),
    deployments: connection([]),
    pullRequests: connection([])
  }));
  const client = apiClientFor(responses, captured);

  const result = await fetchTeamworkGraphEvidence(client, '10006', CLOUD_ID);

  assert.equal(captured.length, 5);
  assert.equal(result.goals.length, 5);
  assert.deepEqual(result.truncatedCategories, ['goals']);
  assert.match(result.warning, /additional linked records/i);
});


test('preserves first-page evidence and marks pending categories partial when a later Graph request times out', async () => {
  let calls = 0;
  const client = {
    asUser() {
      return {
        requestTeamworkGraph() {
          calls += 1;
          if (calls === 1) {
            return Promise.resolve(graphResponse({
              goals: connection([{ id: 'goal-timeout', name: 'Evidence before timeout' }], true, 'next-goal'),
              deployments: connection([]),
              pullRequests: connection([])
            }));
          }
          return new Promise(() => {});
        }
      };
    }
  };

  const result = await fetchTeamworkGraphEvidence(client, '10006', CLOUD_ID, {
    totalDurationMs: 100,
    requestDurationMs: 10
  });

  assert.equal(calls, 2);
  assert.equal(result.status, 'partial');
  assert.deepEqual(result.goals.map((goal) => goal.id), ['goal-timeout']);
  assert.deepEqual(result.truncatedCategories, ['goals']);
  assert.match(result.warning, /some connected evidence could not be loaded/i);
});


test('advances all active evidence categories together for five bounded pages', async () => {
  const captured = [];
  const responses = Array.from({ length: 5 }, (_, page) => {
    const hasNextPage = page < 4;
    const cursor = (category) => hasNextPage ? category + '-cursor-' + (page + 1) : null;
    return graphResponse({
      goals: connection([{ id: 'goal-' + (page + 1), name: 'Goal ' + (page + 1) }], hasNextPage, cursor('goal')),
      deployments: connection([{ id: 'deployment-' + (page + 1), displayName: 'Deployment ' + (page + 1), state: 'SUCCESSFUL' }], hasNextPage, cursor('deployment')),
      pullRequests: connection([{ id: 'pr-' + (page + 1), title: 'Pull request ' + (page + 1), status: 'MERGED' }], hasNextPage, cursor('pr'))
    });
  });
  const client = apiClientFor(responses, captured);

  const result = await fetchTeamworkGraphEvidence(client, '10006', CLOUD_ID);

  assert.equal(captured.length, 5);
  assert.deepEqual(result.goals.map((item) => item.id), ['goal-1', 'goal-2', 'goal-3', 'goal-4', 'goal-5']);
  assert.deepEqual(result.deployments.map((item) => item.id), ['deployment-1', 'deployment-2', 'deployment-3', 'deployment-4', 'deployment-5']);
  assert.deepEqual(result.pullRequests.map((item) => item.id), ['pr-1', 'pr-2', 'pr-3', 'pr-4', 'pr-5']);
  assert.deepEqual(result.truncatedCategories, []);
  assert.notEqual(result.status, 'partial');
});
