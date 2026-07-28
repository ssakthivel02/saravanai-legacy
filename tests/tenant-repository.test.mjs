import test from 'node:test';
import assert from 'node:assert/strict';
import { createTenantRepository } from '../src/tenant-repository.js';

const verifiedRequest = new Request('https://example.test', {
  headers: {
    'x-sakthiai-access-verified': 'true',
    'x-sakthiai-access-role': 'owner',
    'x-sakthiai-profile-key': 'profile-0123456789abcdef01234567'
  }
});

test('repository reports no write or delete implementation', () => {
  const repository = createTenantRepository({});
  assert.equal(repository.writeImplemented, false);
  assert.equal(repository.deleteImplemented, false);
});

test('write preview validates but never executes', async () => {
  const repository = createTenantRepository({});
  const result = await repository.previewWrite(verifiedRequest, {
    resourceType: 'artifact',
    recordId: 'artifact:001',
    payloadBytes: 100,
    metadata: { format: 'docx' }
  });
  assert.equal(result.ok, true);
  assert.equal(result.executable, false);
  assert.equal(result.code, 'TENANT_WRITE_PREVIEW_ONLY');
});

test('metadata reads remain unavailable while persistence is disabled', async () => {
  const repository = createTenantRepository({});
  const result = await repository.listMetadata(verifiedRequest);
  assert.equal(result.ok, false);
  assert.equal(result.code, 'TENANT_STORAGE_READS_DISABLED');
});