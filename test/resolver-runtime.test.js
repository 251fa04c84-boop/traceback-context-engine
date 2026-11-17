'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

// Exercise the exact CommonJS export shape used by src/index.js.
// This catches Forge runtime constructor failures that unit tests with mocks miss.
test('Forge resolver package exposes a constructable Resolver in the deployed CommonJS shape', () => {
  const resolverModule = require('@forge/resolver');
  const Resolver = resolverModule.default || resolverModule;

  assert.equal(typeof Resolver, 'function', 'Resolver must resolve to a constructor');
  const resolver = new Resolver();
  assert.equal(typeof resolver.define, 'function');
  assert.equal(typeof resolver.getDefinitions, 'function');
});
