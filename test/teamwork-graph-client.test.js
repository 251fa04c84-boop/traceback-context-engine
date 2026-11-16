'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

let loadTeamworkGraphEvidence;
try {
  ({ loadTeamworkGraphEvidence } = require('../src/teamwork-graph'));
} catch {
  // The API adapter is intentionally absent in the RED phase.
}

test('calls Teamwork Graph with the current issue ARI and returns normalized linked evidence', async () => {
  assert.equal(typeof loadTeamworkGraphEvidence, 'function', 'loadTeamworkGraphEvidence must be implemented');

  let receivedQuery = '';
  let receivedVariables = null;
  const result = await loadTeamworkGraphEvidence({
    cloudId: 'c0e47565-a2b1-472f-bd30-5c1e3684bb1e',
    issueId: '10006',
    requestTeamworkGraph: async (query, variables) => {
      receivedQuery = query;
      receivedVariables = variables;
      return {
        ok: true,
        json: async () => ({
          data: {
            jiraWorkItemGoals: { edges: [] },
            jiraWorkItemLinkedExternalDeployments: {
              edges: [{ node: { __typename: 'ExternalDeployment', id: 'deployment-7', displayName: 'Production release', state: 'SUCCESSFUL' } }]
            },
            jiraWorkItemLinkedExternalPullRequests: { edges: [] }
          }
        })
      };
    }
  });

  assert.equal(receivedVariables.issueId, 'ari:cloud:jira:c0e47565-a2b1-472f-bd30-5c1e3684bb1e:issue/10006');
  assert.match(receivedQuery, /jiraWorkItemGoals/);
  assert.match(receivedQuery, /jiraWorkItemLinkedExternalDeployments/);
  assert.match(receivedQuery, /jiraWorkItemLinkedExternalPullRequests/);
  assert.equal(result.status, 'available');
  assert.equal(result.deployments[0].title, 'Production release');
});

test('returns a safe unavailable state when the Teamwork Graph request fails', async () => {
  assert.equal(typeof loadTeamworkGraphEvidence, 'function', 'loadTeamworkGraphEvidence must be implemented');

  const result = await loadTeamworkGraphEvidence({
    cloudId: 'c0e47565-a2b1-472f-bd30-5c1e3684bb1e',
    issueId: '10006',
    requestTeamworkGraph: async () => {
      throw new Error('private upstream diagnostic');
    }
  });

  assert.equal(result.status, 'unavailable');
  assert.deepEqual(result.goals, []);
  assert.deepEqual(result.deployments, []);
  assert.deepEqual(result.pullRequests, []);
  assert.doesNotMatch(result.warning, /private upstream diagnostic/);
});
