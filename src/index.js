'use strict';

const Resolver = require('@forge/resolver');
const api = require('@forge/api');
const { route } = require('@forge/api');
const { isValidIssueKey, normalizeIssue } = require('./domain/incident');
const { fetchTeamworkGraphEvidence } = require('./services/teamwork-graph');

const resolver = new Resolver();

resolver.define('getIssueContext', async ({ payload, context }) => {
  const issueKey = String(payload?.issueKey || '').trim();
  if (!isValidIssueKey(issueKey)) {
    throw new Error('A valid Jira issue key is required.');
  }

  const response = await api.asUser().requestJira(
    route`/rest/api/3/issue/${issueKey}?fields=summary,description,status,priority,issuetype,created,updated,project`,
    { headers: { Accept: 'application/json' } }
  );

  if (response.status === 404) throw new Error('Issue not found or you do not have permission to view it.');
  if (!response.ok) throw new Error(`Jira request failed (${response.status}). Please retry.`);

  const issue = await response.json();
  const normalizedIssue = normalizeIssue(issue);
  const teamworkGraph = await fetchTeamworkGraphEvidence(api, issue.id, context?.cloudId);

  return {
    ...normalizedIssue,
    teamworkGraph
  };
});

exports.handler = resolver.getDefinitions();
