'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
let graphDomain = {};
try {
  graphDomain = require('../src/domain/teamwork-graph');
} catch {
  // The production module is intentionally absent in the RED phase.
}
const { buildJiraIssueAri, normalizeTeamworkGraphResponse } = graphDomain;

test('builds the Jira issue ARI from the current site and numeric issue id', () => {
  assert.equal(typeof buildJiraIssueAri, 'function', 'buildJiraIssueAri must be implemented');
  assert.equal(
    buildJiraIssueAri('c0e47565-a2b1-472f-bd30-5c1e3684bb1e', '10006'),
    'ari:cloud:jira:c0e47565-a2b1-472f-bd30-5c1e3684bb1e:issue/10006'
  );
});

test('rejects missing or malformed identifiers before making a Teamwork Graph request', () => {
  assert.equal(typeof buildJiraIssueAri, 'function', 'buildJiraIssueAri must be implemented');
  assert.throws(() => buildJiraIssueAri('', '10006'), /cloud id/i);
  assert.throws(() => buildJiraIssueAri('not-a-cloud-id', '10006'), /cloud id/i);
  assert.throws(() => buildJiraIssueAri('c0e47565-a2b1-472f-bd30-5c1e3684bb1e', 'DEMO-7'), /issue id/i);
});

test('normalizes linked deployments, pull requests and goals with source provenance', () => {
  assert.equal(typeof normalizeTeamworkGraphResponse, 'function', 'normalizeTeamworkGraphResponse must be implemented');
  assert.equal(typeof normalizeTeamworkGraphResponse, 'function', 'normalizeTeamworkGraphResponse must be implemented');
  assert.equal(typeof normalizeTeamworkGraphResponse, 'function', 'normalizeTeamworkGraphResponse must be implemented');
  const result = normalizeTeamworkGraphResponse({
    data: {
      jiraWorkItemGoals: {
        edges: [
          { node: { __typename: 'AtlassianGoal', id: 'ari:goal/1', key: 'REL-1', name: 'Reliable releases', url: 'https://example.atlassian.net/goals/1', archived: false } }
        ]
      },
      jiraWorkItemLinkedExternalDeployments: {
        edges: [
          { node: { __typename: 'ExternalDeployment', id: 'deployment-1', displayName: 'Production rollout', state: 'SUCCESSFUL', environment: { displayName: 'Production', type: 'PRODUCTION' }, provider: { name: 'GitHub' }, url: 'https://github.com/example/deployments/1', createdAt: '2026-11-16T10:00:00Z', lastUpdatedAt: '2026-11-16T10:05:00Z' } }
        ]
      },
      jiraWorkItemLinkedExternalPullRequests: {
        edges: [
          { node: { __typename: 'ExternalPullRequest', id: 'pull-request-1', title: 'Handle payment timeout', displayId: '42', status: 'MERGED', provider: { name: 'GitHub' }, url: 'https://github.com/example/repo/pull/42', createdAt: '2026-11-16T09:00:00Z', lastUpdatedAt: '2026-11-16T09:30:00Z' } }
        ]
      }
    }
  });

  assert.equal(result.status, 'available');
  assert.equal(result.source, 'Atlassian Teamwork Graph');
  assert.equal(result.goals.length, 1);
  assert.deepEqual(result.goals[0], {
    id: 'ari:goal/1',
    key: 'REL-1',
    name: 'Reliable releases',
    description: '',
    url: 'https://example.atlassian.net/goals/1',
    updatedAt: null,
    archived: false
  });
  assert.equal(result.deployments.length, 1);
  assert.equal(result.deployments[0].title, 'Production rollout');
  assert.equal(result.deployments[0].state, 'SUCCESSFUL');
  assert.equal(result.deployments[0].environment, 'Production');
  assert.equal(result.deployments[0].environmentType, 'PRODUCTION');
  assert.equal(result.deployments[0].provider, 'GitHub');
  assert.equal(result.deployments[0].url, 'https://github.com/example/deployments/1');
  assert.equal(result.pullRequests.length, 1);
  assert.equal(result.pullRequests[0].title, 'Handle payment timeout');
  assert.equal(result.pullRequests[0].displayId, '42');
  assert.equal(result.pullRequests[0].status, 'MERGED');
  assert.equal(result.pullRequests[0].provider, 'GitHub');
  assert.equal(result.pullRequests[0].url, 'https://github.com/example/repo/pull/42');
});

test('marks permission-filtered empty graph results as empty rather than claiming no evidence exists', () => {
  const result = normalizeTeamworkGraphResponse({
    data: {
      jiraWorkItemGoals: { edges: [] },
      jiraWorkItemLinkedExternalDeployments: { edges: [] },
      jiraWorkItemLinkedExternalPullRequests: { edges: [] }
    }
  });

  assert.equal(result.status, 'empty');
  assert.deepEqual(result.goals, []);
  assert.deepEqual(result.deployments, []);
  assert.deepEqual(result.pullRequests, []);
  assert.match(result.warning, /scopes|permissions|connectors/i);
});

test('preserves usable evidence while marking GraphQL errors as partial', () => {
  const result = normalizeTeamworkGraphResponse({
    data: {
      jiraWorkItemGoals: { edges: [] },
      jiraWorkItemLinkedExternalDeployments: {
        edges: [{ node: { __typename: 'ExternalDeployment', id: 'deployment-2', displayName: 'Staging release', state: 'IN_PROGRESS' } }]
      },
      jiraWorkItemLinkedExternalPullRequests: { edges: [] }
    },
    errors: [{ message: 'A linked evidence scope was not granted.' }]
  });

  assert.equal(result.status, 'partial');
  assert.equal(result.deployments.length, 1);
  assert.match(result.warning, /some connected evidence/i);
});

test('returns a safe unavailable state for a malformed Teamwork Graph response', () => {
  assert.equal(typeof normalizeTeamworkGraphResponse, 'function', 'normalizeTeamworkGraphResponse must be implemented');
  const result = normalizeTeamworkGraphResponse(null);

  assert.equal(result.status, 'unavailable');
  assert.deepEqual(result.goals, []);
  assert.deepEqual(result.deployments, []);
  assert.deepEqual(result.pullRequests, []);
});
