import test from 'node:test';
import assert from 'node:assert/strict';
import { tenantRecoveryPolicy, tenantRecoverySummary } from '../src/tenant-recovery-policy.js';

test('lifecycle assurance is disabled and emergency-stopped by default', () => {
  const policy = tenantRecoveryPolicy({});
  assert.equal(policy.lifecycleEnabled, false);
  assert.equal(policy.emergencyStopped, true);
  assert.equal(policy.operational, false);
  assert.equal(policy.productionMigrationAllowed, false);
});

test('every evidence gate is required before owner-reviewed assurance state', () => {
  const base = {
    TENANT_LIFECYCLE_ASSURANCE_ENABLED: 'true',
    TENANT_LIFECYCLE_EMERGENCY_STOP: 'false',
    TENANT_REHEARSAL_APPROVED: 'true',
    TENANT_BACKUP_EVIDENCE_APPROVED: 'true',
    TENANT_RESTORE_EVIDENCE_APPROVED: 'true',
    TENANT_ISOLATION_EVIDENCE_APPROVED: 'true'
  };
  assert.equal(tenantRecoveryPolicy(base).operational, false);
  const complete = tenantRecoveryPolicy({ ...base, TENANT_DELETION_EVIDENCE_APPROVED: 'true' });
  assert.equal(complete.operational, true);
  assert.equal(complete.automaticRecoveryEnabled, false);
  assert.equal(tenantRecoverySummary(base).productionActionsAllowed, false);
});
