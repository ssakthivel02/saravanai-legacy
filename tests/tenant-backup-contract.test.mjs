import test from 'node:test';
import assert from 'node:assert/strict';
import { validateTenantBackupEvidence, tenantBackupSummary } from '../src/tenant-backup-contract.js';

test('valid backup evidence is accepted without claiming runtime execution', () => {
  const result = validateTenantBackupEvidence({
    environment: 'preview',
    exportFormat: 'd1-export',
    checksumSha256: 'b'.repeat(64),
    encryption: 'provider-managed-at-rest',
    createdAt: '2026-07-29T18:00:00Z',
    recordCount: 12,
    storedBytes: 4096
  });
  assert.equal(result.valid, true);
  assert.equal(result.backupCreatedByRuntime, false);
  assert.equal(result.productionDataIncluded, false);
});

test('backup evidence rejects production and missing integrity data', () => {
  const result = validateTenantBackupEvidence({ environment: 'production', exportFormat: 'zip' });
  assert.equal(result.valid, false);
  assert.ok(result.findings.includes('BACKUP_NON_PRODUCTION_ENVIRONMENT_REQUIRED'));
  assert.equal(tenantBackupSummary().runtimeBackupExecutionEnabled, false);
});
