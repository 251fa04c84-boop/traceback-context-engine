'use strict';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const TERMINAL_JIRA_STATUSES = new Set([
  'done',
  'resolved',
  'closed',
  'cancelled',
  'canceled',
  'completed',
  'complete'
]);

function parseTimestamp(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

function withinOneDay(first, second) {
  const firstTime = parseTimestamp(first);
  const secondTime = parseTimestamp(second);
  return firstTime !== null
    && secondTime !== null
    && Math.abs(firstTime - secondTime) <= ONE_DAY_MS;
}

function buildInvestigationLeads({
  issue = {},
  relatedWorkItems = [],
  teamworkGraph = {}
} = {}) {
  const leads = [];
  const deployments = Array.isArray(teamworkGraph.deployments)
    ? teamworkGraph.deployments
    : [];
  const pullRequests = Array.isArray(teamworkGraph.pullRequests)
    ? teamworkGraph.pullRequests
    : [];
  const goals = Array.isArray(teamworkGraph.goals)
    ? teamworkGraph.goals
    : [];
  const related = Array.isArray(relatedWorkItems) ? relatedWorkItems : [];

  function addLead(lead) {
    leads.push({
      id: lead.sourceType + ':' + lead.sourceId,
      ...lead
    });
  }

  for (const deployment of deployments) {
    const state = String(deployment.state || '').toUpperCase();
    const production = String(deployment.environmentType || '').toUpperCase() === 'PRODUCTION'
      || String(deployment.environment || '').toLowerCase() === 'production';
    const recent = withinOneDay(issue.created, deployment.createdAt || deployment.updatedAt);

    if (state === 'FAILED') {
      addLead({
        sourceType: 'deployment',
        sourceId: deployment.id || deployment.title || 'failed-deployment',
        sourceLabel: deployment.title || 'Linked deployment',
        title: 'Inspect failed deployment',
        priority: 'high',
        rationale: 'The linked deployment record reports FAILED. Inspect its source record; this status does not establish that the deployment caused the Jira issue.',
        url: deployment.url || ''
      });
    } else if (state === 'IN_PROGRESS') {
      addLead({
        sourceType: 'deployment',
        sourceId: deployment.id || deployment.title || 'in-progress-deployment',
        sourceLabel: deployment.title || 'Linked deployment',
        title: 'Check deployment in progress',
        priority: 'medium',
        rationale: 'The linked deployment is still IN_PROGRESS. Check its current state and completion record; this does not establish that it caused the Jira issue.',
        url: deployment.url || ''
      });
    } else if (production && recent) {
      addLead({
        sourceType: 'deployment',
        sourceId: deployment.id || deployment.title || 'recent-production-deployment',
        sourceLabel: deployment.title || 'Production deployment',
        title: 'Review recent production deployment',
        priority: 'medium',
        rationale: 'This linked production deployment was recorded within 24 hours of issue creation. Timing is a follow-up clue only and does not establish causation.',
        url: deployment.url || ''
      });
    }
  }

  for (const pullRequest of pullRequests) {
    const status = String(pullRequest.status || '').toUpperCase();
    const recent = withinOneDay(
      issue.created,
      pullRequest.updatedAt || pullRequest.createdAt
    );

    if (status === 'OPEN' || status === 'DRAFT') {
      addLead({
        sourceType: 'pullRequest',
        sourceId: pullRequest.id || pullRequest.displayId || pullRequest.title || 'open-pull-request',
        sourceLabel: pullRequest.title || 'Linked pull request',
        title: 'Review pending pull request',
        priority: 'medium',
        rationale: 'The linked pull request is still ' + status + '. Review its changes and review status; its open state does not establish that it caused the Jira issue.',
        url: pullRequest.url || ''
      });
    } else if (status === 'MERGED' && recent) {
      addLead({
        sourceType: 'pullRequest',
        sourceId: pullRequest.id || pullRequest.displayId || pullRequest.title || 'recent-merged-pull-request',
        sourceLabel: pullRequest.title || 'Merged pull request',
        title: 'Compare recent merged change',
        priority: 'medium',
        rationale: 'The linked pull request was updated within 24 hours of issue creation. Compare the change with the issue timeline; timing is not proof of causation.',
        url: pullRequest.url || ''
      });
    }
  }

  for (const item of related) {
    const status = String(item.status || '').trim();
    if (!status || TERMINAL_JIRA_STATUSES.has(status.toLowerCase())) continue;

    addLead({
      sourceType: 'jiraIssue',
      sourceId: item.key || item.summary || 'related-issue',
      sourceLabel: item.key || 'Related Jira issue',
      title: 'Review related Jira work',
      priority: 'low',
      rationale: 'A linked Jira work item is still ' + status + ' through the "' + (item.relationship || 'linked') + '" relationship. Check whether its current state affects this investigation.',
      url: item.url || ''
    });
  }

  for (const goal of goals) {
    if (goal.archived !== true) continue;
    addLead({
      sourceType: 'goal',
      sourceId: goal.id || goal.key || goal.name || 'archived-goal',
      sourceLabel: goal.name || goal.key || 'Linked goal',
      title: 'Confirm the linked goal still applies',
      priority: 'low',
      rationale: 'The linked Atlassian goal is archived. Confirm whether it remains relevant to this work item.',
      url: goal.url || ''
    });
  }

  const hasExternalRecords = goals.length > 0 || deployments.length > 0 || pullRequests.length > 0;
  if (!hasExternalRecords && ['empty', 'unavailable'].includes(teamworkGraph.status)) {
    addLead({
      sourceType: 'availability',
      sourceId: 'teamwork-graph',
      sourceLabel: 'Atlassian Teamwork Graph',
      title: 'Verify connected evidence sources',
      priority: 'low',
      rationale: 'No linked external goals, deployments, or pull requests were returned. This may mean no links exist, a connector is not configured, or required scopes and permissions are missing.',
      url: ''
    });
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return leads
    .map((lead, index) => ({ ...lead, order: index }))
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority] || a.order - b.order)
    .map(({ order, ...lead }) => lead);
}

module.exports = { buildInvestigationLeads };
