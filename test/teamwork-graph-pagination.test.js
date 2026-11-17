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
          return { ok: true, async json() { return body; } };
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
      goals: connection([{ id: 'goal-2', name: 'Reduce incidents' }])
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
