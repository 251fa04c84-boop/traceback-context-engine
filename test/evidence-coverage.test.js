'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { buildEvidenceCoverage, NOT_INTEGRATED_SOURCES } = require('../src/domain/evidence-coverage');

test('reports Jira and available Graph evidence without overstating completeness', () => {
  const coverage = buildEvidenceCoverage({
    issue: { key: 'PAY-42' },
    teamworkGraph: {
      status: 'available',
      goals: [{ id: 'goal-1' }],
      deployments: [{ id: 'dep-1' }],
      pullRequests: [{ id: 'pr-1' }]
    }
  });

  assert.equal(coverage.sources[0].status, 'observed');
  assert.equal(coverage.sources[1].status, 'available');
  assert.equal(coverage.sources[1].recordCount, 3);
  assert.equal(coverage.completeness, 'partial-by-design');
});

test('preserves empty, partial and unavailable Graph states distinctly', () => {
  for (const status of ['empty', 'partial', 'unavailable']) {
    const coverage = buildEvidenceCoverage({
      issue: { key: 'PAY-42' },
      teamworkGraph: { status, warning: 'Source-specific status detail.' }
    });
    assert.equal(coverage.sources[1].status, status);
    assert.equal(coverage.sources[1].detail, 'Source-specific status detail.');
  }
});

test('does not treat empty Graph results as proof that no evidence exists', () => {
  const coverage = buildEvidenceCoverage({
    issue: { key: 'PAY-42' },
    teamworkGraph: { status: 'empty', goals: [], deployments: [], pullRequests: [] }
  });

  assert.match(coverage.sources[1].detail, /does not prove/i);
  assert.match(coverage.boundary, /not proof/i);
});

test('labels unintegrated observability sources as not queried, not empty', () => {
  const coverage = buildEvidenceCoverage({
    issue: { key: 'PAY-42' },
    teamworkGraph: { status: 'available' }
  });
  const unintegrated = coverage.sources.filter((source) => source.status === 'not-integrated');

  assert.deepEqual(unintegrated.map((source) => source.key), NOT_INTEGRATED_SOURCES.map((source) => source.key));
  assert.equal(unintegrated.length, 6);
  assert.ok(unintegrated.every((source) => /does not currently query/i.test(source.detail)));
});

test('reports missing Jira issue context without fabricating an issue', () => {
  const coverage = buildEvidenceCoverage({
    teamworkGraph: { status: 'unavailable' }
  });

  assert.equal(coverage.sources[0].status, 'unavailable');
  assert.match(coverage.sources[0].detail, /No normalized Jira issue/);
});

test('does not infer source coverage from array contents when Graph status is unavailable', () => {
  const coverage = buildEvidenceCoverage({
    issue: { key: 'PAY-42' },
    teamworkGraph: {
      status: 'unavailable',
      deployments: [{ id: 'dep-1' }]
    }
  });

  assert.equal(coverage.sources[1].status, 'unavailable');
  assert.equal(coverage.sources[1].recordCount, 1);
  assert.match(coverage.sources[1].detail, /could not be confirmed/i);
});
