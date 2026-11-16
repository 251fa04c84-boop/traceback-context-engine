'use strict';

const {
  buildJiraIssueAri,
  normalizeTeamworkGraphResponse
} = require('../domain/teamwork-graph');

const TEAMWORK_GRAPH_QUERY = `
query TraceBackIssueEvidence($id: ID!) {
  jiraWorkItemGoals(id: $id, first: 10) {
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
  }
  jiraWorkItemLinkedExternalDeployments(id: $id, first: 10) {
    edges {
      node {
        ... on ExternalDeployment {
          id
          displayName
          label
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
  }
  jiraWorkItemLinkedExternalPullRequests(id: $id, first: 10) {
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
  }
}
`;

function unavailableEvidence(warning) {
  return {
    ...normalizeTeamworkGraphResponse(null),
    warning
  };
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

    const response = await userApi.requestTeamworkGraph(
      TEAMWORK_GRAPH_QUERY,
      { id: issueAri }
    );

    if (!response || response.ok !== true || typeof response.json !== 'function') {
      return unavailableEvidence(
        'Teamwork Graph evidence is unavailable. Check the app scopes, site configuration, and current-user access.'
      );
    }

    const graphResponse = await response.json();
    return normalizeTeamworkGraphResponse(graphResponse);
  } catch {
    return unavailableEvidence(
      'Teamwork Graph evidence is unavailable. Check the app scopes, site configuration, and current-user access.'
    );
  }
}

module.exports = {
  fetchTeamworkGraphEvidence,
  TEAMWORK_GRAPH_QUERY
};
