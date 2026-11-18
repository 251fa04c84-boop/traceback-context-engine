'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { getCategoryEmptyStateMessage } = require('../src/domain/evidence-copy');

test('unavailable category copy explains that the source could not be loaded', () => {
  assert.match(getCategoryEmptyStateMessage('unavailable', 'Goal'), /could not be loaded/i);
  assert.match(getCategoryEmptyStateMessage('unavailable', 'Goal'), /scopes.*access/i);
});

test('partial category copy warns that other records may be missing', () => {
  assert.match(getCategoryEmptyStateMessage('partial', 'Deployment'), /partial response/i);
  assert.match(getCategoryEmptyStateMessage('partial', 'Deployment'), /may be missing/i);
});

test('empty category copy distinguishes no returned records from proof of absence', () => {
  const message = getCategoryEmptyStateMessage('empty', 'Pull request');
  assert.match(message, /No linked pull-request records/i);
  assert.match(message, /does not prove/i);
});

test('available category copy reports a category-level empty result without overstating it', () => {
  assert.equal(
    getCategoryEmptyStateMessage('available', 'Goal'),
    'No linked goal records were returned for this issue.'
  );
});

test('unknown category names receive a safe generic label', () => {
  assert.match(getCategoryEmptyStateMessage('unavailable', ''), /evidence records could not be loaded/i);
});
