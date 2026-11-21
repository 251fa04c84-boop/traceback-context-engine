'use strict';

function parseEventTime(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{4}|[+-]\d{2}:\d{2})$/i.test(value.trim())) return null;
  const milliseconds = Date.parse(value);
  return Number.isFinite(milliseconds) ? new Date(milliseconds).toISOString() : null;
}

function buildIncidentTimeline({ issue = {}, teamworkGraph = {} } = {}) {
  const events = [];
  const seen = new Set();

  function addEvent(event, rawTimestamp) {
    const occurredAt = parseEventTime(rawTimestamp);
    if (!occurredAt) return;
    const dedupeKey = [event.sourceType, event.sourceId, event.eventType, occurredAt].join(':');
    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);
    events.push({
      ...event,
      occurredAt,
      timestampField: event.timestampField,
      provenance: event.provenance || 'Timestamp supplied by the source record; not independently verified.'
    });
  }

  const issueKey = typeof issue.key === 'string' ? issue.key.trim() : '';
  if (issueKey && issue.created) {
    addEvent({
      id: 'jiraIssue:' + issueKey + ':created',
      eventType: 'issue-created',
      title: 'Jira incident created',
      summary: issue.summary || issueKey,
      sourceType: 'jiraIssue',
      sourceId: issueKey,
      sourceLabel: 'Jira ' + issueKey,
      timestampField: 'created',
      url: '/browse/' + issueKey,
      provenance: 'Jira issue created timestamp.'
    }, issue.created);
  }

  if (issueKey && issue.updated && parseEventTime(issue.updated) !== parseEventTime(issue.created)) {
    addEvent({
      id: 'jiraIssue:' + issueKey + ':updated',
      eventType: 'issue-last-updated',
      title: 'Jira issue last updated',
      summary: 'Latest update recorded by Jira; intermediate issue history is not included in this view.',
      sourceType: 'jiraIssue',
      sourceId: issueKey,
      sourceLabel: 'Jira ' + issueKey,
      timestampField: 'updated',
      url: '/browse/' + issueKey,
      provenance: 'Jira issue updated timestamp; this is the latest update marker, not a complete change history.'
    }, issue.updated);
  }

  const deployments = Array.isArray(teamworkGraph.deployments) ? teamworkGraph.deployments : [];
  for (const deployment of deployments) {
    const id = typeof deployment.id === 'string' ? deployment.id : '';
    if (!id) continue;
    const label = deployment.title || 'Linked deployment';
    const state = deployment.state || 'Unknown state';
    const base = {
      sourceType: 'deployment',
      sourceId: id,
      sourceLabel: label,
      url: deployment.url || ''
    };
    addEvent({
      ...base,
      id: 'deployment:' + id + ':created',
      eventType: 'deployment-created',
      title: 'Deployment created',
      summary: label + ' · ' + state + (deployment.environment ? ' · ' + deployment.environment : ''),
      timestampField: 'createdAt',
      provenance: 'Deployment createdAt timestamp from Atlassian Teamwork Graph.'
    }, deployment.createdAt);
    if (deployment.updatedAt && parseEventTime(deployment.updatedAt) !== parseEventTime(deployment.createdAt)) {
      addEvent({
        ...base,
        id: 'deployment:' + id + ':updated',
        eventType: 'deployment-last-updated',
        title: 'Deployment last updated',
        summary: label + ' · latest recorded state: ' + state,
        timestampField: 'updatedAt',
        provenance: 'Deployment last-updated timestamp from Atlassian Teamwork Graph; intermediate deployment history is not included.'
      }, deployment.updatedAt);
    }
  }

  const pullRequests = Array.isArray(teamworkGraph.pullRequests) ? teamworkGraph.pullRequests : [];
  for (const pullRequest of pullRequests) {
    const id = typeof pullRequest.id === 'string' ? pullRequest.id : '';
    if (!id) continue;
    const label = pullRequest.title || 'Linked pull request';
    const status = pullRequest.status || 'Unknown status';
    const base = {
      sourceType: 'pullRequest',
      sourceId: id,
      sourceLabel: label,
      url: pullRequest.url || ''
    };
    addEvent({
      ...base,
      id: 'pullRequest:' + id + ':created',
      eventType: 'pull-request-created',
      title: 'Pull request created',
      summary: label + ' · ' + status,
      timestampField: 'createdAt',
      provenance: 'Pull request createdAt timestamp from Atlassian Teamwork Graph.'
    }, pullRequest.createdAt);
    if (pullRequest.updatedAt && parseEventTime(pullRequest.updatedAt) !== parseEventTime(pullRequest.createdAt)) {
      addEvent({
        ...base,
        id: 'pullRequest:' + id + ':updated',
        eventType: 'pull-request-last-updated',
        title: 'Pull request last updated',
        summary: label + ' · latest recorded status: ' + status,
        timestampField: 'updatedAt',
        provenance: 'Pull request last-updated timestamp from Atlassian Teamwork Graph; intermediate review and commit history is not included.'
      }, pullRequest.updatedAt);
    }
  }

  return events.sort((a, b) => (
    Date.parse(a.occurredAt) - Date.parse(b.occurredAt)
    || a.id.localeCompare(b.id)
  ));
}

module.exports = { buildIncidentTimeline };
