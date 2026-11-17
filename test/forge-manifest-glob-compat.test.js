'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { PackageValidator } = require('@forge/manifest');

test('Forge manifest 13.9.0 PackageValidator can glob existing extraFiles with the patched glob override', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'traceback-forge-glob-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  await fs.writeFile(path.join(directory, 'asset.json'), '{"ok":true}\n', 'utf8');

  const validator = new PackageValidator();
  const result = await validator.validate({
    typedContent: {
      app: {
        package: {
          extraFiles: [path.join(directory, '*.json')]
        }
      }
    }
  });

  assert.equal(result.success, true);
  assert.deepEqual(result.errors, []);
});

test('Forge manifest PackageValidator rejects a missing extraFiles glob without crashing', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'traceback-forge-glob-missing-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));

  const validator = new PackageValidator();
  const result = await validator.validate({
    typedContent: {
      app: {
        package: {
          extraFiles: [path.join(directory, '*.missing')]
        }
      }
    }
  });

  assert.equal(result.success, false);
  assert.equal(result.errors.length, 1);
});
