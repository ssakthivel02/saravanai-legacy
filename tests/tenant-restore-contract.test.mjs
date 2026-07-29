import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateRestoreDrill, tenantRestoreSummary } from '../src/tenant-restore-contract.js';

test('matching non-production restore evidence is eligible for owner review', () => {
  const digest = 'c'.repeat(64);
  const result = evaluateRestoreDrill({
    environment: 'non-production',
    backupChecksumSha256: digest,
    restoredChecksumSha256: digest,
    integrityResult: 'pass',
    tenantIsolationResult: 'pass',
    schemaResult: 'pass',
    recoveryTimeMinutes: 18,
    recoveryPointMinutes: 5
  });
  assert.equal(result.valid, true);
  assert.equal(result.decision, 'eligible-for-owner-review');
  assert.equal(result.productionRestoreAllowed, false);
});

test('checksum mismatch and failed isolation block restore evidence', () => {
  const result = evaluateRestoreDrill({
    environment: 'preview',
    backupChecksumSha256: 'd'.repeat(64),
    restoredChecksumSha256: 'e'.repeat(64),
    integrityResult: 'pass',
    tenantIsolationResult: 'fail',
    schemaResult: 'pass',
    recoveryTimeMinutes: 20,
    recoveryPointMinutes: 10
  });
  assert.equal(result.valid, false);
  assert.ok(result.findings.includes('RESTORE_DIGEST_MISMATCH'));
  assert.equal(tenantRestoreSummary().automaticRestoreEnabled, false);
});
