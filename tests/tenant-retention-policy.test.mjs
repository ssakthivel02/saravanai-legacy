import test from 'node:test';
import assert from 'node:assert/strict';
import { tenantRetentionPolicy, validateDeletionRequest } from '../src/tenant-retention-policy.js';

test('automatic deletion and purge remain disabled', () => {
  const policy = tenantRetentionPolicy();
  assert.equal(policy.automaticDeletionEnabled, false);
  assert.equal(policy.automaticPurgeEnabled, false);
  assert.equal(policy.crossTenantDeletionAllowed, false);
});

test('deletion requests require explicit owner approval and remain preview-only', () => {
  const denied = validateDeletionRequest({ resourceType: 'project', recordId: 'project:001' });
  assert.equal(denied.valid, false);
  const approved = validateDeletionRequest({ resourceType: 'project', recordId: 'project:001', ownerApproved: true });
  assert.equal(approved.valid, true);
  assert.equal(approved.executable, false);
});