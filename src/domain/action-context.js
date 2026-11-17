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
  const hasContextKey = (typeof contextualIssueKey === 'string' && Boolean(contextual)) ||
    (contextualIssueKey !== undefined && contextualIssueKey !== null && typeof contextualIssueKey !== 'string');
  const hasContextUrl = typeof contextualIssueUrl === 'string' && Boolean(contextualIssueUrl.trim());

  if (directContextual && urlContextual && directContextual !== urlContextual) {
    throw new Error('The active Jira issue context is inconsistent.');
  }
  if ((hasContextKey && !directContextual && !urlContextual) || (hasContextUrl && !urlContextual && !directContextual)) {
    throw new Error('The active Jira issue context is invalid.');
  }
  if (requested && !isValidIssueKey(requested)) {
    throw new Error('A valid Jira issue key is required.');
  }
  if (activeContext && requested && activeContext !== requested) {
    throw new Error('The requested issue must match the active Jira issue context.');
  }

  const issueKey = activeContext || requested;
  if (!issueKey) throw new Error('A Jira issue key is required.');
  return issueKey;
}

module.exports = { resolveActionIssueKey, issueKeyFromContextUrl };
