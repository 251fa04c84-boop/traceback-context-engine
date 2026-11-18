'use strict';

const CLOUD_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ISSUE_ID_PATTERN = /^[1-9][0-9]{0,19}$/;
const TRUNCATABLE_CATEGORIES = new Set(['goals', 'deployments', 'pullRequests']);

function buildJiraIssueAri(cloudId, issueId) {
  const normalizedCloudId = typeof cloudId === 'string' ? cloudId.trim() : '';
  if (!CLOUD_ID_PATTERN.test(normalizedCloudId)) {
    throw new TypeError('A valid Atlassian cloud id is required.');
  }

  const normalizedIssueId = String(issueId ?? '').trim();
  if (!ISSUE_ID_PATTERN.test(normalizedIssueId)) {
    throw new TypeError('A numeric Jira issue id is required.');
  }

  return `ari:cloud:jira:${normalizedCloudId}:issue/${normalizedIssueId}`;
}

function connectionNodes(connection, expectedType) {
  if (!connection || !Array.isArray(connection.edges)) return [];

  return connection.edges
    .map((edge) => edge?.node)
    .filter((node) => (
      node
      && typeof node === 'object'
      && (!node.__typename || node.__typename === expectedType)
    ));
}

function stringValue(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function safeHttpsUrl(value) {
  const raw = stringValue(value);
  if (!raw) return '';

  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== 'https:' || !parsed.hostname || parsed.username || parsed.password) {
      return '';
    }
    return parsed.href;
  } catch {
    return '';
  }
}

function normalizeTeamworkGraphResponse(response) {
  const empty = {
    source: 'Atlassian Teamwork Graph',
    status: 'unavailable',
    goals: [],
    deployments: [],
    pullRequests: [],
    warning: 'Connected Atlassian context is temporarily unavailable.',
    truncatedCategories: []
  };

  if (!response || typeof response !== 'object' || !response.data || typeof response.data !== 'object' || Array.isArray(response.data)) {
    return empty;
  }

  const data = response.data;
  const goals = connectionNodes(data.jiraWorkItemGoals, 'AtlassianGoal')
    .map((goal) => ({
      id: stringValue(goal.id),
      key: stringValue(goal.key),
      name: stringValue(goal.name, 'Untitled goal'),
      description: stringValue(goal.description),
      url: safeHttpsUrl(goal.url),
      updatedAt: goal.updatedAt || null,
      archived: typeof goal.archived === 'boolean' ? goal.archived : null
    }))
    .filter((goal) => Boolean(goal.id));

  const deployments = connectionNodes(
    data.jiraWorkItemLinkedExternalDeployments,
    'ExternalDeployment'
  )
    .map((deployment) => ({
      id: stringValue(deployment.id),
      title: stringValue(deployment.displayName || deployment.label, 'Deployment'),
      description: stringValue(deployment.description),
      state: stringValue(deployment.state, 'UNKNOWN'),
      environment: stringValue(deployment.environment?.displayName, 'Unknown environment'),
      environmentType: stringValue(deployment.environment?.type, 'UNMAPPED'),
      provider: stringValue(deployment.provider?.name, 'Unknown provider'),
      url: safeHttpsUrl(deployment.url),
      region: stringValue(deployment.region),
      createdAt: deployment.createdAt || null,
      updatedAt: deployment.lastUpdatedAt || null
    }))
    .filter((deployment) => Boolean(deployment.id));

  const pullRequests = connectionNodes(
    data.jiraWorkItemLinkedExternalPullRequests,
    'ExternalPullRequest'
  )
    .map((pullRequest) => ({
      id: stringValue(pullRequest.id),
      title: stringValue(pullRequest.title || pullRequest.displayName, 'Untitled pull request'),
      displayId: stringValue(pullRequest.displayId || pullRequest.pullRequestId),
      status: stringValue(pullRequest.status, 'UNKNOWN'),
      provider: stringValue(pullRequest.provider?.name, 'Unknown provider'),
      url: safeHttpsUrl(pullRequest.url),
      createdAt: pullRequest.createdAt || null,
      updatedAt: pullRequest.lastUpdatedAt || null
    }))
    .filter((pullRequest) => Boolean(pullRequest.id));

  const hasItems = goals.length > 0 || deployments.length > 0 || pullRequests.length > 0;
  const hasErrors = Array.isArray(response.errors) && response.errors.length > 0;
  const truncatedCategories = Array.isArray(response.truncatedCategories)
    ? [...new Set(response.truncatedCategories.filter((category) => TRUNCATABLE_CATEGORIES.has(category)))]
    : [];

  let status = 'empty';
  let warning = 'No linked deployment, pull request, or goal records were returned. This can mean no records are linked, an upstream connector is not configured, or required Teamwork Graph scopes or user permissions are missing.';

  if (hasErrors) {
    status = hasItems ? 'partial' : 'unavailable';
    warning = 'Some connected evidence could not be loaded. Check the app’s Teamwork Graph scopes and the user’s Jira access.';
  } else if (hasItems) {
    status = 'available';
    warning = '';
  }

  if (truncatedCategories.length > 0) {
    // A bounded result is not complete evidence, even when the first page
    // contains records. Keep the UI status honest so it cannot show green
    // "available" while additional linked records may have been omitted.
    if (status !== 'unavailable') status = 'partial';
    const labels = truncatedCategories.map((category) => ({
      goals: 'goals',
      deployments: 'deployments',
      pullRequests: 'pull requests'
    }[category]));
    const paginationWarning = `Pagination could not be completed for: ${labels.join(', ')}. Additional linked records may exist.`;
    warning = warning ? `${warning} ${paginationWarning}` : paginationWarning;
  }

  return {
    source: 'Atlassian Teamwork Graph',
    status,
    goals,
    deployments,
    pullRequests,
    warning,
    truncatedCategories
  };
}

module.exports = {
  buildJiraIssueAri,
  normalizeTeamworkGraphResponse
};
