'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { parseIsoTimestamp } = require('../src/domain/iso-timestamp');

test('accepts UTC and timezone-qualified ISO timestamps', () => {
  assert.equal(parseIsoTimestamp('2026-11-21T10:00:00Z'), Date.parse('2026-11-21T10:00:00Z'));
  assert.equal(parseIsoTimestamp('2026-11-21T15:30:00+05:30'), Date.parse('2026-11-21T15:30:00+05:30'));
  assert.equal(parseIsoTimestamp('2026-11-21T10:00:00.123+0000'), Date.parse('2026-11-21T10:00:00.123Z'));
});

test('rejects impossible calendar dates and invalid clock components', () => {
  for (const value of ['2026-02-30T10:00:00Z','2026-04-31T10:00:00Z','2026-13-01T10:00:00Z','2026-01-01T24:00:00Z','2026-01-01T10:60:00Z','2026-01-01T10:00:60Z']) {
    assert.equal(parseIsoTimestamp(value), null, value);
  }
});

test('applies Gregorian leap-year rules', () => {
  assert.notEqual(parseIsoTimestamp('2024-02-29T12:00:00Z'), null);
  assert.equal(parseIsoTimestamp('2025-02-29T12:00:00Z'), null);
  assert.notEqual(parseIsoTimestamp('2000-02-29T12:00:00Z'), null);
  assert.equal(parseIsoTimestamp('1900-02-29T12:00:00Z'), null);
});

test('rejects timezone offsets beyond ISO 8601 maximum of 14 hours', () => {
  assert.notEqual(parseIsoTimestamp('2026-01-01T10:00:00+14:00'), null);
  assert.equal(parseIsoTimestamp('2026-01-01T10:00:00+14:01'), null);
  assert.equal(parseIsoTimestamp('2026-01-01T10:00:00-15:00'), null);
});

test('rejects locale-ambiguous, date-only, and non-string values', () => {
  assert.equal(parseIsoTimestamp('11/21/2026 10:00'), null);
  assert.equal(parseIsoTimestamp('2026-11-21'), null);
  assert.equal(parseIsoTimestamp(null), null);
  assert.equal(parseIsoTimestamp(1795255200000), null);
});
