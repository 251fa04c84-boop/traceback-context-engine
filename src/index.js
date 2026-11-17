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
// authorization. An issue context, when supplied by Atlassian, is authoritative.
exports.getTracebackInvestigation = async (payload = {}) => {
  const actionContext = payload.context || {};
  const issueKey = resolveActionIssueKey(payload.issueKey, actionContext.jira?.issueKey);
  const issue = await fetchJiraIssue(
    () => api.asUser().requestJira(
      route`/rest/api/3/issue/${issueKey}?fields=summary,description,status,priority,issuetype,created,updated,project,issuelinks`,
      { headers: { Accept: 'application/json' } }
    ),
    DEFAULT_JIRA_REQUEST_TIMEOUT_MS
  );
  const normalizedIssue = normalizeIssue(issue);
  const teamworkGraph = await fetchTeamworkGraphEvidence(api, issue.id, actionContext.cloudId);
  const investigationLeads = buildInvestigationLeads({
    issue: normalizedIssue,
    relatedWorkItems: normalizedIssue.relatedWorkItems,
    teamworkGraph
  });

  return {
    ...normalizedIssue,
    teamworkGraph,
    investigationLeads,
    accessBoundary: 'All Jira and Teamwork Graph reads were requested as the invoking user. Missing permissions or unavailable connectors may limit evidence.',
    evidenceBoundary: 'Linked records and timing are investigation leads, not proof of causation. No production or Jira mutations are available through this action.'
  };
};

exports.handler = resolver.getDefinitions();
