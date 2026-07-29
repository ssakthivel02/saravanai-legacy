export const TENANT_RECOVERY_RELEASE = 'tenant-recovery-policy-1.0.0';

const TRUE_VALUES = new Set(['true', '1', 'yes', 'on']);

function enabled(value) {
  return TRUE_VALUES.has(String(value ?? '').trim().toLowerCase());
}

export function tenantRecoveryPolicy(env = {}) {
  const lifecycleEnabled = enabled(env.TENANT_LIFECYCLE_ASSURANCE_ENABLED);
  const emergencyStopped = String(env.TENANT_LIFECYCLE_EMERGENCY_STOP ?? 'true').trim().toLowerCase() !== 'false';
  const rehearsalApproved = enabled(env.TENANT_REHEARSAL_APPROVED);
  const backupEvidenceApproved = enabled(env.TENANT_BACKUP_EVIDENCE_APPROVED);
  const restoreEvidenceApproved = enabled(env.TENANT_RESTORE_EVIDENCE_APPROVED);
  const isolationEvidenceApproved = enabled(env.TENANT_ISOLATION_EVIDENCE_APPROVED);
  const deletionEvidenceApproved = enabled(env.TENANT_DELETION_EVIDENCE_APPROVED);

  const evidenceComplete = rehearsalApproved
    && backupEvidenceApproved
    && restoreEvidenceApproved
    && isolationEvidenceApproved
    && deletionEvidenceApproved;
  const operational = lifecycleEnabled && !emergencyStopped && evidenceComplete;

  let activation = 'prepared-disabled-by-default';
  if (lifecycleEnabled && emergencyStopped) activation = 'emergency-stopped';
  else if (lifecycleEnabled && !evidenceComplete) activation = 'blocked-evidence-incomplete';
  else if (operational) activation = 'owner-reviewed-assurance-only';

  return Object.freeze({
    release: TENANT_RECOVERY_RELEASE,
    lifecycleEnabled,
    emergencyStopped,
    evidence: {
      rehearsalApproved,
      backupEvidenceApproved,
      restoreEvidenceApproved,
      isolationEvidenceApproved,
      deletionEvidenceApproved,
      complete: evidenceComplete
    },
    operational,
    activation,
    productionMigrationAllowed: false,
    productionRestoreAllowed: false,
    productionDeletionAllowed: false,
    automaticRecoveryEnabled: false,
    automaticFailoverEnabled: false,
    serverWritesEnabled: false,
    paidRecoveryServiceRequired: false
  });
}

export function tenantRecoverySummary(env = {}) {
  const policy = tenantRecoveryPolicy(env);
  return {
    release: policy.release,
    activation: policy.activation,
    operational: policy.operational,
    emergencyStopped: policy.emergencyStopped,
    evidenceComplete: policy.evidence.complete,
    automaticRecoveryEnabled: false,
    productionActionsAllowed: false,
    paidRecoveryServiceRequired: false
  };
}

export const __test = { enabled, TRUE_VALUES };
