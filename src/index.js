'use strict';

const Resolver = require('@forge/resolver');
const api = require('@forge/api');
const { normalizeIssue } = require('./domain/incident');

const resolver = new Resolver();

resolver.define('getIssueContext', async ({ payload }) => {
  const issueKey = String(payload?.issueKey || '').trim();
  if (!/^[A-Z][A-Z0-9_]*-\d{1,10}$/.test(issueKey)) {
    throw new Error('A valid Jira issue key is required.');
  }

  const response = await api.asUser().requestJira(
    api.route`/rest/api/3/issue/${issueKey}?fields=summary,description,status,priority,issuetype,created,updated,project`,
    { headers: { Accept: 'application/json' } }
  );

  if (response.status === 404) throw new Error('Issue not found or you do not have permission to view it.');
  if (!response.ok) throw new Error(`Jira request failed (${response.status}). Please retry.`);

  const issue = await response.json();
  return normalizeIssue(issue);
});

exports.handler = resolver.getDefinitions();
