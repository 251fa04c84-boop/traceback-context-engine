'use strict';

const { withTimeout } = require('./request-timeout');

const DEFAULT_JIRA_REQUEST_TIMEOUT_MS = 8000;

async function fetchJiraIssue(requestJira, timeoutMs = DEFAULT_JIRA_REQUEST_TIMEOUT_MS) {
  if (typeof requestJira !== 'function') {
    throw new TypeError('A Jira request function is required.');
  }

  return withTimeout(async () => {
    let response;
    try {
      response = await requestJira();
    } catch {
      throw new Error('Jira request failed. Please retry.');
    }

    if (response?.status === 404) {
      throw new Error('Issue not found or you do not have permission to view it.');
    }
    const status = Number(response?.status);
    const hasHttpStatus = Number.isFinite(status) && status >= 100 && status <= 599;
    const httpFailure = response?.ok === false || (hasHttpStatus && (status < 200 || status >= 300));
    if (!response || response.ok !== true || httpFailure) {
      throw new Error(
        hasHttpStatus
          ? `Jira request failed (${status}). Please retry.`
          : 'Jira request failed. Please retry.'
      );
    }
    if (typeof response.json !== 'function') {
      throw new Error('Jira returned an invalid issue response. Please retry.');
    }

    try {
      return await response.json();
    } catch {
      throw new Error('Jira returned an unreadable issue response. Please retry.');
    }
  }, timeoutMs, 'Jira request timed out. Please retry.');
}

module.exports = {
  fetchJiraIssue,
  DEFAULT_JIRA_REQUEST_TIMEOUT_MS
};
