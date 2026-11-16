'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

let graphDomain = {};
try {
  graphDomain = require('../src/domain/teamwork-graph');
} catch {
  // A missing implementation must fail the behavior assertions below.
}

function productionFunction(name) {
  assert.equal(typeof graphDomain[name], 'function', `${name} must be implemented`);
  return graphDomain[name];
}

test('builds the Jira issue ARI from the current site and numeric issue id', () => {
  const buildJiraIssueAri = productionFunction('buildJiraIssueAri');
  assert.equal(
    buildJiraIssueAri('c0e47565-a2b1-472f-bd30-5c1e3684bb1e', '10006'),
    'ari:cloud:jira:c0e47565-a2b1-472f-bd30-5c1e3684bb1e:issue/10006'
  );
});

test('rejects missing or malformed identifiers before making a Teamwork Graph request', () => {
  const buildJiraIssueAri = productionFunction('buildJiraIssueAri');
  assert.throws(() => buildJiraIssueAri('', '10006'), /cloud id/i);
  assert.throws(() => buildJiraIssueAri('not-a-cloud-id', '10006'), /cloud id/i);
  assert.throws(() => buildJiraIssueAri('c0e47565-a2b1-472f-bd30-5c1e3684bb1e', 'DEMO-7'), /issue id/i);
});

test('normalizes linked deployments, pull requests and goals with source provenance', () => {
  const normalizeTeamworkGraphResponse = productionFunction('normalizeTeamworkGraphResponse');
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
  assert.deepEqual(result.goals[0], {
    id: 'ari:goal/1',
    key: 'REL-1',
    name: 'Reliable releases',
    description: '',
    url: 'https://example.atlassian.net/goals/1',
    updatedAt: null,
    archived: false
  });
  assert.equal(result.deployments[0].title, 'Production rollout');
  assert.equal(result.deployments[0].state, 'SUCCESSFUL');
  assert.equal(result.deployments[0].environment, 'Production');
  assert.equal(result.deployments[0].environmentType, 'PRODUCTION');
  assert.equal(result.deployments[0].provider, 'GitHub');
  assert.equal(result.deployments[0].url, 'https://github.com/example/deployments/1');
  assert.equal(result.pullRequests[0].title, 'Handle payment timeout');
  assert.equal(result.pullRequests[0].displayId, '42');
  assert.equal(result.pullRequests[0].status, 'MERGED');
  assert.equal(result.pullRequests[0].provider, 'GitHub');
  assert.equal(result.pullRequests[0].url, 'https://github.com/example/repo/pull/42');
});

test('marks permission-filtered empty graph results as empty rather than claiming no evidence exists', () => {
  const normalizeTeamworkGraphResponse = productionFunction('normalizeTeamworkGraphResponse');
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
  const normalizeTeamworkGraphResponse = productionFunction('normalizeTeamworkGraphResponse');
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
  const normalizeTeamworkGraphResponse = productionFunction('normalizeTeamworkGraphResponse');
  const result = normalizeTeamworkGraphResponse(null);

  assert.equal(result.status, 'unavailable');
  assert.deepEqual(result.goals, []);
  assert.deepEqual(result.deployments, []);
  assert.deepEqual(result.pullRequests, []);
});

test('rejects non-HTTPS, malformed, and credential-bearing source URLs', () => {
  const normalizeTeamworkGraphResponse = productionFunction('normalizeTeamworkGraphResponse');
  const result = normalizeTeamworkGraphResponse({
    data: {
      jiraWorkItemGoals: {
        edges: [{ node: { id: 'goal-unsafe', name: 'Unsafe goal link', url: 'javascript:alert(1)' } }]
      },
      jiraWorkItemLinkedExternalDeployments: {
        edges: [{ node: { id: 'deployment-unsafe', displayName: 'Unsafe deployment link', url: 'http://example.com/deploy' } }]
      },
      jiraWorkItemLinkedExternalPullRequests: {
        edges: [{ node: { id: 'pr-unsafe', title: 'Unsafe pull request link', url: 'https://user:password@example.com/pull/1' } }]
      }
    }
  });

  assert.equal(result.status, 'available');
  assert.equal(result.goals[0].url, '');
  assert.equal(result.deployments[0].url, '');
  assert.equal(result.pullRequests[0].url, '');
});

test('ignores graph nodes without immutable item identifiers', () => {
  const normalizeTeamworkGraphResponse = productionFunction('normalizeTeamworkGraphResponse');
  const result = normalizeTeamworkGraphResponse({
    data: {
      jiraWorkItemGoals: { edges: [{ node: { name: 'Unidentified goal' } }] },
      jiraWorkItemLinkedExternalDeployments: { edges: [{ node: { displayName: 'Unidentified deployment' } }] },
      jiraWorkItemLinkedExternalPullRequests: { edges: [{ node: { title: 'Unidentified pull request' } }] }
    }
  });

  assert.equal(result.status, 'empty');
  assert.deepEqual(result.goals, []);
  assert.deepEqual(result.deployments, []);
  assert.deepEqual(result.pullRequests, []);
});
