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
const { runTracebackInvestigationAction } = require('./domain/rovo-investigation-action');
const { runIssueContextResolver } = require('./domain/issue-context-resolver');
const { resolveActionIssueKey } = require('./domain/action-context');
const { buildInvestigationLeads } = require('./domain/investigation');
const { buildIncidentTimeline } = require('./domain/timeline');
const { buildEvidenceCoverage } = require('./domain/evidence-coverage');
const { fetchTeamworkGraphEvidence } = require('./services/teamwork-graph');
const { fetchJiraIssue, DEFAULT_JIRA_REQUEST_TIMEOUT_MS } = require('./services/jira-issue');

// Forge UI/resolver invocations are stopped after 25 seconds. Leave time for
// normalization and the optional Graph request instead of waiting indefinitely.
const resolver = new Resolver();

resolver.define('getIssueContext', async ({ payload, context }) => runIssueContextResolver({
  payload,
  context,
  api,
  route,
  fetchJiraIssue,
  defaultJiraRequestTimeoutMs: DEFAULT_JIRA_REQUEST_TIMEOUT_MS,
  resolveIssueKey,
  normalizeIssue,
  fetchTeamworkGraphEvidence
}));

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
  buildInvestigationLeads,
  buildIncidentTimeline,
  buildEvidenceCoverage
});

exports.handler = resolver.getDefinitions();
