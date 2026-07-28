export const TENANT_RECORD_RELEASE = 'tenant-record-contract-1.0.0';

export const TENANT_RESOURCE_TYPES = Object.freeze([
  'project',
  'conversation',
  'artifact',
  'approval',
  'memory',
  'knowledge-node',
  'usage-ledger'
]);

const RESOURCE_SET = new Set(TENANT_RESOURCE_TYPES);
const ID_PATTERN = /^[a-z0-9][a-z0-9._:-]{2,127}$/;
const FORBIDDEN_METADATA_KEYS = new Set(['email', 'jwt', 'token', 'accessAud', 'profileKey', 'password', 'secret']);

function clean(value, max = 256) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function validateTenantRecord(input = {}) {
  const resourceType = clean(input.resourceType, 64);
  const recordId = clean(input.recordId, 128);
  const contentType = clean(input.contentType, 128) || 'application/octet-stream';
  const payloadBytes = Number(input.payloadBytes || 0);
  const metadata = input.metadata && typeof input.metadata === 'object' && !Array.isArray(input.metadata) ? input.metadata : {};
  const forbiddenMetadata = Object.keys(metadata).filter((key) => FORBIDDEN_METADATA_KEYS.has(key));
  const errors = [];

  if (!RESOURCE_SET.has(resourceType)) errors.push('TENANT_RESOURCE_TYPE_INVALID');
  if (!ID_PATTERN.test(recordId)) errors.push('TENANT_RECORD_ID_INVALID');
  if (!Number.isInteger(payloadBytes) || payloadBytes < 0 || payloadBytes > 262144) errors.push('TENANT_PAYLOAD_SIZE_INVALID');
  if (forbiddenMetadata.length) errors.push('TENANT_METADATA_SENSITIVE_FIELD_REJECTED');

  return {
    valid: errors.length === 0,
    errors,
    record: {
      resourceType,
      recordId,
      contentType,
      payloadBytes,
      metadataKeys: Object.keys(metadata).sort(),
      encryptedPayloadRequired: true,
      plaintextPayloadAllowed: false
    }
  };
}

export function tenantRecordContractSummary() {
  return {
    release: TENANT_RECORD_RELEASE,
    resourceTypes: [...TENANT_RESOURCE_TYPES],
    maximumPayloadBytes: 262144,
    encryptedPayloadRequired: true,
    plaintextPayloadAllowed: false,
    emailFieldAllowed: false,
    jwtFieldAllowed: false,
    profileKeyFieldAllowed: false
  };
}

export const __test = { clean, ID_PATTERN, FORBIDDEN_METADATA_KEYS, RESOURCE_SET };