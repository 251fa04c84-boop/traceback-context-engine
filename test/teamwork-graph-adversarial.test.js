'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  normalizeTeamworkGraphResponse,
  buildJiraIssueAri
} = require('../src/domain/teamwork-graph');
const {
  fetchTeamworkGraphEvidence,
  TEAMWORK_GRAPH_QUERY,
  MAX_PAGES_PER_CATEGORY
} = require('../src/services/teamwork-graph');

const CLOUD_ID = 'c0e47565-a2b1-472f-bd30-5c1e3684bb1e';
const ISSUE_ID = '10006';

function connection(edges = [], hasNextPage = false, endCursor = null) {
  return { edges: edges.map((node) => ({ node })), pageInfo: { hasNextPage, endCursor } };
}

function graphResponse({
  goals = connection(),
  deployments = connection(),
  pullRequests = connection(),
  errors
} = {}) {
  return {
    data: {
      jiraWorkItemGoals: goals,
      jiraWorkItemLinkedExternalDeployments: deployments,
      jiraWorkItemLinkedExternalPullRequests: pullRequests
    },
    ...(errors ? { errors } : {})
  };
}

function clientFor(handler, calls = []) {
  return {
    asUser() {
      return {
        async requestTeamworkGraph(query, variables) {
          calls.push({ query, variables });
          return handler(query, variables, calls.length);
        }
      };
    }
  };
}

test('ARI validation rejects adversarial cloud identifiers', () => {
  for (const cloudId of [
    '', ' ', 'not-a-uuid', '00000000-0000-0000-0000-000000000000',
    'c0e47565-a2b1-472f-bd30-5c1e3684bb1e/extra',
    'c0e47565-a2b1-472f-bd30-5c1e3684bb1e?x=1',
    null, undefined, 42
  ]) {
    assert.throws(() => buildJiraIssueAri(cloudId, ISSUE_ID), TypeError);
  }
});

test('ARI validation rejects adversarial issue identifiers', () => {
  for (const issueId of [
    '', '0', '00', '-1', '+1', '1.0', '1e3', 'DEMO-1', '../1',
    '1/../../2', '1?x=2', null, undefined, {}, []
  ]) {
    assert.throws(() => buildJiraIssueAri(CLOUD_ID, issueId), TypeError);
  }
});

test('ARI trims valid surrounding whitespace and preserves numeric identifier', () => {
  assert.equal(
    buildJiraIssueAri(` ${CLOUD_ID} `, ' 10006 '),
    `ari:cloud:jira:${CLOUD_ID}:issue/10006`
  );
});

test('malformed top-level Graph responses fail closed', () => {
  for (const input of [null, undefined, false, 0, '', 'json', [], {}, { data: null }, { data: [] }]) {
    const result = normalizeTeamworkGraphResponse(input);
    assert.equal(result.status, 'unavailable');
    assert.deepEqual(result.goals, []);
    assert.deepEqual(result.deployments, []);
    assert.deepEqual(result.pullRequests, []);
    assert.ok(result.warning);
  }
});

test('malformed or absent connections normalize to empty collections without throwing', () => {
  const variants = [undefined, null, false, 0, '', [], {}, { edges: null }, { edges: 'bad' }];
  for (const field of [
    'jiraWorkItemGoals',
    'jiraWorkItemLinkedExternalDeployments',
    'jiraWorkItemLinkedExternalPullRequests'
  ]) {
    for (const value of variants) {
      const data = {
        jiraWorkItemGoals: connection(),
        jiraWorkItemLinkedExternalDeployments: connection(),
        jiraWorkItemLinkedExternalPullRequests: connection()
      };
      data[field] = value;
      const result = normalizeTeamworkGraphResponse({ data });
      assert.deepEqual(result.goals, []);
      assert.deepEqual(result.deployments, []);
      assert.deepEqual(result.pullRequests, []);
    }
  }
});

test('normalizer drops null, primitive and wrong-typename nodes', () => {
  const result = normalizeTeamworkGraphResponse({
    data: {
      jiraWorkItemGoals: { edges: [
        null, {}, { node: null }, { node: 'bad' },
        { node: { __typename: 'ExternalDeployment', id: 'wrong-type' } },
        { node: { __typename: 'AtlassianGoal', id: 'goal-good', name: 'Good' } }
      ] }
    }
  });
  assert.deepEqual(result.goals.map((item) => item.id), ['goal-good']);
});

test('normalizer accepts untyped nodes when the relationship field already defines the type', () => {
  const result = normalizeTeamworkGraphResponse({
    data: { jiraWorkItemGoals: connection([{ id: 'goal-1', name: 'Goal' }]) }
  });
  assert.equal(result.goals.length, 1);
});

test('normalizer filters records without stable identifiers in every category', () => {
  const result = normalizeTeamworkGraphResponse({
    data: {
      jiraWorkItemGoals: connection([{ name: 'missing id' }, { id: 'goal-1', name: 'ok' }]),
      jiraWorkItemLinkedExternalDeployments: connection([{ displayName: 'missing id' }]),
      jiraWorkItemLinkedExternalPullRequests: connection([{ title: 'missing id' }])
    }
  });
  assert.deepEqual(result.goals.map((item) => item.id), ['goal-1']);
  assert.deepEqual(result.deployments, []);
  assert.deepEqual(result.pullRequests, []);
});

test('normalizer trims text fields and uses safe display fallbacks', () => {
  const result = normalizeTeamworkGraphResponse({
    data: {
      jiraWorkItemGoals: connection([{ id: 'g', key: ' G-1 ', name: '  Goal  ', description: '  Desc  ' }]),
      jiraWorkItemLinkedExternalDeployments: connection([{ id: 'd', label: '  Rollout  ', state: ' ', environment: {}, provider: {} }]),
      jiraWorkItemLinkedExternalPullRequests: connection([{ id: 'p', displayName: '  Change  ', status: ' ', provider: {} }])
    }
  });
  assert.equal(result.goals[0].key, 'G-1');
  assert.equal(result.goals[0].name, 'Goal');
  assert.equal(result.goals[0].description, 'Desc');
  assert.equal(result.deployments[0].title, 'Rollout');
  assert.equal(result.deployments[0].state, 'UNKNOWN');
  assert.equal(result.deployments[0].environment, 'Unknown environment');
  assert.equal(result.deployments[0].provider, 'Unknown provider');
  assert.equal(result.pullRequests[0].title, 'Change');
  assert.equal(result.pullRequests[0].status, 'UNKNOWN');
  assert.equal(result.pullRequests[0].provider, 'Unknown provider');
});

test('normalizer uses stable fallback labels for blank names and titles', () => {
  const result = normalizeTeamworkGraphResponse({
    data: {
      jiraWorkItemGoals: connection([{ id: 'g', name: ' ' }]),
      jiraWorkItemLinkedExternalDeployments: connection([{ id: 'd', displayName: ' ', label: '' }]),
      jiraWorkItemLinkedExternalPullRequests: connection([{ id: 'p', title: '', displayName: ' ' }])
    }
  });
  assert.equal(result.goals[0].name, 'Untitled goal');
  assert.equal(result.deployments[0].title, 'Deployment');
  assert.equal(result.pullRequests[0].title, 'Untitled pull request');
});

test('normalizer preserves explicit false archived value and uses null for unknown', () => {
  const result = normalizeTeamworkGraphResponse({
    data: { jiraWorkItemGoals: connection([
      { id: 'g1', archived: false },
      { id: 'g2', archived: true },
      { id: 'g3', archived: 'false' }
    ]) }
  });
  assert.equal(result.goals[0].archived, false);
  assert.equal(result.goals[1].archived, true);
  assert.equal(result.goals[2].archived, null);
});

test('HTTPS URL normalization canonicalizes safe links', () => {
  const result = normalizeTeamworkGraphResponse({
    data: { jiraWorkItemGoals: connection([{ id: 'g', url: 'https://EXAMPLE.com:443/a/../goal' }]) }
  });
  assert.equal(result.goals[0].url, 'https://example.com/goal');
});

test('URL allowlist rejects unsafe schemes, credentials and malformed inputs', () => {
  const invalidUrls = [
    'http://example.com', 'ftp://example.com/a', 'javascript:alert(1)',
    'data:text/html,hello', '//example.com/path', '/browse/DEMO-1',
    'https://user@example.com', 'https://:pass@example.com',
    'not a url', '   ', null, 123
  ];
  for (const [index, url] of invalidUrls.entries()) {
    const result = normalizeTeamworkGraphResponse({
      data: { jiraWorkItemGoals: connection([{ id: `g-${index}`, url }]) }
    });
    assert.equal(result.goals[0].url, '', `expected URL to be rejected: ${String(url)}`);
  }
});

test('truncated category metadata is deduplicated and allowlisted', () => {
  const result = normalizeTeamworkGraphResponse({
    data: { jiraWorkItemGoals: connection([{ id: 'g' }]) },
    truncatedCategories: ['goals', 'goals', 'deployments', 'pullRequests', 'other', null, 1]
  });
  assert.deepEqual(result.truncatedCategories, ['goals', 'deployments', 'pullRequests']);
  assert.match(result.warning, /goals, deployments, pull requests/);
});

test('unknown GraphQL errors are not leaked to the user-facing warning', () => {
  const secret = 'internal-hostname secret-token stack-trace';
  const result = normalizeTeamworkGraphResponse({
    data: { jiraWorkItemGoals: connection() },
    errors: [{ message: secret, extensions: { authorization: 'Bearer secret' } }]
  });
  assert.equal(result.status, 'unavailable');
  assert.doesNotMatch(result.warning, /internal-hostname|secret-token|Bearer/);
});

test('returns unavailable without a callable current-user API client', async () => {
  const variants = [null, {}, { asUser: null }, { asUser: () => null }, { asUser: () => ({}) }];
  for (const apiClient of variants) {
    const result = await fetchTeamworkGraphEvidence(apiClient, ISSUE_ID, CLOUD_ID);
    assert.equal(result.status, 'unavailable');
    assert.deepEqual(result.goals, []);
  }
});

test('does not call Graph when issue id or cloud id is invalid', async () => {
  let calls = 0;
  const apiClient = clientFor(() => { calls += 1; return graphResponse(); });
  for (const [issueId, cloudId] of [
    ['DEMO-9', CLOUD_ID], ['0', CLOUD_ID], [ISSUE_ID, 'bad'], [ISSUE_ID, null]
  ]) {
    const result = await fetchTeamworkGraphEvidence(apiClient, issueId, cloudId);
    assert.equal(result.status, 'unavailable');
  }
  assert.equal(calls, 0);
});

test('contains thrown current-user API client errors', async () => {
  const apiClient = { asUser() { throw new Error('internal details'); } };
  const result = await fetchTeamworkGraphEvidence(apiClient, ISSUE_ID, CLOUD_ID);
  assert.equal(result.status, 'unavailable');
  assert.doesNotMatch(result.warning, /internal details/);
});

test('contains rejected Graph requests without leaking upstream details', async () => {
  const apiClient = clientFor(() => { throw new Error('private upstream host and token'); });
  const result = await fetchTeamworkGraphEvidence(apiClient, ISSUE_ID, CLOUD_ID);
  assert.equal(result.status, 'unavailable');
  assert.doesNotMatch(result.warning, /private upstream|token/);
});

test('handles primitive and null Graph responses without throwing', async () => {
  for (const response of [null, undefined, false, 0, 'bad response']) {
    const result = await fetchTeamworkGraphEvidence(clientFor(() => response), ISSUE_ID, CLOUD_ID);
    assert.equal(result.status, 'unavailable');
  }
});

test('handles Graph responses with missing or non-object data without throwing', async () => {
  for (const response of [{}, { data: null }, { data: 'bad' }, { data: [] }]) {
    const result = await fetchTeamworkGraphEvidence(clientFor(() => response), ISSUE_ID, CLOUD_ID);
    assert.equal(result.status, 'unavailable');
  }
});

for (const [category, field] of [
  ['goals', 'jiraWorkItemGoals'],
  ['deployments', 'jiraWorkItemLinkedExternalDeployments'],
  ['pullRequests', 'jiraWorkItemLinkedExternalPullRequests']
]) {
  test(`marks missing ${category} connection metadata unavailable without crashing`, async () => {
    const response = graphResponse();
    delete response.data[field];
    const result = await fetchTeamworkGraphEvidence(clientFor(() => response), ISSUE_ID, CLOUD_ID);
    assert.equal(result.status, 'unavailable');
    assert.match(result.warning, /could not be loaded/i);
  });

  test(`stops only the malformed ${category} connection and continues other categories`, async () => {
    const response = graphResponse({
      goals: connection([{ id: 'g1', name: 'Goal' }]),
      deployments: connection([{ id: 'd1', displayName: 'Deploy' }]),
      pullRequests: connection([{ id: 'p1', title: 'PR' }])
    });
    response.data[field] = { edges: 'malformed' };
    const result = await fetchTeamworkGraphEvidence(clientFor(() => response), ISSUE_ID, CLOUD_ID);
    assert.equal(result.status, 'partial');
    assert.equal(result.goals.length, category === 'goals' ? 0 : 1);
    assert.equal(result.deployments.length, category === 'deployments' ? 0 : 1);
    assert.equal(result.pullRequests.length, category === 'pullRequests' ? 0 : 1);
  });

  test(`marks missing ${category} pagination metadata as a partial result`, async () => {
    const response = graphResponse();
    response.data[field] = { edges: [] };
    const result = await fetchTeamworkGraphEvidence(clientFor(() => response), ISSUE_ID, CLOUD_ID);
    assert.equal(result.status, 'unavailable');
    assert.match(result.warning, /could not be loaded/i);
  });
}

test('marks missing cursor as truncated and stops requesting further pages', async () => {
  const calls = [];
  const response = graphResponse({ goals: connection([{ id: 'g1' }], true, null) });
  const result = await fetchTeamworkGraphEvidence(clientFor(() => response, calls), ISSUE_ID, CLOUD_ID);
  assert.equal(calls.length, 1);
  assert.deepEqual(result.truncatedCategories, ['goals']);
  assert.equal(result.goals.length, 1);
});

test('marks blank cursor as truncated and stops requesting further pages', async () => {
  const calls = [];
  const response = graphResponse({ goals: connection([{ id: 'g1' }], true, '   ') });
  const result = await fetchTeamworkGraphEvidence(clientFor(() => response, calls), ISSUE_ID, CLOUD_ID);
  assert.equal(calls.length, 1);
  assert.deepEqual(result.truncatedCategories, ['goals']);
});

test('detects a repeated cursor and avoids an infinite pagination loop', async () => {
  const calls = [];
  const response = graphResponse({ goals: connection([{ id: 'g1' }], true, 'same-cursor') });
  const result = await fetchTeamworkGraphEvidence(clientFor(() => response, calls), ISSUE_ID, CLOUD_ID);
  assert.equal(calls.length, 2);
  assert.deepEqual(result.truncatedCategories, ['goals']);
});

test('deduplicates repeated records returned on later pages', async () => {
  let page = 0;
  const client = clientFor(() => {
    page += 1;
    if (page === 1) return graphResponse({ goals: connection([{ id: 'g1', name: 'First' }], true, 'next') });
    return graphResponse({ goals: connection([{ id: 'g1', name: 'Duplicate' }, { id: 'g2', name: 'Second' }]) });
  });
  const result = await fetchTeamworkGraphEvidence(client, ISSUE_ID, CLOUD_ID);
  assert.deepEqual(result.goals.map((item) => item.id), ['g1', 'g2']);
  assert.equal(result.goals[0].name, 'First');
});

test('does not send completed categories in subsequent pagination requests', async () => {
  const calls = [];
  let page = 0;
  const client = clientFor(() => {
    page += 1;
    if (page === 1) return graphResponse({
      goals: connection([{ id: 'g1' }], true, 'g-next'),
      deployments: connection([{ id: 'd1' }]),
      pullRequests: connection([{ id: 'p1' }])
    });
    return graphResponse({ goals: connection([{ id: 'g2' }]) });
  }, calls);
  await fetchTeamworkGraphEvidence(client, ISSUE_ID, CLOUD_ID);
  assert.equal(calls.length, 2);
  assert.equal(calls[1].variables.includeGoals, true);
  assert.equal(calls[1].variables.includeDeployments, false);
  assert.equal(calls[1].variables.includePullRequests, false);
});

test('respects the per-category page safety limit', async () => {
  const calls = [];
  let page = 0;
  const client = clientFor(() => {
    page += 1;
    return graphResponse({
      goals: connection([{ id: `g${page}` }], true, `cursor-${page}`)
    });
  }, calls);
  const result = await fetchTeamworkGraphEvidence(client, ISSUE_ID, CLOUD_ID);
  assert.equal(MAX_PAGES_PER_CATEGORY, 5);
  assert.equal(calls.length, MAX_PAGES_PER_CATEGORY);
  assert.deepEqual(result.truncatedCategories, ['goals']);
});

test('query uses variables and field inclusion rather than interpolating user input', () => {
  assert.match(TEAMWORK_GRAPH_QUERY, /\$id: ID!/);
  assert.match(TEAMWORK_GRAPH_QUERY, /@include\(if: \$includeGoals\)/);
  assert.match(TEAMWORK_GRAPH_QUERY, /@include\(if: \$includeDeployments\)/);
  assert.match(TEAMWORK_GRAPH_QUERY, /@include\(if: \$includePullRequests\)/);
  assert.doesNotMatch(TEAMWORK_GRAPH_QUERY, /DEMO-9|10006|c0e47565/);
});

test('Graph errors plus partial data preserve records and mark partial', async () => {
  const response = graphResponse({
    deployments: connection([{ id: 'd1', displayName: 'Real deployment' }]),
    errors: [{ message: 'Forbidden field' }]
  });
  const result = await fetchTeamworkGraphEvidence(clientFor(() => response), ISSUE_ID, CLOUD_ID);
  assert.equal(result.status, 'partial');
  assert.equal(result.deployments.length, 1);
});

test('Graph error without usable evidence marks the result unavailable', async () => {
  const response = graphResponse({ errors: [{ message: 'Forbidden' }] });
  const result = await fetchTeamworkGraphEvidence(clientFor(() => response), ISSUE_ID, CLOUD_ID);
  assert.equal(result.status, 'unavailable');
});

test('empty Graph response is not falsely presented as proof that no records exist', async () => {
  const result = await fetchTeamworkGraphEvidence(
    clientFor(() => graphResponse()),
    ISSUE_ID,
    CLOUD_ID
  );
  assert.equal(result.status, 'empty');
  assert.match(result.warning, /connector|scopes|permissions/i);
});

test('all three record categories are independent and can be empty or populated together', async () => {
  const result = await fetchTeamworkGraphEvidence(clientFor(() => graphResponse({
    goals: connection([{ id: 'g1', name: 'Goal' }]),
    deployments: connection([]),
    pullRequests: connection([{ id: 'p1', title: 'PR' }])
  })), ISSUE_ID, CLOUD_ID);
  assert.equal(result.status, 'available');
  assert.equal(result.goals.length, 1);
  assert.equal(result.deployments.length, 0);
  assert.equal(result.pullRequests.length, 1);
});

test('each Graph request uses the current-user API client', async () => {
  let asUserCalls = 0;
  const apiClient = {
    asUser() {
      asUserCalls += 1;
      return { async requestTeamworkGraph() { return graphResponse(); } };
    }
  };
  await fetchTeamworkGraphEvidence(apiClient, ISSUE_ID, CLOUD_ID);
  assert.equal(asUserCalls, 1);
});
