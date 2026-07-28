import test from 'node:test';
import assert from 'node:assert/strict';
import { build018StorageContract, PLATFORM_RELEASE_018, OWNER_BUILD_018 } from '../src/platform-release-018.js';

const verifiedRequest = new Request('https://example.test', {
  headers: {
    'x-sakthiai-access-verified': 'true',
    'x-sakthiai-access-role': 'owner',
    'x-sakthiai-profile-key': 'profile-0123456789abcdef01234567'
  }
});

test('Build 018 identifiers are current', () => {
  assert.equal(PLATFORM_RELEASE_018, '0.18.0-tenant-persistence-foundation');
  assert.equal(OWNER_BUILD_018, 18);
});

test('storage contract is safe and disabled by default', async () => {
  const contract = await build018StorageContract(verifiedRequest, {});
  assert.equal(contract.context.valid, true);
  assert.equal(contract.context.tenantIdExposed, false);
  assert.equal(contract.storage.operations.readsOperational, false);
  assert.equal(contract.storage.operations.writesOperational, false);
  assert.equal(contract.storage.schema.automaticMigration, false);
  assert.equal(contract.quota.paidOverageAllowed, false);
});