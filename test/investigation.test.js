'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { buildInvestigationLeads } = require('../src/domain/investigation');

test('prioritizes a failed linked deployment without claiming it caused the issue', () => {
  const leads = buildInvestigationLeads({
    issue: { created: '2026-11-16T10:00:00Z' },
    relatedWorkItems: [],
    teamworkGraph: {
      status: 'available',
      deployments: [{
        id: 'deployment-1',
        title: 'Production rollout',
        state: 'FAILED',
        environment: 'Production',
        environmentType: 'PRODUCTION',
        provider: 'GitHub',
        url: 'https://github.com/acme/service/deployments/1',
        createdAt: '2026-11-16T09:30:00Z'
      }],
      pullRequests: [],
      goals: []
    }
  });

  assert.equal(leads[0].priority, 'high');
  assert.equal(leads[0].sourceType, 'deployment');
  assert.equal(leads[0].title, 'Inspect failed deployment');
  assert.equal(leads[0].url, 'https://github.com/acme/service/deployments/1');
  assert.match(leads[0].rationale, /FAILED/);
  assert.match(leads[0].rationale, /does not establish/i);
  assert.match(leads[0].rationale, /cause|caused|causation/i);
});

test('flags a production deployment recorded near issue creation as a timeline lead only', () => {
  const leads = buildInvestigationLeads({
    issue: { created: '2026-11-16T10:00:00Z' },
    teamworkGraph: {
      status: 'available',
      deployments: [{
        id: 'deployment-2',
        title: 'Production release',
        state: 'SUCCESSFUL',
        environment: 'Production',
        environmentType: 'PRODUCTION',
        provider: 'GitHub',
        url: 'https://github.com/acme/service/deployments/2',
        createdAt: '2026-11-16T08:00:00Z'
      }],
      pullRequests: [],
      goals: []
    }
  });

  assert.equal(leads.length, 1);
  assert.equal(leads[0].title, 'Review recent production deployment');
  assert.match(leads[0].rationale, /within 24 hours/i);
  assert.match(leads[0].rationale, /does not establish causation/i);
});

test('suggests reviewing open pull requests and unresolved related Jira work', () => {
  const leads = buildInvestigationLeads({
    issue: { created: '2026-11-16T10:00:00Z' },
    relatedWorkItems: [{
      key: 'DEMO-8',
      summary: 'Automatically update linked requests',
      status: 'In Progress',
      issueType: 'Task',
      priority: 'Medium',
      relationship: 'blocks',
      url: '/browse/DEMO-8'
    }],
    teamworkGraph: {
      status: 'available',
      deployments: [],
      pullRequests: [{
        id: 'pr-12',
        title: 'Retry payment capture',
        displayId: '12',
        status: 'OPEN',
        provider: 'GitHub',
        url: 'https://github.com/acme/service/pull/12'
      }],
      goals: []
    }
  });

  assert.equal(leads.length, 2);
  assert.equal(leads[0].sourceType, 'pullRequest');
  assert.equal(leads[0].title, 'Review pending pull request');
  assert.equal(leads[1].sourceType, 'jiraIssue');
  assert.equal(leads[1].title, 'Review related Jira work');
  assert.equal(leads[1].url, '/browse/DEMO-8');
});

test('shows a scope and connector check when no external graph records are returned', () => {
  const leads = buildInvestigationLeads({
    issue: {},
    relatedWorkItems: [],
    teamworkGraph: {
      status: 'empty',
      goals: [],
      deployments: [],
      pullRequests: [],
      warning: 'No links returned.'
    }
  });

  assert.equal(leads.length, 1);
  assert.equal(leads[0].sourceType, 'availability');
  assert.equal(leads[0].title, 'Verify connected evidence sources');
  assert.match(leads[0].rationale, /scopes|permissions|connectors/i);
});

test('does not infer time proximity when issue or evidence timestamps are invalid', () => {
  const leads = buildInvestigationLeads({
    issue: { created: 'not-a-date' },
    teamworkGraph: {
      status: 'available',
      deployments: [{
        id: 'deployment-3',
        title: 'Production release',
        state: 'SUCCESSFUL',
        environmentType: 'PRODUCTION',
        url: 'https://github.com/acme/service/deployments/3',
        createdAt: 'also-not-a-date'
      }],
      pullRequests: [],
      goals: []
    }
  });

  assert.deepEqual(leads, []);
});

test('does not assign production-level priority to a failed non-production deployment', () => {
  const leads = buildInvestigationLeads({
    issue: { created: '2026-11-16T10:00:00Z' },
    teamworkGraph: {
      status: 'available',
      deployments: [{
        id: 'deployment-staging',
        title: 'Staging rollout',
        state: 'FAILED',
        environment: 'Staging',
        environmentType: 'STAGING',
        provider: 'GitHub',
        url: 'https://github.com/acme/service/deployments/staging-1',
        createdAt: '2026-11-16T09:30:00Z'
      }],
      pullRequests: [],
      goals: []
    }
  });

  assert.equal(leads.length, 1);
  assert.equal(leads[0].priority, 'medium');
  assert.match(leads[0].rationale, /FAILED/);
  assert.match(leads[0].rationale, /does not establish/i);
});


test('assigns a transparent deterministic review score without implying causal confidence', () => {
  const leads = buildInvestigationLeads({
    issue: { created: '2026-11-16T10:00:00Z' },
    teamworkGraph: {
      status: 'available',
      deployments: [{
        id: 'production-failure',
        title: 'Production rollout',
        state: 'FAILED',
        environmentType: 'PRODUCTION'
      }],
      pullRequests: [],
      goals: []
    }
  });

  assert.equal(leads[0].rankScore, 90);
  assert.equal(leads[0].priority, 'high');
  assert.equal(leads[0].evidenceKind, 'direct-status');
  assert.match(leads[0].scoreMeaning, /not a probability/i);
  assert.match(leads[0].rationale, /does not establish/i);
});

test('ranks independent evidence types by fixed review-priority rules and preserves source links', () => {
  const leads = buildInvestigationLeads({
    issue: { created: '2026-11-16T10:00:00Z' },
    relatedWorkItems: [{
      key: 'DEMO-8',
      summary: 'Blocked task',
      status: 'In Progress',
      relationship: 'blocks',
      url: '/browse/DEMO-8'
    }],
    teamworkGraph: {
      status: 'available',
      deployments: [{
        id: 'deployment-1',
        title: 'Production failure',
        state: 'FAILED',
        environmentType: 'PRODUCTION',
        url: 'https://example.test/deployments/1'
      }],
      pullRequests: [{
        id: 'pr-1',
        title: 'Pending change',
        status: 'OPEN',
        url: 'https://example.test/pull/1'
      }],
      goals: [{ id: 'goal-1', name: 'Archived goal', archived: true }]
    }
  });

  assert.deepEqual(leads.map((lead) => lead.rankScore), [90, 52, 38, 18]);
  assert.deepEqual(leads.map((lead) => lead.priority), ['high', 'medium', 'low', 'low']);
  assert.equal(leads[0].url, 'https://example.test/deployments/1');
  assert.equal(leads[1].url, 'https://example.test/pull/1');
  assert.equal(leads[2].evidenceKind, 'relationship');
  assert.equal(leads[3].evidenceKind, 'lifecycle-status');
});

test('keeps temporal clues distinct from direct status evidence', () => {
  const leads = buildInvestigationLeads({
    issue: { created: '2026-11-16T10:00:00Z' },
    teamworkGraph: {
      status: 'available',
      deployments: [{
        id: 'recent-production',
        title: 'Recent production release',
        state: 'SUCCESSFUL',
        environmentType: 'PRODUCTION',
        createdAt: '2026-11-16T09:00:00Z'
      }],
      pullRequests: [],
      goals: []
    }
  });

  assert.equal(leads[0].rankScore, 60);
  assert.equal(leads[0].evidenceKind, 'temporal-association');
  assert.match(leads[0].scoreMeaning, /not a probability/i);
  assert.match(leads[0].rationale, /does not establish causation/i);
});


test('uses the nearest valid created or updated timestamp and exposes its provenance', () => {
  const leads = buildInvestigationLeads({
    issue: { created: '2026-11-16T10:00:00Z' },
    teamworkGraph: {
      status: 'available',
      deployments: [],
      pullRequests: [{
        id: 'merged-pr-nearest',
        title: 'Recent merged change',
        status: 'MERGED',
        createdAt: '2026-11-10T10:00:00Z',
        updatedAt: '2026-11-16T09:30:00+00:00'
      }],
      goals: []
    }
  });

  assert.equal(leads.length, 1);
  assert.equal(leads[0].temporalEvidence.field, 'updatedAt');
  assert.equal(leads[0].temporalEvidence.occurredAt, '2026-11-16T09:30:00.000Z');
  assert.equal(leads[0].temporalEvidence.distanceHours, 0.5);
  assert.match(leads[0].rationale, /updatedAt at 0\.5 hours/);
});

test('accepts an exact 24-hour temporal boundary with an explicit timezone offset', () => {
  const leads = buildInvestigationLeads({
    issue: { created: '2026-11-16T10:00:00+05:30' },
    teamworkGraph: {
      status: 'available',
      deployments: [{
        id: 'boundary-deployment',
        title: 'Production deployment',
        state: 'SUCCESSFUL',
        environmentType: 'PRODUCTION',
        createdAt: '2026-11-15T10:00:00+05:30'
      }],
      pullRequests: [],
      goals: []
    }
  });

  assert.equal(leads.length, 1);
  assert.equal(leads[0].temporalEvidence.field, 'createdAt');
  assert.equal(leads[0].temporalEvidence.distanceHours, 24);
});

test('rejects ambiguous, malformed and impossible calendar timestamps for temporal scoring', () => {
  const invalidIssueDates = ['11/16/2026 10:00', '2026-02-30T10:00:00Z', '2026-11-16 10:00:00Z'];
  for (const created of invalidIssueDates) {
    const leads = buildInvestigationLeads({
      issue: { created },
      teamworkGraph: {
        status: 'available',
        deployments: [{
          id: 'recent-production',
          state: 'SUCCESSFUL',
          environmentType: 'PRODUCTION',
          createdAt: '2026-11-16T09:00:00Z'
        }],
        pullRequests: [],
        goals: []
      }
    });
    assert.deepEqual(leads, [], 'invalid issue timestamp must not create a temporal lead: ' + created);
  }
});

test('uses a valid created timestamp when updated timestamp is malformed', () => {
  const leads = buildInvestigationLeads({
    issue: { created: '2026-11-16T10:00:00Z' },
    teamworkGraph: {
      status: 'available',
      deployments: [{
        id: 'production-fallback',
        state: 'SUCCESSFUL',
        environmentType: 'PRODUCTION',
        createdAt: '2026-11-16T09:45:00Z',
        updatedAt: 'yesterday'
      }],
      pullRequests: [],
      goals: []
    }
  });

  assert.equal(leads.length, 1);
  assert.equal(leads[0].temporalEvidence.field, 'createdAt');
  assert.equal(leads[0].temporalEvidence.distanceHours, 0.25);
});

test('accepts valid fractional seconds and reports normalized source time', () => {
  const leads = buildInvestigationLeads({
    issue: { created: '2026-11-16T10:00:00.000Z' },
    teamworkGraph: {
      status: 'available',
      deployments: [{
        id: 'fractional-time',
        state: 'SUCCESSFUL',
        environmentType: 'PRODUCTION',
        createdAt: '2026-11-16T09:59:59.500Z'
      }],
      pullRequests: [],
      goals: []
    }
  });

  assert.equal(leads.length, 1);
  assert.equal(leads[0].temporalEvidence.occurredAt, '2026-11-16T09:59:59.500Z');
  assert.equal(leads[0].temporalEvidence.distanceHours, 0);
});
