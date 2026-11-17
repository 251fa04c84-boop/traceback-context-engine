'use strict';

const { isValidIssueKey } = require('./incident');

function resolveActionIssueKey(requestedIssueKey, contextualIssueKey) {
  const requested = typeof requestedIssueKey === 'string' ? requestedIssueKey.trim() : '';
  const contextual = typeof contextualIssueKey === 'string' ? contextualIssueKey.trim() : '';

  if (contextual && !isValidIssueKey(contextual)) {
    throw new Error('The active Jira issue context is invalid.');
  }
  if (requested && !isValidIssueKey(requested)) {
    throw new Error('A valid Jira issue key is required.');
  }
  if (contextual && requested && contextual !== requested) {
    throw new Error('The requested issue must match the active Jira issue context.');
  }

  const issueKey = contextual || requested;
  if (!issueKey) throw new Error('A Jira issue key is required.');
  return issueKey;
}

module.exports = { resolveActionIssueKey };
