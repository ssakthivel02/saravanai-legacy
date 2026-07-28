import test from 'node:test';
import assert from 'node:assert/strict';
import { validateTenantRecord, tenantRecordContractSummary } from '../src/tenant-record-contract.js';

test('accepts bounded encrypted-record metadata', () => {
  const result = validateTenantRecord({
    resourceType: 'project',
    recordId: 'project:alpha-001',
    payloadBytes: 2048,
    contentType: 'application/octet-stream',
    metadata: { titleLength: 12 }
  });
  assert.equal(result.valid, true);
  assert.equal(result.record.encryptedPayloadRequired, true);
});

test('rejects sensitive metadata and oversized records', () => {
  const result = validateTenantRecord({
    resourceType: 'conversation',
    recordId: 'conversation:001',
    payloadBytes: 999999,
    metadata: { email: 'hidden@example.test' }
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('TENANT_METADATA_SENSITIVE_FIELD_REJECTED'));
  assert.ok(result.errors.includes('TENANT_PAYLOAD_SIZE_INVALID'));
  assert.equal(tenantRecordContractSummary().plaintextPayloadAllowed, false);
});