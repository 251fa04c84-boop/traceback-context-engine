'use strict';

const resolverModule = require('@forge/resolver');
// Forge resolver 2.x may expose its CommonJS default export under .default.
const Resolver = resolverModule.default || resolverModule;
if (typeof Resolver !== 'function') {
  throw new TypeError('The @forge/resolver package did not expose a Resolver constructor.');
}
const api = require('@forge/api');
const { route } = require('@forge/api');
const { resolveIssueKey, normalizeIssue } = require('./domain/incident');
const { runTracebackInvestigationAction } = require('./domain/rovo-investigation-action');
const { resolveActionIssueKey } = require('./domain/action-context');
const { buildInvestigationLeads } = require('./domain/investigation');
const { fetchTeamworkGraphEvidence } = require('./services/teamwork-graph');
const { fetchJiraIssue, DEFAULT_JIRA_REQUEST_TIMEOUT_MS } = require('./services/jira-issue');

const resolver = new Resolver();

resolver.define('getIssueContext', async ({ payload, context }) => {
  const issueKey = resolveIssueKey(payload?.issueKey, context);
  const issue = await fetchJiraIssue(
    () => api.asUser().requestJira(
      route`/rest/api/3/issue/${issueKey}?fields=summary,description,status,priority,issuetype,created,updated,project,issuelinks`,
      { headers: { Accept: 'application/json' } }
    ),
    DEFAULT_JIRA_REQUEST_TIMEOUT_MS
  );
  const normalizedIssue = normalizeIssue(issue);
  const teamworkGraph = await fetchTeamworkGraphEvidence(api, issue.id, context?.cloudId);
  return { ...normalizedIssue, teamworkGraph };
});

// Rovo action: all reads run as the invoking user; action input never grants
// authorization. Active issue context is authoritative when Atlassian supplies it.
exports.getTracebackInvestigation = (payload = {}) => runTracebackInvestigationAction({
  payload,
  api,
  route,
  fetchJiraIssue,
  defaultJiraRequestTimeoutMs: DEFAULT_JIRA_REQUEST_TIMEOUT_MS,
  resolveActionIssueKey,
  normalizeIssue,
  fetchTeamworkGraphEvidence,
  buildInvestigationLeads
});

exports.handler = resolver.getDefinitions();
