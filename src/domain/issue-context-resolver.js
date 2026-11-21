'use strict';

async function runIssueContextResolver({
  payload = {},
  context = {},
  api,
  route,
  fetchJiraIssue,
  defaultJiraRequestTimeoutMs,
  resolveIssueKey,
  normalizeIssue,
  fetchTeamworkGraphEvidence
}) {
  const issueKey = resolveIssueKey(payload?.issueKey, context);
  const issue = await fetchJiraIssue(
    () => api.asUser().requestJira(
      route`/rest/api/3/issue/${issueKey}?fields=summary,description,status,priority,issuetype,created,updated,project,issuelinks`,
      { headers: { Accept: 'application/json' } }
    ),
    defaultJiraRequestTimeoutMs
  );
  const normalizedIssue = normalizeIssue(issue);
  const teamworkGraph = await fetchTeamworkGraphEvidence(api, issue.id, context?.cloudId);

  return {
    ...normalizedIssue,
    teamworkGraph
  };
}

module.exports = { runIssueContextResolver };
