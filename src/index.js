'use strict';

const resolverModule = require('@forge/resolver');
// Forge resolver 2.x may expose its CommonJS default export under `.default`.
// Normalize both export shapes so the deployed runtime always receives the constructor.
const Resolver = resolverModule.default || resolverModule;
if (typeof Resolver !== 'function') {
  throw new TypeError('The @forge/resolver package did not expose a Resolver constructor.');
}
const api = require('@forge/api');
const { route } = require('@forge/api');
const { resolveIssueKey, normalizeIssue } = require('./domain/incident');
const { fetchTeamworkGraphEvidence } = require('./services/teamwork-graph');
const { fetchJiraIssue, DEFAULT_JIRA_REQUEST_TIMEOUT_MS } = require('./services/jira-issue');

// Forge UI/resolver invocations are stopped after 25 seconds. Leave time for
// normalization and the optional Graph request instead of waiting indefinitely.
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

  return {
    ...normalizedIssue,
    teamworkGraph
  };
});

exports.handler = resolver.getDefinitions();
