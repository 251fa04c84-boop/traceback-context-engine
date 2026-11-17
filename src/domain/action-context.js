'use strict';

const { isValidIssueKey } = require('./incident');

function issueKeyFromContextUrl(contextualIssueUrl) {
  if (typeof contextualIssueUrl !== 'string' || !contextualIssueUrl.trim()) return '';
  try {
    const url = new URL(contextualIssueUrl);
    if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) return '';
    const match = url.pathname.match(/^\/browse\/([^/]+)\/?$/i);
    if (!match || !isValidIssueKey(match[1])) return '';
    return match[1];
  } catch {
    return '';
  }
}

function resolveActionIssueKey(requestedIssueKey, contextualIssueKey, contextualIssueUrl) {
  const requested = typeof requestedIssueKey === 'string' ? requestedIssueKey.trim() : '';
  const contextual = typeof contextualIssueKey === 'string' ? contextualIssueKey.trim() : '';
  const urlContextual = issueKeyFromContextUrl(contextualIssueUrl);
  const directContextual = contextual && isValidIssueKey(contextual) ? contextual : '';
  const activeContext = directContextual || urlContextual;

  if (directContextual && urlContextual && directContextual !== urlContextual) {
    throw new Error('The active Jira issue context is inconsistent.');
  }
  if (requested && !isValidIssueKey(requested)) {
    throw new Error('A valid Jira issue key is required.');
  }
  if (activeContext && requested && activeContext !== requested) {
    throw new Error('The requested issue must match the active Jira issue context.');
  }

  const issueKey = activeContext || requested;
  if (!issueKey) {
    if (contextual || (typeof contextualIssueUrl === 'string' && contextualIssueUrl.trim())) {
      throw new Error('The active Jira issue context is invalid.');
    }
    throw new Error('A Jira issue key is required.');
  }
  return issueKey;
}

module.exports = { resolveActionIssueKey, issueKeyFromContextUrl };
