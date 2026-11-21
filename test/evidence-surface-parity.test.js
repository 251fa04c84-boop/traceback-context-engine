'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { runTracebackInvestigationAction } = require('../src/domain/rovo-investigation-action');
const { runIssueContextResolver } = require('../src/domain/issue-context-resolver');
const { resolveActionIssueKey } = require('../src/domain/action-context');
const { resolveIssueKey, normalizeIssue } = require('../src/domain/incident');
const { buildInvestigationLeads } = require('../src/domain/investigation');
const { buildIncidentTimeline } = require('../src/domain/timeline');
const { buildEvidenceCoverage } = require('../src/domain/evidence-coverage');

const issuePayload = {
  id: '10042',
  key: 'PAY-123',
  fields: {
    summary: 'Checkout requests are timing out',
    description: 'Customers report intermittent checkout failures.',
    issuetype: { name: 'Incident' },
    status: { name: 'In Progress' },
    priority: { name: 'High' },
    project: { key: 'PAY' },
    created: '2026-11-20T10:00:00Z',
    updated: '2026-11-20T10:15:00Z',
    issuelinks: [{
      type: { name: 'Blocks', outward: 'blocks', inward: 'is blocked by' },
      outwardIssue: {
        key: 'PAY-122',
        fields: {
          summary: 'Payment provider timeout handling',
          status: { name: 'In Progress' },
          issuetype: { name: 'Task' },
          priority: { name: 'Medium' }
        }
      }
    }]
  }
};

const cloudId = 'c0e47565-a2b1-472f-bd30-5c1e3684bb1e';
const graphFixtures = [
  {
    name: 'available linked evidence',
    graph: {
      source: 'Atlassian Teamwork Graph',
      status: 'available',
      goals: [{ id: 'goal-1', key: 'REL-1', name: 'Reliable checkout', url: 'https://example.atlassian.net/goals/1', archived: false }],
      deployments: [{
        id: 'deployment-1',
        title: 'Checkout production rollout',
        state: 'FAILED',
        environment: 'Production',
        environmentType: 'PRODUCTION',
        provider: 'GitHub',
        url: 'https://github.com/example/payments/deployments/1',
        createdAt: '2026-11-20T09:45:00Z',
        updatedAt: '2026-11-20T09:50:00Z'
      }],
      pullRequests: [{
        id: 'pull-request-1',
        title: 'Increase payment timeout',
        displayId: '42',
        status: 'MERGED',
        provider: 'GitHub',
        url: 'https://github.com/example/payments/pull/42',
        createdAt: '2026-11-20T09:30:00Z',
        updatedAt: '2026-11-20T09:40:00Z'
      }]
    }
  },
  {
    name: 'partial linked evidence',
    graph: {
      source: 'Atlassian Teamwork Graph',
      status: 'partial',
      warning: 'Some connected evidence is unavailable to this user.',
      goals: [],
      deployments: [{
        id: 'deployment-partial',
        title: 'Staging rollout',
        state: 'IN_PROGRESS',
        environment: 'Staging',
        environmentType: 'STAGING',
        provider: 'GitHub',
        url: 'https://github.com/example/payments/deployments/2',
        createdAt: '2026-11-20T10:05:00Z'
      }],
      pullRequests: []
    }
  },
  {
    name: 'empty graph result',
    graph: {
      source: 'Atlassian Teamwork Graph',
      status: 'empty',
      warning: 'No linked records were returned for this user.',
      goals: [],
      deployments: [],
      pullRequests: []
    }
  },
  {
    name: 'unavailable graph result',
    graph: {
      source: 'Atlassian Teamwork Graph',
      status: 'unavailable',
      warning: 'Teamwork Graph access is unavailable.',
      goals: [],
      deployments: [],
      pullRequests: []
    }
  }
];

function route(strings, ...values) {
  return strings.reduce((result, part, index) => result + part + (values[index] ?? ''), '');
}

for (const fixture of graphFixtures) {
  test('compares actual Jira panel resolver and Rovo action outputs for ' + fixture.name, async () => {
    const calls = { asUser: 0, asApp: 0, jira: 0, graph: 0 };
    const api = {
      asUser() {
        calls.asUser += 1;
        return {
          async requestJira() {
            calls.jira += 1;
            return { ok: true };
          }
        };
      },
      asApp() {
        calls.asApp += 1;
        throw new Error('Investigation must never use app-level authorization.');
      }
    };
    const dependencies = {
      api,
      route,
      fetchJiraIssue: async (request, timeoutMs) => {
        assert.equal(timeoutMs, 8000);
        await request();
        return issuePayload;
      },
      defaultJiraRequestTimeoutMs: 8000,
      normalizeIssue,
      fetchTeamworkGraphEvidence: async (client, issueId, requestedCloudId) => {
        calls.graph += 1;
        assert.equal(client, api);
        assert.equal(issueId, '10042');
        assert.equal(requestedCloudId, cloudId);
        return fixture.graph;
      }
    };

    // Exercise the same production function used by the actual Jira issue panel.
    const panelIncident = await runIssueContextResolver({
      ...dependencies,
      payload: {},
      context: { cloudId, extension: { issue: { key: 'PAY-123' } } },
      resolveIssueKey
    });

    // Exercise the production Rovo action independently against the same source fixtures.
    const rovoResult = await runTracebackInvestigationAction({
      ...dependencies,
      payload: {
        context: {
          cloudId,
          jira: { issueKey: 'PAY-123' }
        }
      },
      resolveActionIssueKey,
      buildInvestigationLeads,
      buildIncidentTimeline,
      buildEvidenceCoverage
    });

    const panelLeads = buildInvestigationLeads({
      issue: panelIncident,
      relatedWorkItems: panelIncident.relatedWorkItems,
      teamworkGraph: panelIncident.teamworkGraph
    });
    const panelTimeline = buildIncidentTimeline({
      issue: panelIncident,
      teamworkGraph: panelIncident.teamworkGraph
    });
    const panelCoverage = buildEvidenceCoverage({
      issue: panelIncident,
      teamworkGraph: panelIncident.teamworkGraph
    });

    assert.deepEqual(rovoResult.investigationLeads, panelLeads);
    assert.deepEqual(rovoResult.incidentTimeline, panelTimeline);
    assert.deepEqual(rovoResult.evidenceCoverage, panelCoverage);
    assert.equal(calls.asUser, 2);
    assert.equal(calls.asApp, 0);
    assert.equal(calls.jira, 2);
    assert.equal(calls.graph, 2);
    assert.equal(panelIncident.key, 'PAY-123');
    assert.equal(rovoResult.key, 'PAY-123');
    assert.equal(panelIncident.teamworkGraph.status, fixture.graph.status);
    assert.equal(rovoResult.teamworkGraph.status, fixture.graph.status);
  });
}
