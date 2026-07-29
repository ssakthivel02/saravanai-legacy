export const TENANT_RESTORE_RELEASE = 'tenant-restore-contract-1.0.0';

function clean(value, max = 512) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function evaluateRestoreDrill(input = {}) {
  const environment = clean(input.environment, 64).toLowerCase();
  const backupChecksum = clean(input.backupChecksumSha256, 64).toLowerCase();
  const restoredChecksum = clean(input.restoredChecksumSha256, 64).toLowerCase();
  const integrityResult = clean(input.integrityResult, 32).toLowerCase();
  const tenantIsolationResult = clean(input.tenantIsolationResult, 32).toLowerCase();
  const schemaResult = clean(input.schemaResult, 32).toLowerCase();
  const recoveryTimeMinutes = Number(input.recoveryTimeMinutes);
  const recoveryPointMinutes = Number(input.recoveryPointMinutes);
  const findings = [];

  if (!['local', 'preview', 'non-production'].includes(environment)) findings.push('RESTORE_NON_PRODUCTION_ENVIRONMENT_REQUIRED');
  if (!/^[a-f0-9]{64}$/.test(backupChecksum)) findings.push('RESTORE_BACKUP_DIGEST_INVALID');
  if (!/^[a-f0-9]{64}$/.test(restoredChecksum)) findings.push('RESTORE_OUTPUT_DIGEST_INVALID');
  if (backupChecksum && restoredChecksum && backupChecksum !== restoredChecksum) findings.push('RESTORE_DIGEST_MISMATCH');
  if (integrityResult !== 'pass') findings.push('RESTORE_INTEGRITY_NOT_PASSED');
  if (tenantIsolationResult !== 'pass') findings.push('RESTORE_TENANT_ISOLATION_NOT_PASSED');
  if (schemaResult !== 'pass') findings.push('RESTORE_SCHEMA_NOT_PASSED');
  if (!Number.isFinite(recoveryTimeMinutes) || recoveryTimeMinutes < 0 || recoveryTimeMinutes > 1440) findings.push('RESTORE_RTO_EVIDENCE_INVALID');
  if (!Number.isFinite(recoveryPointMinutes) || recoveryPointMinutes < 0 || recoveryPointMinutes > 1440) findings.push('RESTORE_RPO_EVIDENCE_INVALID');

  return {
    release: TENANT_RESTORE_RELEASE,
    valid: findings.length === 0,
    decision: findings.length ? 'block' : 'eligible-for-owner-review',
    findings,
    recovery: {
      environment,
      recoveryTimeMinutes: Number.isFinite(recoveryTimeMinutes) ? recoveryTimeMinutes : null,
      recoveryPointMinutes: Number.isFinite(recoveryPointMinutes) ? recoveryPointMinutes : null,
      checksumMatched: Boolean(backupChecksum && restoredChecksum && backupChecksum === restoredChecksum),
      integrityResult,
      tenantIsolationResult,
      schemaResult
    },
    restoreExecutedByRuntime: false,
    productionRestoreAllowed: false,
    dataMutationEnabled: false,
    ownerApprovalRequired: true
  };
}

export function tenantRestoreSummary() {
  return {
    release: TENANT_RESTORE_RELEASE,
    drillEnvironment: 'non-production-only',
    productionRestoreAllowed: false,
    automaticRestoreEnabled: false,
    tenantIsolationEvidenceRequired: true
  };
}

export const __test = { clean };
