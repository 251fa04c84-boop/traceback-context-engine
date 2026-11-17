'use strict';

// Deterministic property-style regression corpus. These are real node:test
// subtests, not a counter or a benchmark. Each case checks a specific invariant
// against a generated input so failures are reproducible by case number.
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  buildJiraIssueAri,
  normalizeTeamworkGraphResponse
} = require('../src/domain/teamwork-graph');
const { buildInvestigationLeads } = require('../src/domain/investigation');

const CASES_PER_PROPERTY = 1000;
const CLOUD_ID = 'c0e47565-a2b1-472f-bd30-5c1e3684bb1e';

function validUuid(index) {
  const hex = index.toString(16).padStart(12, '0').slice(-12);
  return `123e4567-e89b-42d3-a456-${hex}`;
}

function connection(nodes) {
  return {
    edges: nodes.map((node) => ({ node })),
    pageInfo: { hasNextPage: false, endCursor: null }
  };
}

test('1,000 generated valid Jira ARIs preserve the exact validated identifiers', async (t) => {
  for (let index = 1; index <= CASES_PER_PROPERTY; index += 1) {
    await t.test(`valid ARI case ${index}`, () => {
      const cloudId = validUuid(index);
      const issueId = String(index * 7919);
      assert.equal(
        buildJiraIssueAri(cloudId, issueId),
        `ari:cloud:jira:${cloudId}:issue/${issueId}`
      );
    });
  }
});

test('1,000 generated hostile issue identifiers are rejected', async (t) => {
  const hostile = (index) => [
    `../${index}`,
    `${index}/../../admin`,
    `${index}?expand=all`,
    `${index}#fragment`,
    `+${index}`,
    `-${index}`,
    `${index}.0`,
    `${index}e2`,
    `DEMO-${index}`,
    ` ${index} `
  ][index % 10];

  for (let index = 1; index <= CASES_PER_PROPERTY; index += 1) {
    await t.test(`hostile issue id case ${index}`, () => {
      assert.throws(() => buildJiraIssueAri(CLOUD_ID, hostile(index)), TypeError);
    });
  }
});

test('1,000 generated Graph nodes preserve stable ids and reject unsafe URLs', async (t) => {
  for (let index = 1; index <= CASES_PER_PROPERTY; index += 1) {
    await t.test(`Graph node normalization case ${index}`, () => {
      const id = `goal-${index}`;
      const safeUrl = `https://example-${index}.com/a/b`;
      const unsafeUrl = `javascript:alert(${index})`;
      const normalized = normalizeTeamworkGraphResponse({
        data: {
          jiraWorkItemGoals: connection([
            { id, name: ` Goal ${index} `, url: safeUrl },
            { id: `bad-${index}`, name: 'unsafe link', url: unsafeUrl }
          ])
        }
      });
      assert.equal(normalized.status, 'available');
      assert.equal(normalized.goals.length, 2);
      assert.equal(normalized.goals[0].id, id);
      assert.equal(normalized.goals[0].name, `Goal ${index}`);
      assert.equal(normalized.goals[0].url, safeUrl);
      assert.equal(normalized.goals[1].url, '');
    });
  }
});

test('1,000 generated investigation inputs never produce duplicate lead identities', async (t) => {
  for (let index = 1; index <= CASES_PER_PROPERTY; index += 1) {
    await t.test(`investigation identity case ${index}`, () => {
      const leads = buildInvestigationLeads({
        issue: { created: '2026-11-16T10:00:00.000Z' },
        teamworkGraph: {
          status: 'available',
          deployments: [{
            id: `deployment-${index}`,
            state: index % 2 === 0 ? 'FAILED' : 'IN_PROGRESS',
            environmentType: index % 3 === 0 ? 'PRODUCTION' : 'STAGING',
            title: `Deployment ${index}`
          }],
          pullRequests: [{
            id: `pull-${index}`,
            status: index % 2 === 0 ? 'OPEN' : 'DRAFT',
            title: `Pull request ${index}`
          }],
          goals: [{
            id: `goal-${index}`,
            archived: index % 2 === 0,
            name: `Goal ${index}`
          }]
        }
      });
      const ids = leads.map((lead) => lead.id);
      assert.equal(new Set(ids).size, ids.length);
      assert.ok(leads.every((lead) => ['high', 'medium', 'low'].includes(lead.priority)));
      assert.ok(leads.every((lead) => typeof lead.rationale === 'string' && lead.rationale.length > 0));
    });
  }
});
