'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { fetchTeamworkGraphEvidence } = require('../src/services/teamwork-graph');

test('queries all curated issue-context relationships as the current Atlassian user', async () => {
  let capturedQuery = '';
  let capturedVariables = null;
  let requestCount = 0;
  const graphResponse = {
    data: {
      jiraWorkItemGoals: { edges: [{ node: { id: 'goal-1', key: 'REL-1', name: 'Reliable releases', url: 'https://example.atlassian.net/goals/1' } }], pageInfo: { hasNextPage: false, endCursor: null } },
      jiraWorkItemLinkedExternalDeployments: { edges: [{ node: { id: 'deployment-1', displayName: 'Production rollout', state: 'SUCCESSFUL' } }], pageInfo: { hasNextPage: false, endCursor: null } },
      jiraWorkItemLinkedExternalPullRequests: { edges: [{ node: { id: 'pr-1', title: 'Handle checkout retries', status: 'MERGED' } }], pageInfo: { hasNextPage: false, endCursor: null } }
    }
  };
  const apiClient = {
    asUser() {
      return {
        async requestTeamworkGraph(query, variables) {
          requestCount += 1;
          capturedQuery = query;
          capturedVariables = variables;
          return graphResponse;
        }
      };
    }
  };

  const result = await fetchTeamworkGraphEvidence(
    apiClient,
    '10006',
    'c0e47565-a2b1-472f-bd30-5c1e3684bb1e'
  );

  assert.equal(requestCount, 1);
  assert.match(capturedQuery, /jiraWorkItemGoals/);
  assert.match(capturedQuery, /jiraWorkItemLinkedExternalDeployments/);
  assert.match(capturedQuery, /jiraWorkItemLinkedExternalPullRequests/);
  assert.match(capturedQuery, /first: 25/);
  assert.match(capturedQuery, /pageInfo/);
  assert.deepEqual(capturedVariables, {
    id: 'ari:cloud:jira:c0e47565-a2b1-472f-bd30-5c1e3684bb1e:issue/10006',
    goalsAfter: null,
    deploymentsAfter: null,
    pullRequestsAfter: null,
    includeGoals: true,
    includeDeployments: true,
    includePullRequests: true
  });
  assert.equal(result.status, 'available');
  assert.equal(result.goals[0].name, 'Reliable releases');
  assert.equal(result.deployments[0].title, 'Production rollout');
  assert.equal(result.pullRequests[0].title, 'Handle checkout retries');
});

test('parses the backend HTTP response shape before normalizing Teamwork Graph evidence', async () => {
  const body = {
    data: {
      jiraWorkItemGoals: { edges: [{ node: { id: 'goal-http-1', name: 'Reliable releases' } }], pageInfo: { hasNextPage: false, endCursor: null } },
      jiraWorkItemLinkedExternalDeployments: { edges: [], pageInfo: { hasNextPage: false, endCursor: null } },
      jiraWorkItemLinkedExternalPullRequests: { edges: [], pageInfo: { hasNextPage: false, endCursor: null } }
    }
  };
  const apiClient = {
    asUser() {
      return {
        async requestTeamworkGraph() {
          return {
            ok: true,
            status: 200,
            async json() { return body; }
          };
        }
      };
    }
  };

  const result = await fetchTeamworkGraphEvidence(
    apiClient,
    '10006',
    'c0e47565-a2b1-472f-bd30-5c1e3684bb1e'
  );

  assert.equal(result.status, 'available');
  assert.equal(result.goals[0].id, 'goal-http-1');
});

test('preserves GraphQL errors and marks non-2xx backend HTTP responses unavailable', async () => {
  const apiClient = {
    asUser() {
      return {
        async requestTeamworkGraph() {
          return {
            ok: false,
            status: 403,
            async json() {
              return { data: null, errors: [{ message: 'Forbidden' }] };
            }
          };
        }
      };
    }
  };

  const result = await fetchTeamworkGraphEvidence(
    apiClient,
    '10006',
    'c0e47565-a2b1-472f-bd30-5c1e3684bb1e'
  );

  assert.equal(result.status, 'unavailable');
  assert.match(result.warning, /Teamwork Graph/i);
});

test('returns safe unavailable evidence when a backend HTTP response body is not valid JSON', async () => {
  const apiClient = {
    asUser() {
      return {
        async requestTeamworkGraph() {
          return {
            ok: true,
            status: 200,
            async json() { throw new SyntaxError('invalid JSON'); }
          };
        }
      };
    }
  };

  const result = await fetchTeamworkGraphEvidence(
    apiClient,
    '10006',
    'c0e47565-a2b1-472f-bd30-5c1e3684bb1e'
  );

  assert.equal(result.status, 'unavailable');
  assert.match(result.warning, /Teamwork Graph/i);
});

test('returns unavailable evidence without making a request when the issue identity is invalid', async () => {
  let requestCount = 0;
  const apiClient = {
    asUser() {
      return {
        async requestTeamworkGraph() {
          requestCount += 1;
          throw new Error('Must not be called');
        }
      };
    }
  };

  const result = await fetchTeamworkGraphEvidence(apiClient, 'DEMO-8', 'c0e47565-a2b1-472f-bd30-5c1e3684bb1e');

  assert.equal(requestCount, 0);
  assert.equal(result.status, 'unavailable');
  assert.match(result.warning, /issue/i);
});

test('does not fail the Jira resolver when Teamwork Graph denies access', async () => {
  const apiClient = {
    asUser() {
      return {
        async requestTeamworkGraph() {
          return { data: null, errors: [{ message: 'Forbidden' }] };
        }
      };
    }
  };

  const result = await fetchTeamworkGraphEvidence(
    apiClient,
    '10006',
    'c0e47565-a2b1-472f-bd30-5c1e3684bb1e'
  );

  assert.equal(result.status, 'unavailable');
  assert.deepEqual(result.deployments, []);
  assert.deepEqual(result.pullRequests, []);
  assert.deepEqual(result.goals, []);
  assert.match(result.warning, /Teamwork Graph/i);
});

test('normalizes partial GraphQL data without throwing away linked evidence', async () => {
  const apiClient = {
    asUser() {
      return {
        async requestTeamworkGraph() {
          return {
            data: {
              jiraWorkItemGoals: { edges: [] },
              jiraWorkItemLinkedExternalDeployments: {
                edges: [{ node: { id: 'deployment-2', displayName: 'Staging deploy', state: 'IN_PROGRESS' } }]
              },
              jiraWorkItemLinkedExternalPullRequests: { edges: [] }
            },
            errors: [{ message: 'Pull request relationship not visible' }]
          };
        }
      };
    }
  };

  const result = await fetchTeamworkGraphEvidence(
    apiClient,
    '10006',
    'c0e47565-a2b1-472f-bd30-5c1e3684bb1e'
  );

  assert.equal(result.status, 'partial');
  assert.equal(result.deployments.length, 1);
  assert.equal(result.pullRequests.length, 0);
});
