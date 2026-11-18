'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { buildInvestigationLeads } = require('../src/domain/investigation');

const ISSUE = { created: '2026-11-16T10:00:00.000Z' };

function graph(overrides = {}) {
  return { status: 'available', goals: [], deployments: [], pullRequests: [], ...overrides };
}

test('recognizes every terminal Jira status without creating an investigation lead', () => {
  for (const status of ['Done', 'Resolved', 'Closed', 'Cancelled', 'Canceled', 'Completed', 'Complete']) {
    const leads = buildInvestigationLeads({
      issue: ISSUE,
      relatedWorkItems: [{ key: 'DEMO-1', status }],
      teamworkGraph: graph()
    });
    assert.deepEqual(leads, [], `terminal status should be ignored: ${status}`);
  }
});

test('creates a follow-up for each non-terminal related Jira status', () => {
  for (const status of ['Open', 'To Do', 'In Progress', 'Waiting for support']) {
    const leads = buildInvestigationLeads({
      issue: ISSUE,
      relatedWorkItems: [{ key: 'DEMO-2', status }],
      teamworkGraph: graph()
    });
    assert.equal(leads.length, 1);
    assert.equal(leads[0].sourceType, 'jiraIssue');
    assert.equal(leads[0].priority, 'low');
  }
});

test('treats failed deployment states case-insensitively and prioritizes production only', () => {
  const leads = buildInvestigationLeads({
    issue: ISSUE,
    teamworkGraph: graph({
      deployments: [
        { id: 'prod', state: 'failed', environmentType: 'production' },
        { id: 'stage', state: 'FAILED', environmentType: 'STAGING' }
      ]
    })
  });
  assert.equal(leads.length, 2);
  assert.equal(leads[0].sourceId, 'prod');
  assert.equal(leads[0].priority, 'high');
  assert.equal(leads[1].sourceId, 'stage');
  assert.equal(leads[1].priority, 'medium');
});

test('recognizes production environment labels when environment type is not mapped', () => {
  const leads = buildInvestigationLeads({
    issue: ISSUE,
    teamworkGraph: graph({
      deployments: [{ id: 'prod-label', state: 'FAILED', environment: 'Production' }]
    })
  });
  assert.equal(leads[0].priority, 'high');
  assert.match(leads[0].rationale, /production deployment/i);
});

test('creates medium-priority follow-ups for in-progress deployments', () => {
  const leads = buildInvestigationLeads({
    issue: ISSUE,
    teamworkGraph: graph({
      deployments: [{ id: 'running', state: 'IN_PROGRESS', environmentType: 'PRODUCTION' }]
    })
  });
  assert.equal(leads.length, 1);
  assert.equal(leads[0].priority, 'medium');
  assert.equal(leads[0].title, 'Check deployment in progress');
});

test('recognizes open and draft pull requests as pending investigation leads', () => {
  const leads = buildInvestigationLeads({
    issue: ISSUE,
    teamworkGraph: graph({
      pullRequests: [
        { id: 'open', status: 'OPEN' },
        { id: 'draft', status: 'DRAFT' }
      ]
    })
  });
  assert.equal(leads.length, 2);
  assert.ok(leads.every((lead) => lead.title === 'Review pending pull request'));
});

test('recognizes merged pull requests within the 24-hour window', () => {
  const leads = buildInvestigationLeads({
    issue: ISSUE,
    teamworkGraph: graph({
      pullRequests: [{ id: 'merged-recent', status: 'MERGED', updatedAt: '2026-11-15T10:00:00Z' }]
    })
  });
  assert.equal(leads.length, 1);
  assert.equal(leads[0].title, 'Compare recent merged change');
});

test('does not create a recent-merge lead outside the 24-hour window', () => {
  const leads = buildInvestigationLeads({
    issue: ISSUE,
    teamworkGraph: graph({
      pullRequests: [{ id: 'merged-old', status: 'MERGED', updatedAt: '2026-11-15T09:59:59Z' }]
    })
  });
  assert.deepEqual(leads, []);
});

test('creates a follow-up only for archived goals', () => {
  const leads = buildInvestigationLeads({
    issue: ISSUE,
    teamworkGraph: graph({
      goals: [
        { id: 'active', name: 'Active goal', archived: false },
        { id: 'unknown', name: 'Unknown archive state', archived: null },
        { id: 'archived', name: 'Archived goal', archived: true }
      ]
    })
  });
  assert.equal(leads.length, 1);
  assert.equal(leads[0].sourceType, 'goal');
  assert.equal(leads[0].sourceId, 'archived');
});

test('sorts high, medium and low priority leads without losing source order within a priority', () => {
  const leads = buildInvestigationLeads({
    issue: ISSUE,
    relatedWorkItems: [{ key: 'DEMO-8', status: 'Open' }],
    teamworkGraph: graph({
      deployments: [
        { id: 'stage-failed', state: 'FAILED', environmentType: 'STAGING' },
        { id: 'prod-failed', state: 'FAILED', environmentType: 'PRODUCTION' }
      ],
      pullRequests: [{ id: 'pr-open', status: 'OPEN' }],
      goals: [{ id: 'old-goal', archived: true }]
    })
  });
  assert.deepEqual(leads.map((lead) => lead.priority), ['high', 'medium', 'medium', 'low', 'low']);
  assert.deepEqual(leads.map((lead) => lead.sourceId), ['prod-failed', 'stage-failed', 'pr-open', 'DEMO-8', 'old-goal']);
});

test('handles malformed optional collections without throwing', () => {
  const leads = buildInvestigationLeads({
    issue: ISSUE,
    relatedWorkItems: 'not-an-array',
    teamworkGraph: { status: 'unavailable', deployments: null, pullRequests: {}, goals: false }
  });
  assert.equal(leads.length, 1);
  assert.equal(leads[0].sourceType, 'availability');
});

test('does not invent an availability warning when graph status is partial', () => {
  const leads = buildInvestigationLeads({
    issue: ISSUE,
    teamworkGraph: graph({ status: 'partial' })
  });
  assert.deepEqual(leads, []);
});
