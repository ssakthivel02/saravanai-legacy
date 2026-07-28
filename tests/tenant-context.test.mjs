import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveTenantContext, tenantContextSummary } from '../src/tenant-context.js';

test('rejects unverified requests', async () => {
  const result = await resolveTenantContext(new Request('https://example.test'));
  assert.equal(result.valid, false);
  assert.equal(result.code, 'TENANT_VERIFIED_IDENTITY_REQUIRED');
});

test('derives stable pseudonymous tenant context without email exposure', async () => {
  const headers = {
    'x-sakthiai-access-verified': 'true',
    'x-sakthiai-access-role': 'owner',
    'x-sakthiai-profile-key': 'profile-0123456789abcdef01234567'
  };
  const first = await resolveTenantContext(new Request('https://example.test', { headers }));
  const second = await resolveTenantContext(new Request('https://example.test', { headers }));
  assert.equal(first.valid, true);
  assert.equal(first.tenantId, second.tenantId);
  assert.match(first.tenantId, /^tenant-[a-f0-9]{24}$/);
  assert.equal(JSON.stringify(tenantContextSummary(first)).includes('0123456789abcdef'), false);
});