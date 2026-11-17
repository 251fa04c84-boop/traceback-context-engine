'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { withTimeout } = require('../src/services/request-timeout');

test('returns an operation result when it completes before the deadline', async () => {
  const result = await withTimeout(async () => 'completed', 100, 'deadline');
  assert.equal(result, 'completed');
});

test('rejects with a safe timeout message when an operation never settles', async () => {
  await assert.rejects(
    withTimeout(() => new Promise(() => {}), 10, 'request deadline exceeded'),
    /request deadline exceeded/
  );
});

test('preserves the original operation error', async () => {
  await assert.rejects(
    withTimeout(() => Promise.reject(new Error('upstream failure')), 100, 'deadline'),
    /upstream failure/
  );
});

test('rejects invalid operations and timeout durations', () => {
  assert.throws(() => withTimeout(null, 10), TypeError);
  assert.throws(() => withTimeout(() => {}, 0), RangeError);
  assert.throws(() => withTimeout(() => {}, Infinity), RangeError);
});
