'use strict';

const api = require('@forge/api');
const { route } = require('@forge/api');
const { isValidIssueKey, normalizeIssue } = require('./domain/incident');
const { buildInvestigationLeads } = require('./domain/investigation');
const { fetchTeamworkGraphEvidence } = require('./services/teamwork-graph');
const { fetchJiraIssue, DEFAULT_JIRA_REQUEST_TIMEOUT_MS } = require('./services/jira-issue');

function boundedText(value, maxLength, fallback = '') {
  if (typeof value !== 'string' || !value.trim()) return fallback;
  const normalized = value.trim();
  return normalized.length > maxLength ? normalized.slice(0, maxLength) + '…' : normalized;
}

function resolveActionIssueKey(payload) {
  const hasExplicitInput = Object.prototype.hasOwnProperty.call(payload || {}, 'issueKey');
  if (hasExplicitInput) {
    const explicit = typeof payload.issueKey === 'string' ? payload.issueKey.trim() : '';
    if (!isValidIssueKey(explicit)) {
      throw new Error('Provide a valid Jira issue key, for example DEMO-9.');
    }
    return explicit;
  }

  const jiraContext = payload?.context?.jira;
  const contextualKey = typeof jiraContext?.issueKey === 'string'
    ? jiraContext.issueKey.trim()
    : '';
  if (isValidIssueKey(contextualKey)) return contextualKey;

  const contextualUrl = typeof jiraContext?.url === 'string' ? jiraContext.url : '';
  const match = contextualUrl.match(/\/browse\/([A-Z][A-Z0-9_]*-[1-9][0-9]{0,9})(?:[/?#]|$)/);
  if (match && isValidIssueKey(match[1])) return match[1];

  throw new Error('A valid Jira issue key is required to retrieve investigation context.');
}

function compactIssue(issue) {
  return {
    key: issue.key,
    summary: boundedText(issue.summary, 500, 'Untitled issue'),
    description: boundedText(issue.description, 2000),
    issueType: boundedText(issue.issueType, 100, 'Unknown'),
    status: boundedText(issue.status, 100, 'Unknown'),
    priority: boundedText(issue.priority, 100, 'Unspecified'),
    created: issue.created || null,
    updated: issue.updated || null,
    projectKey: issue.projectKey || null,
    assessment: boundedText(issue.assessment, 1000),
    evidenceSources: Array.isArray(issue.evidenceSources) ? issue.evidenceSources.slice(0, 10) : []
  };
}

function compactTeamworkGraph(graph) {
  const source = graph && typeof graph === 'object' ? graph : {};
  const goals = Array.isArray(source.goals) ? source.goals.slice(0, 125).map((item) => ({
    id: boundedText(item.id, 300),
    key: boundedText(item.key, 100),
    name: boundedText(item.name, 300, 'Untitled goal'),
    description: boundedText(item.description, 1500),
    url: boundedText(item.url, 2048),
    updatedAt: item.updatedAt || null,
    archived: typeof item.archived === 'boolean' ? item.archived : null
  })) : [];
  const deployments = Array.isArray(source.deployments) ? source.deployments.slice(0, 125).map((item) => ({
    id: boundedText(item.id, 300),
    title: boundedText(item.title, 300, 'Deployment'),
    description: boundedText(item.description, 1500),
    state: boundedText(item.state, 80, 'UNKNOWN'),
    environment: boundedText(item.environment, 120, 'Unknown environment'),
    environmentType: boundedText(item.environmentType, 80, 'UNMAPPED'),
    provider: boundedText(item.provider, 120, 'Unknown provider'),
    url: boundedText(item.url, 2048),
    region: boundedText(item.region, 120),
    createdAt: item.createdAt || null,
    updatedAt: item.updatedAt || null
  })) : [];
  const pullRequests = Array.isArray(source.pullRequests) ? source.pullRequests.slice(0, 125).map((item) => ({
    id: boundedText(item.id, 300),
    title: boundedText(item.title, 500, 'Untitled pull request'),
    displayId: boundedText(item.displayId, 100),
    status: boundedText(item.status, 80, 'UNKNOWN'),
    provider: boundedText(item.provider, 120, 'Unknown provider'),
    url: boundedText(item.url, 2048),
    createdAt: item.createdAt || null,
    updatedAt: item.updatedAt || null
  })) : [];

  return {
    source: boundedText(source.source, 100, 'Atlassian Teamwork Graph'),
    status: ['available', 'empty', 'partial', 'unavailable'].includes(source.status)
      ? source.status
      : 'unavailable',
    goals,
    deployments,
    pullRequests,
    warning: boundedText(source.warning, 1200),
    truncatedCategories: Array.isArray(source.truncatedCategories)
      ? source.truncatedCategories.slice(0, 3)
      : []
  };
}

async function getTracebackContext(payload = {}, context = {}) {
  const issueKey = resolveActionIssueKey(payload);
  const actionContext = payload?.context && typeof payload.context === 'object'
    ? payload.context
    : {};
  const cloudId = actionContext.cloudId || context?.cloudId || null;

  const rawIssue = await fetchJiraIssue(
    () => api.asUser().requestJira(
      route`/rest/api/3/issue/${issueKey}?fields=summary,description,status,priority,issuetype,created,updated,project,issuelinks`,
      { headers: { Accept: 'application/json' } }
    ),
    DEFAULT_JIRA_REQUEST_TIMEOUT_MS
  );
  const normalizedIssue = normalizeIssue(rawIssue);
  const teamworkGraph = compactTeamworkGraph(
    await fetchTeamworkGraphEvidence(api, rawIssue.id, cloudId)
  );
  const issue = compactIssue(normalizedIssue);
  const relatedWorkItems = Array.isArray(normalizedIssue.relatedWorkItems)
    ? normalizedIssue.relatedWorkItems.slice(0, 100).map((item) => ({
      key: boundedText(item.key, 100),
      summary: boundedText(item.summary, 500, 'Untitled linked issue'),
      status: boundedText(item.status, 100, 'Unknown'),
      issueType: boundedText(item.issueType, 100, 'Unknown'),
      priority: boundedText(item.priority, 100, 'Unspecified'),
      relationship: boundedText(item.relationship, 150, 'relates to'),
      url: boundedText(item.url, 300)
    }))
    : [];

  const investigationLeads = buildInvestigationLeads({
    issue: normalizedIssue,
    relatedWorkItems,
    teamworkGraph
  });

  return {
    schemaVersion: 1,
    accessMode: 'read-only',
    issue,
    relatedWorkItems,
    teamworkGraph,
    investigationLeads,
    interpretationPolicy: {
      rootCause: 'not-established',
      causalInference: 'not-supported-by-linked-records-alone',
      missingEvidenceIsNotNegativeProof: true,
      sourceLinksAreRequiredWhenAvailable: true
    }
  };
}

module.exports = {
  getTracebackContext,
  resolveActionIssueKey,
  compactTeamworkGraph
};
