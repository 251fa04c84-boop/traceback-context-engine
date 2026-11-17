'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const packageJson = require('../package.json');
const lock = require('../package-lock.json');

function lockedPackages(name) {
  return Object.entries(lock.packages || {})
    .filter(([path]) => path === `node_modules/${name}` || path.endsWith(`/node_modules/${name}`))
    .map(([path, pkg]) => ({ path, version: pkg.version }));
}

test('pins every installed ProseMirror view copy to a patched release', () => {
  assert.equal(packageJson.overrides['prosemirror-view'], '1.42.9');

  const entries = lockedPackages('prosemirror-view');
  assert.ok(entries.length > 0, 'the lockfile must contain ProseMirror view');
  for (const entry of entries) {
    assert.equal(entry.version, '1.42.9', entry.path);
  }
});

test('limits the glob major override to Forge manifest and resolves patched minimatch through glob 14', () => {
  assert.deepEqual(packageJson.overrides['@forge/manifest'], { glob: { '.': '14.0.2', minimatch: '11.0.8' } });
  assert.equal(packageJson.overrides.glob, undefined, 'glob must not be overridden globally');
  assert.equal(packageJson.overrides.minimatch, undefined, 'minimatch must not be overridden globally');

  const manifest = lock.packages['node_modules/@forge/manifest'];
  const glob = lock.packages['node_modules/glob'];
  const minimatch = lock.packages['node_modules/minimatch'];

  assert.equal(manifest.dependencies.glob, '^13.0.0');
  const globCopies = lockedPackages('glob');
  assert.equal(globCopies.length, 1, 'the scoped override should not create duplicate glob trees');
  assert.equal(globCopies[0].version, '14.0.2');
  assert.equal(glob.version, '14.0.2');
  assert.equal(glob.dependencies.minimatch, '^11.0.0');
  assert.equal(minimatch.version, '11.0.8');
});
