'use strict';

function isValidIssueKey(value) {
  return typeof value === 'string' && /^[A-Z][A-Z0-9_]*-\d{1,10}$/.test(value.trim());
}

function plainText(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(plainText).filter(Boolean).join(' ');
  if (typeof value === 'object') {
    if (typeof value.text === 'string') return value.text;
    if (Array.isArray(value.content)) return value.content.map(plainText).filter(Boolean).join(' ');
    return '';
  }
  return String(value);
}

function normalizeIssue(issue) {
  if (!issue || typeof issue !== 'object' || !issue.key || !issue.fields) {
    throw new TypeError('A valid Jira issue is required');
  }
  const fields = issue.fields;
  return {
    key: String(issue.key),
    summary: String(fields.summary || 'Untitled issue'),
    description: plainText(fields.description).slice(0, 4000),
    issueType: fields.issuetype?.name || 'Unknown',
    status: fields.status?.name || 'Unknown',
    priority: fields.priority?.name || 'Unspecified',
    created: fields.created || null,
    updated: fields.updated || null,
    projectKey: fields.project?.key || null,
    evidenceSources: ['Jira issue fields'],
    connectedOperationalSources: [],
    assessment: 'Jira context retrieved. No telemetry, logs, deployment history, or tracing source is connected, so a root cause cannot yet be verified.'
  };
}

module.exports = { isValidIssueKey, plainText, normalizeIssue };
