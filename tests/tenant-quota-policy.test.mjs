import test from 'node:test';
import assert from 'node:assert/strict';
import { tenantQuotaPolicy, evaluateTenantQuota } from '../src/tenant-quota-policy.js';

test('hard quotas and paid overage are disabled by default', () => {
  const policy = tenantQuotaPolicy({});
  assert.equal(policy.hardQuotaEnabled, false);
  assert.equal(policy.paidOverageAllowed, false);
  assert.equal(policy.silentPaidFallback, false);
});

test('preview reports exceeded dimensions without blocking while inactive', () => {
  const result = evaluateTenantQuota({ records: 1000, storedBytes: 0, dailyWrites: 0 }, 1, {});
  assert.equal(result.allowed, true);
  assert.equal(result.code, 'TENANT_QUOTA_PREVIEW_EXCEEDED');
  assert.deepEqual(result.exceeded, ['records']);
});