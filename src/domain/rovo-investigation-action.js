'use strict';

async function runTracebackInvestigationAction({
  payload = {},
  api,
  route,
  fetchJiraIssue,
  defaultJiraRequestTimeoutMs,
  resolveActionIssueKey,
  normalizeIssue,
  fetchTeamworkGraphEvidence,
  buildInvestigationLeads,
  buildIncidentTimeline,
  buildEvidenceCoverage
}) {
  const actionContext = payload.context || {};
  const issueKey = resolveActionIssueKey(
    payload.issueKey,
    actionContext.jira?.issueKey,
    actionContext.jira?.url
  );

  const issue = await fetchJiraIssue(
    () => api.asUser().requestJira(
      route`/rest/api/3/issue/${issueKey}?fields=summary,description,status,priority,issuetype,created,updated,project,issuelinks`,
      { headers: { Accept: 'application/json' } }
    ),
    defaultJiraRequestTimeoutMs
  );
  const normalizedIssue = normalizeIssue(issue);
  const teamworkGraph = await fetchTeamworkGraphEvidence(api, issue.id, actionContext.cloudId);
  const investigationLeads = buildInvestigationLeads({
    issue: normalizedIssue,
    relatedWorkItems: normalizedIssue.relatedWorkItems,
    teamworkGraph
  });
  const incidentTimeline = buildIncidentTimeline({
    issue: normalizedIssue,
    teamworkGraph
  });
  const evidenceCoverage = buildEvidenceCoverage({
    issue: normalizedIssue,
    teamworkGraph
  });

  return {
    ...normalizedIssue,
    teamworkGraph,
    investigationLeads,
    incidentTimeline,
    evidenceCoverage,
    accessBoundary: 'All Jira and Teamwork Graph reads were requested as the invoking user. Missing permissions or unavailable connectors may limit evidence.',
    evidenceBoundary: 'Linked records and timing are investigation leads, not proof of causation. No production or Jira mutations are available through this action.'
  };
}

module.exports = { runTracebackInvestigationAction };
