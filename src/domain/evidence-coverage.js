'use strict';

const NOT_INTEGRATED_SOURCES = [
  { key: 'telemetry', label: 'Service telemetry and metrics' },
  { key: 'logs', label: 'Application and infrastructure logs' },
  { key: 'traces', label: 'Distributed traces' },
  { key: 'alerts', label: 'Alert and on-call history' },
  { key: 'featureFlags', label: 'Feature-flag change history' },
  { key: 'runtimeConfig', label: 'Runtime configuration history' }
];

function buildEvidenceCoverage({ issue = {}, teamworkGraph = {} } = {}) {
  const graphStatus = ['available', 'empty', 'partial', 'unavailable'].includes(teamworkGraph.status)
    ? teamworkGraph.status
    : 'unavailable';
  const graphCount = ['goals', 'deployments', 'pullRequests'].reduce((total, key) => (
    total + (Array.isArray(teamworkGraph[key]) ? teamworkGraph[key].length : 0)
  ), 0);

  const jiraAvailable = typeof issue.key === 'string' && issue.key.trim().length > 0;
  const sources = [
    {
      key: 'jiraIssue',
      label: 'Jira issue',
      status: jiraAvailable ? 'observed' : 'unavailable',
      detail: jiraAvailable
        ? 'Issue fields were read for the invoking user.'
        : 'No normalized Jira issue was supplied.'
    },
    {
      key: 'teamworkGraph',
      label: 'Atlassian Teamwork Graph',
      status: graphStatus,
      recordCount: graphCount,
      detail: typeof teamworkGraph.warning === 'string' && teamworkGraph.warning
        ? teamworkGraph.warning
        : graphStatus === 'available'
          ? 'Linked Graph records were returned for the invoking user.'
          : graphStatus === 'empty'
            ? 'No linked records were returned for this user; this does not prove that none exist.'
            : 'Graph evidence could not be confirmed as complete.'
    },
    ...NOT_INTEGRATED_SOURCES.map((source) => ({
      ...source,
      status: 'not-integrated',
      detail: 'TraceBack does not currently query this source. No absence or healthy state can be inferred.'
    }))
  ];

  return {
    sources,
    connectedSourceCount: sources.filter((source) => (
      source.status === 'observed'
      || source.status === 'available'
      || (source.status === 'partial' && source.recordCount > 0)
    )).length,
    notIntegrated: NOT_INTEGRATED_SOURCES.map((source) => source.key),
    completeness: 'partial-by-design',
    boundary: 'Coverage describes only the connectors TraceBack queried. Not-integrated sources were not queried; empty or unavailable results are not proof that evidence does not exist.'
  };
}

module.exports = { buildEvidenceCoverage, NOT_INTEGRATED_SOURCES };
