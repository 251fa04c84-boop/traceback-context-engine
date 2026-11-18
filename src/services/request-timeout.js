'use strict';

function withTimeout(operation, timeoutMs, timeoutMessage = 'Operation timed out.') {
  if (typeof operation !== 'function') {
    throw new TypeError('A timeout operation must be a function.');
  }
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new RangeError('A timeout duration must be a positive finite number.');
  }

  let timer;
  const timeout = new Promise((resolve, reject) => {
    timer = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
  });

  return Promise.race([
    Promise.resolve().then(operation),
    timeout
  ]).finally(() => clearTimeout(timer));
}

module.exports = { withTimeout };
