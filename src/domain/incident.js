'use strict';

function isValidIssueKey(value) {
  return typeof value === 'string' && /^[A-Z][A-Z0-9_]*-[1-9]\d{0,9}$/.test(value.trim());
}

function getIssueKeyFromProductContext(context) {
  const candidate = context?.extension?.issue?.key || context?.platformContext?.issueKey;
  if (typeof candidate !== 'string') return null;
  const issueKey = candidate.trim();
  return isValidIssueKey(issueKey) ? issueKey : null;
}

function resolveIssueKey(requestedIssueKey, context) {
  const requested = typeof requestedIssueKey === 'string' ? requestedIssueKey.trim() : '';
  const active = getIssueKeyFromProductContext(context);

  if (active && requested && requested !== active) {
    throw new Error('This panel can only load the Jira issue where it is currently open.');
  }

  const issueKey = active || requested;
  if (!isValidIssueKey(issueKey)) {
    throw new Error('A valid active Jira issue key is required.');
  }
  return issueKey;
}

function getRetryIssueKey(context, lastIssueKey) {
  const activeIssueKey = getIssueKeyFromProductContext(context);
  if (activeIssueKey) return activeIssueKey;

  const fallbackIssueKey = typeof lastIssueKey === 'string' ? lastIssueKey.trim() : '';
  return isValidIssueKey(fallbackIssueKey) ? fallbackIssueKey : null;
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

function normalizeRelatedIssues(issueLinks) {
  if (!Array.isArray(issueLinks)) return [];

  const seen = new Set();
  const related = [];

  for (const link of issueLinks) {
    if (!link || typeof link !== 'object') continue;

    const isOutward = Boolean(link.outwardIssue);
    const issue = isOutward ? link.outwardIssue : link.inwardIssue;
    const key = typeof issue?.key === 'string' ? issue.key.trim() : '';
    if (!isValidIssueKey(key) || seen.has(key)) continue;

    const fields = issue.fields && typeof issue.fields === 'object' ? issue.fields : {};
    const relationship = isOutward
      ? (link.type?.outward || link.type?.name)
      : (link.type?.inward || link.type?.name);

    seen.add(key);
    related.push({
      key,
      summary: typeof fields.summary === 'string' && fields.summary.trim()
        ? fields.summary.trim()
        : 'Untitled linked issue',
      status: fields.status?.name || 'Unknown',
      issueType: fields.issuetype?.name || 'Unknown',
      priority: fields.priority?.name || 'Unspecified',
      relationship: typeof relationship === 'string' && relationship.trim()
        ? relationship.trim()
        : 'relates to',
      url: `/browse/${key}`
    });
  }

  return related;
}

function normalizeIssue(issue) {
  if (
    !issue ||
    typeof issue !== 'object' ||
    Array.isArray(issue) ||
    !isValidIssueKey(issue.key) ||
    !issue.fields ||
    typeof issue.fields !== 'object' ||
    Array.isArray(issue.fields)
  ) {
    throw new TypeError('A valid Jira issue is required');
  }
  const fields = issue.fields;
  return {
    key: issue.key.trim(),
    summary: String(fields.summary || 'Untitled issue'),
    description: plainText(fields.description).slice(0, 4000),
    issueType: fields.issuetype?.name || 'Unknown',
    status: fields.status?.name || 'Unknown',
    priority: fields.priority?.name || 'Unspecified',
    created: fields.created || null,
    updated: fields.updated || null,
    projectKey: fields.project?.key || null,
    evidenceSources: ['Jira issue fields'],
    relatedWorkItems: normalizeRelatedIssues(fields.issuelinks),
    connectedOperationalSources: [],
    assessment: 'Jira context retrieved. No telemetry, logs, deployment history, or tracing source is connected, so a root cause cannot yet be verified.'
  };
}

module.exports = {
  isValidIssueKey,
  getIssueKeyFromProductContext,
  resolveIssueKey,
  getRetryIssueKey,
  plainText,
  normalizeRelatedIssues,
  normalizeIssue
};
