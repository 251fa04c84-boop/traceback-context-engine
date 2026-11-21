'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { buildIncidentTimeline } = require('../src/domain/timeline');

test('reconstructs a chronological timeline from Jira, deployment and pull-request timestamps', () => {
  const timeline = buildIncidentTimeline({
    issue: {
      key: 'PAY-42',
      summary: 'Checkout failures',
      created: '2026-11-21T10:00:00Z',
      updated: '2026-11-21T10:40:00Z'
    },
    teamworkGraph: {
      deployments: [{
        id: 'dep-1',
        title: 'Payments production rollout',
        state: 'FAILED',
        environment: 'Production',
        createdAt: '2026-11-21T10:15:00Z',
        updatedAt: '2026-11-21T10:20:00Z',
        url: 'https://example.test/deployments/1'
      }],
      pullRequests: [{
        id: 'pr-7',
        title: 'Change payment retries',
        status: 'MERGED',
        createdAt: '2026-11-21T09:30:00Z',
        updatedAt: '2026-11-21T09:50:00Z',
        url: 'https://example.test/pull/7'
      }]
    }
  });

  assert.deepEqual(timeline.map((event) => event.eventType), [
    'pull-request-created',
    'pull-request-last-updated',
    'issue-created',
    'deployment-created',
    'deployment-last-updated',
    'issue-last-updated'
  ]);
  assert.equal(timeline[0].url, 'https://example.test/pull/7');
  assert.equal(timeline[2].url, '/browse/PAY-42');
  assert.equal(timeline[3].summary, 'Payments production rollout · FAILED · Production');
  assert.match(timeline[5].provenance, /not a complete change history/i);
});

test('does not invent events when source timestamps are missing or malformed', () => {
  const timeline = buildIncidentTimeline({
    issue: { key: 'PAY-42', created: 'not-a-date', updated: null },
    teamworkGraph: {
      deployments: [{ id: 'dep-1', title: 'No timestamp' }],
      pullRequests: [{ id: 'pr-1', title: 'Bad timestamp', createdAt: 'yesterday-ish' }]
    }
  });
  assert.deepEqual(timeline, []);
});

test('deduplicates repeated source events and keeps same-time records deterministically ordered', () => {
  const timeline = buildIncidentTimeline({
    issue: { key: 'PAY-42', created: '2026-11-21T10:00:00Z' },
    teamworkGraph: {
      deployments: [
        { id: 'dep-2', title: 'Second', createdAt: '2026-11-21T10:00:00Z' },
        { id: 'dep-1', title: 'First', createdAt: '2026-11-21T10:00:00Z' },
        { id: 'dep-1', title: 'First', createdAt: '2026-11-21T10:00:00Z' }
      ],
      pullRequests: []
    }
  });

  assert.equal(timeline.length, 3);
  assert.deepEqual(timeline.map((event) => event.id), [
    'deployment:dep-1:created',
    'deployment:dep-2:created',
    'jiraIssue:PAY-42:created'
  ]);
});

test('preserves partial evidence without pretending the timeline is complete', () => {
  const timeline = buildIncidentTimeline({
    issue: { key: 'PAY-42', created: '2026-11-21T10:00:00Z' },
    teamworkGraph: {
      status: 'partial',
      warning: 'Pagination incomplete.',
      deployments: [{ id: 'dep-1', createdAt: '2026-11-21T10:10:00Z' }],
      pullRequests: []
    }
  });

  assert.equal(timeline.length, 2);
  assert.equal(timeline[1].sourceType, 'deployment');
  assert.equal(timeline[1].provenance, 'Deployment createdAt timestamp from Atlassian Teamwork Graph.');
});


test('accepts Jira timezone offsets but rejects ambiguous non-ISO date strings', () => {
  const timeline = buildIncidentTimeline({
    issue: {
      key: 'PAY-43',
      created: '2026-11-21T10:00:00.000+0000',
      updated: '2026-11-21T15:30:00+05:30'
    },
    teamworkGraph: {
      deployments: [{ id: 'dep-bad', createdAt: '2026-11-21' }],
      pullRequests: [{ id: 'pr-bad', createdAt: 'yesterday' }]
    }
  });

  assert.equal(timeline.length, 1);
  assert.equal(timeline[0].occurredAt, '2026-11-21T10:00:00.000Z');
  assert.equal(timeline[0].eventType, 'issue-created');
});

test('does not show a last-updated marker when it represents the same instant as creation', () => {
  const timeline = buildIncidentTimeline({
    issue: {
      key: 'PAY-44',
      created: '2026-11-21T10:00:00Z',
      updated: '2026-11-21T15:30:00+05:30'
    },
    teamworkGraph: {
      deployments: [{
        id: 'dep-same',
        createdAt: '2026-11-21T10:00:00Z',
        updatedAt: '2026-11-21T15:30:00+05:30'
      }],
      pullRequests: []
    }
  });

  assert.deepEqual(timeline.map((event) => event.eventType), [
    'deployment-created',
    'issue-created'
  ]);
});


test('rejects impossible calendar dates and out-of-range offsets in every timeline source', () => {
  const timeline = buildIncidentTimeline({
    issue: { key: 'PAY-45', created: '2026-02-30T10:00:00Z' },
    teamworkGraph: {
      deployments: [{ id: 'dep-impossible', createdAt: '2026-04-31T10:00:00Z' }],
      pullRequests: [{ id: 'pr-offset', createdAt: '2026-11-21T10:00:00+14:01' }]
    }
  });
  assert.deepEqual(timeline, []);
});
