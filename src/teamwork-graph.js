'use strict';

const {
  buildJiraIssueAri,
  normalizeTeamworkGraphResponse
} = require('./domain/teamwork-graph');

const TEAMWORK_GRAPH_QUERY = `
  query TraceBackIssueEvidence($issueId: ID!) {
    jiraWorkItemGoals(id: $issueId, first: 10) {
      edges {
        node {
          __typename
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
    jiraWorkItemLinkedExternalDeployments(id: $issueId, first: 10) {
      edges {
        node {
          __typename
          ... on ExternalDeployment {
            id
            displayName
            description
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
      pageInfo {
        hasNextPage
        endCursor
      }
    }
    jiraWorkItemLinkedExternalPullRequests(id: $issueId, first: 10) {
      edges {
        node {
          __typename
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

function unavailableResult() {
  return {
    source: 'Atlassian Teamwork Graph',
    status: 'unavailable',
    goals: [],
    deployments: [],
    pullRequests: [],
    warning: 'Teamwork Graph could not be reached for this issue. Jira issue facts remain available.'
  };
}

async function loadTeamworkGraphEvidence({ cloudId, issueId, requestTeamworkGraph }) {
  try {
    const issueAri = buildJiraIssueAri(cloudId, issueId);
    if (typeof requestTeamworkGraph !== 'function') {
      return unavailableResult();
    }

    const response = await requestTeamworkGraph(TEAMWORK_GRAPH_QUERY, {
      issueId: issueAri
    });

    if (!response || response.ok !== true) {
      return unavailableResult();
    }

    const payload = await response.json();
    return normalizeTeamworkGraphResponse(payload);
  } catch {
    return unavailableResult();
  }
}

module.exports = {
  TEAMWORK_GRAPH_QUERY,
  loadTeamworkGraphEvidence
};
