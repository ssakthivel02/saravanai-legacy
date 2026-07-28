export const TENANT_RETENTION_RELEASE = 'tenant-retention-policy-1.0.0';

export const RETENTION_DAYS = Object.freeze({
  project: 3650,
  conversation: 730,
  artifact: 1095,
  approval: 2555,
  memory: 3650,
  'knowledge-node': 3650,
  'usage-ledger': 400
});

export function tenantRetentionPolicy() {
  return {
    release: TENANT_RETENTION_RELEASE,
    retentionDays: { ...RETENTION_DAYS },
    deletionRequestMode: 'owner-approved-manual-preview',
    automaticDeletionEnabled: false,
    automaticPurgeEnabled: false,
    legalHoldEnabled: false,
    exportBeforeDeletionRequired: true,
    crossTenantDeletionAllowed: false,
    hardDeleteImplemented: false,
    tombstonePrepared: true
  };
}

export function validateDeletionRequest(input = {}) {
  const resourceType = String(input.resourceType || '').trim();
  const recordId = String(input.recordId || '').trim();
  const ownerApproved = input.ownerApproved === true;
  const errors = [];
  if (!Object.hasOwn(RETENTION_DAYS, resourceType)) errors.push('TENANT_DELETE_RESOURCE_INVALID');
  if (!/^[a-z0-9][a-z0-9._:-]{2,127}$/.test(recordId)) errors.push('TENANT_DELETE_RECORD_ID_INVALID');
  if (!ownerApproved) errors.push('TENANT_DELETE_OWNER_APPROVAL_REQUIRED');
  return {
    valid: errors.length === 0,
    errors,
    executable: false,
    mode: 'preview-only',
    automaticPurgeEnabled: false
  };
}

export const __test = { RETENTION_DAYS };