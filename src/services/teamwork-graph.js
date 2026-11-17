'use strict';

const {
  buildJiraIssueAri,
  normalizeTeamworkGraphResponse
} = require('../domain/teamwork-graph');

const { withTimeout } = require('./request-timeout');

const MAX_PAGES_PER_CATEGORY = 5;
// Jira issue retrieval has an 8-second cap in the resolver. Keep Graph work
// below the Forge 25-second invocation ceiling, leaving several seconds for
// normalization and response serialization.
const MAX_TOTAL_DURATION_MS = 12_000;
const MAX_REQUEST_DURATION_MS = 5_000;
const CATEGORY_CONFIG = {
  goals: {
    field: 'jiraWorkItemGoals',
    variable: 'goalsAfter',
    include: 'includeGoals'
  },
  deployments: {
    field: 'jiraWorkItemLinkedExternalDeployments',
    variable: 'deploymentsAfter',
    include: 'includeDeployments'
  },
  pullRequests: {
    field: 'jiraWorkItemLinkedExternalPullRequests',
    variable: 'pullRequestsAfter',
    include: 'includePullRequests'
  }
};

const TEAMWORK_GRAPH_QUERY = `
query TraceBackIssueEvidence(
  $id: ID!,
  $goalsAfter: String,
  $deploymentsAfter: String,
  $pullRequestsAfter: String,
  $includeGoals: Boolean!,
  $includeDeployments: Boolean!,
  $includePullRequests: Boolean!
) {
  jiraWorkItemGoals(id: $id, first: 25, after: $goalsAfter) @include(if: $includeGoals) {
    edges {
      node {
        ... on AtlassianGoal {
          id
          key
          name
          description
          url
          updatedAt
          archived
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
  jiraWorkItemLinkedExternalDeployments(id: $id, first: 25, after: $deploymentsAfter) @include(if: $includeDeployments) {
    edges {
      node {
        ... on ExternalDeployment {
          id
          displayName
          label
          description
          state
          environment {
            displayName
            type
          }
          provider {
            name
          }
          url
          region
          createdAt
          lastUpdatedAt
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
  jiraWorkItemLinkedExternalPullRequests(id: $id, first: 25, after: $pullRequestsAfter) @include(if: $includePullRequests) {
    edges {
      node {
        ... on ExternalPullRequest {
          id
          title
          displayName
          displayId
          pullRequestId
          status
          provider {
            name
          }
          url
          createdAt
          lastUpdatedAt
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`;

function unavailableEvidence(warning) {
  return {
    ...normalizeTeamworkGraphResponse(null),
    warning,
    truncatedCategories: []
  };
}

async function readTeamworkGraphResponse(response) {
  if (!response || typeof response !== 'object') return response;
  if (typeof response.json !== 'function') return response;

  let body;
  try {
    body = await response.json();
  } catch {
    return {
      data: null,
      errors: [{ message: 'Teamwork Graph returned an unreadable response body.' }]
    };
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    body = { data: null };
  }

  const status = Number(response.status);
  const httpFailure = response.ok === false || (Number.isFinite(status) && status >= 400);
  if (!httpFailure) return body;

  const errors = Array.isArray(body.errors) ? [...body.errors] : [];
  errors.push({
    message: 'Teamwork Graph request failed (' + (Number.isFinite(status) ? status : 'HTTP') + ').'
  });
  return { ...body, errors };
}

function makeRequestVariables(issueAri, cursors, include) {
  return {
    id: issueAri,
    goalsAfter: cursors.goals,
    deploymentsAfter: cursors.deployments,
    pullRequestsAfter: cursors.pullRequests,
    includeGoals: include.goals,
    includeDeployments: include.deployments,
    includePullRequests: include.pullRequests
  };
}

function appendConnection(target, incoming) {
  if (!incoming || !Array.isArray(incoming.edges)) return;
  const existingIds = new Set(
    target.edges
      .map((edge) => edge?.node?.id)
      .filter((id) => typeof id === 'string' && id)
  );

  for (const edge of incoming.edges) {
    const id = edge?.node?.id;
    if (typeof id === 'string' && id && existingIds.has(id)) continue;
    target.edges.push(edge);
    if (typeof id === 'string' && id) existingIds.add(id);
  }
}

async function fetchTeamworkGraphEvidence(apiClient, issueId, cloudId) {
  let issueAri;
  try {
    issueAri = buildJiraIssueAri(cloudId, issueId);
  } catch {
    return unavailableEvidence(
      'Teamwork Graph evidence requires a valid Jira issue ID and Atlassian site context.'
    );
  }

  try {
    const userApi = apiClient?.asUser?.();
    if (!userApi || typeof userApi.requestTeamworkGraph !== 'function') {
      return unavailableEvidence(
        'Teamwork Graph evidence is unavailable because the current-user API client is not available.'
      );
    }

    const data = {
      jiraWorkItemGoals: { edges: [] },
      jiraWorkItemLinkedExternalDeployments: { edges: [] },
      jiraWorkItemLinkedExternalPullRequests: { edges: [] }
    };
    const cursors = { goals: null, deployments: null, pullRequests: null };
    const include = { goals: true, deployments: true, pullRequests: true };
    const pageCounts = { goals: 0, deployments: 0, pullRequests: 0 };
    const seenCursors = { goals: new Set(), deployments: new Set(), pullRequests: new Set() };
    const truncated = { goals: false, deployments: false, pullRequests: false };
    const errors = [];
    let requestCount = 0;
    const startedAt = Date.now();

    function markPendingCategoriesAsTruncated() {
      for (const category of Object.keys(include)) {
        if (include[category]) truncated[category] = true;
      }
    }

    while (Object.values(include).some(Boolean) && requestCount < MAX_PAGES_PER_CATEGORY) {
      let graphResponse;
      const remainingMs = MAX_TOTAL_DURATION_MS - (Date.now() - startedAt);
      if (remainingMs <= 0) {
        markPendingCategoriesAsTruncated();
        errors.push({ message: 'Teamwork Graph pagination exceeded its time budget.' });
        break;
      }

      try {
        // @forge/api requestTeamworkGraph may expose a Fetch-like response or
        // a direct { data, errors } object. Bound the request and body read so
        // optional Graph evidence cannot consume the entire Forge invocation.
        graphResponse = await withTimeout(
          async () => readTeamworkGraphResponse(await userApi.requestTeamworkGraph(
            TEAMWORK_GRAPH_QUERY,
            makeRequestVariables(issueAri, cursors, include)
          )),
          Math.min(MAX_REQUEST_DURATION_MS, remainingMs),
          'Teamwork Graph request timed out.'
        );
      } catch {
        markPendingCategoriesAsTruncated();
        errors.push({ message: 'Teamwork Graph request failed or exceeded its time budget.' });
        break;
      }
      requestCount += 1;

      if (!graphResponse || typeof graphResponse !== 'object') {
        markPendingCategoriesAsTruncated();
        errors.push({ message: 'Teamwork Graph returned an invalid response.' });
        break;
      }

      if (Array.isArray(graphResponse.errors)) errors.push(...graphResponse.errors);
      const pageData = graphResponse.data;
      if (!pageData || typeof pageData !== 'object') {
        markPendingCategoriesAsTruncated();
        errors.push({ message: 'Teamwork Graph returned no usable data.' });
        break;
      }

      for (const [category, config] of Object.entries(CATEGORY_CONFIG)) {
        if (!include[category]) continue;
        const connection = pageData[config.field];
        if (!connection || typeof connection !== 'object' || !Array.isArray(connection.edges)) {
          errors.push({ message: 'Teamwork Graph returned an invalid linked-evidence connection.' });
          include[category] = false;
          continue;
        }

        appendConnection(data[config.field], connection);
        pageCounts[category] += 1;

        const pageInfo = connection.pageInfo;
        if (!pageInfo || typeof pageInfo.hasNextPage !== 'boolean') {
          errors.push({ message: 'Teamwork Graph pagination metadata is missing.' });
          include[category] = false;
          continue;
        }

        if (pageInfo.hasNextPage !== true) {
          include[category] = false;
          continue;
        }

        const nextCursor = typeof pageInfo.endCursor === 'string'
          ? pageInfo.endCursor.trim()
          : '';

        if (!nextCursor || seenCursors[category].has(nextCursor)) {
          truncated[category] = true;
          include[category] = false;
          continue;
        }

        if (pageCounts[category] >= MAX_PAGES_PER_CATEGORY) {
          truncated[category] = true;
          include[category] = false;
          continue;
        }

        seenCursors[category].add(nextCursor);
        cursors[category] = nextCursor;
        include[category] = true;
      }
    }

    const truncatedCategories = Object.keys(truncated).filter((category) => truncated[category]);
    return normalizeTeamworkGraphResponse({
      data,
      errors,
      truncatedCategories
    });
  } catch {
    return unavailableEvidence(
      'Teamwork Graph evidence is unavailable. Check the app scopes, site configuration, and current-user access.'
    );
  }
}

module.exports = {
  fetchTeamworkGraphEvidence,
  TEAMWORK_GRAPH_QUERY,
  MAX_PAGES_PER_CATEGORY,
  MAX_TOTAL_DURATION_MS,
  MAX_REQUEST_DURATION_MS
};
