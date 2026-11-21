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

// These are deterministic triage-priority bands, not probabilities or root-cause confidence.
const PRIORITY_THRESHOLDS = { high: 70, medium: 40 };

function parseTimestamp(value) {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  const match = /^(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2}):(\\d{2})(?:\\.(\\d+))?(Z|[+-]\\d{2}:?\\d{2})$/i.exec(normalized);
  if (!match) return null;

  const [, yearText, monthText, dayText, hourText, minuteText, secondText, , offset] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const second = Number(secondText);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth
    || hour > 23 || minute > 59 || second > 59) return null;

  if (offset.toUpperCase() !== 'Z') {
    const offsetParts = offset.slice(1).replace(':', '');
    const offsetHours = Number(offsetParts.slice(0, 2));
    const offsetMinutes = Number(offsetParts.slice(2, 4));
    if (offsetHours > 23 || offsetMinutes > 59) return null;
  }

  const time = Date.parse(normalized);
  return Number.isFinite(time) ? time : null;
}

function nearestTimestampWithinOneDay(reference, candidates) {
  const referenceTime = parseTimestamp(reference);
  if (referenceTime === null) return null;

  const matches = candidates
    .map(({ field, value }) => ({ field, time: parseTimestamp(value) }))
    .filter((candidate) => candidate.time !== null)
    .map((candidate) => ({ ...candidate, distance: Math.abs(candidate.time - referenceTime) }))
    .filter((candidate) => candidate.distance <= ONE_DAY_MS)
    .sort((a, b) => a.distance - b.distance || a.field.localeCompare(b.field));

  if (matches.length === 0) return null;
  return {
    field: matches[0].field,
    occurredAt: new Date(matches[0].time).toISOString(),
    distanceHours: Math.round((matches[0].distance / (60 * 60 * 1000)) * 100) / 100
  };
}

function priorityForScore(score) {
  if (score >= PRIORITY_THRESHOLDS.high) return 'high';
  if (score >= PRIORITY_THRESHOLDS.medium) return 'medium';
  return 'low';
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
    const rankScore = Math.max(0, Math.min(100, Math.round(lead.rankScore)));
    leads.push({
      id: lead.sourceType + ':' + lead.sourceId,
      ...lead,
      rankScore,
      priority: priorityForScore(rankScore),
      scoreMeaning: 'Deterministic review priority only; not a probability, causal finding, or root-cause confidence.'
    });
  }

  for (const deployment of deployments) {
    const state = String(deployment.state || '').toUpperCase();
    const production = String(deployment.environmentType || '').toUpperCase() === 'PRODUCTION'
      || String(deployment.environment || '').toLowerCase() === 'production';
    const temporalEvidence = nearestTimestampWithinOneDay(issue.created, [
      { field: 'createdAt', value: deployment.createdAt },
      { field: 'updatedAt', value: deployment.updatedAt }
    ]);

    if (state === 'FAILED') {
      addLead({
        sourceType: 'deployment',
        sourceId: deployment.id || deployment.title || 'failed-deployment',
        sourceLabel: deployment.title || 'Linked deployment',
        title: 'Inspect failed deployment',
        rankScore: production ? 90 : 65,
        evidenceKind: 'direct-status',
        rationale: 'The linked ' + (production ? 'production ' : '') + 'deployment record reports FAILED. Inspect its source record; this status does not establish that the deployment caused the Jira issue.',
        url: deployment.url || ''
      });
    } else if (state === 'IN_PROGRESS') {
      addLead({
        sourceType: 'deployment',
        sourceId: deployment.id || deployment.title || 'in-progress-deployment',
        sourceLabel: deployment.title || 'Linked deployment',
        title: 'Check deployment in progress',
        rankScore: 55,
        evidenceKind: 'direct-status',
        rationale: 'The linked deployment is still IN_PROGRESS. Check its current state and completion record; this does not establish that it caused the Jira issue.',
        url: deployment.url || ''
      });
    } else if (production && temporalEvidence) {
      addLead({
        sourceType: 'deployment',
        sourceId: deployment.id || deployment.title || 'recent-production-deployment',
        sourceLabel: deployment.title || 'Production deployment',
        title: 'Review recent production deployment',
        rankScore: 60,
        evidenceKind: 'temporal-association',
        temporalEvidence,
        rationale: 'This linked production deployment ' + temporalEvidence.field + ' timestamp is ' + temporalEvidence.distanceHours + ' hours from issue creation. Timing is a follow-up clue only and does not establish causation.',
        url: deployment.url || ''
      });
    }
  }

  for (const pullRequest of pullRequests) {
    const status = String(pullRequest.status || '').toUpperCase();
    const temporalEvidence = nearestTimestampWithinOneDay(issue.created, [
      { field: 'createdAt', value: pullRequest.createdAt },
      { field: 'updatedAt', value: pullRequest.updatedAt }
    ]);

    if (status === 'OPEN' || status === 'DRAFT') {
      addLead({
        sourceType: 'pullRequest',
        sourceId: pullRequest.id || pullRequest.displayId || pullRequest.title || 'open-pull-request',
        sourceLabel: pullRequest.title || 'Linked pull request',
        title: 'Review pending pull request',
        rankScore: status === 'OPEN' ? 52 : 46,
        evidenceKind: 'direct-status',
        rationale: 'The linked pull request is still ' + status + '. Review its changes and review status; its open state does not establish that it caused the Jira issue.',
        url: pullRequest.url || ''
      });
    } else if (status === 'MERGED' && temporalEvidence) {
      addLead({
        sourceType: 'pullRequest',
        sourceId: pullRequest.id || pullRequest.displayId || pullRequest.title || 'recent-merged-pull-request',
        sourceLabel: pullRequest.title || 'Merged pull request',
        title: 'Compare recent merged change',
        rankScore: 58,
        evidenceKind: 'temporal-association',
        temporalEvidence,
        rationale: 'The linked pull request ' + temporalEvidence.field + ' timestamp is ' + temporalEvidence.distanceHours + ' hours from issue creation. Compare the change with the issue timeline; timing is not proof of causation.',
        url: pullRequest.url || ''
      });
    }
  }

  for (const item of related) {
    const status = String(item.status || '').trim();
    if (!status || TERMINAL_JIRA_STATUSES.has(status.toLowerCase())) continue;
    const relationship = String(item.relationship || 'linked');
    const blocking = /^(blocks|is blocked by|blocked by)$/i.test(relationship);

    addLead({
      sourceType: 'jiraIssue',
      sourceId: item.key || item.summary || 'related-issue',
      sourceLabel: item.key || 'Related Jira issue',
      title: 'Review related Jira work',
      rankScore: blocking ? 38 : 28,
      evidenceKind: 'relationship',
      rationale: 'A linked Jira work item is still ' + status + ' through the "' + relationship + '" relationship. Check whether its current state affects this investigation; the relationship alone does not prove impact.',
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
      rankScore: 18,
      evidenceKind: 'lifecycle-status',
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
      rankScore: 8,
      evidenceKind: 'coverage-gap',
      rationale: 'No linked external goals, deployments, or pull requests were returned. This may mean no links exist, a connector is not configured, or required scopes and permissions are missing.',
      url: ''
    });
  }

  return leads
    .map((lead, index) => ({ ...lead, order: index }))
    .sort((a, b) => b.rankScore - a.rankScore || a.order - b.order)
    .map(({ order, ...lead }) => lead);
}

module.exports = { buildInvestigationLeads };
