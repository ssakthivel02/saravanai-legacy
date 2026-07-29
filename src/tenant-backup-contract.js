export const TENANT_BACKUP_RELEASE = 'tenant-backup-contract-1.0.0';

const ALLOWED_ENVIRONMENTS = new Set(['local', 'preview', 'non-production']);

function clean(value, max = 512) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function validateTenantBackupEvidence(input = {}) {
  const environment = clean(input.environment, 64).toLowerCase();
  const exportFormat = clean(input.exportFormat, 64).toLowerCase();
  const checksum = clean(input.checksumSha256, 64).toLowerCase();
  const encryption = clean(input.encryption, 64).toLowerCase();
  const createdAt = clean(input.createdAt, 64);
  const recordCount = Number(input.recordCount);
  const storedBytes = Number(input.storedBytes);
  const findings = [];

  if (!ALLOWED_ENVIRONMENTS.has(environment)) findings.push('BACKUP_NON_PRODUCTION_ENVIRONMENT_REQUIRED');
  if (!['sql', 'jsonl', 'd1-export'].includes(exportFormat)) findings.push('BACKUP_FORMAT_UNSUPPORTED');
  if (!/^[a-f0-9]{64}$/.test(checksum)) findings.push('BACKUP_SHA256_INVALID');
  if (!['aes-256-gcm', 'provider-managed-at-rest'].includes(encryption)) findings.push('BACKUP_ENCRYPTION_EVIDENCE_REQUIRED');
  if (!createdAt || Number.isNaN(Date.parse(createdAt))) findings.push('BACKUP_TIMESTAMP_INVALID');
  if (!Number.isInteger(recordCount) || recordCount < 0) findings.push('BACKUP_RECORD_COUNT_INVALID');
  if (!Number.isInteger(storedBytes) || storedBytes < 0) findings.push('BACKUP_BYTE_COUNT_INVALID');

  return {
    release: TENANT_BACKUP_RELEASE,
    valid: findings.length === 0,
    findings,
    evidence: {
      environment,
      exportFormat,
      checksumPresent: /^[a-f0-9]{64}$/.test(checksum),
      encryption,
      createdAt,
      recordCount: Number.isInteger(recordCount) && recordCount >= 0 ? recordCount : null,
      storedBytes: Number.isInteger(storedBytes) && storedBytes >= 0 ? storedBytes : null
    },
    backupCreatedByRuntime: false,
    productionDataIncluded: false,
    identityFieldsIncluded: false,
    secretsIncluded: false,
    automaticUploadEnabled: false
  };
}

export function tenantBackupSummary() {
  return {
    release: TENANT_BACKUP_RELEASE,
    requiredEvidence: ['environment', 'exportFormat', 'checksumSha256', 'encryption', 'createdAt', 'recordCount', 'storedBytes'],
    runtimeBackupExecutionEnabled: false,
    productionBackupClaimed: false,
    paidBackupServiceRequired: false
  };
}

export const __test = { clean, ALLOWED_ENVIRONMENTS };
