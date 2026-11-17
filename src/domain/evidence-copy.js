'use strict';

function getCategoryEmptyStateMessage(status, category) {
  const label = typeof category === 'string' && category.trim() ? category.trim() : 'evidence';
  const plural = label.toLowerCase() === 'pull request' ? 'pull-request' : label.toLowerCase();

  if (status === 'unavailable') {
    return `${label} records could not be loaded because Teamwork Graph was unavailable. Check app scopes, site configuration, and current-user access.`;
  }
  if (status === 'partial') {
    return `No ${plural} records were returned in the partial response. Other records may be missing; check the warning and source permissions.`;
  }
  if (status === 'empty') {
    return `No linked ${plural} records were returned for this issue to the current user. This does not prove no related evidence exists elsewhere.`;
  }
  return `No linked ${plural} records were returned for this issue.`;
}

module.exports = { getCategoryEmptyStateMessage };
